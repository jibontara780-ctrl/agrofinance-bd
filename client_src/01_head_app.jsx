<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AgroFinance BD | Smart Agriculture Direct Investment Platform</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- React & ReactDOM (Local Vendor with CDN Fallback) -->
  <script src="/vendor/react.production.min.js"></script>
  <script src="/vendor/react-dom.production.min.js"></script>
  <script>
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
      document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\/script>');
      document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\/script>');
    }
  </script>

  <!-- Chart.js (Local Vendor with CDN Fallback) -->
  <script src="/vendor/chart.min.js"></script>
  <script>
    if (typeof Chart === 'undefined') {
      document.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>');
    }
  </script>

  <!-- Canvas Confetti (Local Vendor with CDN Fallback) -->
  <script src="/vendor/confetti.min.js"></script>
  <script>
    if (typeof confetti === 'undefined') {
      document.write('<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"><\/script>');
    }
  </script>

  <!-- Google Fonts: Hind Siliguri, Noto Sans Bengali, Inter & Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            heading: ['Outfit', '"Hind Siliguri"', '"Noto Sans Bengali"', 'sans-serif'],
            bengali: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'SolaimanLipi', 'sans-serif']
          }
        }
      }
    };
  </script>

  <style>
    :root, body, #root, .font-sans {
      font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
      background-color: #f8fafc;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    }
    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: 'Outfit', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif !important;
    }

    /* PREVENT BENGALI CONJUNCT AND LIGATURE BREAKAGE */
    /* In Bengali, letter-spacing (tracking-*) and text-transform: uppercase destroy conjunct ligatures (যুক্তাক্ষর) */
    .font-bengali,
    [lang="bn"],
    .font-bengali *,
    [lang="bn"] * {
      letter-spacing: 0px !important;
      text-transform: none !important;
    }

    body:lang(bn) h1, body:lang(bn) h2, body:lang(bn) h3, body:lang(bn) h4, body:lang(bn) h5, body:lang(bn) h6,
    body:lang(bn) p, body:lang(bn) span, body:lang(bn) div, body:lang(bn) a, body:lang(bn) button {
      letter-spacing: 0px !important;
      text-transform: none !important;
    }
    .gradient-agro {
      background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%);
    }
    .gradient-gold {
      background: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%);
    }
    .gradient-navy {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spinSlow 8s linear infinite;
    }
  </style>
