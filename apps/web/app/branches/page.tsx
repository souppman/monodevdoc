'use client';

import { GitBranch } from 'lucide-react';
import { useState, useEffect } from 'react';



export default function Branches() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [repoInfo, setRepoInfo] = useState<{ owner: string, repo: string } | null>(null);

    useEffect(() => {
        const repoFullName = localStorage.getItem('current_repo_full_name'); // e.g. "souppman/monodevdoc"
        if (repoFullName) {
            const [owner, repo] = repoFullName.split('/');
            setRepoInfo({ owner, repo });

            fetch(`/api/github/branches?owner=${owner}&repo=${repo}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBranches(data);
                    } else {
                        console.error('Expected array of branches, got:', data);
                        setBranches([]);
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch branches', err);
                    setBranches([]);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="px-8 py-6 border-b border-gray-200 flex items-center">
                <h1 className="text-3xl font-bold text-black">Branch Activity</h1>
            </header>

            {/* Branch Activity */}
            <main className="px-8 py-6 space-y-4">
                {loading ? (
                    <div className="text-gray-500">Loading branches...</div>
                ) : branches.length === 0 ? (
                    <div className="text-gray-500 italic">No branches found or no repository selected.</div>
                ) : (
                    branches.map((branch, idx) => (
                        <div key={idx} className="px-8 py-6 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <GitBranch className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                                        {/* GitHub branches API doesn't return last activity date in the simple list, 
                                            we would need to fetch commit details. For now, showing name + SHA. */}
                                        <p className="text-xs text-gray-500">
                                            Commit: {branch.commit?.sha.substring(0, 7)}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${branch.name === 'main' || branch.name === 'master'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {branch.name === 'main' || branch.name === 'master' ? 'Stable' : 'Active'}
                                </span>
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
                    ))
                )}
            </main>
        </div>
    )
}