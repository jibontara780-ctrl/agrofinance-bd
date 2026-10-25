'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { currentUser, notifications } from '@/lib/data';

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'ড্যাশবোর্ড', labelEn: 'Dashboard' },
  { href: '/projects', icon: '🌾', label: 'প্রকল্পসমূহ', labelEn: 'Projects' },
  { href: '/portfolio', icon: '💼', label: 'পোর্টফোলিও', labelEn: 'Portfolio' },
  { href: '/transactions', icon: '💳', label: 'লেনদেন', labelEn: 'Transactions' },
  { href: '/market', icon: '📊', label: 'বাজার মূল্য', labelEn: 'Market' },
  { href: '/reports', icon: '📋', label: 'রিপোর্ট', labelEn: 'Reports' },
  { href: '/notifications', icon: '🔔', label: 'বিজ্ঞপ্তি', labelEn: 'Notifications' },
  { href: '/profile', icon: '👤', label: 'প্রোফাইল', labelEn: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} min-h-screen`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <div>
                <div className="font-bold text-green-700 text-base leading-tight">AgroFinance</div>
                <div className="text-xs text-gray-400">BD Platform</div>
              </div>
            </Link>
          )}
          {collapsed && <Link href="/dashboard" className="text-2xl mx-auto">🌾</Link>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ml-auto">
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'} ${collapsed ? 'justify-center' : ''} relative`}>
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && item.href === '/notifications' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
                {collapsed && item.href === '/notifications' && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Link */}
        <div className="p-3 border-t border-gray-100">
          <Link href="/admin" className={`sidebar-item-inactive ${collapsed ? 'justify-center' : ''}`}>
            <span className="text-xl">👑</span>
            {!collapsed && <span>অ্যাডমিন প্যানেল</span>}
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">{currentUser.name}</div>
                <div className="text-xs text-gray-400 truncate">{currentUser.email}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px]">{item.labelEn}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
