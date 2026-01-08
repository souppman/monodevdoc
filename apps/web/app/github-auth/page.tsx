'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Repository {
  id: number;
  name: string;
  branch: string;
  visibility: 'Main' | 'Private' | 'Public';
}


export default function GitHubAuth() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const router = useRouter();

  // Mock data (replace with real GitHub API fetch later if needed, but for now user just wants functional UI)
  const repositories: Repository[] = [
    { id: 1, name: 'monodevdoc', branch: 'Main', visibility: 'Private' }, // Real repo match
    { id: 2, name: 'repository-two', branch: 'Private', visibility: 'Private' },
    { id: 3, name: 'repository-three', branch: 'Public', visibility: 'Public' },
  ];

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedRepo) {
      // Simple "Auth" - Persist Project ID
      // In a real app we'd get a session token, but here we just need Context.
      localStorage.setItem('current_project_id', selectedRepo);
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="w-full max-w-md flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-black text-center">
          Connect to Github
        </h1>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded text-base text-gray-500 focus:outline-none focus:border-gray-400"
        />

        {/* Repository list */}
        <div className="flex flex-col gap-3">
          {filteredRepos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => setSelectedRepo(repo.name)}
              className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${selectedRepo === repo.name ? 'bg-black' : 'bg-white'
                  }`}>
                  {selectedRepo === repo.name && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-black">{repo.name}</span>
              </div>
              <span className="text-black">{repo.visibility}</span>
            </button>
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRepo}
          className={`w-full py-3 bg-gray-300 text-black text-center rounded transition-colors ${selectedRepo ? 'hover:bg-gray-400' : 'opacity-50 cursor-not-allowed'
            }`}
        >
          Continue ({selectedRepo ? '1 selected' : '0 selected'})
        </button>
      </main>
    </div>
  );
}

