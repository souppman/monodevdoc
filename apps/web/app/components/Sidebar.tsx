'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: '(logo)', href: '/dashboard', icon: true },
    { label: '(documents)', href: '/dashboard' },
    { label: '(journal)', href: '/journal' },
    { label: '(generate)', href: '/generate' },
    { label: '(settings)', href: '/settings' },
  ];

  return (
    <aside className="w-40 bg-zinc-900 text-white flex flex-col items-center py-6 gap-6">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`w-24 h-16 flex items-center justify-center rounded ${
            pathname === item.href
              ? 'bg-zinc-700'
              : 'bg-zinc-800 hover:bg-zinc-700'
          } transition-colors text-sm`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
