import api from '../utils/api';
import { Book } from './bookService';

export interface FavoriteResponse {
  id: string;
  book_id: string;
}

export const favoriteService = {
  getFavorites: () => api.get<FavoriteResponse[]>('/api/favorites'),
  addFavorite: (bookId: string) => api.post('/api/favorites/check/', { book_id: bookId }),
  removeFavorite: (bookId: string) => api.delete(`/api/favorites/book/${bookId}`),
  checkIsFavorite: (bookId: string) => api.get<boolean>(`/api/favorites/check/${bookId}`),
}; 