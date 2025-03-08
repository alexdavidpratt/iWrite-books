/*
  # Book-Specific Writing Reminders Enhancement

  1. Updates
    - Add reminder preferences to book_schedules
    - Add reminder templates for different book types
    - Add reminder history tracking
*/

-- Add reminder preferences to book_schedules
ALTER TABLE book_schedules
ADD COLUMN reminder_message text,
ADD COLUMN reminder_type text DEFAULT 'email' CHECK (reminder_type IN ('email', 'browser', 'both')),
ADD COLUMN daily_word_goal integer DEFAULT 500,
ADD COLUMN reminder_history jsonb DEFAULT '[]'::jsonb;

-- Create book reminder templates
CREATE TABLE book_reminder_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    genre text,
    template_type text,
    message_template text,
    created_at timestamptz DEFAULT now()
);

-- Insert default templates
INSERT INTO book_reminder_templates (genre, template_type, message_template) VALUES
    ('fiction', 'motivation', 'Time to continue the journey with {book_title}! Your characters are waiting.'),
    ('fiction', 'progress', 'You''re {progress}% through {book_title}. Keep the story moving!'),
    ('non-fiction', 'motivation', 'Ready to share more knowledge in {book_title}?'),
    ('non-fiction', 'progress', 'You''ve written {word_count} words in {book_title}. Keep building your expertise!'),
    ('poetry', 'motivation', 'Let''s capture more beautiful verses in {book_title}'),
    ('poetry', 'progress', 'Your poetry collection {book_title} is growing. Time to add another piece!');

-- Enable RLS on new table
ALTER TABLE book_reminder_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for templates
CREATE POLICY "Anyone can view reminder templates"
    ON book_reminder_templates
    FOR SELECT
    TO authenticated
    USING (true);