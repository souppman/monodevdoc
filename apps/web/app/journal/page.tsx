'use client';

import { useState } from 'react';
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

    const entries: JournalEntry[] = [
        {
            id: 1,
            time: '2 hours ago',
            commit: 'commit abc123f',
            title: 'Auth implementation decision',
            excerpt: '"Decided to use JWT tokens instead of sessions ..."',
            tags: [{tag: 'architecture', color: 'yellow'}, {tag: 'database', color: 'yellow'}],
        },
        {
            id: 2,
            time: 'Yesterday',
            commit: 'branch feature/docs',
            title: 'Documentation tooling research',
            excerpt: '"Researched Docusaurus and Mintlify ..."',
            tags: [{tag: 'docs', color: 'blue'}],
        },
        {
            id: 3,
            time: '3 days ago',
            commit: 'JIRA-456',
            title: 'API rate limiting strategy',
            excerpt: '"Implemented sliding window rate limiter ..."',
            tags: [{tag: 'api', color: 'purple'}],
        },
    ];

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
                    {entries.map((entry) => (
                        <div key={entry.id} className="px-8 py-6 border border-gray-200 rounded-lg">
                            <p className="mb-2 text-xs text-gray-500">
                                {entry.time} • {entry.commit}
                            </p>
                            <h3 className="mb-2 text-xl font-bold text-black">
                                {entry.title}
                            </h3>
                            <p className="mb-4 text-sm text-gray-700">{entry.excerpt}</p>
                            <div className="flex gap-2">
                                {entry.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 text-xs rounded-full bg-${tag.color}-100 text-${tag.color}-600`}
                                    >
                                        {tag.tag}
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
