import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Type definitions for database tables
export type Book = {
  id: string;
  user_id: string;
  title: string;
  subtitle?: string;
  description?: string;
  genre?: string;
  front_cover_url?: string;
  back_cover_url?: string;
  target_word_count: number;
  current_word_count: number;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  created_at: string;
};

export type UserProfile = {
  id: string;
  username: string;
  full_name?: string;
  created_at: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'cancelled' | 'expired';
  writing_schedule: {
    days: string[];
    preferred_time: string;
  };
  last_reminder_sent: string;
};

export type Chapter = {
  id: string;
  book_id: string;
  title: string;
  content?: string;
  formatted_content?: {
    blocks: Array<{
      type: string;
      text: string;
      style?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
      };
    }>;
  };
  word_count: number;
  order: number;
  created_at: string;
  last_autosave: string;
};

export type WritingGoal = {
  id: string;
  user_id: string;
  daily_word_count: number;
  writing_days: string[];
  created_at: string;
};

export type Subscription = {
  id: string;
  name: 'Free' | 'Pro' | 'Enterprise';
  price: number;
  features: string[];
  limits: {
    books: number;
    ai_suggestions: number;
    cloud_storage: number;
  };
};