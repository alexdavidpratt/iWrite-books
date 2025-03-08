/*
  # Add book covers support

  1. Changes
    - Add front_cover_url and back_cover_url columns to books table
    - Create storage bucket for book covers
*/

-- Add cover URL columns to books table
ALTER TABLE books 
ADD COLUMN front_cover_url text,
ADD COLUMN back_cover_url text;

-- Enable storage for covers
INSERT INTO storage.buckets (id, name)
VALUES ('book-covers', 'book-covers')
ON CONFLICT DO NOTHING;

-- Set up storage policy
CREATE POLICY "Authenticated users can upload book covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'book-covers');

CREATE POLICY "Anyone can view book covers"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'book-covers');