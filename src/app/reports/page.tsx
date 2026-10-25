'use client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { myInvestments, portfolioChartData, categoryDistribution, monthlyReturnData, formatFullCurrency, formatCurrency } from '@/lib/data';

const COLORS = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#6b7280'];

const quarterlyData = [
  { quarter: 'Q1 2025', invested: 800000, returned: 5000, roi: 0.6 },
  { quarter: 'Q2 2025', invested: 2050000, returned: 910200, roi: 26.8 },
  { quarter: 'Q3 2025', invested: 2850000, returned: 115000, roi: 4.0 },
];

export default function ReportsPage() {
  const totalInvested = myInvestments.reduce((s, i) => s + i.investedAmount, 0);
  const totalReturns = myInvestments.reduce((s, i) => s + i.totalReturnReceived, 0);
  const completedInv = myInvestments.filter(i => i.status === 'completed');
  const avgReturn = completedInv.length > 0
    ? completedInv.reduce((s, i) => s + (i.actualReturn || i.expectedReturn), 0) / completedInv.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Period Selector */}
      <div className="card flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">বার্ষিক রিপোর্ট ২০২৫</h3>
          <p className="text-sm text-gray-500">জানুয়ারি - জুন ২০২৫</p>
        </div>
        <div className="flex gap-3">
          <select className="input-field max-w-xs">
            <option>২০২৫</option>
            <option>২০২৪</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <span>📄</span> PDF ডাউনলোড
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <span>📊</span> Excel
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'মোট বিনিয়োগ', value: formatFullCurrency(totalInvested), icon: '💰', change: '+৳5L এই বছর', color: 'green' },
          { label: 'মোট আয়', value: formatFullCurrency(totalReturns), icon: '📈', change: '+২৬% গড় রিটার্ন', color: 'blue' },
          { label: 'নিট মুনাফা', value: formatFullCurrency(totalReturns - totalInvested + myInvestments.filter(i=>i.status==='active').reduce((s,i)=>s+i.investedAmount,0)), icon: '🎯', change: 'কমপ্লিটেড থেকে', color: 'purple' },
          { label: 'গড় রিটার্ন', value: `${avgReturn.toFixed(1)}%`, icon: '⭐', change: 'সম্পন্ন প্রকল্পে', color: 'orange' },
        ].map((m, i) => (
          <div key={i} className="card">
            <div className="text-3xl mb-2">{m.icon}</div>
            <div className="text-xl font-extrabold text-gray-900">{m.value}</div>
            <div className="text-sm text-gray-500">{m.label}</div>
            <div className="text-xs text-green-600 mt-1 font-medium">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Growth */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="section-title">পোর্টফোলিও প্রবৃদ্ধি বিশ্লেষণ</h3>
            <p className="section-subtitle">মাসিক বিনিয়োগ ও রিটার্নের তুলনা</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioChartData}>
            <defs>
              <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `৳${(v/100000).toFixed(0)}L`} />
            <Tooltip formatter={(v: number) => [formatFullCurrency(v), '']} />
            <Legend />
            <Area type="monotone" dataKey="invested" name="বিনিয়োগ" stroke="#16a34a" fill="url(#colorInvest)" strokeWidth={2} />
            <Area type="monotone" dataKey="cumulative" name="সঞ্চিত মূল্য" stroke="#3b82f6" fill="url(#colorReturn)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Returns */}
        <div className="card">
          <h3 className="section-title mb-1">মাসিক রিটার্ন</h3>
          <p className="section-subtitle mb-4">প্রতি মাসে প্রাপ্ত আয়</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyReturnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `৳${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [formatFullCurrency(v), 'রিটার্ন']} />
              <Bar dataKey="returns" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 className="section-title mb-1">বিভাগ বিতরণ</h3>
          <p className="section-subtitle mb-4">কোন খাতে কতটুকু বিনিয়োগ</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={4}>
                {categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [formatFullCurrency(v), '']} />
              <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quarterly Report Table */}
      <div className="card">
        <h3 className="section-title mb-4">ত্রৈমাসিক রিপোর্ট</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 rounded-xl">
                <th className="table-header rounded-l-xl">ত্রৈমাসিক</th>
                <th className="table-header">বিনিয়োগ</th>
                <th className="table-header">আয়</th>
                <th className="table-header">ROI</th>
                <th className="table-header rounded-r-xl">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quarterlyData.map((q, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="table-cell font-semibold">{q.quarter}</td>
                  <td className="table-cell">{formatFullCurrency(q.invested)}</td>
                  <td className="table-cell text-green-600 font-bold">+{formatFullCurrency(q.returned)}</td>
                  <td className="table-cell">
                    <span className={`font-bold ${q.roi > 20 ? 'text-green-600' : q.roi > 5 ? 'text-blue-600' : 'text-gray-600'}`}>
                      {q.roi.toFixed(1)}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${i < 2 ? 'badge-green' : 'badge-blue'}`}>
                      {i < 2 ? '✓ সম্পন্ন' : '● চলমান'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment Performance */}
      <div className="card">
        <h3 className="section-title mb-4">বিনিয়োগ পারফরম্যান্স র‍্যাংকিং</h3>
        <div className="space-y-3">
          {myInvestments
            .sort((a, b) => (b.actualReturn || b.expectedReturn) - (a.actualReturn || a.expectedReturn))
            .map((inv, i) => (
              <div key={inv.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900' :
                  i === 1 ? 'bg-gray-300 text-gray-700' :
                  i === 2 ? 'bg-orange-400 text-orange-900' : 'bg-gray-100 text-gray-600'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm truncate">{inv.projectTitle}</div>
                  <div className="text-xs text-gray-500">বিনিয়োগ: {formatCurrency(inv.investedAmount)}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-green-600 text-lg">+{inv.actualReturn || inv.expectedReturn}%</div>
                  <div className="text-xs text-gray-400">{inv.status === 'completed' ? 'সম্পন্ন' : 'চলমান'}</div>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${((inv.actualReturn || inv.expectedReturn) / 40) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
