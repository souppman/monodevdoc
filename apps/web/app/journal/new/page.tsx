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
        <div className="flex-1 bg-white">
            <header className="px-8 py-6 border-b border-gray-200 flex items-center">
                <h1 className="text-3xl font-bold text-black">New Journal Entry</h1>
            </header>

            <main className="px-8 py-6">

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Attach to context */}
                    <div className="px-8 py-6 border border-gray-200 rounded-lg">
                        <label className="block font-semibold text-gray-900 mb-2">
                            Attach to context
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <select
                                    value={formData.commit}
                                    onChange={(e) => setFormData({ ...formData, commit: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                                >
                                    <option value="abc123f">Commit: abc123f</option>
                                    <option value="def456g">Commit: def456g</option>
                                </select>
                            </div>

                            <div className="relative">
                                <select
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                                >
                                    <option value="feature/auth">Branch: feature/auth</option>
                                    <option value="main">Branch: main</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="title" className="block font-semibold text-gray-900 mb-2">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:border-blue-500"
                        />
                    </div>

                    {/* Tags */}
                    <div className="px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="tags" className="block font-semibold text-gray-900 mb-2">
                            Tags (optional)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:border-blue-500"
                        />
                    </div>

                    {/* Linked Ticket */}
                    <div className="px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="ticket" className="block font-semibold text-gray-900 mb-2">
                            Linked Ticket (optional)
                        </label>
                        <input
                            id="ticket"
                            type="text"
                            placeholder="JIRA-XXX or leave empty"
                            value={formData.ticket}
                            onChange={(e) => setFormData({ ...formData, ticket: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:border-blue-500 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Entry Content */}
                    <div className="px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="content" className="block font-semibold text-gray-900 mb-2">
                            Entry Content
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