</head>
<body class="selection:bg-emerald-500 selection:text-white antialiased">
  <div id="root"></div>

  <!-- Application Script -->
  <script id="agro-app-root">
    const { useState, useEffect, useMemo, useRef } = React;

    // Smart API Base: detects if opened via file:// or directly from server
    const API_BASE = (typeof window !== 'undefined' && window.location.protocol === 'file:')
      ? 'http://localhost:5001/api'
      : '/api';

    // Helper Currency Formatter (BDT)
    const formatBDT = (amount, lang = 'bn') => {
      const num = Number(amount) || 0;
      if (lang === 'bn') {
        return '৳' + num.toLocaleString('bn-BD');
      }
      return '৳' + num.toLocaleString('en-BD');
    };

    // Centralized Bilingual Dictionary (100% Pure Bangla & 100% Crisp English)
    const I18N = {
      bn: {
        bannerSecurity: '🔒 ২৫৬-বিট টিএলএস এনক্রিপশন সক্রিয়',
        bannerInsured: '✓ সাধারণ বীমা কর্পোরেশন দ্বারা ১০০% ফসল বীমাকৃত মূলধন',
        taglineAdmin: 'এন্টারপ্রাইজ অ্যাডমিনিস্ট্রেশন ও কমপ্লায়েন্স গেটওয়ে',
        taglineUser: 'স্মার্ট কৃষি অর্থায়ন ও যৌথ বিনিয়োগ প্ল্যাটফর্ম',
        navHome: 'হোম',
        navProjects: 'সমন্বিত প্রকল্পসমূহ',
        navPortfolio: 'পোর্টফোলিও',
        navFarmTour: 'খামার পরিদর্শন 🚜',
        navImpact: 'সামাজিক প্রভাব 🌱',
        navAiAgent: 'এআই এগ্রো এজেন্ট 🤖',
        navDashboard: 'ড্যাশবোর্ড',
        navAdmin: 'অ্যাডমিন কনসোল',
        navViewPublic: 'পাবলিক সাইট দেখুন ↗',
        navLogin: 'লগইন',
        navRegister: 'বিনিয়োগকারী নিবন্ধন',
        navSignOut: 'লগআউট',
        navProfile: 'প্রোফাইল ও কেওয়াইসি',
        walletBalance: 'ওয়ালেট ব্যালেন্স',
        balanceText: 'ব্যালেন্স',
        liveSiemActive: 'লাইভ মনিটরিং সক্রিয়',
        terms: 'সেবার শর্তাবলী',
        privacy: 'গোপনীয়তা নীতি',
        security: 'নিরাপত্তা নীতিমালা',
        certInfo: 'বীমা ও নিরীক্ষা সনদ',
        rights: '© ২০২৬ AgroFinance BD Limited. সর্বস্বত্ব সংরক্ষিত।',
        staffPortal: 'স্টাফ পোর্টাল',
        footerDesc: 'বাংলাদেশের শীর্ষস্থানীয় প্রাতিষ্ঠানিক কৃষি বিনিয়োগ প্ল্যাটফর্ম। একটি সমন্বিত প্রকল্পে অর্থায়নে একাধিক সম্ভাবনাময় প্রকল্পে স্বয়ংক্রিয় বন্টন, আধুনিক আইওটি মনিটরিং ও নিশ্চিত ফসল বীমাকৃত উচ্চ মুনাফা প্রদান।',
        footerSectorsTitle: 'সমন্বিত বিনিয়োগ খাতসমূহ',
        footerSectors: [
          '🌾 সিলেট ও সুনামগঞ্জ হাওর বোরো ধান প্রকল্প',
          '🐄 পাবনা ও চলনবিল উন্নত জাতের ডেইরি ফার্মিং',
          '🐟 চাঁদপুর ও সুরমা নদী অববাহিকা বৈজ্ঞানিক মৎস্য চাষ',
          '🥭 রাজশাহী আধুনিক বরেন্দ্র ফল ও মাল্টা বাগান',
          '🥦 বগুড়া নিয়ন্ত্রিত পরিবেশ বিষমুক্ত সবজি গ্রিনহাউস'
        ],
        footerNavTitle: 'প্রয়োজনীয় লিঙ্কসমূহ',
        footerNav: [
          { label: 'হোম পেজ', tab: 'landing' },
          { label: 'সমন্বিত প্রকল্পসমূহ', tab: 'projects' },
          { label: 'বিনিয়োগ পোর্টফোলিও', tab: 'portfolio' },
          { label: 'খামার পরিদর্শন ট্যুর 🚜', action: 'farmTour' },
          { label: 'সামাজিক প্রভাব ও উন্নয়ন 🌱', tab: 'impact' }
        ],
        footerContactTitle: 'যোগাযোগ ও সাপোর্ট',
        footerAddress: 'কারওয়ান বাজার বাণিজ্যিক এলাকা, ঢাকা-১২১৫, বাংলাদেশ',
        footerHotline: '📞 হেল্পলাইন: +৮৮০ ১৭১২-৩৪৫৬৭৮',
        footerEmail: '✉️ ইমেইল: support@agrofinance.bd',
        footerDedication: '🇧🇩 স্মার্ট বাংলাদেশ ও কৃষির আধুনিক রূপান্তরে নিবেদিত।'
      },
      en: {
        bannerSecurity: '🔒 256-BIT TLS END-TO-END ENCRYPTION ACTIVE',
        bannerInsured: '✓ 100% CAPITAL PROTECTED BY NATIONAL CROP INSURANCE',
        taglineAdmin: 'Enterprise Administration & Compliance Gateway',
        taglineUser: 'Smart Agri-Fintech & Direct Investment Platform',
        navHome: 'Home',
        navProjects: 'Integrated Projects',
        navPortfolio: 'Portfolio',
        navFarmTour: 'Farm Tours 🚜',
        navImpact: 'Social Impact 🌱',
        navAiAgent: 'AI Agro Agent 🤖',
        navDashboard: 'Dashboard',
        navAdmin: 'Admin Console',
        navViewPublic: 'View Public Site ↗',
        navLogin: 'Log in',
        navRegister: 'Investor Register',
        navSignOut: 'Sign Out',
        navProfile: 'Profile & KYC',
        walletBalance: 'Wallet Balance',
        balanceText: 'Balance',
        liveSiemActive: 'Live SIEM Active',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        security: 'Security Disclosure',
        certInfo: 'Insurance & Audit Certification',
        rights: '© 2026 AgroFinance BD Limited. All rights reserved.',
        staffPortal: 'Staff Portal',
        footerDesc: 'Bangladesh\'s premier institutional agricultural investment platform. Enabling secure ethical funding, satellite IoT farm monitoring, and 100% insured agricultural growth for rural and urban prosperity.',
        footerSectorsTitle: 'Integrated Investment Sectors',
        footerSectors: [
          '🌾 Sylhet Haor Basin High-Yield Boro Rice',
          '🐄 Pabna Modern High-Lactation Dairy Hub',
          '🐟 Chandpur & Surma River Biofloc Fisheries',
          '🥭 Rajshahi Export-Grade Commercial Mango Orchards',
          '🥦 Bogura Climate-Controlled Greenhouse Vegetables'
        ],
        footerNavTitle: 'Quick Navigation',
        footerNav: [
          { label: 'Home Page', tab: 'landing' },
          { label: 'Integrated Projects', tab: 'projects' },
          { label: 'Investment Portfolio', tab: 'portfolio' },
          { label: 'Farm Visits & Tours 🚜', action: 'farmTour' },
          { label: 'Social Impact & Farmers 🌱', tab: 'impact' }
        ],
        footerContactTitle: 'Headquarters & Support',
        footerAddress: 'Kawran Bazar Commercial Area, Dhaka-1215, Bangladesh',
        footerHotline: '📞 Hotline: +880 1712-345678',
        footerEmail: '✉️ Email: support@agrofinance.bd',
        footerDedication: '🇧🇩 Dedicated to advancing Smart Agriculture Vision in Bangladesh.'
      }
    };

    // Global API Dispatcher
    async function apiCall(endpoint, method = 'GET', data = null, token = null) {
      try {
        const cleanPath = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
        const url = cleanPath.startsWith('/api') ? cleanPath : '/api' + cleanPath;
        const headers = { 'Content-Type': 'application/json' };
        const activeToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('agro_token') : null);
        if (activeToken) headers['Authorization'] = 'Bearer ' + activeToken;
        
        const options = { method, headers };
        if (data && method !== 'GET') {
          options.body = JSON.stringify(data);
        }
        
        const res = await fetch(url, options);
        return await res.json();
      } catch (err) {
        console.error('API Call Error:', err);
        return { success: false, message: err.message || 'Network request failed' };
      }
    }

    const getCategoryBadge = (cat, lang = 'bn') => {
      const isBn = lang === 'bn';
      const map = {
        grain: { label: isBn ? 'ধান ও খাদ্যশস্য' : 'Paddy & Crops', icon: '🌾', color: 'bg-amber-100 text-amber-800 border-amber-300' },
        fishery: { label: isBn ? 'বৈজ্ঞানিক মৎস্য চাষ' : 'Scientific Fisheries', icon: '🐟', color: 'bg-blue-100 text-blue-800 border-blue-300' },
        fruit: { label: isBn ? 'রপ্তানি ফল বাগান' : 'Export Fruit Orchards', icon: '🥭', color: 'bg-orange-100 text-orange-800 border-orange-300' },
        vegetable: { label: isBn ? 'গ্রিনহাউস সবজি' : 'Greenhouse Vegetables', icon: '🥦', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
        livestock: { label: isBn ? 'পোল্ট্রি ও পশুসম্পদ' : 'Livestock & Feed', icon: '🐔', color: 'bg-rose-100 text-rose-800 border-rose-300' },
        dairy: { label: isBn ? 'আধুনিক ডেইরি হাব' : 'Modern Dairy Hub', icon: '🥛', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' }
      };
      return map[cat] || { label: isBn ? 'সমন্বিত কৃষি' : 'Integrated Agro', icon: '🌱', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    };

    const PROJECT_FALLBACK_IMAGES = {
      rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      grain: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      crops: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      paddy: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      fish: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      fishery: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      fisheries: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      hilsa: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      fruit: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      horticulture: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      vegetable: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
      greenhouse: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
      poultry: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      chicken: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      egg: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      livestock: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      shrimp: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
      dairy: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      cow: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      milk: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    };

    function getProjectImageUrl(img, category, title) {
      if (img && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:'))) {
        return img;
      }
      const needle = `${img || ''} ${category || ''} ${title || ''}`.toLowerCase();
      for (const [key, url] of Object.entries(PROJECT_FALLBACK_IMAGES)) {
        if (needle.includes(key)) return url;
      }
      return PROJECT_FALLBACK_IMAGES.default;
    }

    // ==========================================
    // NOTIFICATION CENTER VIEW COMPONENT
    // ==========================================
    function NotificationCenterView({ lang = 'bn', notifications = [], token, onRefresh, onNavigate, showToast }) {
      const isBn = lang === 'bn';
      const [filter, setFilter] = React.useState('all');
      const [search, setSearch] = React.useState('');

      const filtered = (notifications || []).filter(n => {
        if (filter === 'unread' && n.read) return false;
        if (filter === 'read' && !n.read) return false;
        if (filter === 'project' && n.type !== 'project' && n.type !== 'investment') return false;
        if (filter === 'announcement' && n.type !== 'announcement') return false;
        if (search) {
          const q = search.toLowerCase();
          return (n.title && n.title.toLowerCase().includes(q)) || (n.message && n.message.toLowerCase().includes(q));
        }
        return true;
      });

      const handleMarkAllRead = async () => {
        if (!token) return;
        try {
          const res = await apiCall('/api/notifications/read-all', 'PUT', {}, token);
          if (res.success) {
            if (onRefresh) onRefresh();
            showToast(isBn ? 'সকল বিজ্ঞপ্তি পঠিত হয়েছে।' : 'All notifications marked as read.');
          }
        } catch (e) {
          console.error(e);
        }
      };

      const handleMarkOne = async (id) => {
        try {
          await apiCall(`/api/notifications/${id}/read`, 'PUT', {}, token);
          if (onRefresh) onRefresh();
        } catch (e) {}
      };

      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
          {/* HEADER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isBn ? 'বিজ্ঞপ্তি ও বার্তা কেন্দ্র' : 'Notification Center & Alerts'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? 'আপনার বিনিয়োগ অনুমোদন, লভ্যাংশ বন্টন, কেওয়াইসি স্ট্যাটাস ও প্ল্যাটফর্ম নোটিশ'
                  : 'Real-time updates on investments, harvest payouts, KYC verifications, and announcements'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <span>✓</span>
                  <span>{isBn ? 'সব পঠিত করুন' : 'Mark All Read'}</span>
                </button>
              )}
            </div>
          </div>

          {/* FILTER & SEARCH */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto text-xs font-bold overflow-x-auto">
              {[
                { id: 'all', label: isBn ? `সকল (${notifications.length})` : `All (${notifications.length})` },
                { id: 'unread', label: isBn ? `অপঠিত (${notifications.filter(n => !n.read).length})` : `Unread (${notifications.filter(n => !n.read).length})` },
                { id: 'project', label: isBn ? 'প্রকল্প ও লাভ' : 'Investments' },
                { id: 'announcement', label: isBn ? 'ঘোষণা' : 'Announcements' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    filter === f.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder={isBn ? 'বিজ্ঞপ্তি খুঁজুন...' : 'Search notifications...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-4xl block">📭</span>
                <h3 className="font-bold text-slate-800 text-sm">
                  {isBn ? 'কোনো বিজ্ঞপ্তি পাওয়া যায়নি' : 'No notifications found'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isBn ? 'আপনার ফিল্টারের সাথে মিলে এমন কোনো নোটিফিকেশন নেই।' : 'No notifications match your current filter.'}
                </p>
              </div>
            ) : (
              filtered.map(n => {
                const isUnread = !n.read;
                return (
                  <div
                    key={n._id || n.id}
                    onClick={() => {
                      if (isUnread) handleMarkOne(n._id || n.id);
                      if (n.type === 'project' || n.type === 'investment') onNavigate('portfolio');
                      else if (n.type === 'kyc') onNavigate('profile');
                      else if (n.type === 'wallet') onNavigate('wallet');
                    }}
                    className={`p-5 rounded-3xl border transition cursor-pointer flex items-start gap-4 ${
                      isUnread
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
                      n.type === 'project' ? 'bg-amber-100 text-amber-800' :
                      n.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                      n.type === 'kyc' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {n.type === 'project' ? '🌾' : n.type === 'announcement' ? '📢' : n.type === 'kyc' ? '🪪' : '✨'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm">{n.title}</h4>
                          {isUnread && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                              {isBn ? 'নতুন' : 'NEW'}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {n.date || 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    // ==========================================
    // MAIN APP COMPONENT
    // ==========================================
    function App() {
      // Language State: 'bn' (Default Bangla) or 'en' (English)
      const [lang, setLang] = useState(() => {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem('agro_lang') || 'bn';
        }
        return 'bn';
      });

      const t = I18N[lang] || I18N.bn;

      const toggleLanguage = () => {
        const nextLang = lang === 'bn' ? 'en' : 'bn';
        setLang(nextLang);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('agro_lang', nextLang);
        }
      };

      // Navigation & User State
      const [activeTab, setActiveTab] = useState('landing');
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(() => (typeof localStorage !== 'undefined' ? localStorage.getItem('agro_token') : '') || '');
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      
      // Data State
      const [projects, setProjects] = useState([]);
      const [investments, setInvestments] = useState([]);
      const [transactions, setTransactions] = useState([]);
      const [marketPrices, setMarketPrices] = useState([]);
      const [notifications, setNotifications] = useState([]);
      const [adminStats, setAdminStats] = useState(null);
      const [securityData, setSecurityData] = useState(null);

      // Modals & Drawers
      const [authModalOpen, setAuthModalOpen] = useState(false);
      const [adminGatewayOpen, setAdminGatewayOpen] = useState(
        typeof window !== 'undefined' && (
          ['#admin-gateway', '#admin-portal', '#admin-login', '#admin'].includes((window.location.hash || '').toLowerCase()) ||
          (window.location.pathname || '').toLowerCase().startsWith('/admin')
        )
      );
      const [authMode, setAuthMode] = useState('login');
      const [verifyEmailTarget, setVerifyEmailTarget] = useState('');
      const [investModalProject, setInvestModalProject] = useState(null);
      const [depositModalOpen, setDepositModalOpen] = useState(false);
      const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
      const [certificateModalInv, setCertificateModalInv] = useState(null);
      const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
      const [farmDetailModal, setFarmDetailModal] = useState(null);
      const [chatAdvisorOpen, setChatAdvisorOpen] = useState(false);
      const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
      const [farmTourModalOpen, setFarmTourModalOpen] = useState(false);
      const [selectedTourFarm, setSelectedTourFarm] = useState('');
      const [legalModalPolicy, setLegalModalPolicy] = useState(null);
      const [toastMsg, setToastMsg] = useState(null);

      const handleOpenFarmTour = (farmName = '') => {
        setSelectedTourFarm(typeof farmName === 'string' ? farmName : '');
        setFarmTourModalOpen(true);
      };

      const showToast = (msg, type = 'success') => {
        setToastMsg({ text: msg, type });
        setTimeout(() => setToastMsg(null), 3500);
      };

      // API Loaders
      const loadUser = async (authToken = token) => {
        if (!authToken) {
          setUser(null);
          return;
        }
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            const h = (window.location.hash || '').toLowerCase();
            const p = (window.location.pathname || '').toLowerCase();
            const isAdminRoute = ['#admin-gateway', '#admin-portal', '#admin-login', '#admin'].includes(h) || p === '/admin' || p.startsWith('/admin/');
            if (data.user?.role === 'admin' && (isAdminRoute || activeTab === 'landing')) {
              setActiveTab('admin');
              setAdminGatewayOpen(false);
            }
          } else {
            setUser(null);
            localStorage.removeItem('agro_token');
            setToken('');
          }
        } catch (err) {
          console.error(err);
        }
      };

      const loadProjects = async () => {
        try {
          const res = await fetch(`${API_BASE}/projects`);
          const data = await res.json();
          if (data.success) setProjects(data.data);
        } catch (err) {
          console.error(err);
        }
      };

      const loadInvestments = async () => {
        if (!token) return;
        try {
          const res = await fetch(`${API_BASE}/investments/my`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setInvestments(data.data);
        } catch (err) {
          console.error(err);
        }
      };

      const loadTransactions = async () => {
        if (!token) return;
        try {
          const res = await fetch(`${API_BASE}/wallet/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setTransactions(data.data);
        } catch (err) {
          console.error(err);
        }
      };

      const loadMarket = async () => {
        try {
          const res = await fetch(`${API_BASE}/market`);
          const data = await res.json();
          if (data.success) setMarketPrices(data.data);
        } catch (err) {
          console.error(err);
        }
      };

      const loadNotifications = async () => {
        if (!token) return;
        try {
          const res = await fetch(`${API_BASE}/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setNotifications(data.data);
        } catch (err) {
          console.error(err);
        }
      };

      const handleMarkAllRead = async () => {
        if (!token) return;
        try {
          await apiCall('/api/notifications/read-all', 'PUT', {}, token);
          loadNotifications();
          showToast(lang === 'bn' ? 'সকল বিজ্ঞপ্তি পঠিত হয়েছে।' : 'All notifications marked as read.');
        } catch (e) {
          console.error(e);
        }
      };

      const handleNotificationClick = async (n) => {
        try {
          if (!n.read) {
            await apiCall(`/api/notifications/${n._id || n.id}/read`, 'PUT', {}, token);
            loadNotifications();
          }
        } catch (e) {}
        setNotifDropdownOpen(false);
        if (n.type === 'project' || n.type === 'investment') {
          setActiveTab('portfolio');
        } else if (n.type === 'kyc') {
          setActiveTab('profile');
        } else if (n.type === 'wallet' || n.type === 'payout') {
          setActiveTab('wallet');
        } else {
          setActiveTab('notifications');
        }
      };

      const loadSecurityAndAdmin = async () => {
        if (!token) return;
        try {
          const [secRes, statsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/security`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
          ]);
          const secData = await secRes.json();
          const statsData = await statsRes.json();
          if (secData.success) setSecurityData(secData);
          if (statsData.success) setAdminStats(statsData.stats || statsData.data || statsData);
        } catch (err) {
          console.error(err);
        }
      };

      // Lifecycle Initializers
      useEffect(() => {
        document.documentElement.lang = lang;
      }, [lang]);

      useEffect(() => {
        loadProjects();
        loadMarket();
      }, []);

      useEffect(() => {
        if (token) {
          loadUser(token);
          loadInvestments();
          loadTransactions();
          loadNotifications();
        } else {
          setUser(null);
          setInvestments([]);
          setTransactions([]);
        }
      }, [token]);

      useEffect(() => {
        if (user?.role === 'admin') {
          loadSecurityAndAdmin();
        }
      }, [user]);

      // Listen for #admin-gateway hash changes or /admin route
      useEffect(() => {
        const checkAdminHash = () => {
          const h = (window.location.hash || '').toLowerCase();
          const p = (window.location.pathname || '').toLowerCase();
          const isAdminRoute = ['#admin-gateway', '#admin-portal', '#admin-login', '#admin'].includes(h) || p === '/admin' || p.startsWith('/admin/');
          if (isAdminRoute) {
            if (user?.role === 'admin') {
              setActiveTab('admin');
              setAdminGatewayOpen(false);
            } else {
              setAdminGatewayOpen(true);
            }
          }
        };
        checkAdminHash();
        window.addEventListener('hashchange', checkAdminHash);
        return () => window.removeEventListener('hashchange', checkAdminHash);
      }, [user]);

      const handleLogout = () => {
        localStorage.removeItem('agro_token');
        setToken('');
        setUser(null);
        setActiveTab('landing');
        showToast(lang === 'bn' ? 'সফলভাবে লগআউট হয়েছে।' : 'Signed out successfully.');
      };

      const totalInvested = useMemo(() => {
        return investments
          .filter(i => i.status === 'active' || i.status === 'completed')
          .reduce((sum, i) => sum + (Number(i.investedAmount) || 0), 0);
      }, [investments]);

      const totalReturns = useMemo(() => {
        return investments.reduce((sum, i) => sum + (Number(i.totalReturnReceived) || 0), 0);
      }, [investments]);

      return (
        <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white ${lang === 'bn' ? 'font-bengali' : ''}`} lang={lang}>
          
          {/* Toast Notification */}
          {toastMsg && (
            <div className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all duration-300 animate-bounce ${
              toastMsg.type === 'error' ? 'bg-rose-950 text-white border-rose-500' : 'bg-slate-900 text-white border-emerald-500'
            }`}>
              <span className="text-xl">{toastMsg.type === 'error' ? '⚠️' : '🌿'}</span>
              <span className="font-bold text-sm">{toastMsg.text}</span>
            </div>
          )}

          {/* TOP ANNOUNCEMENT BANNER */}
          <div className="bg-slate-950 text-emerald-400 text-[11px] font-bold py-1.5 px-4 text-center border-b border-emerald-950/40 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.bannerSecurity}</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-amber-300">{t.bannerInsured}</span>
          </div>

          {/* MAIN NAVBAR */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
              
              {/* Brand Logo */}
              <div
                className="flex items-center gap-2.5 cursor-pointer shrink-0"
                onClick={() => setActiveTab(user?.role === 'admin' ? 'admin' : 'landing')}
              >
                <div className="w-10 h-10 rounded-2xl gradient-agro flex items-center justify-center text-xl shadow-md text-white font-bold shrink-0">
                  🌾
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight text-slate-900 leading-none">
                    AgroFinance <span className="text-emerald-600">BD</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 tracking-wider">
                    {user?.role === 'admin' ? t.taglineAdmin : t.taglineUser}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {user?.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('admin')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition flex items-center gap-1.5 ${
                        activeTab === 'admin'
                          ? 'gradient-agro text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 border border-slate-200 bg-white'
                      }`}
                    >
                      <span>🛡️</span>
                      <span>{t.navAdmin}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        activeTab === 'projects'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-black'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>🌾</span>
                      <span>{t.navProjects}</span>
                      <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-emerald-600 text-white rounded-full">{projects.length}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('landing')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        activeTab === 'landing'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-black'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                      title={t.navViewPublic}
                    >
                      <span>🌐</span>
                      <span>{t.navViewPublic}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('landing')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'landing' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      {t.navHome}
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${activeTab === 'projects' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <span>{t.navProjects}</span>
                      <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-emerald-600 text-white rounded-full">{projects.length}</span>
                    </button>
                    {user && (
                      <>
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                        >
                          {t.navDashboard}
                        </button>
                        <button
                          onClick={() => setActiveTab('portfolio')}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'portfolio' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                        >
                          {t.navPortfolio}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleOpenFarmTour()}
                      className="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                      title={lang === 'bn' ? 'খামার পরিদর্শন বুকিং' : 'Schedule Farm Tour'}
                    >
                      <span>🚜</span>
                      <span>{lang === 'bn' ? 'খামার পরিদর্শন' : 'Farm Tours'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('impact')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'impact' ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      {t.navImpact}
                    </button>
                  </>
                )}
              </nav>

              {/* Actions, Language Switcher & Profile */}
              <div className="flex items-center gap-2 shrink-0">
                
                {/* DUAL LANGUAGE TOGGLE BUTTON */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-2xs shrink-0"
                  title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
                >
                  <span className="text-sm">{lang === 'bn' ? '🇬🇧' : '🇧🇩'}</span>
                  <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
                </button>

                {user ? (
                  <div className="flex items-center gap-2">
                    {/* Investor Wallet Badge */}
                    {user.role !== 'admin' && (
                      <div
                        onClick={() => setActiveTab('wallet')}
                        className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition shadow-2xs shrink-0"
                        title={t.walletBalance}
                      >
                        <span className="text-sm">👛</span>
                        <span className="text-xs font-black">{formatBDT(user.walletBalance, lang)}</span>
                      </div>
                    )}

                    {/* Admin Status Pill */}
                    {user.role === 'admin' && (
                      <div
                        onClick={() => setActiveTab('admin')}
                        className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white border border-slate-800 text-xs shadow-2xs shrink-0"
                      >
                        <span className={`w-2 h-2 rounded-full ${securityData?.hasActiveAttack ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                        <span className="font-mono text-[10px] font-black uppercase text-emerald-400">
                          {securityData?.hasActiveAttack ? 'ALERT' : t.liveSiemActive}
                        </span>
                      </div>
                    )}

                    {/* Notifications Button with Dropdown Container */}
                    <div className="relative">
                      <button
                        onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                        className={`relative p-2 rounded-full border transition ${
                          notifDropdownOpen
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                        title={lang === 'bn' ? "বিজ্ঞপ্তি সমূহ" : "Notifications"}
                      >
                        <span className="text-base">🔔</span>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                            {notifications.filter(n => !n.read).length}
                          </span>
                        )}
                      </button>

                      {/* NOTIFICATION DROPDOWN OVERLAY */}
                      {notifDropdownOpen && (
                        <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in text-slate-800">
                          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                              <span>🔔</span>
                              <span>{lang === 'bn' ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications'}</span>
                              {notifications.filter(n => !n.read).length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono">
                                  {notifications.filter(n => !n.read).length}
                                </span>
                              )}
                            </div>
                            {notifications.filter(n => !n.read).length > 0 && (
                              <button
                                onClick={handleMarkAllRead}
                                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                              >
                                {lang === 'bn' ? 'সব পঠিত করুন' : 'Mark all read'}
                              </button>
                            )}
                          </div>

                          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-slate-400">
                                {lang === 'bn' ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No notifications'}
                              </div>
                            ) : (
                              notifications.map(n => (
                                <div
                                  key={n._id || n.id}
                                  onClick={() => handleNotificationClick(n)}
                                  className={`p-3 hover:bg-slate-50 cursor-pointer transition flex items-start gap-2.5 ${!n.read ? 'bg-emerald-50/50' : ''}`}
                                >
                                  <span className="text-base shrink-0 mt-0.5">
                                    {n.type === 'project' ? '🌾' : n.type === 'announcement' ? '📢' : n.type === 'kyc' ? '🪪' : '✨'}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                      <div className="font-bold text-slate-900 truncate text-[11px]">{n.title}</div>
                                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                                    <span className="text-[9px] text-slate-400 mt-1 block font-mono">{n.date || 'Recent'}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                            <button
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                setActiveTab('notifications');
                              }}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                              {lang === 'bn' ? 'সব নোটিফিকেশন দেখুন →' : 'View All Notifications →'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* User Profile Pill */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                      <div
                        onClick={() => setActiveTab(user.role === 'admin' ? 'admin' : 'profile')}
                        className="cursor-pointer flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
                        title={lang === 'bn' ? 'প্রোফাইল ও কেওয়াইসি' : 'Profile & KYC'}
                      >
                        <div className={`w-8 h-8 rounded-full text-white font-black flex items-center justify-center text-xs shadow-xs ${
                          user.role === 'admin' ? 'bg-slate-900 border border-slate-700' : 'gradient-agro'
                        }`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="hidden xl:block text-left">
                          <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user.name}</div>
                          <div className="text-[9px] text-slate-500 font-semibold">
                            {user.role === 'admin' ? 'Administrator' : (user.kycStatus === 'verified' ? (lang === 'bn' ? 'ভেরিফাইড' : 'Verified') : (lang === 'bn' ? 'বিনিয়োগকারী' : 'Investor'))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title={t.navSignOut}
                      >
                        🚪
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setAuthModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                    >
                      {t.navLogin}
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setAuthModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-black gradient-agro text-white shadow-xs hover:brightness-110 active:scale-95 transition"
                    >
                      {t.navRegister}
                    </button>
                  </div>
                )}

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700"
                >
                  ☰
                </button>
              </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 text-xs">
                {user?.role === 'admin' ? (
                  <>
                    <button
                      onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-black bg-slate-900 text-white flex items-center gap-2"
                    >
                      <span>🛡️</span>
                      <span>{t.navAdmin}</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {t.navProjects} ({projects.length})
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {t.navHome}
                    </button>
                    <button
                      onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {t.navProjects} ({projects.length})
                    </button>
                    <button
                      onClick={() => { handleOpenFarmTour(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/50 flex items-center gap-2"
                    >
                      <span>🚜</span>
                      <span>{lang === 'bn' ? 'খামার পরিদর্শন বুকিং' : 'Schedule Farm Tour'}</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('impact'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                    >
                      {t.navImpact}
                    </button>
                    {user && (
                      <button
                        onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <span>👤</span>
                        <span>{t.navProfile}</span>
                      </button>
                    )}
                    {user && (
                      <button
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <span>🚪</span>
                        <span>{t.navSignOut}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </header>

          {/* MAIN APPLICATION ROUTING */}
          <main className="flex-1">
            {activeTab === 'landing' && (
              <LandingView
                lang={lang}
                projects={projects}
                user={user}
                onSelectProject={(p) => {
                  if (!user) setAuthModalOpen(true);
                  else setInvestModalProject(p);
                }}
                onExplore={() => setActiveTab('projects')}
                onOpenFarmDetail={(p) => setFarmDetailModal(p)}
                onOpenRegister={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                onOpenAiAdvisor={() => setChatAdvisorOpen(true)}
                onOpenFarmTour={handleOpenFarmTour}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsView
                lang={lang}
                projects={projects}
                onInvest={(p) => {
                  if (!user) setAuthModalOpen(true);
                  else setInvestModalProject(p);
                }}
                onOpenFarmDetail={(p) => setFarmDetailModal(p)}
                onOpenFarmTour={handleOpenFarmTour}
              />
            )}

            {activeTab === 'ai-agent' && (
              <AiAgentFullView
                lang={lang}
                projects={projects}
                onInvest={(p) => {
                  if (!user) setAuthModalOpen(true);
                  else setInvestModalProject(p);
                }}
              />
            )}

            {activeTab === 'dashboard' && user && (
              <DashboardView
                lang={lang}
                user={user}
                investments={investments}
                totalInvested={totalInvested}
                totalReturns={totalReturns}
                projects={projects}
                notifications={notifications}
                onOpenVerifyEmail={() => {
                  setVerifyEmailTarget(user.email);
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                onNavigate={setActiveTab}
                onInvestClick={() => setActiveTab('projects')}
                onDepositClick={() => setDepositModalOpen(true)}
                onWithdrawClick={() => setWithdrawModalOpen(true)}
                onOpenFarmTour={handleOpenFarmTour}
              />
            )}

            {activeTab === 'portfolio' && user && (
              <PortfolioView
                lang={lang}
                user={user}
                investments={investments}
                projects={projects}
                token={token}
                onViewCertificate={(inv) => setCertificateModalInv(inv)}
                onExploreProjects={() => setActiveTab('projects')}
                showToast={showToast}
                onUserUpdate={loadUser}
              />
            )}

            {activeTab === 'wallet' && user && (
              <WalletView
                lang={lang}
                user={user}
                transactions={transactions}
                onDepositClick={() => setDepositModalOpen(true)}
                onWithdrawClick={() => setWithdrawModalOpen(true)}
              />
            )}

            {activeTab === 'impact' && (
              <ImpactView
                lang={lang}
                projects={projects}
                onExplore={() => setActiveTab('projects')}
              />
            )}

            {activeTab === 'profile' && user && (
              <ProfileView
                lang={lang}
                user={user}
                notifications={notifications}
                onUserUpdate={loadUser}
                showToast={showToast}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationCenterView
                lang={lang}
                notifications={notifications}
                token={token}
                onRefresh={loadNotifications}
                onNavigate={setActiveTab}
                showToast={showToast}
              />
            )}

            {activeTab === 'admin' && (
              <AdminView
                lang={lang}
                stats={adminStats}
                projects={projects}
                securityData={securityData}
                onRefreshProjects={loadProjects}
                onRefreshSecurity={loadSecurityAndAdmin}
                onNewProject={() => setNewProjectModalOpen(true)}
                showToast={showToast}
              />
            )}
          </main>

          {/* FLOATING ACTION BUTTON (AI AGRO ADVISOR) */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setChatAdvisorOpen(!chatAdvisorOpen)}
              className="p-4 rounded-3xl gradient-agro text-white shadow-2xl flex items-center gap-3 border-2 border-emerald-300 hover:scale-105 active:scale-95 transition group"
              title={lang === 'bn' ? 'এআই এগ্রো উপদেষ্টা' : 'AI Agro Advisor'}
            >
              <span className="text-2xl animate-bounce">🤖</span>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                  {lang === 'bn' ? 'সার্বক্ষণিক সহায়তা' : 'Live Intelligence'}
                </div>
                <div className="text-xs font-black">
                  {lang === 'bn' ? 'এআই এগ্রো উপদেষ্টা' : 'AI Agro Advisor'}
                </div>
              </div>
            </button>
          </div>

          {/* FLOATING CHAT ADVISOR MODAL */}
          {chatAdvisorOpen && (
            <ChatAdvisorModal
              lang={lang}
              onClose={() => setChatAdvisorOpen(false)}
              onSelectProject={(p) => {
                setChatAdvisorOpen(false);
                if (!user) {
                  setAuthModalOpen(true);
                } else {
                  setInvestModalProject(p);
                }
              }}
              projects={projects}
            />
          )}

          {/* FOOTER */}
          <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌾</span>
                    <span className="text-2xl font-black text-white">AgroFinance <span className="text-emerald-500">BD</span></span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {t.footerDesc}
                  </p>
                </div>

                <div>
                  <h4 className={`text-sm font-black text-white mb-4 ${lang === 'bn' ? 'tracking-normal' : 'uppercase tracking-wider'}`}>{t.footerSectorsTitle}</h4>
                  <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
                    {t.footerSectors.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`text-sm font-black text-white mb-4 ${lang === 'bn' ? 'tracking-normal' : 'uppercase tracking-wider'}`}>{t.footerNavTitle}</h4>
                  <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
                    {t.footerNav.map((item, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.action === 'farmTour') handleOpenFarmTour();
                            else if (item.tab) {
                              if (item.tab === 'portfolio' && !user) setAuthModalOpen(true);
                              else setActiveTab(item.tab);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className="hover:text-emerald-400 transition"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`text-sm font-black text-white mb-4 ${lang === 'bn' ? 'tracking-normal' : 'uppercase tracking-wider'}`}>{t.footerContactTitle}</h4>
                  <p className="text-sm text-slate-400 mb-2 font-medium">
                    {t.footerAddress}
                  </p>
                  <p className="text-sm text-slate-400 mb-1">{t.footerHotline}</p>
                  <p className="text-sm text-slate-400 mb-4">{t.footerEmail}</p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300">
                    {t.footerDedication}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                <div className="flex items-center gap-3">
                  <span>{t.rights}</span>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 font-semibold">
                  <button
                    onClick={() => setLegalModalPolicy('terms')}
                    className="hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    {t.terms}
                  </button>
                  <button
                    onClick={() => setLegalModalPolicy('privacy')}
                    className="hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    {t.privacy}
                  </button>
                  <button
                    onClick={() => setLegalModalPolicy('security')}
                    className="hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    {t.security}
                  </button>
                  <button
                    onClick={() => setLegalModalPolicy('insurance')}
                    className="hover:text-emerald-400 transition cursor-pointer text-left"
                  >
                    {t.certInfo}
                  </button>
                </div>
              </div>
            </div>
          </footer>

          {/* MODALS */}
          {authModalOpen && (
            <AuthModal
              lang={lang}
              mode={authMode}
              setMode={setAuthMode}
              initialVerifyEmail={verifyEmailTarget}
              onClose={() => {
                setAuthModalOpen(false);
                setVerifyEmailTarget('');
              }}
              onOpenAdminGateway={() => {
                setAuthModalOpen(false);
                setAdminGatewayOpen(true);
              }}
              onSuccess={(userData, userToken) => {
                setUser(userData);
                setToken(userToken);
                localStorage.setItem('agro_token', userToken);
                setAuthModalOpen(false);
                if (userData.role === 'admin') {
                  setActiveTab('admin');
                  showToast(lang === 'bn' ? `স্বাগতম অ্যাডমিন, ${userData.name}!` : `Welcome Administrator, ${userData.name}!`);
                } else {
                  showToast(lang === 'bn' ? `স্বাগতম, ${userData.name}! আপনার একাউন্ট সক্রিয় হয়েছে।` : `Welcome, ${userData.name}! Account activated.`);
                  setActiveTab('dashboard');
                }
              }}
            />
          )}

          {adminGatewayOpen && (
            <AdminGatewayModal
              lang={lang}
              onClose={() => {
                setAdminGatewayOpen(false);
                if (typeof window !== 'undefined' && window.location.hash) {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
              }}
              onSuccess={(adminUser, adminToken) => {
                setUser(adminUser);
                setToken(adminToken);
                localStorage.setItem('agro_token', adminToken);
                setAdminGatewayOpen(false);
                if (typeof window !== 'undefined' && window.location.hash) {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                setActiveTab('admin');
                showToast(lang === 'bn' ? 'অ্যাডমিনিস্ট্রেটর পোর্টাল আনলক হয়েছে।' : 'Administrator console unlocked.');
              }}
            />
          )}

          {investModalProject && (
            <InvestmentModal
              lang={lang}
              project={investModalProject}
              user={user}
              token={token}
              onClose={() => setInvestModalProject(null)}
              onSuccess={(newInv) => {
                setInvestModalProject(null);
                setInvestments(prev => [newInv, ...prev]);
                showToast(lang === 'bn' ? 'বিনিয়োগ সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদনের পর সক্রিয় হবে।' : 'Investment request placed successfully!');
                setActiveTab('portfolio');
                loadUser();
              }}
            />
          )}

          {depositModalOpen && (
            <DepositModal
              lang={lang}
              user={user}
              token={token}
              onClose={() => setDepositModalOpen(false)}
              onSuccess={() => {
                setDepositModalOpen(false);
                loadUser();
                loadTransactions();
                showToast(lang === 'bn' ? 'টাকা সফলভাবে জমা হয়েছে!' : 'Funds deposited successfully!');
              }}
            />
          )}

          {withdrawModalOpen && (
            <WithdrawModal
              lang={lang}
              user={user}
              token={token}
              onClose={() => setWithdrawModalOpen(false)}
              onSuccess={() => {
                setWithdrawModalOpen(false);
                loadUser();
                loadTransactions();
                showToast(lang === 'bn' ? 'উত্তোলন অনুরোধ সফলভাবে পাঠানো হয়েছে!' : 'Withdrawal request submitted!');
              }}
            />
          )}

          {certificateModalInv && (
            <DigitalCertificateModal
              lang={lang}
              investment={certificateModalInv}
              onClose={() => setCertificateModalInv(null)}
            />
          )}

          {newProjectModalOpen && (
            <NewProjectModal
              lang={lang}
              token={token}
              onClose={() => setNewProjectModalOpen(false)}
              onSuccess={() => {
                setNewProjectModalOpen(false);
                loadProjects();
                showToast(lang === 'bn' ? 'নতুন কৃষি প্রকল্প সফলভাবে তৈরি হয়েছে!' : 'New project published successfully!');
              }}
            />
          )}

          {farmDetailModal && (
            <FarmDetailModal
              lang={lang}
              project={farmDetailModal}
              onClose={() => setFarmDetailModal(null)}
              onInvest={() => {
                const target = farmDetailModal;
                setFarmDetailModal(null);
                if (!user) {
                  setAuthModalOpen(true);
                } else {
                  setInvestModalProject(target);
                }
              }}
            />
          )}

          {farmTourModalOpen && (
            <FarmTourBookingModal
              lang={lang}
              user={user}
              initialFarm={selectedTourFarm}
              onClose={() => setFarmTourModalOpen(false)}
              showToast={showToast}
            />
          )}

          {legalModalPolicy && (
            <LegalPolicyModal
              lang={lang}
              initialTab={legalModalPolicy}
              onClose={() => setLegalModalPolicy(null)}
            />
          )}

        </div>
      );
    }
