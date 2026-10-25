'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌾</span>
              <div>
                <span className="text-xl font-bold text-green-700">AgroFinance</span>
                <span className="text-xl font-bold text-gray-800"> BD</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Features</a>
              <a href="#projects" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Projects</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-green-600 font-medium transition-colors">How It Works</a>
              <a href="#returns" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Returns</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth" className="text-green-600 hover:text-green-700 font-semibold px-4 py-2 rounded-xl hover:bg-green-50 transition-all">
                Login
              </Link>
              <Link href="/auth" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-agro opacity-5"></div>
        <div className="absolute top-20 right-0 w-1/2 h-full opacity-10">
          <div className="text-[400px] leading-none">🌾</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              বাংলাদেশের #১ কৃষি বিনিয়োগ প্ল্যাটফর্ম
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              কৃষিতে বিনিয়োগ করুন,{' '}
              <span className="text-gradient">টেকসই মুনাফা</span>{' '}
              উপভোগ করুন
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AgroFinance BD-তে বিনিয়োগ করে বাংলাদেশের কৃষি খাতে অংশীদার হন। 
              চাল, মাছ, সবজি, ফল থেকে পোল্ট্রি — সকল কৃষি প্রকল্পে স্বচ্ছ ও নিরাপদ বিনিয়োগের সুযোগ।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/auth" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl text-center">
                🚀 এখনই শুরু করুন
              </Link>
              <Link href="/dashboard" className="bg-white border-2 border-green-200 hover:border-green-400 text-green-700 font-bold px-8 py-4 rounded-2xl text-lg transition-all text-center">
                📊 Dashboard দেখুন
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '১,২৪৭+', label: 'সক্রিয় বিনিয়োগকারী', emoji: '👥' },
                { value: '১২.৫ কোটি+', label: 'মোট বিনিয়োগ', emoji: '💰' },
                { value: '২৪টি', label: 'সফল প্রকল্প', emoji: '✅' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">কেন AgroFinance BD?</h2>
            <p className="text-xl text-gray-600">সহজ, স্বচ্ছ এবং লাভজনক কৃষি বিনিয়োগ</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: '১০০% নিরাপদ', desc: 'বাংলাদেশ ব্যাংক অনুমোদিত, বীমা আওতাভুক্ত প্রতিটি প্রকল্প। আপনার বিনিয়োগ সম্পূর্ণ সুরক্ষিত।', color: 'green' },
              { icon: '📈', title: 'উচ্চ রিটার্ন', desc: 'বার্ষিক ১৬% থেকে ৪০% পর্যন্ত রিটার্ন। প্রতিটি প্রকল্পের বিস্তারিত আর্থিক বিবরণ সহ স্বচ্ছ প্রজেকশন।', color: 'blue' },
              { icon: '🌿', title: 'টেকসই কৃষি', desc: 'আধুনিক প্রযুক্তি ও জৈব পদ্ধতিতে চাষ। পরিবেশবান্ধব ও দীর্ঘমেয়াদী কৃষি উন্নয়নে অবদান রাখুন।', color: 'emerald' },
              { icon: '📱', title: 'রিয়েল-টাইম ট্র্যাকিং', desc: 'মোবাইল অ্যাপ ও ওয়েবসাইটে সরাসরি আপনার বিনিয়োগের অগ্রগতি, ফসলের অবস্থা ও বাজার মূল্য দেখুন।', color: 'purple' },
              { icon: '💳', title: 'সহজ লেনদেন', desc: 'বিকাশ, নগদ, রকেট থেকে শুরু করে যেকোনো ব্যাংক ট্রান্সফারে বিনিয়োগ ও উত্তোলন করুন।', color: 'orange' },
              { icon: '🤝', title: 'বিশেষজ্ঞ দল', desc: 'কৃষিবিদ, আর্থিক বিশ্লেষক ও ঝুঁকি ব্যবস্থাপক দ্বারা পরিচালিত প্রতিটি প্রকল্প।', color: 'teal' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">কিভাবে কাজ করে?</h2>
            <p className="text-xl text-gray-600">মাত্র ৪টি সহজ ধাপে শুরু করুন</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '📝', title: 'নিবন্ধন করুন', desc: 'বিনামূল্যে অ্যাকাউন্ট খুলুন। NID ও ব্যাংক তথ্য দিয়ে KYC সম্পন্ন করুন।' },
              { step: '02', icon: '🔍', title: 'প্রকল্প বেছে নিন', desc: 'আপনার বাজেট ও ঝুঁকি অনুযায়ী কৃষি প্রকল্প নির্বাচন করুন।' },
              { step: '03', icon: '💰', title: 'বিনিয়োগ করুন', desc: 'মোবাইল ব্যাংকিং বা ব্যাংক ট্রান্সফারে নিরাপদে অর্থ পাঠান।' },
              { step: '04', icon: '🎯', title: 'মুনাফা পান', desc: 'ফসল বিক্রির পর মাসিক বা একসাথে মুনাফা সহ মূলধন ফেরত পান।' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-green-200 z-0"></div>
                )}
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-2xl text-2xl mb-4 shadow-lg mx-auto">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">ধাপ {step.step}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Projects */}
      <section id="projects" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">সক্রিয় বিনিয়োগ প্রকল্প</h2>
            <p className="text-xl text-gray-600">এখনই বিনিয়োগ করুন — সীমিত আসন বাকি</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: '🌾', title: 'প্রিমিয়াম চাল চাষ - সিলেট', location: 'সিলেট', return: '২২%', duration: '৬ মাস', progress: 75, risk: 'কম', status: 'সক্রিয়', raised: '৩৭.৫ লক্ষ', total: '৫০ লক্ষ' },
              { emoji: '🥭', title: 'আম বাগান বিনিয়োগ - রাজশাহী', location: 'রাজশাহী', return: '৩৫%', duration: '১৮ মাস', progress: 54, risk: 'মাঝারি', status: 'সক্রিয়', raised: '৬৫ লক্ষ', total: '১.২ কোটি' },
              { emoji: '🦐', title: 'চিংড়ি চাষ - খুলনা', location: 'খুলনা', return: '৪০%', duration: '১০ মাস', progress: 60, risk: 'উচ্চ', status: 'আসছে', raised: '৯০ লক্ষ', total: '১.৫ কোটি' },
            ].map((project, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 text-center">
                  <div className="text-6xl mb-2">{project.emoji}</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'সক্রিয়' ? 'bg-green-400 text-white' : 'bg-purple-400 text-white'}`}>
                    ● {project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">📍 {project.location}</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center bg-green-50 rounded-xl p-3">
                      <div className="text-xl font-extrabold text-green-600">{project.return}</div>
                      <div className="text-xs text-gray-500">রিটার্ন</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded-xl p-3">
                      <div className="text-base font-bold text-blue-600">{project.duration}</div>
                      <div className="text-xs text-gray-500">মেয়াদ</div>
                    </div>
                    <div className="text-center bg-orange-50 rounded-xl p-3">
                      <div className="text-base font-bold text-orange-600">{project.risk}</div>
                      <div className="text-xs text-gray-500">ঝুঁকি</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>সংগ্রহ: {project.raised}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">লক্ষ্য: {project.total}</div>
                  </div>
                  <Link href="/auth" className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all">
                    বিনিয়োগ করুন →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-lg">
              সব প্রকল্প দেখুন →
            </Link>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section id="returns" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">আকর্ষণীয় রিটার্ন ইতিহাস</h2>
              <p className="text-xl text-gray-600 mb-8">আমাদের বিনিয়োগকারীরা গড়ে ২৬% বার্ষিক রিটার্ন পেয়েছেন।</p>
              <div className="space-y-4">
                {[
                  { project: 'স্ট্রবেরি চাষ - রংপুর', return: '+৩৩.৫%', status: 'সম্পন্ন', icon: '🍓' },
                  { project: 'ইলিশ মাছ চাষ - চাঁদপুর', return: '+২৮.৫%', status: 'সম্পন্ন', icon: '🐟' },
                  { project: 'সবজি গ্রিনহাউস - বগুড়া', return: '+১৯.২%', status: 'সম্পন্ন', icon: '🥦' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.project}</div>
                      <div className="text-sm text-green-600 font-medium">{item.status}</div>
                    </div>
                    <div className="text-2xl font-extrabold text-green-600">{item.return}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '২৬%', label: 'গড় বার্ষিক রিটার্ন', emoji: '📈', bg: 'from-green-500 to-green-700' },
                { value: '২৪টি', label: 'সফলভাবে সম্পন্ন', emoji: '✅', bg: 'from-blue-500 to-blue-700' },
                { value: '০%', label: 'ডিফল্ট রেট', emoji: '🛡️', bg: 'from-purple-500 to-purple-700' },
                { value: '৩ দিন', label: 'গড় উত্তোলন সময়', emoji: '⚡', bg: 'from-orange-500 to-orange-700' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 text-white text-center`}>
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-agro">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">আজই শুরু করুন</h2>
          <p className="text-xl text-green-100 mb-10">মাত্র ২৫,০০০ টাকা থেকে বিনিয়োগ শুরু করুন। রেজিস্ট্রেশন সম্পূর্ণ বিনামূল্যে।</p>
          <Link href="/auth" className="inline-block bg-white text-green-700 hover:bg-green-50 font-bold px-10 py-5 rounded-2xl text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            🌾 বিনামূল্যে অ্যাকাউন্ট খুলুন
          </Link>
          <p className="text-green-200 text-sm mt-4">কোনো লুকানো চার্জ নেই • ৩ মিনিটে নিবন্ধন • ২৪/৭ সাপোর্ট</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-bold text-white">AgroFinance BD</span>
              </div>
              <p className="text-sm leading-relaxed">বাংলাদেশের কৃষিতে বিনিয়োগের সবচেয়ে নির্ভরযোগ্য প্ল্যাটফর্ম।</p>
            </div>
            {[
              { title: 'প্ল্যাটফর্ম', links: ['প্রকল্পসমূহ', 'ড্যাশবোর্ড', 'পোর্টফোলিও', 'মার্কেট'] },
              { title: 'কোম্পানি', links: ['আমাদের সম্পর্কে', 'টিম', 'ক্যারিয়ার', 'প্রেস'] },
              { title: 'সহায়তা', links: ['FAQ', 'যোগাযোগ', 'গোপনীয়তা নীতি', 'শর্তাবলী'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="hover:text-white transition-colors text-sm">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© ২০২৫ AgroFinance BD. সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex gap-6 text-sm">
              <span>🇧🇩 Made in Bangladesh</span>
              <span>🔒 SSL Secured</span>
              <span>🏦 Bangladesh Bank Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
