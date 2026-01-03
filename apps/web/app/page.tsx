import Link from "next/link";
import { FileCodeCorner } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="flex flex-col items-center justify-center gap-8 text-center">
        {/* Logo placeholder */}
        <div className="w-40 h-40 flex items-center justify-center">
          <FileCodeCorner className="w-35 h-35 text-blue-600"/>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl font-bold text-black">
          Welcome to DevDoc
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-700">
          AI-powered documentation for developers
        </p>

        {/* Connect GitHub button */}
        <Link
          href="/github-auth"
          className="px-8 py-3 bg-blue-600 text-white text-base rounded hover:bg-blue-700 transition-colors"
        >
          Connect GitHub Repository
        </Link>

        {/* Skip button */}
        <button className="text-black text-base hover:underline">
          Skip for now
        </button>
      </main>
    </div>
  );
}
