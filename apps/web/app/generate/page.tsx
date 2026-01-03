'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateDocumentation() {
  const router = useRouter();
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
      <main className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-black text-center mb-12">
          Generate Documentation
        </h1>

        <div className="flex flex-col gap-8">
          {/* Documentation Type */}
          <div>
            <label htmlFor="docType" className="block text-black font-medium mb-3">
              Documentation Type
            </label>
            <div className="relative">
              <select
                id="docType"
                value={formData.docType}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded text-black appearance-none bg-white focus:outline-none focus:border-gray-400"
              >
                <option value="Architecture Documentation">Architecture Documentation</option>
                <option value="Requirements">Requirements</option>
                <option value="User Guide">User Guide</option>
                <option value="API Reference">API Reference</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
                ▼
              </div>
            </div>
          </div>

          {/* Context to Include */}
          <div>
            <label className="block text-black font-medium mb-3">
              Context to Include
            </label>
            <div className="space-y-3">
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    context: { ...formData.context, currentBranch: !formData.context.currentBranch },
                  })
                }
                className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                    formData.context.currentBranch ? 'bg-black' : 'bg-white'
                  }`}
                >
                  {formData.context.currentBranch && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-black">Current Branch (feature/auth)</span>
              </button>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    context: { ...formData.context, allBranches: !formData.context.allBranches },
                  })
                }
                className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                    formData.context.allBranches ? 'bg-black' : 'bg-white'
                  }`}
                >
                  {formData.context.allBranches && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-black">All Branches</span>
              </button>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    context: { ...formData.context, recentCommits: !formData.context.recentCommits },
                  })
                }
                className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                    formData.context.recentCommits ? 'bg-black' : 'bg-white'
                  }`}
                >
                  {formData.context.recentCommits && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-black">Recent Commits (last 30 days)</span>
              </button>
            </div>
          </div>

          {/* Journal Notes */}
          <div>
            <label className="block text-black font-medium mb-3">Journal Notes</label>
            <div className="space-y-3">
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    journal: { ...formData.journal, allEntries: !formData.journal.allEntries },
                  })
                }
                className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                    formData.journal.allEntries ? 'bg-black' : 'bg-white'
                  }`}
                >
                  {formData.journal.allEntries && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-black">Include all relevant journal entries</span>
              </button>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    journal: { ...formData.journal, taggedOnly: !formData.journal.taggedOnly },
                  })
                }
                className="w-full px-6 py-4 bg-gray-300 hover:bg-gray-400 transition-colors rounded flex items-center gap-3"
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${
                    formData.journal.taggedOnly ? 'bg-black' : 'bg-white'
                  }`}
                >
                  {formData.journal.taggedOnly && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-black">Include tagged entries only</span>
              </button>
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-black font-medium mb-3">
              Additional Instructions (optional)
            </label>
            <textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded text-black bg-white focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-gray-300 hover:bg-gray-400 text-black text-lg rounded transition-colors"
          >
            Generate Documentation
          </button>
        </div>
      </main>
    </div>
  );
}
