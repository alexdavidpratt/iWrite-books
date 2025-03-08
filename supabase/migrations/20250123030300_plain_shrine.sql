/*
  # Book Writing Schedules Implementation

  1. New Tables
    - `book_schedules`
      - `id` (uuid, primary key)
      - `book_id` (uuid, references books)
      - `user_id` (uuid, references user_profiles)
      - `writing_days` (text[], selected days for writing)
      - `writing_time` (time, preferred writing time)
      - `target_deadline` (date, completion target)
      - `last_notification` (timestamptz, last reminder sent)
      - `notification_frequency` (interval, how often to send reminders)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on book_schedules
    - Add policy for authenticated users to manage their schedules
*/

-- Create book schedules table
CREATE TABLE book_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id uuid REFERENCES books ON DELETE CASCADE,
    user_id uuid REFERENCES user_profiles ON DELETE CASCADE,
    writing_days text[] NOT NULL DEFAULT ARRAY[]::text[],
    writing_time time NOT NULL DEFAULT '09:00',
    target_deadline date,
    last_notification timestamptz,
    notification_frequency interval NOT NULL DEFAULT '1 day'::interval,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_book_schedule UNIQUE (book_id)
);

-- Enable RLS
ALTER TABLE book_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their book schedules"
    ON book_schedules
    USING (auth.uid() = user_id);

-- Create notification function
CREATE OR REPLACE FUNCTION notify_book_schedule()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email text;
    book_title text;
BEGIN
    -- Get user email and book title
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.user_id;

    SELECT title INTO book_title
    FROM books
    WHERE id = NEW.book_id;

    -- Send email notification
    PERFORM net.http_post(
        url := CONCAT(current_setting('app.edge_function_url'), '/notify-writer'),
        headers := jsonb_build_object(
            'Authorization', current_setting('app.edge_function_key'),
            'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
            'email', user_email,
            'bookTitle', book_title,
            'writingTime', NEW.writing_time,
            'writingDays', NEW.writing_days,
            'targetDeadline', NEW.target_deadline
        )
    );
    
    RETURN NEW;
END;
$$;

-- Create notification trigger
CREATE TRIGGER schedule_notification_trigger
    AFTER INSERT OR UPDATE ON book_schedules
    FOR EACH ROW
    EXECUTE FUNCTION notify_book_schedule();