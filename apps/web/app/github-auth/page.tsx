'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, ArrowRight } from 'lucide-react';

export default function GitHubAuth() {
  // No preset default value
  const [repoInput, setRepoInput] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [repos, setRepos] = useState<any[]>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          await fetchRepos(); // Wait for repos
        } else {
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Session check failed', error);
      setLoading(false);
    }
  };


  const fetchRepos = async () => {
    try {
      setRepoLoading(true);
      const res = await fetch('/api/github/repos');
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      }
    } catch (e) {
      console.error("Failed to fetch repos", e);
    } finally {
      setRepoLoading(false);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/github';
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoInput.trim()) {
      const cleanName = repoInput.replace('https://github.com/', '').split('/').pop() || repoInput;
      // Basic parsing for full URL to get owner/repo if possible, else just use the input
      let fullName = cleanName;
      // If it looks like a full URL, try to extract owner/repo
      if (repoInput.includes('github.com')) {
        try {
          const parts = new URL(repoInput).pathname.split('/').filter(Boolean);
          if (parts.length >= 2) {
            fullName = `${parts[0]}/${parts[1]}`;
          }
        } catch (e) { }
      }

      // Set context
      localStorage.setItem('current_project_id', fullName.split('/').pop() || fullName); // repo name
      localStorage.setItem('current_repo_full_name', fullName);
      localStorage.setItem('current_repo_url', repoInput.startsWith('http') ? repoInput : `https://github.com/${fullName}`);
      // If not logged in, we use a placeholder or previous session user
      if (!localStorage.getItem('current_user_login')) {
        // If we have a real user from session, use that even if this is manual
        if (user) {
          localStorage.setItem('current_user_login', user.login);
        } else {
          localStorage.setItem('current_user_login', 'manual-user');
        }
      }

      router.push('/dashboard');
    }
  };

  const handleContinue = async () => {
    if (selectedRepo && user) {
      try {
        setLoading(true);
        // 1. Upsert Project in Backend
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: String(selectedRepo.id),
            name: selectedRepo.name,
            repoUrl: selectedRepo.html_url,
            ownerId: user.login
          })
        });

        if (!res.ok) {
          throw new Error('Failed to connect project');
        }

        const project = await res.json();

        // 2. Save Context
        localStorage.setItem('current_project_id', project.id);
        localStorage.setItem('current_repo_full_name', selectedRepo.full_name);
        localStorage.setItem('current_repo_url', selectedRepo.html_url);
        localStorage.setItem('current_user_login', user.login);

        // 3. Redirect
        router.push('/dashboard');
      } catch (e) {
        console.error("Failed to connect project", e);
        alert("Failed to connect project. Please try again.");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="w-full max-w-md flex flex-col gap-8 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user ? `Welcome, ${user.login || user.name || 'Developer'}` : 'Connect to GitHub'}
          </h1>
          <p className="text-gray-500">
            {user
              ? 'Select a repository to link to your journal.'
              : 'Link your repository to start generating smart documentation.'}
          </p>
        </div>

        <div className="space-y-6">
          {!user ? (
            <>
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Authorize with GitHub
              </button>
              <p className="text-xs text-center text-gray-400">
                Authentication is required to ensure your journal entries are securely scoped to your identity.
              </p>
            </>
          ) : (
            <div className="space-y-4">
              {/* Repo List */}
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {repoLoading ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Loading repositories...</div>
                ) : repos.length > 0 ? (
                  repos.map(repo => (
                    <button
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${selectedRepo?.id === repo.id ? 'bg-blue-50 hover:bg-blue-50 ring-1 ring-blue-500 z-10' : ''}`}
                    >
                      <div className="truncate">
                        <div className="font-medium text-gray-900 text-sm">{repo.name}</div>
                        <div className="text-xs text-gray-500">{repo.full_name}</div>
                      </div>
                      {repo.private && (
                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Private</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No repositories found</div>
                )}
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedRepo}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect {selectedRepo ? selectedRepo.name : ''}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-xs text-gray-400">Logged in as {user.login || user.name}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

