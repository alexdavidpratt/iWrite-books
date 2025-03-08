import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BookSchedule {
  id: string;
  book_id: string;
  user_id: string;
  writing_days: string[];
  writing_time: string;
  target_deadline: string | null;
  last_notification: string | null;
  notification_frequency: string;
}

export function useBookSchedule(bookId: string) {
  const [schedule, setSchedule] = useState<BookSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      fetchSchedule();
    }
  }, [bookId]);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('book_schedules')
        .select('*')
        .eq('book_id', bookId)
        .single();

      if (error) throw error;
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (updates: Partial<BookSchedule>) => {
    try {
      if (!schedule) {
        // Create new schedule
        const { data, error } = await supabase
          .from('book_schedules')
          .insert([{
            book_id: bookId,
            ...updates
          }])
          .select()
          .single();

        if (error) throw error;
        setSchedule(data);
        return data;
      }

      // Update existing schedule
      const { data, error } = await supabase
        .from('book_schedules')
        .update(updates)
        .eq('id', schedule.id)
        .select()
        .single();

      if (error) throw error;
      setSchedule(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update schedule');
      throw err;
    }
  };

  return {
    schedule,
    loading,
    error,
    updateSchedule
  };
}