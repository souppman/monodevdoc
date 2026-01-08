'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Github, GitBranch } from 'lucide-react';

export default function GitHubAuth() {
    const router = useRouter();
    const [setupStep, setSetupStep] = useState(1)

    return (
    <div className="min-h-screen bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-900">Setup DevDoc</h1>
                        <p className="text-gray-600 mt-1">Connect your repository to get started</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                setupStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {setupStep > 1 ? <Check className="w-5 h-5" /> : '1'}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Connect GitHub</div>
                                <div className="text-sm text-gray-500">Authorize access</div>
                            </div>
                        </div>

                        <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                            <div className={`h-full transition-all ${setupStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{width: setupStep >= 2 ? '100%' : '0%'}}></div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                setupStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {setupStep > 2 ? <Check className="w-5 h-5" /> : '2'}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Select Repository</div>
                                <div className="text-sm text-gray-500">Choose your project</div>
                            </div>
                        </div>

                        <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                            <div className={`h-full transition-all ${setupStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{width: setupStep >= 3 ? '100%' : '0%'}}></div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                setupStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                3
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Configure</div>
                                <div className="text-sm text-gray-500">Set preferences</div>
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    {setupStep === 1 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Github className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Connect Your GitHub Account</h2>
                                <p className="text-gray-600 mb-8">
                                    DevDoc needs access to your repositories to automatically capture Git context and generate documentation.
                                </p>

                                <button
                                    onClick={() => setSetupStep(2)}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-3 mx-auto"
                                >
                                    <Github className="w-5 h-5" />
                                    Connect with GitHub
                                </button>

                                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                                    <h4 className="font-semibold text-blue-900 text-sm mb-2">What access do we need?</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Read repository contents and commits</li>
                                        <li>• Receive webhook notifications for changes</li>
                                        <li>• Read issues and pull requests (optional)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {setupStep === 2 && (
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Select a Repository</h2>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <GitBranch className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <div className="font-semibold text-gray-900">username/devdoc-app</div>
                                                <div className="text-sm text-gray-500">Full-stack developer documentation tool</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">Private</span>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <GitBranch className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <div className="font-semibold text-gray-900">username/portfolio-site</div>
                                                <div className="text-sm text-gray-500">Personal portfolio built with Next.js</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded">Public</span>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <GitBranch className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <div className="font-semibold text-gray-900">username/api-service</div>
                                                <div className="text-sm text-gray-500">RESTful API with Node.js and Express</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">Private</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setSetupStep(1)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setSetupStep(3)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {setupStep === 3 && (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Configure Your Workspace</h2>

                            <div className="space-y-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Default Branch
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black">
                                        <option>main</option>
                                        <option>develop</option>
                                        <option>master</option>
                                    </select>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        AI Model Selection
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black">
                                        <option>GPT-4 (Recommended)</option>
                                        <option>Claude 3 Sonnet</option>
                                        <option>GPT-3.5 Turbo</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-2">Choose the AI model for documentation generation</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setSetupStep(2)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => router.push('dashboard')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    Complete Setup
                                    <Check className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
}
