'use client';

import { useState } from 'react';
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

  const entries: JournalEntry[] = [
    {
      id: 1,
      time: '2 hours ago',
      commit: 'commit abc123f',
      title: 'Auth implementation decision',
      excerpt: '"Decided to use JWT tokens instead of sessions ..."',
      tags: ['architecture', 'database'],
    },
    {
      id: 2,
      time: 'Yesterday',
      commit: 'branch feature/docs',
      title: 'Documentation tooling research',
      excerpt: '"Researched Docusaurus and Mintlify ..."',
      tags: ['api'],
    },
    {
      id: 3,
      time: '3 days ago',
      commit: 'JIRA-456',
      title: 'API rate limiting strategy',
      excerpt: '"Implemented sliding window rate limiter ..."',
      tags: ['api'],
    },
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Developer Journal</h1>
        <Link
          href="/journal/new"
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded transition-colors"
        >
          + New Entry
        </Link>
      </header>

      {/* Filter Tabs */}
      <div className="px-8 py-4 flex gap-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-2 rounded transition-colors ${
            activeFilter === 'all'
              ? 'bg-gray-300 text-black'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          All (47)
        </button>
        <button
          onClick={() => setActiveFilter('commit')}
          className={`px-6 py-2 rounded transition-colors ${
            activeFilter === 'commit'
              ? 'bg-gray-300 text-black'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          By Commit
        </button>
        <button
          onClick={() => setActiveFilter('branch')}
          className={`px-6 py-2 rounded transition-colors ${
            activeFilter === 'branch'
              ? 'bg-gray-300 text-black'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          By Branch
        </button>
        <button
          onClick={() => setActiveFilter('tagged')}
          className={`px-6 py-2 rounded transition-colors ${
            activeFilter === 'tagged'
              ? 'bg-gray-300 text-black'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          Tagged
        </button>
      </div>

      {/* Journal Entries */}
      <main className="px-8 py-6">
        <div className="flex flex-col gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-gray-200 p-6 rounded">
              <p className="text-sm text-gray-700 mb-2">
                {entry.time} • {entry.commit}
              </p>
              <h2 className="text-2xl font-bold text-black mb-2">
                {entry.title}
              </h2>
              <p className="text-black mb-4">{entry.excerpt}</p>
              <div className="flex gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-black text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
