'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Blocks, BookUser, Bolt } from 'lucide-react';

export default function NewDocument() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        docType: 'requirements',
        docTitle: 'Functional Requirements Specification',
        description: 'Comprehensive list of functional requirements for the authentication and authorization system...',
        createMethod: 'ai',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/editor');
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    return (
        <div className="flex-1 bg-white">
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-black">Create New Document</h1>
            </header>

            <main className="px-8 py-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Select Document Type */}
                    <div className="px-8 py-6 border border-gray-200 rounded-lg">
                        <label className="block mb-4 font-semibold text-gray-900">
                            Step 1: Select Document Type
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, docType: 'requirements' })}
                                className={`flex gap-3 px-6 py-5 border rounded-lg ${
                                    formData.docType === 'requirements' ? 'border-blue-400 shadow-sm' : 'border-gray-300 hover:border-blue-400 hover:shadow-sm transition-all'
                                }`}
                            >
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
                                    <ClipboardList className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <label className="block font-semibold text-gray-900 cursor-pointer">Requirements</label>
                                    <p className="block text-sm text-gray-700">Function & non-functional</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, docType: 'architecture' })}
                                className={`flex gap-3 px-6 py-5 border rounded-lg ${
                                    formData.docType === 'architecture' ? 'border-yellow-400 shadow-sm' : 'border-gray-300 hover:border-yellow-400 hover:shadow-sm transition-all'
                                }`}
                            >
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg">
                                    <Blocks className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <label className="block font-semibold text-gray-900 cursor-pointer">Architecture</label>
                                    <p className="block text-sm text-gray-700">System design & structure</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, docType: 'userGuide' })}
                                className={`flex gap-3 px-6 py-5 border rounded-lg ${
                                    formData.docType === 'userGuide' ? 'border-purple-400 shadow-sm' : 'border-gray-300 hover:border-purple-400 hover:shadow-sm transition-all'
                                }`}
                            >
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg">
                                    <BookUser className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <label className="block font-semibold text-gray-900 cursor-pointer">User Guide</label>
                                    <p className="block text-sm text-gray-700">End-user instructions</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, docType: 'technicalSpec' })}
                                className={`flex gap-3 px-6 py-5 border rounded-lg ${
                                    formData.docType === 'technicalSpec' ? 'border-green-400 shadow-sm' : 'border-gray-300 hover:border-green-400 hover:shadow-sm transition-all'
                                }`}
                            >
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg">
                                    <Bolt className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <label className="block font-semibold text-gray-900 cursor-pointer">Techincal Specification</label>
                                    <p className="block text-sm text-gray-700">API & Implementation</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="px-8 py-6 space-y-6 border border-gray-200 rounded-lg">
                        <label className="block mb-4 font-semibold text-gray-900">
                            Step 2: Document Details
                        </label>
                        <div>
                            <label className="block font-medium text-gray-700">
                                Document Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={formData.docTitle}
                                onChange={(e) => setFormData({ ...formData, docTitle: e.target.value })}
                                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={5}
                                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="px-8 py-6 space-y-6 border border-gray-200 rounded-lg">
                        <label className="block mb-4 font-semibold text-gray-900">
                            Step 3: How to create?
                        </label>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, createMethod: 'ai' })}
                            className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <div className={`flex items-center justify-center w-6 h-6 border-1 border-blue-600 rounded-full ${
                                formData.createMethod === 'ai' ? 'bg-blue-600' : 'bg-white'
                            }`}>
                                {formData.createMethod === 'ai' && (<div className="w-3 h-3 bg-white rounded-full" />)}
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <label className="block font-semibold text-gray-900">✨ Generate with AI</label>
                                <p className="block font-medium text-gray-700">Use AI to analyze code and create documentation automatically.</p>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, createMethod: 'blank' })}
                            className="flex items-center gap-3 w-full px-6 py-4 border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <div className={`flex items-center justify-center w-6 h-6 border-1 border-blue-600 rounded-full ${
                                formData.createMethod === 'blank' ? 'bg-blue-600' : 'bg-white'
                            }`}>
                                {formData.createMethod === 'blank' && (<div className="w-3 h-3 bg-white rounded-full" />)}
                            </div>
                            <div className="flex flex-col justify-center items-start">
                                <label className="block font-semibold text-gray-900">Start from scratch</label>
                                <p className="block font-medium text-gray-700">Begin with a blank document and write manually.</p>
                            </div>
                        </button>
                    </div>

                    <div className="flex justify-end gap-4 w-full">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Document
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
