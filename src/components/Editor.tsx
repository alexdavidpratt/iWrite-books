// ... (keep existing imports)
import { useContentHistory } from '../hooks/useContentHistory';
import { History, RotateCcw } from 'lucide-react';

// ... (keep existing code until the Editor component)

export function Editor({ chapter, onSave }: EditorProps) {
  // ... (keep existing state)
  const [showHistory, setShowHistory] = useState(false);
  const { versions, loading: loadingVersions, revertToVersion } = useContentHistory(chapter.id);

  // ... (keep existing code until the toolbar section)

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between border-b pb-2">
        {/* Keep existing toolbar items */}
        <div className="flex items-center gap-2">
          {/* Add History button before other buttons */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded hover:bg-gray-100 relative"
            title="View history"
          >
            <History className="w-4 h-4" />
            {versions.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {versions.length}
              </span>
            )}
          </button>
          {/* Keep existing toolbar buttons */}
        </div>
      </div>

      {/* Editor Area with History Sidebar */}
      <div className="flex gap-4 flex-1">
        <div className={`flex-1 relative ${showHistory ? 'md:w-2/3' : 'w-full'}`}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            onSelect={handleTextSelect}
            className="w-full h-full p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start writing your chapter..."
          />
        </div>

        {/* Version History Sidebar */}
        {showHistory && (
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg overflow-y-auto">
            <h3 className="font-semibold mb-4">Version History</h3>
            
            {loadingVersions ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {new Date(version.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to revert to this version? Current changes will be saved as a new version.')) {
                            await revertToVersion(version.id);
                            // Refresh the editor content
                            setContent(version.content);
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Revert
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{version.description}</p>
                    <div className="mt-1 text-xs text-gray-500">
                      {version.word_count.toLocaleString()} words
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keep existing status bar and other components */}
    </div>
  );
}