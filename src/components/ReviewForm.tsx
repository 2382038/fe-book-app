import { useState, useEffect } from 'react';

interface ReviewFormProps {
  initialData?: {
    id?: string;
    bookId: string;
    rating: number;
    comment: string;
  };
  onSubmit: (data: any) => void;
  isEditing?: boolean;
}

const ReviewForm = ({ initialData, onSubmit, isEditing = false }: ReviewFormProps) => {
  const [formData, setFormData] = useState({
    bookId: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">
          Book ID
        </label>
        <input
          type="text"
          name="bookId"
          id="bookId"
          value={formData.bookId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Rating (1-5)
        </label>
        <input
          type="number"
          name="rating"
          id="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          name="comment"
          id="comment"
          rows={4}
          value={formData.comment}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isEditing ? 'Update Review' : 'Add Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 