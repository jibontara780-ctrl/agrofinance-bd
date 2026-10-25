'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { currentUser, notifications } from '@/lib/data';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: '🏠 ড্যাশবোর্ড', subtitle: 'আপনার বিনিয়োগ পরিস্থিতির সার্বিক চিত্র' },
  '/projects': { title: '🌾 কৃষি প্রকল্প', subtitle: 'বিনিয়োগযোগ্য প্রকল্পের তালিকা' },
  '/portfolio': { title: '💼 পোর্টফোলিও', subtitle: 'আপনার বিনিয়োগ বিস্তারিত' },
  '/transactions': { title: '💳 লেনদেন ইতিহাস', subtitle: 'সকল আর্থিক কার্যক্রম' },
  '/market': { title: '📊 বাজার মূল্য', subtitle: 'সর্বশেষ কৃষিপণ্যের বাজার দর' },
  '/reports': { title: '📋 রিপোর্ট ও বিশ্লেষণ', subtitle: 'বিস্তারিত আর্থিক রিপোর্ট' },
  '/notifications': { title: '🔔 বিজ্ঞপ্তি', subtitle: 'সর্বশেষ আপডেট ও বার্তা' },
  '/profile': { title: '👤 প্রোফাইল', subtitle: 'অ্যাকাউন্ট তথ্য ও সেটিংস' },
};

export default function Topbar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'AgroFinance BD', subtitle: '' };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{page.title}</h1>
        {page.subtitle && <p className="text-sm text-gray-500">{page.subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Wallet Balance */}
        <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          <span className="text-lg">💰</span>
          <div>
            <div className="text-xs text-gray-500">ওয়ালেট</div>
            <div className="font-bold text-green-700 text-sm">৳ ৪,২৭,৫০০</div>
          </div>
        </div>

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Avatar */}
        <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <div className="font-semibold text-gray-800 text-sm">{currentUser.name}</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-400">KYC Verified</span>
            </div>
          </div>
        </Link>

        {/* Logout */}
        <Link href="/" className="hidden md:flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm px-2 py-2 rounded-xl hover:bg-red-50">
          <span>🚪</span>
          <span className="text-xs">Logout</span>
        </Link>
      </div>
    </header>
  );
}
