'use client';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { adminStats, adminUsers, agroProjects, formatCurrency, formatFullCurrency } from '@/lib/data';

const monthlyData = [
  { month: 'Jan', users: 45, investment: 8500000, returns: 0 },
  { month: 'Feb', users: 67, investment: 12000000, returns: 500000 },
  { month: 'Mar', users: 89, investment: 18000000, returns: 1200000 },
  { month: 'Apr', users: 102, investment: 22000000, returns: 3500000 },
  { month: 'May', users: 87, investment: 35000000, returns: 8200000 },
  { month: 'Jun', users: 115, investment: 29500000, returns: 9100000 },
];

export default function AdminPage() {
  const activeProjects = agroProjects.filter(p => p.status === 'active').length;

  const statCards = [
    { label: 'মোট ব্যবহারকারী', value: adminStats.totalUsers.toLocaleString(), icon: '👥', color: 'from-blue-500 to-blue-600', sub: `${adminStats.activeUsers} সক্রিয়` },
    { label: 'মোট বিনিয়োগ', value: formatCurrency(adminStats.totalInvestment), icon: '💰', color: 'from-green-500 to-green-600', sub: `${adminStats.activeProjects} প্রকল্পে` },
    { label: 'মোট রিটার্ন প্রদান', value: formatCurrency(adminStats.totalReturns), icon: '📈', color: 'from-purple-500 to-purple-600', sub: 'সফলভাবে প্রদান' },
    { label: 'সক্রিয় প্রকল্প', value: `${activeProjects}টি`, icon: '🌾', color: 'from-orange-500 to-orange-600', sub: `মোট ${agroProjects.length}টির মধ্যে` },
    { label: 'পেন্ডিং KYC', value: `${adminStats.pendingKYC}টি`, icon: '⚠️', color: 'from-red-500 to-red-600', sub: 'অনুমোদনের অপেক্ষায়' },
    { label: 'পেন্ডিং উত্তোলন', value: `${adminStats.pendingWithdrawals}টি`, icon: '💸', color: 'from-amber-500 to-amber-600', sub: 'প্রক্রিয়াধীন' },
    { label: 'এই মাসে নতুন', value: `${adminStats.monthlyNewUsers}জন`, icon: '🆕', color: 'from-teal-500 to-teal-600', sub: 'নতুন বিনিয়োগকারী' },
    { label: 'এই মাসে বিনিয়োগ', value: formatCurrency(adminStats.monthlyInvestment), icon: '📊', color: 'from-indigo-500 to-indigo-600', sub: 'চলতি মাসে' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Alert Banners */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🔴</span>
          <div className="flex-1">
            <div className="font-bold text-red-700">{adminStats.pendingKYC}টি KYC অনুরোধ অপেক্ষমাণ</div>
            <div className="text-sm text-red-600">দ্রুত পদক্ষেপ নিন</div>
          </div>
          <Link href="/admin/kyc" className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700">যান →</Link>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🟡</span>
          <div className="flex-1">
            <div className="font-bold text-amber-700">{adminStats.pendingWithdrawals}টি উত্তোলন অনুরোধ প্রক্রিয়াধীন</div>
            <div className="text-sm text-amber-600">মোট অপেক্ষমাণ পরিমাণ</div>
          </div>
          <Link href="/admin/withdrawals" className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-700">যান →</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="card">
            <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl text-xl mb-3 shadow-sm`}>
              {card.icon}
            </div>
            <div className="text-xl font-extrabold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
            <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title mb-1">মাসিক বিনিয়োগ প্রবৃদ্ধি</h3>
          <p className="section-subtitle mb-4">নতুন বিনিয়োগ ও ব্যবহারকারী বৃদ্ধি</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `৳${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number, name: string) => name === 'investment' ? [formatFullCurrency(v), 'বিনিয়োগ'] : [formatFullCurrency(v), 'রিটার্ন']} />
              <Area type="monotone" dataKey="investment" stroke="#16a34a" fill="url(#adminGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title mb-1">নতুন ব্যবহারকারী নিবন্ধন</h3>
          <p className="section-subtitle mb-4">মাসিক বৃদ্ধির হার</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [v, 'ব্যবহারকারী']} />
              <Bar dataKey="users" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">সাম্প্রতিক ব্যবহারকারী</h3>
          <Link href="/admin/users" className="text-sm text-green-600 font-medium hover:text-green-700">সব দেখুন →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">ব্যবহারকারী</th>
                <th className="table-header">বিনিয়োগ</th>
                <th className="table-header">KYC</th>
                <th className="table-header">নিবন্ধন</th>
                <th className="table-header">স্ট্যাটাস</th>
                <th className="table-header">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="font-bold text-gray-800">{formatCurrency(user.invested)}</div>
                    <div className="text-xs text-gray-500">{user.investments}টি প্রকল্পে</div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${user.kycStatus === 'verified' ? 'badge-green' : user.kycStatus === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                      {user.kycStatus === 'verified' ? '✅ যাচাইকৃত' : user.kycStatus === 'pending' ? '⏳ অপেক্ষমাণ' : '❌ প্রত্যাখ্যাত'}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500">{user.joinDate}</td>
                  <td className="table-cell">
                    <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                      {user.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100">দেখুন</button>
                      {user.kycStatus === 'pending' && (
                        <button className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg hover:bg-green-100">অনুমোদন</button>
                      )}
                      {user.status === 'active' && (
                        <button className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100">স্থগিত</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">প্রকল্পের অবস্থা</h3>
          <Link href="/admin/projects" className="text-sm text-green-600 font-medium hover:text-green-700">পরিচালনা করুন →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {['active', 'upcoming', 'completed'].map((status) => {
            const projs = agroProjects.filter(p => p.status === status);
            const statusColors: Record<string, string> = { active: 'bg-green-50 border-green-200', upcoming: 'bg-purple-50 border-purple-200', completed: 'bg-blue-50 border-blue-200' };
            const statusLabels: Record<string, string> = { active: 'সক্রিয়', upcoming: 'আসছে', completed: 'সম্পন্ন' };
            const statusIcons: Record<string, string> = { active: '✅', upcoming: '⏰', completed: '🎯' };
            return (
              <div key={status} className={`border rounded-2xl p-4 ${statusColors[status]}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{statusIcons[status]}</span>
                  <span className="font-bold text-gray-700">{statusLabels[status]} প্রকল্প</span>
                  <span className="ml-auto font-extrabold text-2xl text-gray-800">{projs.length}</span>
                </div>
                <div className="space-y-2">
                  {projs.slice(0, 2).map(p => (
                    <div key={p.id} className="text-sm text-gray-600 flex justify-between">
                      <span className="truncate flex-1">{p.title.split(' - ')[0]}</span>
                      <span className="text-green-600 font-medium ml-2">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
