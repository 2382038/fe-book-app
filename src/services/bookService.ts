import api from '../utils/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
}

export const bookService = {
  getAllBooks: () => api.get<Book[]>('/api/books'),
  getBook: (id: string) => api.get<Book>(`/api/books/${id}`),
  createBook: (bookData: Omit<Book, 'id'>) => api.post<Book>('/api/books', bookData),
  updateBook: (bookData: Book) => api.put<Book>(`/api/books/${bookData.id}`, bookData),
  deleteBook: (id: string) => api.delete(`/api/books/${id}`),
}; 