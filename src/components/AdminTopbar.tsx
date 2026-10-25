'use client';
import Link from 'next/link';

export default function AdminTopbar() {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800">👑 অ্যাডমিন প্যানেল</h1>
        <p className="text-sm text-gray-500">AgroFinance BD ম্যানেজমেন্ট</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="text-xs text-gray-500">পেন্ডিং KYC</div>
            <div className="font-bold text-red-600 text-sm">৩৪টি অনুরোধ</div>
          </div>
        </div>
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">A</div>
        <Link href="/" className="text-xs text-gray-400 hover:text-red-500 px-2 py-2 rounded-xl hover:bg-red-50">🚪</Link>
      </div>
    </header>
  );
}
