'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: 'ahmed@agrofinance.bd', password: 'password123' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    router.push('/admin');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-agro relative flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl">🌾</span>
            <div>
              <div className="text-2xl font-bold text-white">AgroFinance BD</div>
              <div className="text-green-200 text-sm">Agriculture Investment Platform</div>
            </div>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🌱</div>
            <h2 className="text-3xl font-bold text-white mb-4">কৃষিতে বিনিয়োগ করুন</h2>
            <p className="text-green-100 text-lg mb-8">বাংলাদেশের সেরা কৃষি প্রকল্পে বিনিয়োগ করে ১৬% - ৪০% বার্ষিক রিটার্ন পান</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '১,২৪৭+', sublabel: 'বিনিয়োগকারী' },
                { label: '২৬%', sublabel: 'গড় রিটার্ন' },
                { label: '২৪টি', sublabel: 'সফল প্রকল্প' },
                { label: '০%', sublabel: 'ডিফল্ট রেট' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-white">{s.label}</div>
                  <div className="text-green-200 text-sm">{s.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-green-300 text-sm text-center">
          🔒 SSL Encrypted | 🏦 Bangladesh Bank Compliant | 🛡️ Insured Investments
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-bold text-green-700">AgroFinance BD</span>
            </Link>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${isLogin ? 'bg-white shadow-sm text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
              লগইন করুন
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${!isLogin ? 'bg-white shadow-sm text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
              নিবন্ধন করুন
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">স্বাগতম! 👋</h2>
                <p className="text-gray-500 text-sm">আপনার অ্যাকাউন্টে লগইন করুন</p>
              </div>

              <div>
                <label className="label">ইমেইল বা ফোন নম্বর</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="input-field" placeholder="example@email.com" required />
              </div>

              <div>
                <label className="label">পাসওয়ার্ড</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="input-field pr-12" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  মনে রাখুন
                </label>
                <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">পাসওয়ার্ড ভুলে গেছেন?</a>
              </div>

              <button type="submit" disabled={isLoading} className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    লগইন হচ্ছে...
                  </>
                ) : '🔐 লগইন করুন'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500">অথবা</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="btn-secondary py-3 text-sm flex items-center justify-center gap-2">
                  📱 বিকাশ দিয়ে
                </button>
                <button type="button" className="btn-secondary py-3 text-sm flex items-center justify-center gap-2">
                  🏦 ব্যাংক OTP
                </button>
              </div>

              {/* Demo hint */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-semibold mb-2">🎯 ডেমো অ্যাকাউন্ট:</p>
                <p className="text-xs text-blue-600">Email: ahmed@agrofinance.bd</p>
                <p className="text-xs text-blue-600">Pass: যেকোনো কিছু লিখুন</p>
                <button type="button" onClick={handleAdminLogin} className="mt-2 text-xs text-purple-600 font-semibold hover:text-purple-700">
                  👑 অ্যাডমিন ড্যাশবোর্ড দেখুন →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">অ্যাকাউন্ট খুলুন 🌱</h2>
                <p className="text-gray-500 text-sm">বিনামূল্যে নিবন্ধন করুন, আজই শুরু করুন</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">পুরো নাম</label>
                  <input type="text" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} className="input-field" placeholder="আপনার নাম" required />
                </div>
                <div>
                  <label className="label">ফোন নম্বর</label>
                  <input type="tel" value={registerForm.phone} onChange={e => setRegisterForm({...registerForm, phone: e.target.value})} className="input-field" placeholder="01XXXXXXXXX" required />
                </div>
              </div>

              <div>
                <label className="label">ইমেইল</label>
                <input type="email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="input-field" placeholder="example@email.com" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">পাসওয়ার্ড</label>
                  <input type="password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} className="input-field" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="label">নিশ্চিত করুন</label>
                  <input type="password" value={registerForm.confirm} onChange={e => setRegisterForm({...registerForm, confirm: e.target.value})} className="input-field" placeholder="••••••••" required />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={registerForm.agree} onChange={e => setRegisterForm({...registerForm, agree: e.target.checked})} className="mt-1 rounded" required />
                <span className="text-sm text-gray-600">
                  আমি <a href="#" className="text-green-600 font-medium">শর্তাবলী</a> ও <a href="#" className="text-green-600 font-medium">গোপনীয়তা নীতি</a> মেনে নিচ্ছি
                </span>
              </label>

              <button type="submit" disabled={isLoading} className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    অ্যাকাউন্ট তৈরি হচ্ছে...
                  </>
                ) : '🌱 অ্যাকাউন্ট তৈরি করুন'}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">⚠️ নিবন্ধনের পর KYC সম্পন্ন করতে হবে। NID কার্ড ও ব্যাংক তথ্য প্রস্তুত রাখুন।</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
