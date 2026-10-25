'use client';
import { useState } from 'react';
import { marketPrices } from '@/lib/data';

const categories = ['all', 'grain', 'fishery', 'fruit', 'vegetable', 'livestock'];
const categoryLabels: Record<string, string> = { all: 'সব পণ্য', grain: '🌾 শস্য', fishery: '🐟 মৎস্য', fruit: '🍎 ফল', vegetable: '🥦 সবজি', livestock: '🐔 পশুপাখি' };

export default function MarketPage() {
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = marketPrices
    .filter(m => catFilter === 'all' || m.category === catFilter)
    .filter(m => m.cropName.toLowerCase().includes(search.toLowerCase()));

  const risers = marketPrices.filter(m => m.trend === 'up').sort((a, b) => b.change - a.change).slice(0, 3);
  const fallers = marketPrices.filter(m => m.trend === 'down').sort((a, b) => a.change - b.change).slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">📊</span>
        <div>
          <div className="font-semibold text-blue-800">আজকের বাজার দর - ১৩ জুন ২০২৫</div>
          <div className="text-sm text-blue-600">ঢাকা, রাজশাহী, চট্টগ্রাম, খুলনাসহ প্রধান কৃষি বাজার থেকে সংকলিত</div>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            সর্বশেষ আপডেট
          </div>
        </div>
      </div>

      {/* Top Movers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title text-green-600 mb-3">📈 সর্বোচ্চ বৃদ্ধি</h3>
          <div className="space-y-3">
            {risers.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{item.cropName}</div>
                  <div className="text-xs text-gray-500">{item.market}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">৳{item.currentPrice}/{item.unit}</div>
                  <div className="text-green-600 font-bold text-sm">▲ +{item.change.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="section-title text-red-600 mb-3">📉 সর্বোচ্চ হ্রাস</h3>
          <div className="space-y-3">
            {fallers.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{item.cropName}</div>
                  <div className="text-xs text-gray-500">{item.market}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">৳{item.currentPrice}/{item.unit}</div>
                  <div className="text-red-600 font-bold text-sm">▼ {item.change.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input type="text" placeholder="পণ্যের নাম খুঁজুন..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${catFilter === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">বাজার মূল্য তালিকা</h3>
          <span className="text-sm text-gray-500">{filtered.length}টি পণ্য</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">পণ্যের নাম</th>
                <th className="table-header">বাজার</th>
                <th className="table-header">বর্তমান দর</th>
                <th className="table-header">আগের দর</th>
                <th className="table-header">পরিবর্তন</th>
                <th className="table-header">ট্রেন্ড</th>
                <th className="table-header">আপডেট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-800">{item.cropName}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-600">{item.market}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-lg font-extrabold text-gray-900">৳{item.currentPrice}</span>
                    <span className="text-xs text-gray-400 ml-1">/{item.unit}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-gray-500">৳{item.previousPrice}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`font-bold ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.trend === 'up' ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.trend === 'up' ? '📈 বৃদ্ধি' : '📉 হ্রাস'}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-xs text-gray-400">{item.lastUpdated}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'মাছের বাজার', icon: '🐟', insight: 'ইলিশের দাম ৯% বৃদ্ধি। বর্ষা মৌসুমে চাহিদা বাড়তে পারে।', action: 'Shrimp project-এ বিনিয়োগ লাভজনক হবে।', bg: 'blue' },
          { title: 'ফলের বাজার', icon: '🥭', insight: 'আম সিজন শুরু। রাজশাহীতে Langra ও Himsagar-এর দাম ঊর্ধ্বমুখী।', action: 'Mango Orchard প্রকল্পে ভালো রিটার্ন আশা করা যাচ্ছে।', bg: 'orange' },
          { title: 'শস্যের বাজার', icon: '🌾', insight: 'চালের দাম ৭% বৃদ্ধি। সরকারি ক্রয়মূল্য বৃদ্ধির প্রভাব।', action: 'Rice Cultivation প্রকল্পে রিটার্ন বাড়তে পারে।', bg: 'green' },
        ].map((insight, i) => (
          <div key={i} className={`card border-l-4 ${insight.bg === 'blue' ? 'border-blue-500' : insight.bg === 'orange' ? 'border-orange-500' : 'border-green-500'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{insight.icon}</span>
              <h4 className="font-bold text-gray-800">{insight.title}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{insight.insight}</p>
            <div className={`text-xs font-semibold p-2 rounded-lg ${insight.bg === 'blue' ? 'bg-blue-50 text-blue-700' : insight.bg === 'orange' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
              💡 {insight.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
