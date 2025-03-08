import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ContentVersion {
  id: string;
  chapter_id: string;
  content: string;
  word_count: number;
  created_at: string;
  description: string;
}

export function useContentHistory(chapterId: string) {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chapterId) {
      fetchVersions();
    }
  }, [chapterId]);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('chapter_versions')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch versions');
    } finally {
      setLoading(false);
    }
  };

  const saveVersion = async (content: string, description: string = 'Auto-saved version') => {
    try {
      const wordCount = content.trim().split(/\s+/).length;

      const { data, error } = await supabase
        .from('chapter_versions')
        .insert([{
          chapter_id: chapterId,
          content,
          word_count: wordCount,
          description
        }])
        .select()
        .single();

      if (error) throw error;
      setVersions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save version');
      throw err;
    }
  };

  const revertToVersion = async (versionId: string) => {
    try {
      // First, get the version content
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error('Version not found');

      // Update the chapter with the version content
      const { error: updateError } = await supabase
        .from('chapters')
        .update({
          content: version.content,
          word_count: version.word_count
        })
        .eq('id', chapterId);

      if (updateError) throw updateError;

      // Save a new version marking the reversion
      await saveVersion(
        version.content,
        `Reverted to version from ${new Date(version.created_at).toLocaleString()}`
      );

      return version;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert version');
      throw err;
    }
  };

  return {
    versions,
    loading,
    error,
    saveVersion,
    revertToVersion,
    refreshVersions: fetchVersions
  };
}