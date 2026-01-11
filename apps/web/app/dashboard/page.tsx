'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';



export default function Dashboard() {
  const [stats, setStats] = useState({ documents: 0, journalEntries: 0, aiGenerated: 0 });

  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats', err));

    // Fetch saved docs
    const projectId = localStorage.getItem('current_project_id');
    if (projectId) {
      fetch(`/api/docs?projectId=${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDocs(data);
        })
        .catch(err => console.error('Failed to fetch docs', err));
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/docs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocs(docs.filter(d => d.id !== id));
        // Update stats locally
        setStats(prev => ({ ...prev, aiGenerated: prev.aiGenerated - 1 }));
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <Link
          href="/generate"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          + New Doc
        </Link>
      </header>

      <main className="px-8 py-6">
        {/* Quick Stats */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-8 rounded-lg border-gray-200 border text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">{stats.documents}</div>
              <div className="text-sm text-black">Documents</div>
            </div>
            <div className="p-8 rounded-lg border-gray-200 border text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{stats.journalEntries}</div>
              <div className="text-sm text-black">Journal Entries</div>
            </div>
            <div className="p-8 rounded-lg border-gray-200 border text-center">
              <div className="text-6xl font-bold text-purple-600 mb-2">{stats.aiGenerated}</div>
              <div className="text-sm text-black">AI Generated</div>
            </div>
          </div>
        </div>

        {/* Saved Documentation */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-black mb-4">Saved Documentation</h2>
          <div className="space-y-6">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">{doc.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {doc.docType} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="prose max-w-none text-gray-800 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-100">
                    {doc.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 italic bg-gray-50 rounded border border-gray-200">
                No saved documentation yet. Go to <Link href="/generate" className="text-blue-600 underline">Generate</Link> to create one.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

