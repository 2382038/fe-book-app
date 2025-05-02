import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewService, Review, CreateReviewDto } from '../services/reviewService';
import { bookService } from '../services/bookService';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const Reviews = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<CreateReviewDto>({
    book_id: bookId ? parseInt(bookId) : 0,
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchBooks();
    fetchReviews();
  }, [bookId]);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data.map(book => ({ id: parseInt(book.id), title: book.title })));
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again later.');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getAllReviews(bookId ? parseInt(bookId) : undefined);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, formData);
      } else {
        await reviewService.createReview(formData);
      }
      setFormData({ book_id: bookId ? parseInt(bookId) : 0, rating: 5, comment: '' });
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      setError('Failed to save review. Please try again.');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      book_id: review.book_id,
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#6366F1]">
          {bookId ? 'Book Reviews' : 'All Reviews'}
        </h1>
        {bookId && (
          <button
            onClick={() => navigate(`/books/${bookId}`)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Book
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        {!bookId && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Book
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.book_id}
              onChange={(e) => setFormData({ ...formData, book_id: parseInt(e.target.value) })}
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`text-2xl ${
                  star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                <FaStar />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Comment
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {editingReview ? 'Update Review' : 'Add Review'}
        </button>
      </form>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`${
                          star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews; 