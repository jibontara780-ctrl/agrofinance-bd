import Sidebar from '@/components/AdminSidebar';
import Topbar from '@/components/AdminTopbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
