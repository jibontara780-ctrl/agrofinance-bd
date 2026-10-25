'use client';
import { useState } from 'react';
import { currentUser, myInvestments, formatFullCurrency } from '@/lib/data';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address,
    nid: currentUser.nid,
  });

  const tabs = [
    { id: 'personal', label: 'ব্যক্তিগত তথ্য', icon: '👤' },
    { id: 'kyc', label: 'KYC যাচাই', icon: '✅' },
    { id: 'bank', label: 'ব্যাংক তথ্য', icon: '🏦' },
    { id: 'security', label: 'নিরাপত্তা', icon: '🔒' },
    { id: 'risk', label: 'ঝুঁকি প্রোফাইল', icon: '📊' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="gradient-agro rounded-2xl p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-lg">
              {currentUser.name.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-green-400 hover:bg-green-500 text-white rounded-xl w-8 h-8 flex items-center justify-center text-sm shadow-md transition-colors">
              ✏️
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">{currentUser.name}</h2>
            <p className="text-green-200">{currentUser.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full text-sm font-medium">
                ✅ KYC Verified
              </span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                বিনিয়োগকারী
              </span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                সদস্যপদ: {currentUser.joinDate}
              </span>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-extrabold">{myInvestments.length}</div>
              <div className="text-green-200 text-xs">বিনিয়োগ</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">{formatFullCurrency(currentUser.totalInvested).replace('৳', '')}</div>
              <div className="text-green-200 text-xs">বিনিয়োগকৃত</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">{formatFullCurrency(currentUser.totalReturns).replace('৳', '')}</div>
              <div className="text-green-200 text-xs">আয়</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-green-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">ব্যক্তিগত তথ্য</h3>
            <button onClick={() => setIsEditing(!isEditing)} className={isEditing ? 'btn-danger text-sm py-2' : 'btn-secondary text-sm py-2'}>
              {isEditing ? '✕ বাতিল' : '✏️ সম্পাদনা'}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'পুরো নাম', key: 'name', icon: '👤' },
              { label: 'ইমেইল', key: 'email', icon: '📧' },
              { label: 'ফোন নম্বর', key: 'phone', icon: '📱' },
              { label: 'ঠিকানা', key: 'address', icon: '📍' },
              { label: 'NID নম্বর', key: 'nid', icon: '🪪' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label">{field.icon} {field.label}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData[field.key as keyof typeof formData]}
                    onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                    className="input-field"
                  />
                ) : (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-800 font-medium">
                    {formData[field.key as keyof typeof formData]}
                  </div>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="btn-primary">✓ সংরক্ষণ করুন</button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">বাতিল</button>
            </div>
          )}
        </div>
      )}

      {/* KYC Tab */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">✅</div>
              <div>
                <h3 className="text-xl font-bold text-green-700">KYC সম্পন্ন ও যাচাইকৃত</h3>
                <p className="text-green-600">আপনার পরিচয় সফলভাবে যাচাই করা হয়েছে। ১০ জানুয়ারি ২০২৫</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="section-title mb-4">জমাকৃত নথিপত্র</h3>
            <div className="space-y-3">
              {[
                { doc: 'জাতীয় পরিচয়পত্র (NID)', status: 'verified', date: '২০২৫-০১-০৮', icon: '🪪' },
                { doc: 'ব্যাংক স্টেটমেন্ট', status: 'verified', date: '২০২৫-০১-০৮', icon: '🏦' },
                { doc: 'সেলফি ছবি', status: 'verified', date: '২০২৫-০১-০৮', icon: '📸' },
                { doc: 'ঠিকানা প্রমাণ', status: 'verified', date: '২০২৫-০১-০৮', icon: '📍' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-3xl">{doc.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{doc.doc}</div>
                    <div className="text-xs text-gray-500">জমা: {doc.date}</div>
                  </div>
                  <span className="badge badge-green">✅ যাচাইকৃত</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="section-title mb-2">বিনিয়োগ সীমা</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-xl font-extrabold text-green-700">৳ ৫০,০০,০০০</div>
                <div className="text-sm text-gray-500">সর্বোচ্চ বিনিয়োগ সীমা</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-xl font-extrabold text-blue-700">৳ {(50000000 - currentUser.totalInvested).toLocaleString()}</div>
                <div className="text-sm text-gray-500">অবশিষ্ট সীমা</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Tab */}
      {activeTab === 'bank' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">ব্যাংক অ্যাকাউন্ট</h3>
            <button className="btn-primary text-sm py-2">+ নতুন যোগ করুন</button>
          </div>
          <div className="space-y-4">
            {[
              { bank: 'Dutch Bangla Bank Ltd.', account: '****5678', type: 'Current Account', primary: true },
              { bank: 'bKash Mobile Banking', account: '+880 1712-****78', type: 'Mobile Banking', primary: false },
            ].map((bank, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${bank.primary ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                <div className="text-3xl">{bank.bank.includes('bKash') ? '📱' : '🏦'}</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{bank.bank}</div>
                  <div className="text-sm text-gray-500">{bank.account} • {bank.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  {bank.primary && <span className="badge badge-green">প্রাথমিক</span>}
                  <button className="text-gray-400 hover:text-red-500 transition-colors text-sm">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="section-title mb-4">পাসওয়ার্ড পরিবর্তন</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="label">বর্তমান পাসওয়ার্ড</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">নতুন পাসওয়ার্ড</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <button className="btn-primary">🔒 পাসওয়ার্ড আপডেট করুন</button>
            </div>
          </div>
          <div className="card">
            <h3 className="section-title mb-4">দ্বি-স্তর যাচাইকরণ (2FA)</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
              <div>
                <div className="font-semibold text-gray-800">SMS OTP</div>
                <div className="text-sm text-gray-500">+880 1712-****78 এ OTP পাঠানো হবে</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700">✅ আপনার অ্যাকাউন্ট 2FA দ্বারা সুরক্ষিত।</p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Profile Tab */}
      {activeTab === 'risk' && (
        <div className="card">
          <h3 className="section-title mb-2">ঝুঁকি প্রোফাইল মূল্যায়ন</h3>
          <p className="section-subtitle mb-6">আপনার বিনিয়োগ পছন্দ অনুযায়ী সর্বোত্তম প্রকল্প বাছাই করতে সাহায্য করে</p>
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              {['conservative', 'moderate', 'aggressive'].map((level) => (
                <div key={level} className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${currentUser.riskProfile === level ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{level === 'conservative' ? '🛡️' : level === 'moderate' ? '⚖️' : '🚀'}</div>
                    <div className="font-bold text-gray-800 text-sm">{level === 'conservative' ? 'রক্ষণশীল' : level === 'moderate' ? 'মাঝারি' : 'আক্রমণাত্মক'}</div>
                    <div className="text-xs text-gray-500 mt-1">{level === 'conservative' ? '১৫-২০% রিটার্ন' : level === 'moderate' ? '২০-৩০% রিটার্ন' : '৩০%+ রিটার্ন'}</div>
                    {currentUser.riskProfile === level && <div className="text-xs text-green-600 font-bold mt-1">✓ বর্তমান</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[
              { q: 'আপনি কতদিনের জন্য বিনিয়োগ করতে চান?', a: '৬-১২ মাস' },
              { q: 'মাসিক কত টাকা বিনিয়োগ করতে পারবেন?', a: '৫০,০০০ - ১,০০,০০০ টাকা' },
              { q: 'বিনিয়োগে কতটুকু ঝুঁকি সহ্য করতে পারবেন?', a: 'মাঝারি ঝুঁকি সহনশীল' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-600 mb-1">{item.q}</div>
                <div className="text-base font-bold text-gray-800">{item.a}</div>
              </div>
            ))}
            <button className="btn-primary">🔄 প্রোফাইল আপডেট করুন</button>
          </div>
        </div>
      )}
    </div>
  );
}
