'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Undo2, Redo2, Bold, Italic, Strikethrough } from 'lucide-react';
import { Heading1, Heading2, Heading3 } from 'lucide-react';
import { Quote, ListOrdered, List, SquareCode } from 'lucide-react';
import { Minus, Link2, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import './tiptap-styles.css';

function Toolbar({ editor }: {editor: Editor }) {
    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                isBold: ctx.editor.isActive('bold') ?? false,
                canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
                isItalic: ctx.editor.isActive('italic') ?? false,
                canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
                isStrike: ctx.editor.isActive('strike') ?? false,
                canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
                isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
                isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
                isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
                isBulletList: ctx.editor.isActive('bulletList') ?? false,
                isOrderedList: ctx.editor.isActive('orderedList') ?? false,
                isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
                isBlockquote: ctx.editor.isActive('blockquote') ?? false,
                canUndo: ctx.editor.can().chain().undo().run() ?? false,
                canRedo: ctx.editor.can().chain().redo().run() ?? false,
            }
        }
    })

    const addLink = () => {
        const url = window.prompt('Please enter a URL to link');

        if (url) {
            editor.chain().focus().setLink({ href : url }).run()
        }
    }

    return (
        <div className="px-5 py-3 bg-gray-50 text-gray-300 rounded-lg flex gap-2 items-center border border-gray-200">
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editorState.canUndo}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${ 
                    editorState.canUndo ? 'bg-white hover:bg-gray-100 border border-gray-300 text-black' :
                    'bg-gray-50 text-gray-300'
                }`}
            >
                <Undo2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editorState.canRedo}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${ 
                    editorState.canRedo ? 'bg-white hover:bg-gray-100 border border-gray-300 text-black' :
                    'bg-gray-50 text-gray-300'
                }`}
            >
                <Redo2 className="w-4 h-4" />
            </button>
            |
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editorState.canBold}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.canBold ? (editorState.isBold ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black') 
                    : 'bg-gray-50 text-gray-300'}
                `}
            >
                <Bold className="w-4 h-4"/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editorState.canItalic}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.canItalic ? (editorState.isItalic ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black') 
                    : 'bg-gray-50 text-gray-300'}
                `}
            >
                <Italic className="w-4 h-4"/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editorState.canStrike}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.canStrike ? (editorState.isStrike ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black') 
                    : 'bg-gray-50 text-gray-300'}
                `}
            >
                <Strikethrough className="w-4 h-4"/>
            </button>
            |
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isHeading1 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <Heading1 className="w-4 h-4"/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isHeading2 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <Heading2 className="w-4 h-4"/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isHeading3 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <Heading3 className="w-4 h-4"/>
            </button>
            |
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isBlockquote ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <Quote className="w-4 h-4"/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isCodeBlock ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <SquareCode className="w-4 h-4"/>
            </button>
            |
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isOrderedList ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <ListOrdered className="w-4 h-4"/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                    editorState.isBulletList ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300 text-black'}
                `}>
                <List className="w-4 h-4"/>
            </button>
            |
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={`w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 border border-gray-300 text-black`}>
                <Minus className="w-4 h-4"/>
            </button>
            |
            <button
                onClick={addLink}
                className={`w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-gray-100 border border-gray-300 text-black`}>
                <Link2 className="w-4 h-4"/>
            </button>
        </div>
    );
}

export default function DocumentEditor() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        requirements: true,
        architecture: true,
        userGuide: true,
        techSpecs: true,
    });

    const [selectedDoc, setSelectedDoc] = useState<string>('system-overview');

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
            }
        },
        content: `Hello World! Start typing to get started!`,
        shouldRerenderOnTransaction: true,
        immediatelyRender: false
    })

    if (!editor) return null;

    const aiModify = () => {
        const markdownContent = editor.getMarkdown();

        console.log(markdownContent);

        /* TO-DO INSERT BFF CALL TO MAKE AI EDITS TO CURRENT DOCUMENT */
    }

    const saveFile = () => {
        const markdownContent = editor.getMarkdown();

        console.log(markdownContent);

        /* TO-DO INSERT BFF CALL TO SAVE DOCUMENT */
    }

    const createDocument = () => {
        /* TO-DO INSERT FUNCTION TO ADD A NEW BLANK DOCUMENT */
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <div className="flex gap-5">
                    <Link href="/dashboard"className="flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-500">Back</h3>
                    </Link>
                    <h1 className="text-3xl font-bold text-black">Documentation Editor</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={aiModify}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                            Modify with AI
                    </button>
                    <button 
                        onClick={saveFile} 
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            Save File
                    </button>
                </div>
            </header>
            {/* Sidebar & Editor */}
            <div className="flex grow-1">
                
                {/* Sidebar */}
                <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                        <button 
                            onClick={createDocument}
                            className="px-4 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            + New
                        </button>
                    </div>

                    {/* Documents Tree */}
                    <div className="space-y-2">
                        {/* Requirements Section */}
                        <div>
                            <button
                                onClick={() => toggleSection('requirements')}
                                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {openSections.requirements ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                Requirements
                            </button>
                            {openSections.requirements && (
                                <div className="ml-4 mt-1 space-y-1">
                                    <button
                                        onClick={() => setSelectedDoc('functional-req')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            selectedDoc === 'functional-req'
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Functional Req.
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Architecture Section */}
                        <div>
                            <button
                                onClick={() => toggleSection('architecture')}
                                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {openSections.architecture ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                Architecture
                            </button>
                            {openSections.architecture && (
                                <div className="ml-4 mt-1 space-y-1">
                                    <button
                                        onClick={() => setSelectedDoc('system-overview')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            selectedDoc === 'system-overview'
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        System Overview
                                    </button>
                                    <button
                                        onClick={() => setSelectedDoc('database-schema')}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            selectedDoc === 'database-schema'
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Database Schema
                                    </button>
                                </div>
                            )}
                        </div>


                        {/* User Guide Section */}
                        <div>
                            <button
                                onClick={() => toggleSection('userGuide')}
                                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {openSections.userGuide ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                User Guide
                            </button>
                            {openSections.userGuide && (
                                <div className="ml-4 mt-1 space-y-1">
                                </div>
                            )}
                        </div>

                        {/* Technical Specs Section */}
                        <div>
                            <button
                                onClick={() => toggleSection('techSpecs')}
                                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {openSections.techSpecs ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                Technical Specifications
                            </button>
                            {openSections.techSpecs && (
                                <div className="ml-4 mt-1 space-y-1">
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Editor Area */}
                <main className="px-8 py-6 flex-1 bg-white flex flex-col">
                    
                    {/* Toolbar */}
                    <Toolbar editor={ editor } />

                    {/* Editor Content */}
                    <EditorContent editor={ editor } />
                </main>
            </div>
        </div>
    );
}
