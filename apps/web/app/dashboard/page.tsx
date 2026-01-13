import Link from 'next/link';
import { ClipboardList, Blocks, BookUser, Bolt } from 'lucide-react';

interface Document {
    id: number;
    title: string;
    lastUpdated: string;
    type: string;
    status: 'Complete' | 'Draft' | 'Empty';
    icon: typeof ClipboardList;
    color: 'blue' | 'yellow' | 'purple' | 'green';
}

export default function Dashboard() {
    const documents: Document[] = [
        {
            id: 1,
            title: 'Requirements Documentation',
            lastUpdated: 'Last updated 2 hours ago',
            type: 'AI Generated',
            status: 'Complete',
            icon: ClipboardList,
            color: 'blue',
        },
        {
            id: 2,
            title: 'Architecture Overview',
            lastUpdated: 'Last updated yesterday',
            type: 'Manual + AI',
            status: 'Draft',
            icon: Blocks,
            color: 'yellow',
        },
        {
            id: 3,
            title: 'User Guide',
            lastUpdated: 'Created 3 days ago',
            type: 'Ready to generate',
            status: 'Empty',
            icon: BookUser,
            color: 'purple',
        },
        {
            id: 4,
            title: 'Technical Specifications',
            lastUpdated: 'Last updated last week',
            type: 'Manual',
            status: 'Complete',
            icon: Bolt,
            color: 'green',
        },
    ];

    return (
        <div className="flex-1 bg-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-black">Documentation Overview</h1>
                <Link
                    href="/dashboard/new"
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + New Doc
                </Link>
            </header>

            {/* Documents List */}
            <main className="px-8 py-6">
                <div className="flex flex-col gap-4">
                    {documents.map((doc) => {
                        const Icon = doc.icon;

                        // Define color styles
                        const colorStyles = {
                            blue: 'bg-blue-100 text-blue-600',
                            yellow: 'bg-yellow-100 text-yellow-600',
                            purple: 'bg-purple-100 text-purple-600',
                            green: 'bg-green-100 text-green-600',
                        };

                        const statusStyles = {
                            'Complete': 'bg-green-100 text-green-700',
                            'Draft': 'bg-yellow-100 text-yellow-600',
                            'Empty': 'bg-gray-100 text-gray-700',
                        };

                        return (
                            <Link key={doc.id} href="editor" className={`flex items-start justify-between px-8 py-6 bg-white border border-gray-200 rounded-lg hover:border-${doc.color}-400 hover:shadow-sm transition-all`}>
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg ${colorStyles[doc.color]}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="mb-1 text-xl font-bold text-black">
                                            {doc.title}
                                        </h3>
                                        <p className="mb-3 text-sm text-gray-700">
                                            {doc.lastUpdated} • {doc.type}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[doc.status]}`}>
                                    {doc.status}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h2 className="mb-4 text-lg font-semibold text-black">Quick Stats</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-8 text-center border border-gray-200 rounded-lg">
                            <div className="mb-2 text-6xl font-bold text-blue-600">12</div>
                            <div className="text-sm text-black">Documents</div>
                        </div>
                        <div className="p-8 text-center border border-gray-200 rounded-lg">
                            <div className="mb-2 text-6xl font-bold text-green-600">47</div>
                            <div className="text-sm text-black">Journal Entries</div>
                        </div>
                        <div className="p-8 text-center border border-gray-200 rounded-lg">
                            <div className="mb-2 text-6xl font-bold text-purple-600">8</div>
                            <div className="text-sm text-black">AI Generated</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
