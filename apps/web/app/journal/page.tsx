'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JournalEntry {
    id: number;
    time: string;
    commit: string;
    title: string;
    excerpt: string;
    tags: {tag: string, color: string}[];
}

export default function JournalDashboard() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'commit' | 'branch' | 'tagged'>('all');

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch entries on mount
  useEffect(() => {
    async function fetchEntries() {
      const storedProject = localStorage.getItem('current_project_id');
      if (!storedProject) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/journal/entries?projectId=${encodeURIComponent(storedProject)}`);
        if (res.ok) {
          const data = await res.json();
          setJournalEntries(data);
        }
      } catch (error) {
        console.error('Failed to fetch journal entries', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-black">Developer Journal</h1>
                <Link
                    href="/journal/new"
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + New Entry
                </Link>
            </header>

            <main className="px-8 py-6 space-y-6">
                {/* Filter Tabs */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'all'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All (47)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('commit')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'commit'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        By Commit
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('branch')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'branch'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        By Branch
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('tagged')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'tagged'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Tagged
                    </button>
                </div>

                {/* Journal Entries */}
                <div className="flex flex-col gap-6">
                  {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading journal entries...</div>
                  ) : journalEntries.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No journal entries found. Start coding!</div>
                  ) : (
                    journalEntries.map((entry) => (
                      <div key={entry.id} className="px-8 py-6 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(entry.createdAt).toLocaleDateString()} • {entry.gitCommitHash || 'No Commit'}
                        </p>
                        <h2 className="text-xl font-bold text-black mb-2">
                          {/* Title extracted from content or fallback */}
                          {entry.content.substring(0, 50)}...
                        </h2>
                        <p className="text-sm text-gray-700 mb-4">{entry.content}</p>
                      </div>
                    ))
                  )}
                </div>
            </main>
    </div>
  );
}
