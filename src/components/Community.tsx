import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, Heart, Bookmark, Award } from 'lucide-react';
import { Book } from '../lib/supabase';

interface CommunityProps {
  books: Book[];
}

export function Community({ books }: CommunityProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<Record<string, Array<{ text: string; author: string; date: Date }>>>({});
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (bookId: string) => {
    if (!newComment.trim()) return;
    
    setComments(prev => ({
      ...prev,
      [bookId]: [
        ...(prev[bookId] || []),
        {
          text: newComment,
          author: 'You',
          date: new Date()
        }
      ]
    }));
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Writing Community</h2>
        <div className="flex gap-4">
          <button className="text-indigo-600 hover:text-indigo-800">
            Most Recent
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            Most Popular
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            Following
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4">
              {book.front_cover_url && (
                <img
                  src={book.front_cover_url}
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-sm"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
                    {book.subtitle && (
                      <p className="text-gray-600 mt-1">{book.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-red-500">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-600">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-600">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">
                    {book.description || 'No description available'}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>Genre: {book.genre || 'Unspecified'}</span>
                  <span>•</span>
                  <span>{book.current_word_count.toLocaleString()} words</span>
                  <span>•</span>
                  <span>{book.status.replace('_', ' ').charAt(0).toUpperCase() + book.status.slice(1)}</span>
                </div>

                <div className="mt-4 border-t pt-4">
                  {comments[book.id]?.map((comment, index) => (
                    <div key={index} className="mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-gray-500">
                          {comment.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.text}</p>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts or encouragement..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      onClick={() => handleAddComment(book.id)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}