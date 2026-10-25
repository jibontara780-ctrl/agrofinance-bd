'use client';
import { useState } from 'react';
import { agroProjects, formatCurrency, formatFullCurrency, getRiskColor, getStatusColor, getCategoryEmoji } from '@/lib/data';

const categories = ['all', 'grain', 'fishery', 'fruit', 'vegetable', 'livestock'];
const statuses = ['all', 'active', 'upcoming', 'completed'];
const categoryLabels: Record<string, string> = { all: 'সব', grain: 'শস্য', fishery: 'মৎস্য', fruit: 'ফল', vegetable: 'সবজি', livestock: 'পশুপাখি' };
const statusLabels: Record<string, string> = { all: 'সব', active: 'সক্রিয়', upcoming: 'আসছে', completed: 'সম্পন্ন' };

export default function ProjectsPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('return');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);

  const filtered = agroProjects
    .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'return') return b.expectedReturn - a.expectedReturn;
      if (sortBy === 'funding') return b.totalFunding - a.totalFunding;
      if (sortBy === 'progress') return b.progress - a.progress;
      return 0;
    });

  const selectedProjectData = agroProjects.find(p => p.id === selectedProject);

  const handleInvest = () => {
    if (!investAmount || parseFloat(investAmount) < (selectedProjectData?.minInvestment || 0)) return;
    setInvestSuccess(true);
    setTimeout(() => {
      setShowInvestModal(false);
      setInvestSuccess(false);
      setInvestAmount('');
      setSelectedProject(null);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'মোট প্রকল্প', value: agroProjects.length, icon: '🌾', color: 'green' },
          { label: 'সক্রিয়', value: agroProjects.filter(p => p.status === 'active').length, icon: '✅', color: 'blue' },
          { label: 'আসছে', value: agroProjects.filter(p => p.status === 'upcoming').length, icon: '⏰', color: 'purple' },
          { label: 'সর্বোচ্চ রিটার্ন', value: '৪০%', icon: '📈', color: 'orange' },
        ].map((s, i) => (
          <div key={i} className="card text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              <input
                type="text"
                placeholder="প্রকল্প বা এলাকা খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${categoryFilter === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
              >
                {cat !== 'all' && getCategoryEmoji(cat)} {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field max-w-xs">
            {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field max-w-xs">
            <option value="return">রিটার্ন (বেশি)</option>
            <option value="funding">তহবিল (বেশি)</option>
            <option value="progress">অগ্রগতি</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <div key={project.id} className="card-hover overflow-hidden">
            {/* Card Header */}
            <div className={`-mx-6 -mt-6 p-6 mb-4 ${
              project.status === 'active' ? 'bg-gradient-to-br from-green-500 to-green-700' :
              project.status === 'completed' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
              project.status === 'upcoming' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
              'bg-gradient-to-br from-gray-400 to-gray-600'
            } text-white`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-5xl">{getCategoryEmoji(project.category)}</span>
                <div className="text-right">
                  <span className={`badge ${getStatusColor(project.status)} text-xs`}>
                    {project.status === 'active' ? '● সক্রিয়' : project.status === 'completed' ? '✓ সম্পন্ন' : project.status === 'upcoming' ? '⏰ আসছে' : '⏸ বিরতি'}
                  </span>
                  <div className="text-white/80 text-xs mt-1">👥 {project.investors} বিনিয়োগকারী</div>
                </div>
              </div>
              <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
              <p className="text-white/80 text-sm mt-1">📍 {project.location}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center bg-green-50 rounded-xl p-3">
                <div className="text-2xl font-extrabold text-green-600">{project.expectedReturn}%</div>
                <div className="text-xs text-gray-500">রিটার্ন</div>
              </div>
              <div className="text-center bg-blue-50 rounded-xl p-3">
                <div className="text-lg font-bold text-blue-600">{project.duration}m</div>
                <div className="text-xs text-gray-500">মেয়াদ</div>
              </div>
              <div className={`text-center rounded-xl p-3 ${getRiskColor(project.riskLevel)}`}>
                <div className="text-lg font-bold">{project.riskLevel === 'low' ? 'কম' : project.riskLevel === 'medium' ? 'মাঝা' : 'উচ্চ'}</div>
                <div className="text-xs">ঝুঁকি</div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 font-medium">সংগ্রহ: {formatCurrency(project.raisedAmount)}</span>
                <span className="text-gray-500">{project.progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${project.progress >= 90 ? 'bg-red-500' : project.progress >= 60 ? 'bg-orange-500' : 'bg-green-500'}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">লক্ষ্য: {formatCurrency(project.totalFunding)}</div>
            </div>

            {/* Details */}
            <div className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between mb-1">
                <span>🌿 ফসল:</span>
                <span className="font-medium text-gray-800">{project.cropType}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>🏞️ জমি:</span>
                <span className="font-medium text-gray-800">{project.farmArea}</span>
              </div>
              <div className="flex justify-between">
                <span>💰 সর্বনিম্ন:</span>
                <span className="font-medium text-green-600">{formatFullCurrency(project.minInvestment)}</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.highlights.slice(0, 3).map((h, i) => (
                <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">✓ {h}</span>
              ))}
            </div>

            {/* Action */}
            {project.status === 'active' || project.status === 'upcoming' ? (
              <button
                onClick={() => { setSelectedProject(project.id); setShowInvestModal(true); }}
                className="w-full btn-primary py-3"
                disabled={project.status === 'upcoming'}
              >
                {project.status === 'upcoming' ? '⏰ শীঘ্রই আসছে' : '💰 বিনিয়োগ করুন'}
              </button>
            ) : (
              <button className="w-full btn-secondary py-3 cursor-default opacity-60">
                ✅ সম্পন্ন হয়েছে
              </button>
            )}
          </div>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-medium">কোনো প্রকল্প পাওয়া যায়নি</p>
          <p className="text-sm mt-2">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestModal && selectedProjectData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !investSuccess && setShowInvestModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            {investSuccess ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">বিনিয়োগ সফল!</h3>
                <p className="text-gray-600">আপনার বিনিয়োগ সফলভাবে নিবন্ধিত হয়েছে।</p>
                <div className="mt-4 bg-green-50 rounded-2xl p-4">
                  <div className="text-lg font-bold text-green-600">{formatFullCurrency(parseFloat(investAmount))}</div>
                  <div className="text-sm text-gray-500">{selectedProjectData.title}</div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">বিনিয়োগ করুন</h3>
                  <button onClick={() => setShowInvestModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                <div className="bg-green-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryEmoji(selectedProjectData.category)}</span>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{selectedProjectData.title}</div>
                      <div className="text-xs text-gray-500">রিটার্ন: {selectedProjectData.expectedReturn}% | মেয়াদ: {selectedProjectData.duration} মাস</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">বিনিয়োগের পরিমাণ (টাকা)</label>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={e => setInvestAmount(e.target.value)}
                      className="input-field text-xl font-bold"
                      placeholder="0"
                      min={selectedProjectData.minInvestment}
                      max={selectedProjectData.maxInvestment}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>সর্বনিম্ন: {formatFullCurrency(selectedProjectData.minInvestment)}</span>
                      <span>সর্বোচ্চ: {formatFullCurrency(selectedProjectData.maxInvestment)}</span>
                    </div>
                  </div>

                  {investAmount && parseFloat(investAmount) >= selectedProjectData.minInvestment && (
                    <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">বিনিয়োগ:</span>
                        <span className="font-bold">{formatFullCurrency(parseFloat(investAmount))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">প্রত্যাশিত রিটার্ন ({selectedProjectData.expectedReturn}%):</span>
                        <span className="font-bold text-green-600">+{formatFullCurrency(parseFloat(investAmount) * selectedProjectData.expectedReturn / 100)}</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 flex justify-between text-sm font-bold">
                        <span>মোট প্রাপ্তি:</span>
                        <span className="text-green-600">{formatFullCurrency(parseFloat(investAmount) * (1 + selectedProjectData.expectedReturn / 100))}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="label">পেমেন্ট পদ্ধতি</label>
                    <select className="input-field">
                      <option>💰 ওয়ালেট (ব্যালেন্স: ৳৪,২৭,৫০০)</option>
                      <option>🏦 ব্যাংক ট্রান্সফার</option>
                      <option>📱 বিকাশ</option>
                      <option>📱 নগদ</option>
                    </select>
                  </div>

                  <button
                    onClick={handleInvest}
                    disabled={!investAmount || parseFloat(investAmount) < selectedProjectData.minInvestment}
                    className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💰 বিনিয়োগ নিশ্চিত করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
