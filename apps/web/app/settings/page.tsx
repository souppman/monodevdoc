'use client';
import { useState, useEffect } from 'react';
import { Github, Zap, TreePine, Slack, SquareKanban, Download } from 'lucide-react';

export default function Settings() {
    const [repoName, setRepoName] = useState('github.com/user/test-project');

    useEffect(() => {
        const stored = localStorage.getItem('current_project_id');
        if (stored) {
            setRepoName(`github.com/souppman/${stored}`);
        }
    }, []);

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 px-8 py-6 flex items-center">
                <h1 className="text-3xl font-bold text-black">Settings</h1>
            </header>

            {/* Settings List */}
            <main className="px-8 py-6 space-y-6">

                {/* Repository Configuration */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Repository Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Connected Repository
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                                    value={repoName} // Changed from defaultValue
                                    readOnly
                                />
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                    Change
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Branch
                            </label>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-black">
                                <option>main</option>
                                <option>develop</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* AI & Documentation */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">AI & Documentation</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                AI Model
                            </label>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-black">
                                <option>GPT-4 (Recommended)</option>
                                <option>Claude 3 Sonnet</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documentation Style
                            </label>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-black">
                                <option>Technical (Default)</option>
                                <option>Beginner Friendly</option>
                                <option>Comprehensive</option>
                                <option>Minimal</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Integrations */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Integrations</h2>
                    <div className="space-y-3">

                        {/* GitHub */}
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                                    <Github className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">GitHub</div>
                                    <div className="text-sm text-gray-500">Connected to Repository</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Connected</span>
                        </div>

                        {/* Supabase */}
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Supabase</div>
                                    <div className="text-sm text-gray-500">Database & auth</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Connected</span>
                        </div>

                        {/* Pinecone */}
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                                    <TreePine className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Pinecone</div>
                                    <div className="text-sm text-gray-500">Vector Database for RAG</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Not Connected</span>
                        </div>
                        {/* Slack */}
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center">
                                    <Slack className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Slack</div>
                                    <div className="text-sm text-gray-500">Notifications and sharing</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Not Connected</span>
                        </div>
                        {/* Jira */}
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                                    <SquareKanban className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Jira</div>
                                    <div className="text-sm text-gray-500">Kanban Board Tickets</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Not Connected</span>
                        </div>
                    </div>
                </div>

                {/* Export & Backup */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Export & Backup</h2>
                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                            <span>Export all documentation as Markdown</span>
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                            <span>Export journal entries as JSON</span>
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                            <span>Backup to S3</span>
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </main>
        </div>
    )
}