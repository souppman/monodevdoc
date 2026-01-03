import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header actionButton={{ label: 'New Entry', href: '/journal/new' }} />
      <div className="flex-1 flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
