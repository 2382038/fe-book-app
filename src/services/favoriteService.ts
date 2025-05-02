import api from '../utils/api';
import { Book } from './bookService';

export const favoriteService = {
  getFavorites: () => api.get<Book[]>('/api/favorites'),
  addFavorite: (bookId: string) => api.post('/api/favorites', { book_id: bookId }),
  removeFavorite: (bookId: string) => api.delete(`/api/favorites/book/${bookId}`),
  checkIsFavorite: (bookId: string) => api.get<boolean>(`/api/favorites/check/${bookId}`),
}; 