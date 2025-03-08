-- Create chapter versions table
CREATE TABLE chapter_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id uuid REFERENCES chapters ON DELETE CASCADE NOT NULL,
    content text,
    word_count integer DEFAULT 0,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chapter_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their chapter versions"
    ON chapter_versions
    USING (
        EXISTS (
            SELECT 1 FROM chapters c
            JOIN books b ON c.book_id = b.id
            WHERE c.id = chapter_versions.chapter_id
            AND b.user_id = auth.uid()
        )
    );