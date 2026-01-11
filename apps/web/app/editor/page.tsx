'use client';

import { useState } from 'react';

export default function DocumentEditor() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'history'>('edit');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">Documents</h2>
          <button className="px-4 py-1 bg-white hover:bg-gray-300 text-black text-sm rounded transition-colors">
            + New
          </button>
        </div>

        {/* Documents Tree */}
        <div className="space-y-2">
          <div>
            <button className="w-full text-left px-3 py-2 text-black font-medium hover:bg-gray-300 rounded transition-colors">
              ▼ Architecture
            </button>
            <div className="ml-4 mt-1 space-y-1">
              <button className="w-full text-left px-3 py-2 bg-white text-black rounded">
                System Overview
              </button>
              <button className="w-full text-left px-3 py-2 text-black hover:bg-gray-300 rounded transition-colors">
                Database Schema
              </button>
            </div>
          </div>

          <div>
            <button className="w-full text-left px-3 py-2 text-black font-medium hover:bg-gray-300 rounded transition-colors">
              ▼ Requirements
            </button>
            <div className="ml-4 mt-1 space-y-1">
              <button className="w-full text-left px-3 py-2 text-black hover:bg-gray-300 rounded transition-colors">
                Functional Req.
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 bg-white flex flex-col">
        {/* Breadcrumb & Actions */}
        <div className="px-8 py-4 bg-gray-200 flex items-center justify-between">
          <p className="text-black">Documentation / Architecture /</p>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-white hover:bg-gray-300 text-black rounded transition-colors">
              Preview
            </button>
            <button className="px-6 py-2 bg-white hover:bg-gray-300 text-black rounded transition-colors">
              Generate AI
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 bg-gray-200 flex gap-6">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'edit' ? 'bg-gray-400 text-black' : 'bg-transparent text-black hover:bg-gray-300'
              }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'preview' ? 'bg-gray-400 text-black' : 'bg-transparent text-black hover:bg-gray-300'
              }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'history' ? 'bg-gray-400 text-black' : 'bg-transparent text-black hover:bg-gray-300'
              }`}
          >
            History
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-8 py-3 bg-gray-200 flex gap-4 items-center">
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black font-bold rounded">B</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black italic rounded">I</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black underline rounded">U</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black rounded">H1</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black rounded">H2</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black rounded">🔗</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black rounded">📷</button>
          <button className="px-3 py-1 bg-white hover:bg-gray-300 text-black rounded">▦</button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 px-8 py-6">
          <div className="bg-white border border-gray-300 rounded p-6 min-h-96">
            <h1 className="text-3xl font-bold text-black mb-4">System Overview</h1>

            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-200 text-black text-sm rounded">AI Generated</span>
              <span className="px-3 py-1 bg-gray-200 text-black text-sm rounded">Last updated 2 hours ago</span>
            </div>

            <div className="border-t-2 border-gray-300 my-4"></div>
            <div className="border-t-2 border-gray-300 my-4"></div>
            <div className="border-t-2 border-gray-300 my-4 w-2/3"></div>

            {/* Journal Note */}
            <div className="bg-gray-200 p-4 rounded my-6">
              <p className="text-sm text-black mb-2">
                Journal Note • commit abc123f • feature/auth
              </p>
              <p className="text-black">
                "Write your journal entry here..."
              </p>
            </div>

            <div className="border-t-2 border-gray-300 my-4"></div>
            <div className="border-t-2 border-gray-300 my-4"></div>

            <p className="text-gray-500 italic text-center mt-12">
              [Continue editing or generate more content...]
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
