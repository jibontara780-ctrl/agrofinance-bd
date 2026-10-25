'use client';
import { useState } from 'react';
import { myInvestments, agroProjects, categoryDistribution, formatCurrency, formatFullCurrency, getCategoryEmoji } from '@/lib/data';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#6b7280'];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = myInvestments.filter(inv =>
    activeTab === 'all' || inv.status === activeTab
  );

  const totalInvested = myInvestments.reduce((s, i) => s + i.investedAmount, 0);
  const totalReturns = myInvestments.reduce((s, i) => s + i.totalReturnReceived, 0);
  const activeCount = myInvestments.filter(i => i.status === 'active').length;
  const completedCount = myInvestments.filter(i => i.status === 'completed').length;
  const overallReturn = ((totalReturns / totalInvested) * 100).toFixed(1);

  const radialData = [
    { name: 'রিটার্ন রেট', value: parseFloat(overallReturn), fill: '#16a34a' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Portfolio Summary */}
      <div className="gradient-agro rounded-2xl p-6 text-white">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="text-green-200 text-sm mb-1">মোট বিনিয়োগ</div>
            <div className="text-3xl font-extrabold">{formatFullCurrency(totalInvested)}</div>
          </div>
          <div>
            <div className="text-green-200 text-sm mb-1">মোট রিটার্ন প্রাপ্ত</div>
            <div className="text-3xl font-extrabold text-green-300">{formatFullCurrency(totalReturns)}</div>
          </div>
          <div>
            <div className="text-green-200 text-sm mb-1">গড় রিটার্ন হার</div>
            <div className="text-3xl font-extrabold">{overallReturn}%</div>
          </div>
          <div>
            <div className="text-green-200 text-sm mb-1">মোট প্রকল্প</div>
            <div className="text-3xl font-extrabold">{myInvestments.length}</div>
            <div className="text-green-200 text-xs">{activeCount} সক্রিয় | {completedCount} সম্পন্ন</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title mb-1">বিভাগ অনুযায়ী বিনিয়োগ</h3>
          <p className="section-subtitle mb-4">পোর্টফোলিও বিতরণ</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percentage }) => `${name} ${percentage}%`} labelLine={false}>
                {categoryDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [formatFullCurrency(v), '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title mb-1">বিনিয়োগ অবস্থা</h3>
          <p className="section-subtitle mb-4">প্রকল্পের স্ট্যাটাস বিশ্লেষণ</p>
          <div className="space-y-4 mt-6">
            {[
              { label: 'সক্রিয় বিনিয়োগ', count: activeCount, amount: myInvestments.filter(i => i.status === 'active').reduce((s, i) => s + i.investedAmount, 0), color: 'green', pct: Math.round(activeCount/myInvestments.length*100) },
              { label: 'সম্পন্ন বিনিয়োগ', count: completedCount, amount: myInvestments.filter(i => i.status === 'completed').reduce((s, i) => s + i.investedAmount, 0), color: 'blue', pct: Math.round(completedCount/myInvestments.length*100) },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className={`badge ${item.color === 'green' ? 'badge-green' : 'badge-blue'}`}>{item.count}টি</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-3 bg-${item.color}-500 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-green-600">{overallReturn}%</div>
                <div className="text-xs text-gray-500">গড় রিটার্ন</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-blue-600">{formatCurrency(totalReturns - totalInvested * myInvestments.filter(i => i.status === 'completed').length / myInvestments.length)}</div>
                <div className="text-xs text-gray-500">নিট মুনাফা</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title">আমার বিনিয়োগ তালিকা</h3>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(['all', 'active', 'completed'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}>
                {tab === 'all' ? 'সব' : tab === 'active' ? 'সক্রিয়' : 'সম্পন্ন'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((inv) => {
            const proj = agroProjects.find(p => p.id === inv.projectId);
            const returnPct = inv.actualReturn || inv.expectedReturn;
            const daysProgress = inv.status === 'completed' ? 100 : Math.round((1 - inv.remainingDays / (proj?.duration || 1) / 30) * 100);

            return (
              <div key={inv.id} className="border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon & Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                      {getCategoryEmoji(inv.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{inv.projectTitle}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge ${inv.status === 'active' ? 'badge-green' : 'badge-blue'}`}>
                          {inv.status === 'active' ? '● সক্রিয়' : '✓ সম্পন্ন'}
                        </span>
                        <span className="text-xs text-gray-500">বিনিয়োগ: {inv.investmentDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">বিনিয়োগ</div>
                      <div className="font-bold text-gray-800">{formatCurrency(inv.investedAmount)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">রিটার্ন</div>
                      <div className="font-bold text-green-600">+{returnPct}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">প্রাপ্ত</div>
                      <div className="font-bold text-blue-600">{formatCurrency(inv.totalReturnReceived)}</div>
                    </div>
                    <div className="text-center hidden md:block">
                      <div className="text-sm text-gray-500">{inv.status === 'completed' ? 'মেয়াদ উত্তীর্ণ' : 'বাকি দিন'}</div>
                      <div className="font-bold text-gray-800">{inv.status === 'completed' ? '✓' : `${inv.remainingDays}d`}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="md:w-32">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>অগ্রগতি</span>
                      <span>{inv.status === 'completed' ? '100' : Math.round((inv.totalReturnReceived / (inv.expectedAmount - inv.investedAmount)) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className={`h-2 rounded-full ${inv.status === 'completed' ? 'bg-blue-500' : 'bg-green-500'}`}
                        style={{ width: `${inv.status === 'completed' ? 100 : Math.min(Math.round((inv.totalReturnReceived / (inv.expectedAmount - inv.investedAmount)) * 100), 100)}%` }}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
