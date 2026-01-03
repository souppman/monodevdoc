import Link from 'next/link';

interface Document {
  id: number;
  title: string;
  lastUpdated: string;
  type: string;
  status: 'Complete' | 'Draft' | 'Empty';
}

export default function Dashboard() {
  const documents: Document[] = [
    {
      id: 1,
      title: 'Requirements Documentation',
      lastUpdated: 'Last updated 2 hours ago',
      type: 'AI Generated',
      status: 'Complete',
    },
    {
      id: 2,
      title: 'Architecture Overview',
      lastUpdated: 'Last updated yesterday',
      type: 'Manual + AI',
      status: 'Draft',
    },
    {
      id: 3,
      title: 'User Guide',
      lastUpdated: 'Created 3 days ago',
      type: 'Ready to generate',
      status: 'Empty',
    },
    {
      id: 4,
      title: 'Technical Specifications',
      lastUpdated: 'Last updated last week',
      type: 'Manual',
      status: 'Complete',
    },
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Documentation Overview</h1>
        <Link
          href="/dashboard/new"
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded transition-colors"
        >
          + New Doc
        </Link>
      </header>

      {/* Documents List */}
      <main className="px-8 py-6">
        <div className="flex flex-col gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-gray-200 p-6 rounded flex gap-4"
            >
              {/* Icon placeholder */}
              <div className="w-12 h-12 bg-white flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                (icon)
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-1">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {doc.lastUpdated} • {doc.type}
                </p>
                <div className="inline-block px-4 py-1 bg-white text-black text-sm rounded">
                  {doc.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-black mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-200 p-8 rounded text-center">
              <div className="text-6xl font-bold text-black mb-2">12</div>
              <div className="text-sm text-black">Documents</div>
            </div>
            <div className="bg-gray-200 p-8 rounded text-center">
              <div className="text-6xl font-bold text-black mb-2">47</div>
              <div className="text-sm text-black">Journal Entries</div>
            </div>
            <div className="bg-gray-200 p-8 rounded text-center">
              <div className="text-6xl font-bold text-black mb-2">8</div>
              <div className="text-sm text-black">AI Generated</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
