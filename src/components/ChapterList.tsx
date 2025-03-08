import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Chapter } from '../lib/supabase';

interface ChapterListProps {
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  onCreateChapter: (title: string) => Promise<void>;
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => Promise<void>;
  onDeleteChapter: (chapterId: string) => Promise<void>;
  onReorderChapter: (chapterId: string, newOrder: number) => Promise<void>;
}

export function ChapterList({
  chapters,
  onSelectChapter,
  onCreateChapter,
  onUpdateChapter,
  onDeleteChapter,
  onReorderChapter
}: ChapterListProps) {
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle.trim()) {
      await onCreateChapter(newChapterTitle);
      setNewChapterTitle('');
    }
  };

  const handleUpdateTitle = async (chapter: Chapter) => {
    if (editTitle.trim() && editTitle !== chapter.title) {
      await onUpdateChapter(chapter.id, { title: editTitle });
    }
    setEditingChapter(null);
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleCreateSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="New chapter title"
          className="flex-1 rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <button
          type="submit"
          disabled={!newChapterTitle.trim()}
          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="group bg-white hover:bg-gray-50 rounded-md mb-1 text-sm"
          >
            <div className="flex items-center p-2">
              <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
              <div className="flex-1">
                {editingChapter === chapter.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 rounded-sm border-gray-300 shadow-sm text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateTitle(chapter)}
                      className="px-2 py-1 text-xs bg-indigo-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingChapter(null)}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectChapter(chapter)}
                    className="text-left hover:text-indigo-600 transition-colors w-full"
                  >
                    <span className="font-medium">Chapter {chapter.order}:</span> {chapter.title}
                    <span className="text-xs text-gray-500 ml-2">
                      ({chapter.word_count.toLocaleString()} words)
                    </span>
                  </button>
                )}
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                <button
                  onClick={() => {
                    setEditingChapter(chapter.id);
                    setEditTitle(chapter.title);
                  }}
                  className="p-1 text-gray-400 hover:text-indigo-600"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteChapter(chapter.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onReorderChapter(chapter.id, chapter.order - 1)}
                  disabled={chapter.order === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onReorderChapter(chapter.id, chapter.order + 1)}
                  disabled={chapter.order === chapters.length}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}