'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function GenerateDocumentation() {
    const [formData, setFormData] = useState({
        docType: 'Architecture Documentation',
        context: {
            currentBranch: true,
            allBranches: false,
            recentCommits: true,
        },
        journal: {
            allEntries: true,
            taggedOnly: true,
        },
        instructions: 'Focus on microservices architecture and include deployment strategies ...',
    });

    const handleGenerate = () => {
        console.log('Generating documentation...', formData);
    };

    return (
        <div className="flex-1 bg-white">
            <header className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-black">Generate Documentation</h1>
            </header>

            <main className="px-8 py-6">
                <div className="flex flex-col items-end gap-6">
                    {/* Documentation Type */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="docType" className="block mb-3 font-semibold text-gray-900">
                            Documentation Type
                        </label>
                        <div className="relative">
                            <select
                                id="docType"
                                value={formData.docType}
                                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                                className="px-4 py-2 text-black border border-gray-300 rounded-lg"
                            >
                                <option value="Architecture Documentation">Architecture Documentation</option>
                                <option value="Requirements">Requirements</option>
                                <option value="User Guide">User Guide</option>
                                <option value="Technical Specification">Technical Specification</option>
                            </select>
                        </div>
                    </div>

                    {/* Context to Include */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label className="block mb-3 font-semibold text-gray-900">
                            Context to Include
                        </label>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        context: { ...formData.context, currentBranch: !formData.context.currentBranch },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.context.currentBranch ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.context.currentBranch && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Current Branch (feature/auth)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        context: { ...formData.context, allBranches: !formData.context.allBranches },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.context.allBranches ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.context.allBranches && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">All Branches</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        context: { ...formData.context, recentCommits: !formData.context.recentCommits },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.context.recentCommits ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.context.recentCommits && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Recent Commits (last 30 days)</span>
                            </button>
                        </div>
                    </div>

                    {/* Journal Notes */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label className="block mb-3 font-semibold text-gray-900">Journal Notes</label>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        journal: { ...formData.journal, allEntries: !formData.journal.allEntries },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.journal.allEntries ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.journal.allEntries && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Include all relevant journal entries</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        journal: { ...formData.journal, taggedOnly: !formData.journal.taggedOnly },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.journal.taggedOnly ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.journal.taggedOnly && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Include tagged entries only</span>
                            </button>
                        </div>
                    </div>

                    {/* Additional Instructions */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="instructions" className="block mb-3 font-semibold text-gray-900">
                            Additional Instructions (optional)
                        </label>
                        <textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 text-black bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-400"
                        />
                    </div>

                    {/* Generate button */}
                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="flex items-center justify-center gap-2 px-6 py-2 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                        Generate Documentation
                    </button>
                </div>
            </main>
        </div>
    );
}
