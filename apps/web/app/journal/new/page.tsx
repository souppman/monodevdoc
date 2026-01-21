'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewJournalEntry() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [authorId, setAuthorId] = useState('');

  // Data State
  const [commits, setCommits] = useState<any[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [isLoadingContext, setIsLoadingContext] = useState(true);

  const [formData, setFormData] = useState({
    commit: '',
    branch: '',
    title: '',
    tags: '',
    ticket: '',
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedProject = localStorage.getItem('current_project_id');
    const storedRepoUrl = localStorage.getItem('current_repo_url');
    const storedUser = localStorage.getItem('current_user_login');

    if (storedProject) setProjectId(storedProject);
    if (storedRepoUrl) setRepoUrl(storedRepoUrl);
    if (storedUser) setAuthorId(storedUser);

    const fetchData = async () => {
      setIsLoadingContext(true);
      try {
        // Fetch Commits (GitHub via BFF)
        try {
          const repoParam = storedRepoUrl ? storedRepoUrl.replace('https://github.com/', '') : (storedProject || '');
          const commitsRes = await fetch(`/api/git/commits?repo=${encodeURIComponent(repoParam)}`);
          if (commitsRes.ok) {
            const commitsData = await commitsRes.json();
            if (Array.isArray(commitsData) && commitsData.length > 0) {
              setCommits(commitsData);
              setFormData(prev => ({ ...prev, commit: commitsData[0].gitCommitHash }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch commits', err);
        }

        // Fetch Branches (GitHub via BFF)
        try {
          const repoParam = storedRepoUrl ? storedRepoUrl.replace('https://github.com/', '') : (storedProject || '');
          const branchRes = await fetch(`/api/git/branches?repo=${encodeURIComponent(repoParam)}`);
          if (branchRes.ok) {
            const branchData = await branchRes.json();
            if (Array.isArray(branchData) && branchData.length > 0) {
              const branchNames = branchData.map((b: any) => b.name);
              setBranches(branchNames);

              // Find current branch
              const current = branchData.find((b: any) => b.current);
              setFormData(prev => ({
                ...prev,
                branch: current ? current.name : (branchNames.includes('main') ? 'main' : branchNames[0])
              }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch local branches', err);
        }
      } catch (error) {
        console.error('Failed to load context data', error);
      } finally {
        setIsLoadingContext(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!projectId || !authorId) {
      alert("Missing context. Please go to Settings and ensure a repository is connected.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        content: formData.content,
        author_id: authorId,
        project_id: projectId,
        git_context: {
          git_commit_hash: formData.commit,
          git_branch: formData.branch,
          author_id: authorId,
          repo_url: repoUrl || `https://github.com/souppman/${projectId}`
        },
        meta_title: formData.title,
        meta_tags: formData.tags,
        meta_ticket: formData.ticket
      };

      const richContent = `Title: ${formData.title}\nTicket: ${formData.ticket}\nTags: ${formData.tags}\n\n${formData.content}`;

      const finalPayload = {
        projectId: projectId,
        authorId: authorId,
        content: richContent,
        gitCommitHash: formData.commit,
        gitBranch: formData.branch,
        // Optional metadata
        meta_title: formData.title,
        meta_tags: formData.tags,
        meta_ticket: formData.ticket
      };



      const res = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) throw new Error('Failed to create entry');

      router.push('/journal');
      router.refresh();
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-3xl font-bold text-black">New Journal Entry</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Context Section */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Git Branch</label>
                <div className="relative">
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    disabled={isLoadingContext}
                    className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-white text-black font-medium focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
                  >
                    {isLoadingContext ? (
                      <option>Loading...</option>
                    ) : branches.length > 0 ? (
                      branches.map(b => <option key={b} value={b}>{b}</option>)
                    ) : (
                      <option>No branches found</option>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Recent Commit</label>
                <div className="relative">
                  <select
                    value={formData.commit}
                    onChange={(e) => setFormData({ ...formData, commit: e.target.value })}
                    disabled={isLoadingContext}
                    className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-white text-black font-medium focus:ring-2 focus:ring-blue-600 disabled:opacity-50 font-mono text-xs"
                  >
                    {isLoadingContext ? (
                      <option>Loading...</option>
                    ) : commits.length > 0 ? (
                      commits.map((c: any) => (
                        <option key={c.gitCommitHash} value={c.gitCommitHash}>
                          {c.gitCommitHash.substring(0, 7)} - {c.content.substring(0, 40)}...
                        </option>
                      ))
                    ) : (
                      <option>No commits found</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Entry Details */}
          <section className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-black mb-2">Entry Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What are you working on?"
                className="w-full px-4 py-3 text-lg border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-colors placeholder:text-gray-500 text-black font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Related Ticket (Optional)</label>
                <input
                  type="text"
                  value={formData.ticket}
                  onChange={(e) => setFormData({ ...formData, ticket: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Tags (Optional)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-black placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                placeholder="Write your journal entry here..."
                className="w-full p-4 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none text-black leading-relaxed placeholder:text-gray-500"
                required
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
