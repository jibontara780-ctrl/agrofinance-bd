'use client';
import { useState } from 'react';
import { notifications } from '@/lib/data';

type NotifType = 'all' | 'return' | 'project' | 'kyc' | 'alert';

const typeLabels: Record<string, string> = { all: 'সব', return: '💰 রিটার্ন', project: '🌾 প্রকল্প', kyc: '✅ KYC', alert: '⚠️ সতর্কতা' };
const typeColors: Record<string, string> = { return: 'bg-green-50 border-green-200', project: 'bg-blue-50 border-blue-200', kyc: 'bg-purple-50 border-purple-200', alert: 'bg-orange-50 border-orange-200' };
const notifIcons: Record<string, string> = { money: '💰', check: '✅', new: '🆕', verify: '✔️', alert: '⚠️', update: '📢' };

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotifType>('all');
  const [notifList, setNotifList] = useState(notifications);

  const filtered = notifList.filter(n => filter === 'all' || n.type === filter);
  const unread = notifList.filter(n => !n.read).length;

  const markAllRead = () => setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifList(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🔔</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">বিজ্ঞপ্তি</h2>
            {unread > 0 && <span className="text-sm text-green-600 font-medium">{unread}টি অপঠিত বার্তা</span>}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="btn-secondary text-sm py-2">✓ সব পড়া হয়েছে</button>
          <button onClick={() => setNotifList([])} className="btn-danger text-sm py-2">🗑️ সব মুছুন</button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3 className="section-title mb-4">বিজ্ঞপ্তি সেটিংস</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'রিটার্ন ক্রেডিট বিজ্ঞপ্তি', desc: 'রিটার্ন একাউন্টে জমা হলে জানান', checked: true },
            { label: 'প্রকল্প আপডেট', desc: 'বিনিয়োগকৃত প্রকল্পের আপডেট', checked: true },
            { label: 'নতুন প্রকল্প বিজ্ঞপ্তি', desc: 'নতুন বিনিয়োগ সুযোগ', checked: true },
            { label: 'বাজার সতর্কতা', desc: 'গুরুত্বপূর্ণ বাজার পরিবর্তন', checked: false },
            { label: 'SMS বিজ্ঞপ্তি', desc: 'ফোনে SMS-এ বিজ্ঞপ্তি', checked: true },
            { label: 'Email বিজ্ঞপ্তি', desc: 'ইমেইলে বিজ্ঞপ্তি পাঠান', checked: true },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-semibold text-gray-800">{setting.label}</div>
                <div className="text-xs text-gray-500">{setting.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'return', 'project', 'kyc', 'alert'] as NotifType[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
            {typeLabels[f]}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🔕</div>
            <p className="text-lg font-medium">কোনো বিজ্ঞপ্তি নেই</p>
          </div>
        )}
        {filtered.map((notif) => (
          <div key={notif.id} className={`border rounded-2xl p-4 transition-all ${!notif.read ? `${typeColors[notif.type] || 'bg-gray-50 border-gray-100'} shadow-sm` : 'bg-white border-gray-100 opacity-70'}`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{notifIcons[notif.icon] || '🔔'}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                      {!notif.read && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                    <div className="text-xs text-gray-400 mt-2">📅 {notif.date}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.read && (
                      <button onClick={() => markRead(notif.id)} className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded-lg hover:bg-green-50">
                        পড়েছি
                      </button>
                    )}
                    <button onClick={() => deleteNotif(notif.id)} className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
