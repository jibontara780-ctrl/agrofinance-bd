'use client';
import { useState } from 'react';
import { transactions, formatFullCurrency } from '@/lib/data';

type FilterType = 'all' | 'investment' | 'return' | 'deposit' | 'withdrawal' | 'monthly_return';

const typeLabels: Record<string, string> = {
  investment: 'বিনিয়োগ', return: 'রিটার্ন', deposit: 'ডিপোজিট',
  withdrawal: 'উত্তোলন', monthly_return: 'মাসিক রিটার্ন'
};

const typeIcons: Record<string, string> = {
  investment: '💸', return: '💰', deposit: '⬆️', withdrawal: '⬇️', monthly_return: '📅'
};

const typeColors: Record<string, string> = {
  investment: 'text-red-600 bg-red-50', return: 'text-green-600 bg-green-50',
  deposit: 'text-blue-600 bg-blue-50', withdrawal: 'text-orange-600 bg-orange-50',
  monthly_return: 'text-emerald-600 bg-emerald-50'
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchRef, setSearchRef] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [success, setSuccess] = useState('');

  const filtered = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => t.ref.toLowerCase().includes(searchRef.toLowerCase()) || t.description.toLowerCase().includes(searchRef.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIn = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));

  const handleAction = (type: 'deposit' | 'withdraw') => {
    setSuccess(type);
    setTimeout(() => {
      setSuccess('');
      setShowDepositModal(false);
      setShowWithdrawModal(false);
      setAmount('');
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'মোট ক্রেডিট', value: formatFullCurrency(totalIn), icon: '⬆️', color: 'from-green-500 to-green-600', text: 'text-white' },
          { label: 'মোট ডেবিট', value: formatFullCurrency(totalOut), icon: '⬇️', color: 'from-red-500 to-red-600', text: 'text-white' },
          { label: 'নিট প্রবাহ', value: formatFullCurrency(totalIn - totalOut), icon: '📊', color: 'from-blue-500 to-blue-600', text: 'text-white' },
          { label: 'মোট লেনদেন', value: `${transactions.length}টি`, icon: '🔄', color: 'from-purple-500 to-purple-600', text: 'text-white' },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-extrabold">{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => setShowDepositModal(true)} className="btn-primary py-4 flex flex-col items-center gap-1">
          <span className="text-2xl">⬆️</span>
          <span className="text-sm">ডিপোজিট</span>
        </button>
        <button onClick={() => setShowWithdrawModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-5 rounded-xl transition-all flex flex-col items-center gap-1">
          <span className="text-2xl">⬇️</span>
          <span className="text-sm">উত্তোলন</span>
        </button>
        <button className="btn-secondary py-4 flex flex-col items-center gap-1">
          <span className="text-2xl">📄</span>
          <span className="text-sm">স্টেটমেন্ট</span>
        </button>
        <button className="btn-secondary py-4 flex flex-col items-center gap-1">
          <span className="text-2xl">📊</span>
          <span className="text-sm">ট্যাক্স রিপোর্ট</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input
              type="text"
              placeholder="রেফারেন্স বা বিবরণ দিয়ে খুঁজুন..."
              value={searchRef}
              onChange={e => setSearchRef(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'investment', 'return', 'monthly_return', 'deposit', 'withdrawal'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
              >
                {f === 'all' ? 'সব' : typeLabels[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">লেনদেন ইতিহাস</h3>
          <span className="text-sm text-gray-500">{filtered.length}টি রেকর্ড</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">ধরন</th>
                <th className="table-header">বিবরণ</th>
                <th className="table-header">পরিমাণ</th>
                <th className="table-header">তারিখ</th>
                <th className="table-header">পদ্ধতি</th>
                <th className="table-header">রেফারেন্স</th>
                <th className="table-header">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold ${typeColors[txn.type]}`}>
                      <span>{typeIcons[txn.type]}</span>
                      <span>{typeLabels[txn.type]}</span>
                    </div>
                  </td>
                  <td className="table-cell max-w-xs">
                    <div className="text-sm text-gray-800 truncate">{txn.description}</div>
                  </td>
                  <td className="table-cell">
                    <span className={`font-bold text-base ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.amount > 0 ? '+' : ''}{formatFullCurrency(txn.amount)}
                    </span>
                  </td>
                  <td className="table-cell whitespace-nowrap">
                    <div className="text-sm text-gray-700">{txn.date}</div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-600">{txn.method}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-xs font-mono text-gray-500">{txn.ref}</span>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-green">✓ সম্পন্ন</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>কোনো লেনদেন পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !success && setShowDepositModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {success === 'deposit' ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ডিপোজিট সফল!</h3>
                <p className="text-green-600 font-bold text-xl">{formatFullCurrency(parseFloat(amount))}</p>
                <p className="text-gray-500 text-sm mt-1">ওয়ালেটে যোগ হয়েছে</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">ওয়ালেটে ডিপোজিট</h3>
                  <button onClick={() => setShowDepositModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">পরিমাণ (টাকা)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field text-xl font-bold" placeholder="0" min="100" />
                  </div>
                  <div>
                    <label className="label">পেমেন্ট পদ্ধতি</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'bank', label: 'ব্যাংক ট্রান্সফার', icon: '🏦' },
                        { id: 'bkash', label: 'বিকাশ', icon: '📱' },
                        { id: 'nagad', label: 'নগদ', icon: '📱' },
                        { id: 'rocket', label: 'রকেট', icon: '📱' },
                      ].map(m => (
                        <button key={m.id} onClick={() => setMethod(m.id)} className={`p-3 rounded-xl border-2 font-medium text-sm flex items-center gap-2 transition-all ${method === m.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-200'}`}>
                          <span className="text-xl">{m.icon}</span>{m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleAction('deposit')} disabled={!amount || parseFloat(amount) < 100} className="w-full btn-primary py-4 disabled:opacity-50">
                    ⬆️ ডিপোজিট করুন
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !success && setShowWithdrawModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {success === 'withdraw' ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">উত্তোলন আবেদন সফল!</h3>
                <p className="text-orange-600 font-bold text-xl">{formatFullCurrency(parseFloat(amount))}</p>
                <p className="text-gray-500 text-sm mt-1">৩ কার্যদিবসের মধ্যে পাবেন</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">উত্তোলন করুন</h3>
                  <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 mb-4">
                  <div className="text-sm text-orange-700">উত্তোলনযোগ্য ব্যালেন্স: <strong>৳ ৪,২৭,৫০০</strong></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">পরিমাণ (টাকা)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field text-xl font-bold" placeholder="0" min="500" max="427500" />
                  </div>
                  <div>
                    <label className="label">গন্তব্য অ্যাকাউন্ট</label>
                    <select className="input-field">
                      <option>🏦 Dutch Bangla Bank - ****5678</option>
                      <option>📱 বিকাশ - 01712XXXXXX</option>
                    </select>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-3">
                    <p className="text-xs text-yellow-700">⚠️ উত্তোলন প্রক্রিয়া সম্পন্ন হতে ২-৩ কার্যদিবস লাগে।</p>
                  </div>
                  <button onClick={() => handleAction('withdraw')} disabled={!amount || parseFloat(amount) < 500} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50">
                    ⬇️ উত্তোলন করুন
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
