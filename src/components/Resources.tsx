import React from 'react';
import { Book, Lightbulb, Target, Users, Star, Bookmark } from 'lucide-react';

const articles = [
  {
    title: "The Art of Character Development",
    description: "Learn how to create memorable characters that leap off the page.",
    category: "Craft",
    readTime: "8 min read"
  },
  {
    title: "World-Building 101",
    description: "Essential techniques for creating immersive fictional worlds.",
    category: "Craft",
    readTime: "12 min read"
  },
  {
    title: "Mastering Story Structure",
    description: "Understanding the three-act structure and beyond.",
    category: "Craft",
    readTime: "10 min read"
  },
  {
    title: "Writing Effective Dialogue",
    description: "Tips for creating natural and engaging conversations.",
    category: "Craft",
    readTime: "7 min read"
  },
  {
    title: "Finding Your Writing Voice",
    description: "Develop your unique authorial style and tone.",
    category: "Style",
    readTime: "9 min read"
  },
  {
    title: "The Power of Show, Don't Tell",
    description: "Master this essential writing technique.",
    category: "Craft",
    readTime: "6 min read"
  },
  {
    title: "Creating Compelling Plot Twists",
    description: "Surprise your readers while maintaining believability.",
    category: "Plot",
    readTime: "11 min read"
  },
  {
    title: "Writing Strong Beginnings",
    description: "Hook your readers from the first page.",
    category: "Craft",
    readTime: "8 min read"
  }
];

const categories = [
  "All",
  "Craft",
  "Style",
  "Plot",
  "Character",
  "World-Building",
  "Publishing",
  "Marketing"
];

export function Resources() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Writing Resources</h2>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search resources..."
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Categories Sidebar */}
        <div className="w-64 flex-shrink-0">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-semibold mt-2">{article.title}</h3>
                    <p className="text-gray-600 mt-2">{article.description}</p>
                  </div>
                  <button className="text-gray-400 hover:text-indigo-600">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{article.readTime}</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}