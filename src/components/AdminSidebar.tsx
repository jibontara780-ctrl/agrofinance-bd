'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNav = [
  { href: '/admin', icon: '🏠', label: 'অ্যাডমিন হোম' },
  { href: '/admin/users', icon: '👥', label: 'ব্যবহারকারী' },
  { href: '/admin/projects', icon: '🌾', label: 'প্রকল্প ব্যবস্থাপনা' },
  { href: '/admin/kyc', icon: '✅', label: 'KYC অনুমোদন' },
  { href: '/admin/withdrawals', icon: '💸', label: 'উত্তোলন অনুরোধ' },
  { href: '/admin/reports', icon: '📋', label: 'অ্যাডমিন রিপোর্ট' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-60 bg-gray-900 text-white min-h-screen">
      <div className="p-5 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <div className="font-bold text-white text-sm">AgroFinance Admin</div>
            <div className="text-xs text-gray-400">Management Panel</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {adminNav.map(item => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <span>↩</span> ইনভেস্টর ভিউ
        </Link>
      </div>
    </aside>
  );
}
