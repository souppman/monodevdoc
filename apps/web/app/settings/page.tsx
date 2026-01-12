'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Zap, TreePine, Slack, SquareKanban, Download } from 'lucide-react';


export default function Settings() {
    const router = useRouter();
    const [repoName, setRepoName] = useState('Loading...');
    const [aiModel, setAiModel] = useState('openai/gpt-4o-mini');
    const [openRouterKey, setOpenRouterKey] = useState('');
    const [docStyle, setDocStyle] = useState('Technical (Default)');
    const [isExporting, setIsExporting] = useState(false);

    const [branches, setBranches] = useState<string[]>([]);

    useEffect(() => {
        const storedRepo = localStorage.getItem('current_project_id');
        const repoFullName = localStorage.getItem('current_repo_full_name');

        if (repoFullName) {
            setRepoName(`github.com/${repoFullName}`);
        } else if (storedRepo) {
            setRepoName(`github.com/souppman/${storedRepo}`);
        } else {
            setRepoName('No repository connected');
        }

        if (repoFullName) {
            const [owner, repo] = repoFullName.split('/');
            // Fetch branches
            fetch(`/api/github/branches?owner=${owner}&repo=${repo}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBranches(data.map((b: any) => b.name));
                    }
                })
                .catch(err => console.error('Failed to fetch branches', err));
        }

        const storedModel = localStorage.getItem('settings_ai_model');
        if (storedModel) setAiModel(storedModel);

        const storedKey = localStorage.getItem('settings_openrouter_key');
        if (storedKey) setOpenRouterKey(storedKey);

        const storedStyle = localStorage.getItem('settings_doc_style');
        if (storedStyle) setDocStyle(storedStyle);
    }, []);

    const handleChangeProject = () => {
        // Redirect to GitHub Auth page to select a different repository
        router.push('/github-auth');
    };

    const handleSave = () => {
        localStorage.setItem('settings_ai_model', aiModel);
        localStorage.setItem('settings_openrouter_key', openRouterKey);
        localStorage.setItem('settings_doc_style', docStyle);
        alert('Settings saved successfully!');
    };

    const handleExport = async () => {
        const storedRepo = localStorage.getItem('current_project_id');
        if (!storedRepo) {
            alert('No project connected to export.');
            return;
        }

        setIsExporting(true);
        try {
            // Fetch all entries for this project
            const res = await fetch(`/api/journal/entries?projectId=${encodeURIComponent(storedRepo)}`);
            if (!res.ok) throw new Error('Failed to fetch entries');

            const entries = await res.json();

            if (!Array.isArray(entries) || entries.length === 0) {
                alert('No journal entries found to export.');
                setIsExporting(false);
                return;
            }

            // Build Markdown Content
            let mdContent = `# Developer Journal Export\nProject: ${storedRepo}\nExported: ${new Date().toLocaleString()}\n\n---\n\n`;

            entries.forEach((entry: any) => {
                const date = new Date(entry.createdAt).toLocaleString();
                mdContent += `## ${date}\n\n`;
                if (entry.gitCommitHash) mdContent += `**Commit:** \`${entry.gitCommitHash}\`\n\n`;
                if (entry.gitBranch) mdContent += `**Branch:** \`${entry.gitBranch}\`\n\n`;
                if (entry.content) mdContent += `${entry.content}\n\n`;
                mdContent += `---\n\n`;
            });

            // Trigger Download
            const blob = new Blob([mdContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `devdoc-${storedRepo}-export.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export documentation.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 px-8 py-6 flex items-center">
                <h1 className="text-3xl font-bold text-black">Settings</h1>
            </header>

            {/* Settings List */}
            <main className="px-8 py-6 space-y-6">

                {/* Repository Configuration */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Repository Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Connected Repository
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                                    value={repoName}
                                    readOnly
                                />
                                <button
                                    onClick={handleChangeProject}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Branch
                            </label>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-black">
                                {branches.length > 0 ? (
                                    branches.map(branch => (
                                        <option key={branch} value={branch}>{branch}</option>
                                    ))
                                ) : (
                                    <>
                                        <option>main</option>
                                        <option>master</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {/* AI & Documentation */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">AI & Documentation</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                AI Model (OpenRouter)
                            </label>
                            <select
                                value={aiModel}
                                onChange={(e) => setAiModel(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
                            >
                                <option value="openai/gpt-4o-mini">openai/gpt-4o-mini</option>
                                <option value="x-ai/grok-4-fast">x-ai/grok-4-fast</option>
                                <option value="google/gemma-3-27b-it:free">google/gemma-3-27b-it:free</option>
                                <option value="anthropic/claude-haiku-4.5">anthropic/claude-haiku-4.5</option>
                                <option value="mistralai/devstral-2512:free">mistralai/devstral-2512:free</option>
                                <option value="google/gemini-3-flash-preview">google/gemini-3-flash-preview</option>
                                <option value="x-ai/grok-code-fast-1">x-ai/grok-code-fast-1</option>
                                <option value="anthropic/claude-sonnet-4.5">anthropic/claude-sonnet-4.5</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OpenRouter API Key
                            </label>
                            <input
                                type="password"
                                value={openRouterKey}
                                onChange={(e) => setOpenRouterKey(e.target.value)}
                                placeholder="sk-or-..."
                                className="px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Your key is stored locally in your browser for security.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documentation Style
                            </label>
                            <select
                                value={docStyle}
                                onChange={(e) => setDocStyle(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-black w-full"
                            >
                                <option>Technical (Default)</option>
                                <option>Beginner Friendly</option>
                                <option>Comprehensive</option>
                                <option>Minimal</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Export - Local Download Only */}
                <div className="px-8 py-6 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Export</h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-between transition-colors disabled:opacity-50"
                        >
                            <span>
                                {isExporting ? 'Generating Markdown...' : 'Export all documentation as Markdown'}
                            </span>
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </main>
        </div>
    )
}