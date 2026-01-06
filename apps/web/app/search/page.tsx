'use client';

import { useState } from 'react';
import { Search, FileText, BookOpen, FileCode } from 'lucide-react';

export default function SearchDashboard() {

    const [activeFilter, setActiveFilter] = useState<'all' | 'documents' | 'journal' | 'code'>('all');

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="px-8 py-6 border-b border-gray-200 relative">
                <Search className="absolute left-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search documents, journals, and code..."
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </header>

            <main className="px-8 py-6 space-y-6">
                {/* Filter Tabs */}
                <div className="flex gap-4">
                    <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilter === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    >
                    All
                    </button>
                    <button
                    onClick={() => setActiveFilter('documents')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilter === 'documents'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    >
                    Documentation
                    </button>
                    <button
                    onClick={() => setActiveFilter('journal')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilter === 'journal'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    >
                    Journal Entries
                    </button>
                    <button
                    onClick={() => setActiveFilter('code')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilter === 'code'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    >
                    Code
                    </button>
                </div>

                {/* Search Results */}
                <div className="space-y-4">
                    <span className="block text-gray-500">Found <strong>8 results</strong> for "authentication"</span>

                    <div className="px-8 py-6 border border-gray-200 rounded-lg flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">Authentication System</h3>
                                <span className="text-xs text-gray-500">Documentation</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                The <mark className="bg-yellow-200">authentication</mark> system utilizes JWT instead of sessions for...
                            </p>
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                                <span>feature/user-auth</span>
                                <span>•</span>
                                <span>2 hours ago</span>
                                <span>•</span>
                                <span>abc123f</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 border border-gray-200 rounded-lg flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green-700" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">Auth implementation decision</h3>
                                <span className="text-xs text-gray-500">Journal</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                                Decided to use JWT tokens instead of sessions for <mark className="bg-yellow-200">authentication</mark>...
                            </p>
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                                <span>2 hours ago</span>
                                <span>•</span>
                                <span>abc123f</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 border border-gray-200 rounded-lg flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                            <FileCode className="w-5 h-5 text-purple-600" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">src/auth/auth.ts</h3>
                                <span className="text-xs text-gray-500">Code</span>
                            </div>
                            <p className="w-fit px-4 py-2 mb-2 rounded text-sm text-gray-700 bg-gray-100">
                                const decoded = jwt.verify(token, secretKey);
                                <br />
                                // return original payload if <mark className="bg-yellow-200">authentication</mark> is valid
                                <br />
                                return decoded;
                            </p>
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                                <span>feature/user-auth</span>
                                <span>•</span>
                                <span>Modified 2 hours ago</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}