'use client';
import { useState } from 'react';
import { adminUsers, formatCurrency } from '@/lib/data';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');

  const filtered = adminUsers
    .filter(u => kycFilter === 'all' || u.kycStatus === kycFilter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'মোট', value: adminUsers.length, color: 'blue' },
          { label: 'যাচাইকৃত', value: adminUsers.filter(u => u.kycStatus === 'verified').length, color: 'green' },
          { label: 'অপেক্ষমাণ', value: adminUsers.filter(u => u.kycStatus === 'pending').length, color: 'yellow' },
          { label: 'স্থগিত', value: adminUsers.filter(u => u.status === 'suspended').length, color: 'red' },
        ].map((s, i) => (
          <div key={i} className="card text-center">
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            <input type="text" placeholder="নাম বা ইমেইল..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
          </div>
          <select value={kycFilter} onChange={e => setKycFilter(e.target.value)} className="input-field max-w-xs">
            <option value="all">সব KYC</option>
            <option value="verified">যাচাইকৃত</option>
            <option value="pending">অপেক্ষমাণ</option>
            <option value="rejected">প্রত্যাখ্যাত</option>
          </select>
          <button className="btn-primary">+ নতুন ব্যবহারকারী</button>
        </div>

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
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell font-bold">{formatCurrency(user.invested)}</td>
                <td className="table-cell">
                  <span className={`badge ${user.kycStatus === 'verified' ? 'badge-green' : user.kycStatus === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                    {user.kycStatus === 'verified' ? '✅' : user.kycStatus === 'pending' ? '⏳' : '❌'} {user.kycStatus}
                  </span>
                </td>
                <td className="table-cell text-gray-500">{user.joinDate}</td>
                <td className="table-cell">
                  <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-red'}`}>{user.status}</span>
                </td>
                <td className="table-cell">
                  <div className="flex gap-1">
                    <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">দেখুন</button>
                    {user.kycStatus === 'pending' && <button className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">অনুমোদন</button>}
                    <button className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">স্থগিত</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
