'use client';

import { useState } from 'react';
import { Search, FileText, BookOpen, FileCode } from 'lucide-react';

export default function SearchDashboard() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'documents' | 'journal' | 'code'>('all');

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="relative px-8 py-6 border-b border-gray-200">
                <Search className="absolute left-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search documents, journals, and code..."
                    className="w-full pl-12 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('documents')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'documents'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Documentation
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('journal')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'journal'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Journal Entries
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('code')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activeFilter === 'code'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Code
                    </button>
                </div>

                {/* Search Results */}
                <div className="space-y-4">
                    <span className="block text-gray-500">Found <strong>8 results</strong> for "authentication"</span>

                    <div className="flex gap-4 px-8 py-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">Authentication System</h3>
                                <span className="text-xs text-gray-500">Documentation</span>
                            </div>
                            <p className="mb-2 text-sm text-gray-700">
                                The <mark className="bg-yellow-200">authentication</mark> system utilizes JWT instead of sessions for...
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>feature/user-auth</span>
                                <span>•</span>
                                <span>2 hours ago</span>
                                <span>•</span>
                                <span>abc123f</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 px-8 py-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-green-600" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">Auth implementation decision</h3>
                                <span className="text-xs text-gray-500">Journal</span>
                            </div>
                            <p className="mb-2 text-sm text-gray-700">
                                Decided to use JWT tokens instead of sessions for <mark className="bg-yellow-200">authentication</mark>...
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>2 hours ago</span>
                                <span>•</span>
                                <span>abc123f</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 px-8 py-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                            <FileCode className="w-5 h-5 text-purple-600" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">src/auth/auth.ts</h3>
                                <span className="text-xs text-gray-500">Code</span>
                            </div>
                            <p className="w-fit px-4 py-2 mb-2 text-sm text-gray-700 bg-gray-100 rounded">
                                const decoded = jwt.verify(token, secretKey);
                                <br />
                                // return original payload if <mark className="bg-yellow-200">authentication</mark> is valid
                                <br />
                                return decoded;
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>feature/user-auth</span>
                                <span>•</span>
                                <span>Modified 2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
