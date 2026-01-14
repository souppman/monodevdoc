'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function GenerateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col overflow-x-hidden min-h-screen bg-gray-50">
            <Header />
            {/* Mobile hamburger button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="fixed top-4 right-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-700 hover:text-gray-900 md:hidden"
            >
                <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
