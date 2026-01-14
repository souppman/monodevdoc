'use client';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, GitBranch, Sparkles, Settings, Search, X } from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [recentCommits, setRecentCommits] = useState<any[]>([]);

    useEffect(() => {
        const repoFullName = localStorage.getItem('current_repo_full_name');
        if (!repoFullName) return;

        fetch(`/api/git/commits?repo=${encodeURIComponent(repoFullName)}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecentCommits(data);
                }
            })
            .catch(err => console.error('Failed to fetch recent commits', err));
    }, []);

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
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4
                fixed md:static inset-y-0 right-0 md:left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                md:translate-x-0
            `}>
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 text-gray-700 hover:text-gray-900 md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>

                <nav className="flex flex-col gap-1 px-3 mt-8 md:mt-0">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
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
                        {recentCommits.length > 0 ? (
                            recentCommits.map((commit, idx) => (
                                <div key={idx} className="text-gray-600 truncate flex flex-col mb-2">
                                    <div className="flex items-center text-xs">
                                        <span className="font-mono font-bold mr-2 text-blue-600">
                                            {commit.gitCommitHash ? commit.gitCommitHash.substring(0, 7) : '-------'}
                                        </span>
                                        <span className="text-gray-400 text-[10px]">{commit.date ? new Date(commit.date).toLocaleDateString() : ''}</span>
                                    </div>
                                    <span className="text-xs" title={commit.content}>
                                        {commit.content || 'No description'}
                                    </span>
                                </div>
                        ))
                        ) : (
                            <div className="text-gray-400 italic text-xs">No recent activity</div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
