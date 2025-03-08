import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const inspirationalQuotes = [
  {
    quote: "The first draft is just you telling yourself the story.",
    author: "Terry Pratchett"
  },
  {
    quote: "You can't wait for inspiration. You have to go after it with a club.",
    author: "Jack London"
  },
  {
    quote: "Write drunk, edit sober.",
    author: "Ernest Hemingway"
  },
  {
    quote: "The scariest moment is always just before you start.",
    author: "Stephen King"
  },
  {
    quote: "You can always edit a bad page. You can't edit a blank page.",
    author: "Jodi Picoult"
  },
  {
    quote: "If there's a book that you want to read, but it hasn't been written yet, then you must write it.",
    author: "Toni Morrison"
  },
  {
    quote: "Start writing, no matter what. The water does not flow until the faucet is turned on.",
    author: "Louis L'Amour"
  },
  {
    quote: "The road to hell is paved with adverbs.",
    author: "Stephen King"
  },
  {
    quote: "Don't tell me the moon is shining; show me the glint of light on broken glass.",
    author: "Anton Chekhov"
  },
  {
    quote: "The difference between the right word and the almost right word is the difference between lightning and a lightning bug.",
    author: "Mark Twain"
  }
];

export function WritingReminder() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(30);

  useEffect(() => {
    const checkWritingSchedule = () => {
      const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
      setQuote(randomQuote);
      setShowReminder(true);
      
      if (Notification.permission === 'granted') {
        new Notification('Time to Write!', {
          body: `${randomQuote.quote} - ${randomQuote.author}`,
          icon: '/path-to-icon.png'
        });
      }
    };

    const interval = setInterval(checkWritingSchedule, reminderInterval * 60 * 1000);
    checkWritingSchedule();

    return () => clearInterval(interval);
  }, [reminderInterval]);

  if (!showReminder || !quote) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 rounded-full p-2">
          <Bell className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Time to Write!</h4>
          <blockquote className="mt-2 text-sm text-gray-600 italic">
            "{quote.quote}"
            <footer className="mt-1 text-xs text-gray-500 not-italic">
              — {quote.author}
            </footer>
          </blockquote>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowReminder(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                setShowReminder(false);
                window.location.hash = '#dashboard';
              }}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Start Writing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}