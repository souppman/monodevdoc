'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JournalEntry {
  id: number;
  time: string;
  commit: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export default function JournalDashboard() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'commit' | 'branch' | 'tagged'>('all');

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch entries on mount
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch('/api/journal/entries');
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
      <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Developer Journal</h1>
        <Link
          href="/journal/new"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          + New Entry
        </Link>
      </header>

      {/* Filter Tabs */}
      <div className="px-8 py-4 flex gap-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'all'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          All (47)
        </button>
        <button
          onClick={() => setActiveFilter('commit')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'commit'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          By Commit
        </button>
        <button
          onClick={() => setActiveFilter('branch')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'branch'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          By Branch
        </button>
        <button
          onClick={() => setActiveFilter('tagged')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'tagged'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          Tagged
        </button>
      </div>

      {/* Journal Entries */}
      <main className="px-8 py-6">
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading journal entries...</div>
          ) : journalEntries.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No journal entries found. Start coding!</div>
          ) : (
            journalEntries.map((entry) => (
              <div key={entry.id} className="bg-gray-200 p-6 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  {new Date(entry.createdAt).toLocaleDateString()} • {entry.gitCommitHash || 'No Commit'}
                </p>
                <h2 className="text-xl font-bold text-black mb-2">
                  {/* Title extracted from content or fallback */}
                  {entry.content.substring(0, 50)}...
                </h2>
                <p className="text-black mb-4">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
