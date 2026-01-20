'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Undo2, Redo2, Bold, Italic, Strikethrough } from 'lucide-react';
import { Heading1, Heading2, Heading3 } from 'lucide-react';
import { Quote, ListOrdered, List, SquareCode } from 'lucide-react';
import { Minus, Link2, ArrowLeft } from 'lucide-react';
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
    const searchParams = useSearchParams();
    const docId = searchParams.get('docId');

    const [docData, setDocData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

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
        content: ``,
        contentType: 'markdown',
        shouldRerenderOnTransaction: true,
        immediatelyRender: false
    })

    // Fetch document data when docId is present
    useEffect(() => {
        if (docId && editor) {
            fetch(`/api/docs/${docId}`)
                .then(res => res.json())
                .then(data => {
                    setDocData(data);
                    editor.commands.setContent(data.content || '', { contentType : 'markdown'});
                })
                .catch(err => console.error('Failed to fetch document', err));
        }
    }, [docId, editor])

    if (!editor) return null;

    const saveFile = async () => {
        if (!docId) {
            alert('No document to save. Please open a document from the dashboard first.');
            return;
        }

        const markdownContent = editor.getMarkdown();
        setIsSaving(true);

        try {
            const res = await fetch(`/api/docs/${docId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: markdownContent })
            });

            if (res.ok) {
                const updated = await res.json();
                setDocData(updated);
                alert('Document saved successfully!');
            } else {
                const error = await res.json();
                alert(`Failed to save: ${error.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Failed to save document', err);
            alert('Failed to save document. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col max-h-screen bg-white">
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <div className="flex gap-5">
                    <Link href="/dashboard"className="flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-500">Back</h3>
                    </Link>
                    <h1 className="text-3xl font-bold text-black">
                        {docData?.title || 'Documentation Editor'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={saveFile}
                        disabled={isSaving}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSaving ? 'Saving...' : 'Save File'}
                    </button>
                </div>
            </header>
            {/* Editor */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Toolbar */}
                <div className="sticky top-0 z-10 bg-white px-8 py-4 border-b border-gray-200">
                    <Toolbar editor={ editor } />
                </div>

                {/* Main Editor Area */}
                <main className="flex-1 overflow-y-auto px-8 py-6 bg-white">
                    <EditorContent editor={ editor } />
                </main>
            </div>
        </div>
    );
}
