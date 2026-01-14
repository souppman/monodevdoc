'use client';

import { useState } from 'react';

export default function GenerateDocumentation() {
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

  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

      // Get settings from local storage
      const apiKey = localStorage.getItem('settings_openrouter_key');
      const aiModel = localStorage.getItem('settings_ai_model');

      if (!apiKey) {
        alert('Please set your OpenRouter API Key in Settings.');
        setIsGenerating(false);
        return;
      }

      const res = await fetch('/api/rag/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenRouter-Key': apiKey,
          'X-OpenRouter-Model': aiModel || 'openai/gpt-4o-mini',
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
    // Deterministically resolve Project ID from Repo Name if possible
    let projectId = localStorage.getItem('current_project_id');
    const repoFullName = localStorage.getItem('current_repo_full_name');

    if (repoFullName) {
      try {
        const lookupRes = await fetch(`/api/projects/lookup?repoUrl=${repoFullName}`);
        if (lookupRes.ok) {
          const projectData = await lookupRes.json();
          projectId = projectData.id;
          // Sync local storage to be correct
          localStorage.setItem('current_project_id', projectData.id);
        }
      } catch (e) {
        console.warn('Failed to resolve project by repo name, falling back to stored ID', e);
      }
    }

    if (!projectId || !generatedContent) {
      if (!projectId) alert('No project connected. Please configure a repository in Settings.');
      return;
    }

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
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save documentation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!generatedContent) return;
    setIsExporting(true);
    try {
      const filename = `${formData.docType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
      const res = await fetch('/api/rag/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: generatedContent,
          filename: filename
        })
      });

      if (!res.ok) throw new Error('Export failed');

      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Export succeeded but no URL returned.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export.');
    } finally {
      setIsExporting(false);
    }
  };


    return (
        <div className="flex-1 bg-white">
            <header className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-black">Generate Documentation</h1>
            </header>

            <main className="px-8 py-6">
                <div className="flex flex-col items-center gap-6">
                    {/* Documentation Type */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="docType" className="block mb-3 font-semibold text-gray-900">
                            Documentation Type
                        </label>
                        <div className="relative">
                            <select
                                id="docType"
                                value={formData.docType}
                                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                                className="px-4 py-2 text-black border border-gray-300 rounded-lg"
                            >
                                <option value="Architecture Documentation">Architecture Documentation</option>
                                <option value="Requirements">Requirements</option>
                                <option value="User Guide">User Guide</option>
                                <option value="Technical Specification">Technical Specification</option>
                            </select>
                        </div>
                    </div>

                    {/* Context to Include */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label className="block mb-3 font-semibold text-gray-900">
                            Context to Include
                        </label>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        context: { ...formData.context, currentBranch: !formData.context.currentBranch },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.context.currentBranch ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.context.currentBranch && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Current Branch (feature/auth)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        context: { ...formData.context, allBranches: !formData.context.allBranches },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.context.allBranches ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.context.allBranches && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">All Branches</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        context: { ...formData.context, recentCommits: !formData.context.recentCommits },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.context.recentCommits ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.context.recentCommits && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Recent Commits (last 30 days)</span>
                            </button>
                        </div>
                    </div>

                    {/* Journal Notes */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label className="block mb-3 font-semibold text-gray-900">Journal Notes</label>
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        journal: { ...formData.journal, allEntries: !formData.journal.allEntries },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.journal.allEntries ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.journal.allEntries && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Include all relevant journal entries</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        journal: { ...formData.journal, taggedOnly: !formData.journal.taggedOnly },
                                    })
                                }
                                className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <div
                                    className={`flex items-center justify-center w-6 h-6 border border-blue-600 rounded ${
                                        formData.journal.taggedOnly ? 'bg-blue-600' : 'bg-white'
                                    }`}
                                >
                                    {formData.journal.taggedOnly && <span className="text-sm text-white">✓</span>}
                                </div>
                                <span className="text-black">Include tagged entries only</span>
                            </button>
                        </div>
                    </div>

                    {/* Additional Instructions */}
                    <div className="w-full px-8 py-6 border border-gray-200 rounded-lg">
                        <label htmlFor="instructions" className="block mb-3 font-semibold text-gray-900">
                            Additional Instructions (optional)
                        </label>
                        <textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 text-black bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-400"
                        />
                    </div>

                    {/* Generate button */}
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className={`px-6 py-2 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''
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
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 mr-4"
              >
                {isExporting ? 'Exporting...' : 'Export to S3'}
              </button>

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
