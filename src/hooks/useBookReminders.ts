import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ReminderTemplate {
  id: string;
  genre: string;
  template_type: string;
  message_template: string;
}

interface ReminderHistory {
  timestamp: string;
  message: string;
  type: string;
}

interface BookReminder {
  reminder_message: string | null;
  reminder_type: 'email' | 'browser' | 'both';
  daily_word_goal: number;
  reminder_history: ReminderHistory[];
}

export function useBookReminders(bookId: string) {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [reminderSettings, setReminderSettings] = useState<BookReminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      fetchReminderData();
    }
  }, [bookId]);

  const fetchReminderData = async () => {
    try {
      // Fetch reminder settings
      const { data: settings, error: settingsError } = await supabase
        .from('book_schedules')
        .select('reminder_message, reminder_type, daily_word_goal, reminder_history')
        .eq('book_id', bookId)
        .single();

      if (settingsError) throw settingsError;

      // Fetch available templates
      const { data: templateData, error: templateError } = await supabase
        .from('book_reminder_templates')
        .select('*');

      if (templateError) throw templateError;

      setReminderSettings(settings);
      setTemplates(templateData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reminder data');
    } finally {
      setLoading(false);
    }
  };

  const updateReminderSettings = async (updates: Partial<BookReminder>) => {
    try {
      const { data, error } = await supabase
        .from('book_schedules')
        .update(updates)
        .eq('book_id', bookId)
        .select()
        .single();

      if (error) throw error;
      setReminderSettings({
        ...reminderSettings!,
        ...updates
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reminder settings');
      throw err;
    }
  };

  const getTemplateForBook = async (genre: string, type: string) => {
    return templates.find(t => t.genre === genre && t.template_type === type);
  };

  return {
    templates,
    reminderSettings,
    loading,
    error,
    updateReminderSettings,
    getTemplateForBook
  };
}