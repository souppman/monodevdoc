import { GitBranch } from 'lucide-react';

export default function Branches() {
    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="px-8 py-6 border-b border-gray-200 flex items-center">
                <h1 className="text-3xl font-bold text-black">Branch Activity</h1>
            </header>

            {/* Branch Activity */}
            <main className="px-8 py-6 space-y-4">
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <GitBranch className="w-5 h-5 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-gray-900">main</h3>
                                <p className="text-xs text-gray-500">Protected • Last merge 5 hours ago</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-green-700 text-xs font-medium bg-green-100">Stable</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                        Production-ready code with database schema updates
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>142 commits</span>
                        <span>•</span>
                        <span>78 journal entries</span>
                        <span>•</span>
                        <span>4 active docs</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            View Entries
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            Export Docs
                        </button>
                    </div>
                </div>

                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <GitBranch className="w-5 h-5 text-blue-600" />
                            <div>
                                <h3 className="font-semibold text-gray-900">feature/user-auth</h3>
                                <p className="text-xs text-gray-500">Active • Last commit 2 hours ago</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-yellow-700 text-xs font-medium bg-yellow-100">Needs Review</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                        JWT implementation and user authentication system
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>5 commits</span>
                        <span>•</span>
                        <span>3 journal entries</span>
                        <span>•</span>
                        <span>4 files changed</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            View Entries
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            Generate Docs
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}