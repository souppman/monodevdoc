'use client';

import { useState } from 'react';
import { Search, FileText, BookOpen, FileCode } from 'lucide-react';

export default function SearchDashboard() {

    const [activeFilter, setActiveFilter] = useState<'all' | 'documents' | 'journal' | 'code'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsSearching(true);
            try {
                const projectId = localStorage.getItem('current_project_id') || 'monodevdoc'; // Default for fallback
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: searchQuery,
                        project_id: projectId
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setResults(data.results || []);
                }
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setIsSearching(false);
            }
        }
    };

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="px-8 py-6 border-b border-gray-200 relative">
                <Search className="absolute left-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search documents, journals, and code... (Press Enter)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </header>

            <main className="px-8 py-6 space-y-6">
                {/* Filter Tabs */}
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'all'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        All
                    </button>
                    {/* Other filters disabled for visual cleanup until implemented filters logic */}
                </div>

                {/* Search Results */}
                <div className="space-y-4">
                    {isSearching && <div className="text-gray-500">Searching...</div>}

                    {!isSearching && results.map((result, idx) => (
                        <div key={idx} className="px-8 py-6 border border-gray-200 rounded-lg flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">Score: {result.score.toFixed(2)}</h3>
                                    <span className="text-xs text-gray-500">{result.metadata?.source || 'Result'}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                    {result.content}
                                </p>
                                <div className="text-xs text-gray-500 flex items-center gap-3">
                                    <span>{result.metadata?.file_path || 'Unknown File'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!isSearching && results.length === 0 && searchQuery && (
                        <div className="text-gray-500">No results found.</div>
                    )}
                </div>
            </main>
        </div>
    )
}