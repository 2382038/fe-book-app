import { useState, useEffect } from 'react';
import { bookApi } from '../utils/api';
import { favoriteService } from '../services/favoriteService';
import BookForm from '../components/BookForm';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
}

type BookFormData = Omit<Book, 'id'>;

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchFavorites();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookApi.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites();
      setFavorites(new Set(response.data.map(book => book.id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleCreateBook = async (bookData: BookFormData) => {
    try {
      await bookApi.create(bookData);
      fetchBooks();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleUpdateBook = async (bookData: BookFormData) => {
    if (!selectedBook) return;
    try {
      await bookApi.update(selectedBook.id, { ...bookData });
      fetchBooks();
      setIsFormOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookApi.delete(id);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    try {
      if (favorites.has(bookId)) {
        await favoriteService.removeFavorite(bookId);
        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(bookId);
          return next;
        });
      } else {
        await favoriteService.addFavorite(bookId);
        setFavorites(prev => new Set(prev).add(bookId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
        <h1 className="text-3xl font-bold text-[#6366F1]">Books</h1>
        <button
          onClick={() => {
            setSelectedBook(null);
            setIsFormOpen(true);
          }}
          className="bg-[#6366F1] text-white px-4 py-2 rounded-md hover:bg-[#4F46E5] transition-colors"
        >
          Add New Book
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#6366F1]">
                {selectedBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedBook(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <BookForm
              initialData={selectedBook || undefined}
              onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedBook(null);
              }}
              isEditing={!!selectedBook}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={book.cover_url || 'https://via.placeholder.com/300x400'}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleToggleFavorite(book.id)}
                className="absolute top-4 right-4 text-2xl"
              >
                {favorites.has(book.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-white drop-shadow-lg" />
                )}
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#6366F1] mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">By {book.author}</p>
              <p className="text-gray-700 mb-4">{book.description}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setIsFormOpen(true);
                  }}
                  className="text-[#6366F1] hover:text-[#4F46E5] font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books; 