'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InitialSetup() {
    const [projectName, setProjectName] = useState('test-project');
    const [selectedDocs, setSelectedDocs] = useState({
        requirements: true,
        architecture: true,
        userGuide: true,
        apiReference: false,
    });

    const toggleDoc = (docType: keyof typeof selectedDocs) => {
        setSelectedDocs(prev => ({
            ...prev,
            [docType]: !prev[docType],
        }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <main className="w-full max-w-md flex flex-col gap-8">
                <h1 className="text-4xl font-bold text-black text-center">
                    Configure Your Project
                </h1>

                {/* Project Name */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="projectName" className="text-black font-medium">
                        Project Name
                    </label>
                    <input
                        id="projectName"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded text-base text-gray-500 focus:outline-none focus:border-gray-400"
                    />
                </div>

                {/* Document Types */}
                <div className="flex flex-col gap-3">
                    <label className="text-black font-medium">
                        Document Types to Generate
                    </label>

                    <button
                        onClick={() => toggleDoc('requirements')}
                        className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                            selectedDocs.requirements ? 'bg-black' : 'bg-white'
                        }`}>
                            {selectedDocs.requirements && (
                                <span className="text-white text-sm">✓</span>
                            )}
                        </div>
                        <span className="text-black">Requirements</span>
                    </button>

                    <button
                        onClick={() => toggleDoc('architecture')}
                        className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                            selectedDocs.architecture ? 'bg-black' : 'bg-white'
                        }`}>
                            {selectedDocs.architecture && (
                                <span className="text-white text-sm">✓</span>
                            )}
                        </div>
                        <span className="text-black">Architecture Documentation</span>
                    </button>

                    <button
                        onClick={() => toggleDoc('userGuide')}
                        className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                            selectedDocs.userGuide ? 'bg-black' : 'bg-white'
                        }`}>
                            {selectedDocs.userGuide && (
                                <span className="text-white text-sm">✓</span>
                            )}
                        </div>
                        <span className="text-black">User Guide</span>
                    </button>

                    <button
                        onClick={() => toggleDoc('apiReference')}
                        className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                            selectedDocs.apiReference ? 'bg-black' : 'bg-white'
                        }`}>
                            {selectedDocs.apiReference && (
                                <span className="text-white text-sm">✓</span>
                            )}
                        </div>
                        <span className="text-black">API Reference</span>
                    </button>
                </div>

                {/* Complete Setup button */}
                <Link
                    href="/dashboard"
                    className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-black text-center rounded transition-colors"
                >
                    Complete Setup
                </Link>
            </main>
        </div>
    );
}
