'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJournalEntry() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    commit: 'abc123f',
    branch: 'feature/auth',
    title: 'Auth implementation decision',
    tags: 'architecture, database, security',
    ticket: '',
    content: 'Decided to use JWT tokens instead of sessions for authentication to provide better scalability for our distributed architecture and ...',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/journal');
  };

  const handleCancel = () => {
    router.push('/journal');
  };

  return (
    <div className="flex-1 bg-gray-50">
      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-black text-center mb-12">
          New Journal Entry
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Attach to context */}
          <div>
            <label className="block text-black font-medium mb-2">
              Attach to context
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={formData.commit}
                  onChange={(e) => setFormData({ ...formData, commit: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded text-black appearance-none bg-white focus:outline-none focus:border-gray-400"
                >
                  <option value="abc123f">Commit: abc123f</option>
                  <option value="def456g">Commit: def456g</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
                  ▼
                </div>
              </div>

              <div className="relative">
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded text-black appearance-none bg-white focus:outline-none focus:border-gray-400"
                >
                  <option value="feature/auth">Branch: feature/auth</option>
                  <option value="main">Branch: main</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-black font-medium mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded text-black bg-white focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-black font-medium mb-2">
              Tags (optional)
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded text-black bg-white focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Linked Ticket */}
          <div>
            <label htmlFor="ticket" className="block text-black font-medium mb-2">
              Linked Ticket (optional)
            </label>
            <input
              id="ticket"
              type="text"
              placeholder="JIRA-XXX or leave empty"
              value={formData.ticket}
              onChange={(e) => setFormData({ ...formData, ticket: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded text-black bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
            />
          </div>

          {/* Entry Content */}
          <div>
            <label htmlFor="content" className="block text-black font-medium mb-2">
              Entry Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded text-black bg-white focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-black rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-black rounded transition-colors"
            >
              Save Entry
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
