import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header actionButton={{ label: 'New Doc', href: '/dashboard/new' }} />
      <div className="flex-1 flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
