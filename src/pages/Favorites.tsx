import { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';
import { bookService } from '../services/bookService';
import type { Book } from '../services/bookService';
import { FaHeart } from 'react-icons/fa';

interface FavoriteResponse {
  id: string;
  book_id: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const favoritesResponse = await favoriteService.getFavorites();
      const favoriteIds = favoritesResponse.data.map((fav: FavoriteResponse) => fav.book_id);
      const bookPromises = favoriteIds.map(id => bookService.getBook(id));
      const bookResponses = await Promise.all(bookPromises);
      const books = bookResponses.map(response => response.data);
      setFavorites(books);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorite books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId: string) => {
    try {
      await favoriteService.removeFavorite(bookId);
      setFavorites(prev => prev.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove book from favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchFavorites}
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#6366F1]">Favorite Books</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't added any books to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={book.cover_url || 'https://via.placeholder.com/300x400'}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(book.id)}
                  className="absolute top-4 right-4 text-2xl"
                >
                  <FaHeart className="text-red-500" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#6366F1] mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-2">By {book.author}</p>
                <p className="text-gray-700 mb-4">{book.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 