'use client';

import Link from 'next/link';
import { Pencil, Trash2, Maximize2, X, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ documents: 0, journalEntries: 0, aiGenerated: 0 });
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  useEffect(() => {
    const projectId = localStorage.getItem('current_project_id');

    // Fetch stats with projectId
    if (projectId) {
      fetch(`/api/dashboard/stats?projectId=${projectId}`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Failed to fetch stats', err));

      // Fetch saved docs
      fetch(`/api/docs?projectId=${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDocs(data);
        })
        .catch(err => console.error('Failed to fetch docs', err));
    }
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/docs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocs(docs.filter(d => d.id !== id));
        setStats(prev => ({ ...prev, documents: prev.documents - 1, aiGenerated: prev.aiGenerated - 1 }));
        if (selectedDoc?.id === id) setSelectedDoc(null);
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  return (
    <div className="flex-1 bg-white relative">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 bg-white z-10">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <Link
          href="/generate"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          + New Doc
        </Link>
      </header>

      <main className="px-8 py-6">
        {/* Quick Stats */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">{stats.documents}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Documents</div>
            </div>
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-green-600 mb-2">{stats.journalEntries}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Journal Entries</div>
            </div>
            <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-purple-600 mb-2">{stats.aiGenerated}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">AI Generated</div>
            </div>
          </div>
        </section>

        {/* Saved Documentation Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-64 relative overflow-hidden"
                >
                  <div className="p-6 flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <button
                        onClick={(e) => handleDelete(doc.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{doc.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {doc.docType} • {new Date(doc.createdAt).toLocaleDateString()}
                    </p>

                    <div className="prose prose-sm max-w-none text-gray-600 line-clamp-3 text-xs">
                      {doc.content.substring(0, 150)}...
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-medium text-blue-600 group-hover:underline">View Document</span>
                    <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg mb-4">No saved documentation found for this project.</p>
                <Link href="/generate" className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                  Generate Your First Doc
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedDoc(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-8 py-5 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDoc.docType} • Generated on {new Date(selectedDoc.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="max-w-none prose prose-slate bg-white p-10 rounded-xl shadow-sm border border-gray-200 mx-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">{selectedDoc.content}</pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-8 py-4 bg-white flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selectedDoc.id, { stopPropagation: () => { } } as any)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

