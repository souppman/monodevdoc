'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, GitBranch, Sparkles, Settings, Search } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Documentation',
            href: '/dashboard',
            icon: FileText
        },
        {
            label: 'Journal',
            href: '/journal',
            icon: BookOpen
        },
        {
            label: 'Generate',
            href: '/generate',
            icon: Sparkles
        },
        {
            label: 'Branches',
            href: '/branches',
            icon: GitBranch
        },
        {
            label: 'Search',
            href: '/search',
            icon: Search
        },
        {
            label: 'Settings',
            href: '/settings',
            icon: Settings
        },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname.startsWith('/editor');
        }
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4">
            <nav className="flex flex-col gap-1 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                active
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Recent Commits Section */}
            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Recent Commits
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="text-gray-600">
                        <span className="font-mono text-xs">abc123f</span> - Fix auth bug
                    </div>
                    <div className="text-gray-600">
                        <span className="font-mono text-xs">def456a</span> - Add user model
                    </div>
                    <div className="text-gray-600">
                        <span className="font-mono text-xs">ghi789b</span> - Update docs
                    </div>
                </div>
            </div>
        </aside>
    );
}
