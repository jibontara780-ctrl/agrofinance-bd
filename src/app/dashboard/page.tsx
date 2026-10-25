'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  currentUser, myInvestments, agroProjects, portfolioChartData,
  categoryDistribution, monthlyReturnData, notifications,
  formatCurrency, formatFullCurrency, getCategoryEmoji
} from '@/lib/data';

const COLORS = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#6b7280'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const activeInvestments = myInvestments.filter(i => i.status === 'active');
  const completedInvestments = myInvestments.filter(i => i.status === 'completed');
  const totalInvested = myInvestments.reduce((sum, i) => sum + i.investedAmount, 0);
  const totalReturnsReceived = myInvestments.reduce((sum, i) => sum + i.totalReturnReceived, 0);
  const activeProjects = agroProjects.filter(p => p.status === 'active');
  const unreadNotifs = notifications.filter(n => !n.read);

  const statCards = [
    {
      title: 'মোট বিনিয়োগ',
      value: formatFullCurrency(totalInvested),
      change: '+৳5,00,000 এই মাসে',
      trend: 'up',
      icon: '💰',
      bg: 'from-green-500 to-green-600',
      detail: `${myInvestments.length}টি প্রকল্পে`,
    },
    {
      title: 'মোট রিটার্ন',
      value: formatFullCurrency(totalReturnsReceived),
      change: '+১৫% গড় রিটার্ন',
      trend: 'up',
      icon: '📈',
      bg: 'from-blue-500 to-blue-600',
      detail: 'এখন পর্যন্ত প্রাপ্ত',
    },
    {
      title: 'সক্রিয় বিনিয়োগ',
      value: `${activeInvestments.length}টি`,
      change: `৳${(activeInvestments.reduce((s, i) => s + i.investedAmount, 0) / 100000).toFixed(1)} লক্ষ`,
      trend: 'neutral',
      icon: '🌱',
      bg: 'from-emerald-500 to-emerald-600',
      detail: 'চলমান প্রকল্প',
    },
    {
      title: 'ওয়ালেট ব্যালেন্স',
      value: '৳ ৪,২৭,৫০০',
      change: 'উত্তোলনযোগ্য',
      trend: 'neutral',
      icon: '👛',
      bg: 'from-purple-500 to-purple-600',
      detail: 'সরাসরি উত্তোলন',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="gradient-agro rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-9xl opacity-10">🌾</div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">আস্সালামু আলাইকুম, {currentUser.name}! 👋</h2>
          <p className="text-green-100 mb-4">আপনার পোর্টফোলিও আজ ভালো করছে। সর্বশেষ রিটার্ন চেক করুন।</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="bg-white text-green-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-green-50 transition-all">
              + নতুন বিনিয়োগ
            </Link>
            <Link href="/portfolio" className="bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition-all">
              📊 পোর্টফোলিও
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="card-hover">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${card.bg} rounded-xl text-2xl mb-3 shadow-sm`}>
              {card.icon}
            </div>
            <div className="text-xs text-gray-500 mb-1">{card.title}</div>
            <div className="text-xl font-extrabold text-gray-900 mb-1">{card.value}</div>
            <div className="flex items-center gap-1">
              {card.trend === 'up' && <span className="text-green-500 text-xs">↗</span>}
              <span className="text-xs text-gray-500">{card.change}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">{card.detail}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portfolio Growth Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">পোর্টফোলিও প্রবৃদ্ধি</h3>
              <p className="section-subtitle">বিনিয়োগ ও রিটার্নের মাসিক চিত্র</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>২০২৫</option>
              <option>২০২৪</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={portfolioChartData}>
              <defs>
                <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `৳${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => [formatFullCurrency(v), '']} />
              <Area type="monotone" dataKey="invested" stroke="#16a34a" fill="url(#investGrad)" name="বিনিয়োগ" strokeWidth={2} />
              <Area type="monotone" dataKey="cumulative" stroke="#3b82f6" fill="url(#returnGrad)" name="সঞ্চিত" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 className="section-title mb-1">বিভাগ বিতরণ</h3>
          <p className="section-subtitle mb-4">প্রকল্প অনুযায়ী বিনিয়োগ</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {categoryDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [formatCurrency(v), '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Returns Bar Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="section-title">মাসিক রিটার্ন</h3>
            <p className="section-subtitle">প্রতি মাসের আয়</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyReturnData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => [formatFullCurrency(v), 'রিটার্ন']} />
            <Bar dataKey="returns" fill="#16a34a" radius={[6, 6, 0, 0]} name="রিটার্ন" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Active Investments & Notifications Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Investments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">সক্রিয় বিনিয়োগ</h3>
            <Link href="/portfolio" className="text-sm text-green-600 hover:text-green-700 font-medium">সব দেখুন →</Link>
          </div>
          <div className="space-y-3">
            {activeInvestments.slice(0, 4).map((inv) => {
              const returnPct = ((inv.totalReturnReceived / inv.investedAmount) * 100).toFixed(1);
              return (
                <div key={inv.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                    {getCategoryEmoji(inv.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{inv.projectTitle}</div>
                    <div className="text-xs text-gray-500">বিনিয়োগ: {formatCurrency(inv.investedAmount)}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                        <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${Math.min(parseFloat(returnPct), 100)}%` }}></div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">{returnPct}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">+{inv.expectedReturn}%</div>
                    <div className="text-xs text-gray-400">{inv.remainingDays} দিন</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">সাম্প্রতিক বিজ্ঞপ্তি</h3>
            <Link href="/notifications" className="text-sm text-green-600 hover:text-green-700 font-medium">সব দেখুন →</Link>
          </div>
          <div className="space-y-3">
            {unreadNotifs.slice(0, 4).map((notif) => {
              const icons: Record<string, string> = { money: '💰', check: '✅', new: '🆕', verify: '✔️', alert: '⚠️', update: '📢' };
              return (
                <div key={notif.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl flex-shrink-0">{icons[notif.icon] || '🔔'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{notif.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">{notif.message.substring(0, 80)}...</div>
                    <div className="text-xs text-gray-400 mt-1">{notif.date}</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse-green"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Projects Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">বিনিয়োগের সুযোগ</h3>
            <p className="section-subtitle">আপনার জন্য সুপারিশকৃত প্রকল্প</p>
          </div>
          <Link href="/projects" className="btn-primary text-sm py-2">সব প্রকল্প →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {activeProjects.slice(0, 3).map((proj) => (
            <div key={proj.id} className="border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                  {getCategoryEmoji(proj.category)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">{proj.title.split(' - ')[0]}</div>
                  <div className="text-xs text-gray-500">📍 {proj.location}</div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="text-center">
                  <div className="text-lg font-extrabold text-green-600">{proj.expectedReturn}%</div>
                  <div className="text-xs text-gray-500">রিটার্ন</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-700">{proj.duration} {proj.durationUnit}</div>
                  <div className="text-xs text-gray-500">মেয়াদ</div>
                </div>
                <div className="text-center">
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${proj.riskLevel === 'low' ? 'bg-green-100 text-green-700' : proj.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {proj.riskLevel === 'low' ? 'কম' : proj.riskLevel === 'medium' ? 'মাঝারি' : 'উচ্চ'}
                  </div>
                  <div className="text-xs text-gray-500">ঝুঁকি</div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{formatCurrency(proj.raisedAmount)} সংগ্রহ</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${proj.progress}%` }}></div>
                </div>
              </div>
              <Link href="/projects" className="block text-center text-sm text-green-600 font-semibold hover:text-green-700">
                বিনিয়োগ করুন →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
