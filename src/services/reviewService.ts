import api from '../utils/api';

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewDto {
  book_id: number;
  rating: number;
  comment: string;
}

export const reviewService = {
  getAllReviews: (bookId?: number) => 
    api.get<Review[]>(`/api/reviews${bookId ? `?bookId=${bookId}` : ''}`),
  getReview: (id: number) => api.get<Review>(`/api/reviews/${id}`),
  createReview: (reviewData: CreateReviewDto) => 
    api.post<Review>('/api/reviews', {
      book_id: reviewData.book_id,
      rating: reviewData.rating,
      comment: reviewData.comment
    }),
  updateReview: (id: number, reviewData: CreateReviewDto) => 
    api.patch<Review>(`/api/reviews/${id}`, {
      book_id: reviewData.book_id,
      rating: reviewData.rating,
      comment: reviewData.comment
    }),
  deleteReview: (id: number) => api.delete(`/api/reviews/${id}`),
}; 