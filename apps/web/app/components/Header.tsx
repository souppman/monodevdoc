'use client';

import { FileCode2 } from 'lucide-react';

interface HeaderProps {
    currentRepository?: string;
}

export default function Header({
    currentRepository = 'test-project /',
}: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
                <FileCode2 className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                <h1 className="text-2xl font-bold text-gray-900">DevDoc</h1>
            </div>

            {/* Current Repository */}
            <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm font-medium">{currentRepository}</span>
            </div>
        </header>
    );
}