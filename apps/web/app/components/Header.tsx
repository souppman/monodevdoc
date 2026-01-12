'use client';

import { FileCode2 } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';

interface HeaderProps {
  currentRepository?: string;
  actionButton?: {
    label: string;
    href: string;
  };
}

export default function Header({
  currentRepository: propRepo,
  actionButton
}: HeaderProps) {
  const [repoName, setRepoName] = useState(propRepo || '');

  useEffect(() => {
    if (!propRepo) {
      const stored = localStorage.getItem('current_repo_full_name');
      if (stored) {
        setRepoName(stored);
      }
    }
  }, [propRepo]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <FileCode2 className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
        <h1 className="text-2xl font-bold text-gray-900">DevDoc</h1>
      </div>

      {/* Current Repository */}
      <div className="flex items-center gap-2 text-gray-600">
        <span className="text-sm font-medium">{repoName}</span>
      </div>
    </header>
  );
}