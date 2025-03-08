import React, { useState, useEffect } from 'react';
import { Wand2, Upload, Calendar, Bell } from 'lucide-react';
import { Book, supabase } from '../lib/supabase';
import { useBookReminders } from '../hooks/useBookReminders';

interface BookFormProps {
  onSubmit: (
    title: string,
    subtitle: string,
    description: string,
    genre: string,
    targetWordCount: number,
    frontCoverUrl: string,
    backCoverUrl: string,
    writingSchedule: {
      days: string[];
      preferredTime: string;
      deadline?: string;
      reminderType: 'email' | 'browser' | 'both';
      dailyWordGoal: number;
      customMessage?: string;
    }
  ) => Promise<void>;
  initialData?: Book;
  onCancel: () => void;
}

export function BookForm({ onSubmit, initialData, onCancel }: BookFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [genre, setGenre] = useState(initialData?.genre || '');
  const [targetWordCount, setTargetWordCount] = useState(initialData?.target_word_count || 50000);
  const [frontCoverUrl, setFrontCoverUrl] = useState(initialData?.front_cover_url || '');
  const [backCoverUrl, setBackCoverUrl] = useState(initialData?.back_cover_url || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [writingDays, setWritingDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [deadline, setDeadline] = useState('');
  const [reminderType, setReminderType] = useState<'email' | 'browser' | 'both'>('both');
  const [dailyWordGoal, setDailyWordGoal] = useState(500);
  const [customMessage, setCustomMessage] = useState('');
  const [useCustomMessage, setUseCustomMessage] = useState(false);

  const { templates, reminderSettings } = useBookReminders(initialData?.id || '');

  useEffect(() => {
    if (reminderSettings) {
      setReminderType(reminderSettings.reminder_type);
      setDailyWordGoal(reminderSettings.daily_word_goal);
      if (reminderSettings.reminder_message) {
        setCustomMessage(reminderSettings.reminder_message);
        setUseCustomMessage(true);
      }
    }
  }, [reminderSettings]);

  // ... (keep existing handleCoverUpload function)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const wordCount = typeof targetWordCount === 'string' 
        ? parseInt(targetWordCount, 10) 
        : targetWordCount;

      if (isNaN(wordCount)) {
        throw new Error('Invalid target word count');
      }

      await onSubmit(
        title,
        subtitle,
        description,
        genre,
        wordCount,
        frontCoverUrl,
        backCoverUrl,
        {
          days: writingDays,
          preferredTime,
          deadline,
          reminderType,
          dailyWordGoal,
          customMessage: useCustomMessage ? customMessage : undefined
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  // ... (keep existing JSX until the Writing Schedule section)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Keep existing form fields up to Writing Schedule section */}
      
      {/* Enhanced Writing Schedule Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Writing Schedule
        </h3>
        
        <div className="space-y-6">
          {/* Keep existing writing days selection */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Writing Time
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Completion Date
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Writing Goals and Reminders */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Writing Goals & Reminders
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily Word Goal
              </label>
              <input
                type="number"
                value={dailyWordGoal}
                onChange={(e) => setDailyWordGoal(parseInt(e.target.value))}
                min={100}
                step={100}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reminder Type
              </label>
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value as 'email' | 'browser' | 'both')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="email">Email Only</option>
                <option value="browser">Browser Only</option>
                <option value="both">Both Email & Browser</option>
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useCustomMessage}
                  onChange={(e) => setUseCustomMessage(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Use custom reminder message
                </span>
              </label>

              {useCustomMessage && (
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your custom reminder message..."
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keep existing error and button section */}
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </form>
  );
}