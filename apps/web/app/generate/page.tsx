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
    instructions: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedSources, setGeneratedSources] = useState<string | null>(null);

  // Moved isSaving up to top level hooks where it belongs
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    const projectId = localStorage.getItem('current_project_id');
    if (!projectId) {
      alert('Please connect to a repository first.');
      return;
    }

    const docStyle = localStorage.getItem('settings_doc_style') || 'Technical (Default)';

    setIsGenerating(true);
    setGeneratedContent(null);
    setGeneratedSources(null);

    try {
      // Construct a prompt based on form selection
      const prompt = `
        Generate ${formData.docType} for the current project.
        Context: ${formData.context.currentBranch ? 'Current Branch' : ''} ${formData.context.allBranches ? 'All Branches' : ''}.
        Include Journal Entries: ${formData.journal.allEntries ? 'Yes' : 'No'}.
        Additional Instructions: ${formData.instructions}
      `;

      const res = await fetch('/api/rag/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          doc_type: formData.docType,
          doc_style: docStyle,
          project_id: projectId,
          top_k: 5,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate documentation');
      }

      const data = await res.json();

      setGeneratedContent(data.answer || "No answer generated.");

      const snippets = data.results.map((r: any) => `### Source: ${r.metadata?.source || 'Unknown'}\n\n${r.content}`).join('\n\n---\n\n');
      setGeneratedSources(snippets);

    } catch (error) {
      console.error('Error generating docs:', error);
      alert('Failed to generate documentation. Please check console.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const projectId = localStorage.getItem('current_project_id');
    if (!projectId || !generatedContent) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${formData.docType} - ${new Date().toLocaleString()}`,
          content: generatedContent,
          docType: formData.docType,
          docStyle: localStorage.getItem('settings_doc_style') || 'Default',
          projectId
        })
      });

      if (res.ok) {
        alert('Documentation saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save documentation.');
    } finally {
      setIsSaving(false);
    }
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
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${formData.context.currentBranch ? 'bg-black' : 'bg-white'
                    }`}
                >
                  {formData.context.currentBranch && <span className="text-white text-sm">✓</span>}
                </div>
                <span className="text-black">Current Branch {formData.context.currentBranch ? '(Included)' : ''}</span>
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
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${formData.context.allBranches ? 'bg-black' : 'bg-white'
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
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${formData.context.recentCommits ? 'bg-black' : 'bg-white'
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
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${formData.journal.allEntries ? 'bg-black' : 'bg-white'
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
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 border-black ${formData.journal.taggedOnly ? 'bg-black' : 'bg-white'
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
            disabled={isGenerating}
            className={`w-full py-4 bg-gray-300 hover:bg-gray-400 text-black text-lg rounded transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Documentation'}
          </button>
        </div>
      </main>

      {/* Result Display */}
      {generatedContent && (
        <section className="max-w-4xl mx-auto px-8 pb-12">
          <div className="bg-white p-8 rounded-lg border border-gray-300 shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Generated {formData.docType}</h2>
            <div className="prose max-w-none text-black whitespace-pre-wrap mb-8">
              {generatedContent}
            </div>

            <div className="flex justify-end mb-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save to Project'}
              </button>
            </div>

            <hr className="my-6 border-gray-200" />

            <details>
              <summary className="cursor-pointer text-gray-500 font-medium">View Source Context (RAG Verification)</summary>
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 font-mono whitespace-pre-wrap">
                {generatedSources || 'No source context available.'}
              </div>
            </details>
          </div>
        </section>
      )}
    </div>
  );
}
