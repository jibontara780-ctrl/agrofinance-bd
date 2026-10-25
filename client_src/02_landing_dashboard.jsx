    // ==========================================
    // 2. LANDING & DASHBOARD VIEW COMPONENT
    // ==========================================
    function LandingView({ lang = 'bn', projects, user, onSelectProject, onExplore, onOpenFarmDetail, onOpenRegister, onOpenAiAdvisor, onOpenFarmTour }) {
      const isBn = lang === 'bn';
      const [activeFaq, setActiveFaq] = React.useState(null);

      // Featured Integrated Project Spotlight
      const spotlightProject = projects && projects.length > 0 ? projects[0] : {
        _id: 'proj_001',
        title: 'Green Valley Integrated Agro Mega Farm - Sylhet',
        banglaTitle: 'গ্রীন ভ্যালি সমন্বিত মেগা কৃষি প্রকল্প - সিলেট',
        category: 'grain',
        expectedReturn: 24,
        duration: 6,
        durationUnit: isBn ? 'মাস' : 'months',
        minInvestment: 50000,
        totalFunding: 6000000,
        raisedAmount: 4500000,
        farmArea: isBn ? '৭৫ একর সমন্বিত খামার' : '75 Acres Integrated Farm',
        location: isBn ? 'সুনামগঞ্জ ও সিলেট অববাহিকা' : 'Sunamganj & Sylhet',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        prokolpos: [
          { id: 'p1', name: 'Boro Rice Cultivation', banglaName: 'বোরো ধান চাষ ও প্রসেসিং', allocationPercentage: 40, icon: '🌾' },
          { id: 'p2', name: 'Modern Dairy Farming', banglaName: 'আধুনিক ডেইরি খামার', allocationPercentage: 25, icon: '🐄' },
          { id: 'p3', name: 'Biofloc Aquaculture', banglaName: 'বায়োফ্লক মৎস্য চাষ', allocationPercentage: 20, icon: '🐟' },
          { id: 'p4', name: 'Greenhouse Vegetables', banglaName: 'গ্রিনহাউস সবজি বাগান', allocationPercentage: 15, icon: '🥦' }
        ]
      };

      const spotlightPct = Math.min(100, Math.round(((spotlightProject.raisedAmount || 0) / (spotlightProject.totalFunding || 1)) * 100));

      const faqs = isBn ? [
        {
          q: 'AgroFinance BD-তে একটি প্রকল্পে বিনিয়োগ করলে অর্থ কীভাবে বিভিন্ন প্রকল্পে ভাগ হয়?',
          a: 'বিনিয়োগকারীদের আলাদা আলাদা ক্ষুদ্র প্রকল্পে ঝুঁকি নিতে হয় না। আপনি যখন একটি সমন্বিত মেগা কৃষি প্রকল্পে বিনিয়োগ করেন, আপনার অর্থ স্বয়ংক্রিয়ভাবে ৪টি নির্ধারিত লাভজনক খাতে (যেমন: ধান চাষ ৪০%, ডেইরি খামার ২৫%, মৎস্য প্রকল্প ২০% এবং সবজি বাগান ১৫%) বন্টন হয়। ফলে একটি খাতে প্রতিকূল আবহাওয়া থাকলেও অন্য খাতের উচ্চ লাভে আপনার পুরো বিনিয়োগ সুরক্ষিত থাকে।'
        },
        {
          q: 'প্রাকৃতিক দুর্যোগ বা ফসলের ক্ষয়ক্ষতি থেকে বিনিয়োগের সুরক্ষা কীভাবে নিশ্চিত করা হয়?',
          a: 'আমাদের প্রতিটি প্রকল্পের অন্তর্ভুক্ত প্রতিটি খামারে সাধারণ বীমা কর্পোরেশন ও গ্রীন ডেল্টা কর্তৃক অনুমোদিত জাতীয় ফসল ও প্রাণিসম্পদ বীমা পলিসি কার্যকর রয়েছে। বন্যা, খরা বা শিলাবৃষ্টির মতো প্রাকৃতিক দুর্যোগে বীমা কভারেজের মাধ্যমে মূলধন রক্ষা করা হয়।'
        },
        {
          q: 'বিনিয়োগের লভ্যাংশ ও মূলধন কীভাবে এবং কখন ফেরত পাওয়া যাবে?',
          a: 'ফসলের মৌসুম সম্পন্ন ও পাইকারি আড়তে বিক্রয়ের সাথে সাথে আপনার বিনিয়োগকৃত মূলধন এবং অর্জিত মোট মুনাফা সরাসরি আপনার প্ল্যাটফর্ম ওয়ালেটে জমা হয়। সেখান থেকে আপনি কোনো ধরনের ফি ছাড়াই সরাসরি আপনার ব্যাংক অ্যাকাউন্ট অথবা বিকাশ/নগদে ক্যাশ-আউট করতে পারবেন।'
        },
        {
          q: 'প্রবাসীরা (NRB) বা দেশের বাইরের যেকোনো স্থান থেকে কি বিনিয়োগ করা সম্ভব?',
          a: 'হ্যাঁ, বিশ্বের যেকোনো প্রান্ত থেকে প্রবাসীরা সরাসরি ভিসা/মাস্টারকার্ড অথবা রেমিট্যান্স চ্যানেলের মাধ্যমে বিনিয়োগ করতে পারেন। ড্যাশবোর্ডে সার্বক্ষণিক স্যাটেলাইট ও ড্রোন ইমেজ আপডেট দেখা যায় এবং মুনাফা সরাসরি ঢাকার ব্যাংক একাউন্টে পাঠানো হয়।'
        }
      ] : [
        {
          q: 'How does capital get distributed across multiple projects in a single investment?',
          a: 'Investors do not need to take fragmented risks in standalone micro-projects. When you invest in a Master Integrated Agro Project, your capital is automatically diversified across balanced production units (e.g., Rice 40%, Modern Dairy 25%, Fishery 20%, Greenhouse Vegetables 15%). This ensures that weather volatility in one crop is balanced by strong yields in others.'
        },
        {
          q: 'What safeguards protect investor capital against bad weather or disease?',
          a: 'Every farming cycle is underwritten by national crop and livestock insurance through licensed partners in Bangladesh (Sadharan Bima Corporation). In addition, agronomists use real-time IoT sensors and scheduled agronomist field audits to prevent losses early.'
        },
        {
          q: 'How and when do I receive my profits and capital payout?',
          a: 'Upon harvest maturity and wholesale commodity liquidation, your original principal along with your earned profit are credited directly to your digital wallet. You can instantly withdraw to any Bangladeshi bank account or bKash/Nagad with zero withdrawal fees.'
        },
        {
          q: 'Can Non-Resident Bangladeshis (NRBs) or overseas investors participate?',
          a: 'Yes! AgroFinance BD supports international bank transfers and cards. NRB investors can monitor field progress remotely via drone photo surveys and receive their returns directly into their designated bank account in Bangladesh.'
        }
      ];

      const testimonials = isBn ? [
        {
          name: 'ইঞ্জিনিয়ার তরিকুল ইসলাম',
          role: 'প্রিন্সিপাল সফটওয়্যার আর্কিটেক্ট, ঢাকা',
          quote: 'একটি প্রকল্পে বিনিয়োগ করতেই দেখলাম আমার টাকা ধান, ডেইরি আর মৎস্য খামারে ভাগ হয়ে কাজ করছে। এই বৈচিত্র্যময় বন্টন ব্যবস্থার কারণে ঝুঁকি একদম নেই বললেই চলে।',
          rating: '★★★★★',
          avatar: '👨‍💼'
        },
        {
          name: 'ড. নাসরিন সুলতানা',
          role: 'সহযোগী অধ্যাপক, চট্টগ্রাম বিশ্ববিদ্যালয়',
          quote: 'কৃষি অর্থনীতিতে এমন প্রাতিষ্ঠানিক স্বচ্ছতা আগে দেখিনি। সাধারণ বীমার ফসল সুরক্ষা এবং সময়মতো মাসিক লভ্যাংশ পাওয়ায় আমি নিয়মিত বিনিয়োগ করছি।',
          rating: '★★★★★',
          avatar: '👩‍⚕️'
        },
        {
          name: 'ফরিদুল হক',
          role: 'বাণিজ্যিক পরামর্শক, দুবাই (প্রবাসী)',
          quote: 'দুবাই থেকে খুব সহজেই বিনিয়োগ করেছি। প্রতি সপ্তাহে খামারের স্যাটেলাইট আপডেট ও এআই এজেন্টের নিখুঁত পরামর্শ আমাকে দারুণ আশ্বস্ত করেছে।',
          rating: '★★★★★',
          avatar: '✈️'
        }
      ] : [
        {
          name: 'Engr. Tariqul Islam',
          role: 'Principal Software Architect, Dhaka',
          quote: 'AgroFinance BD has completely transformed agro-investing. By allocating my single investment across rice, dairy, and fisheries, risk is minimized and returns are outstanding.',
          rating: '★★★★★',
          avatar: '👨‍💼'
        },
        {
          name: 'Dr. Nasreen Sultana',
          role: 'Associate Professor, Chittagong',
          quote: 'Institutional transparency, national crop insurance coverage, and prompt monthly payouts right into my bank account have made this my best performing investment.',
          rating: '★★★★★',
          avatar: '👩‍⚕️'
        },
        {
          name: 'Faridul Haque',
          role: 'Commercial Consultant, Dubai (NRB)',
          quote: 'Investing from the UAE was completely seamless. The AI Advisor answered all my ROI queries and harvest payouts arrived directly in my Dhaka bank account.',
          rating: '★★★★★',
          avatar: '✈️'
        }
      ];

      return (
        <div className="space-y-24 animate-fade-in w-full max-w-full overflow-x-hidden">
          
          {/* HERO SECTION */}
          <section className="relative overflow-hidden pt-12 pb-24 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white rounded-b-[2.5rem] shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* HERO COPY */}
                <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{isBn ? '🌾 ১টি প্রকল্পে বিনিয়োগেই বহু-খাতে অর্থ বন্টন' : '🌾 One Investment • Multi-Sector Diversification'}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight">
                    {isBn ? (
                      <>
                        বাংলাদেশের কৃষিতে <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                          সরাসরি নিরাপদ বিনিয়োগ
                        </span>
                        <br />
                        উচ্চ ও নিশ্চিত মুনাফা
                      </>
                    ) : (
                      <>
                        Direct & Insured <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                          Agri Investment
                        </span>
                        <br />
                        in Bangladesh with High Returns
                      </>
                    )}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {isBn 
                      ? 'একটি সমন্বিত প্রকল্পে বিনিয়োগ করলেই আপনার অর্থ স্বয়ংক্রিয়ভাবে ধান, ডেইরি, মৎস্য ও ফল বাগানে ভাগ হয়ে যায়। ঝুঁকি সর্বনিম্ন রেখে সর্বোচ্চ লাভ অর্জন করুন সাধারণ বীমা কর্পোরেশনের ফসল সুরক্ষায়।'
                      : 'Invest in a master integrated project and your capital is automatically diversified across verified crop cycles, modern dairy, biofloc fishery, and orchards to eliminate risk and maximize returns.'}
                  </p>

                  {/* CTA BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                    <button
                      onClick={onExplore}
                      className="px-8 py-4 rounded-2xl gradient-agro text-white font-black text-sm shadow-xl shadow-emerald-950/50 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2.5"
                    >
                      <span>🌾</span>
                      <span>{isBn ? 'সমন্বিত প্রকল্পসমূহ দেখুন' : 'Explore Integrated Projects'}</span>
                    </button>
                    <button
                      onClick={onOpenAiAdvisor}
                      className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🤖</span>
                      <span>{isBn ? 'এআই উপদেষ্টার সাথে কথা বলুন' : 'Talk to AI Advisor'}</span>
                    </button>
                  </div>

                  {/* 4 HIGHLIGHT METRICS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                    <div>
                      <div className="text-2xl font-black text-emerald-400">{isBn ? '৳১২.৮+ কোটি' : '৳12.8+ Cr'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{isBn ? 'মোট সফল বিনিয়োগ' : 'Capital Deployed'}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-amber-400">{isBn ? '২২% - ৩২%' : '22% - 32%'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{isBn ? 'বার্ষিক সম্ভাব্য লাভ' : 'Annual Avg Yield'}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-emerald-400">{isBn ? '১০০%' : '100%'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{isBn ? 'বীমাকৃত মূলধন' : 'Crop Insured'}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-amber-400">{isBn ? '৪,৮০০+' : '4,800+'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{isBn ? 'সক্রিয় বিনিয়োগকারী' : 'Active Investors'}</div>
                    </div>
                  </div>
                </div>

                {/* SPOTLIGHT PROJECT CARD (WITH PROKOLPO ALLOCATION VISUALIZER) */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl backdrop-blur-xl relative space-y-5">
                    
                    {/* Badge */}
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>{isBn ? '🔥 বিশেষ সমন্বিত মেগা প্রকল্প' : '🔥 Featured Mega Project'}</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-xs font-bold">
                        +{spotlightProject.expectedReturn}% {isBn ? 'সম্ভাব্য লাভ' : 'Return'}
                      </span>
                    </div>

                    {/* Image & Title */}
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950">
                      <img
                        src={spotlightProject.image}
                        alt={spotlightProject.title}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                          📍 {spotlightProject.location}
                        </span>
                        <h3 className="text-base font-black truncate">
                          {isBn ? spotlightProject.banglaTitle || spotlightProject.title : spotlightProject.title}
                        </h3>
                      </div>
                    </div>

                    {/* PROKOLPO ALLOCATION VISUALIZER (THE USER'S PRIMARY VISION) */}
                    <div className="space-y-2.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <span>✨</span>
                          <span>{isBn ? 'এই প্রকল্পের অন্তর্ভুক্ত ৪টি উদ্যোগ:' : 'Allocated into 4 Production Units:'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{isBn ? 'স্বয়ংক্রিয় বন্টন' : 'Auto-Diversified'}</span>
                      </div>

                      {/* Multi-Color Segmented Bar */}
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                        <div style={{ width: '40%' }} className="bg-amber-500" title={isBn ? "ধান চাষ (৪০%)" : "Rice Cultivation (40%)"}></div>
                        <div style={{ width: '25%' }} className="bg-cyan-500" title={isBn ? "ডেইরি খামার (২৫%)" : "Dairy Farming (25%)"}></div>
                        <div style={{ width: '20%' }} className="bg-blue-500" title={isBn ? "মৎস্য চাষ (২০%)" : "Aquaculture (20%)"}></div>
                        <div style={{ width: '15%' }} className="bg-emerald-500" title={isBn ? "সবজি বাগান (১৫%)" : "Vegetable Farming (15%)"}></div>
                      </div>

                      {/* Unit Badges */}
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                        <div className="flex items-center gap-1 text-slate-300">
                          <span>🌾</span>
                          <span>{isBn ? 'ধান চাষ (৪০%)' : 'Boro Rice (40%)'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <span>🐄</span>
                          <span>{isBn ? 'ডেইরি খামার (২৫%)' : 'Dairy Farm (25%)'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <span>🐟</span>
                          <span>{isBn ? 'মৎস্য প্রকল্প (২০%)' : 'Fishery (20%)'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <span>🥦</span>
                          <span>{isBn ? 'সবজি বাগান (১৫%)' : 'Greenhouse (15%)'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{isBn ? 'সংগৃহীত তহবিল:' : 'Raised:'} <strong className="text-white">{formatBDT(spotlightProject.raisedAmount, lang)}</strong></span>
                        <span className="font-black text-emerald-400">{spotlightPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="gradient-agro h-full rounded-full" style={{ width: `${spotlightPct}%` }} />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex gap-2.5 pt-1">
                      <button
                        onClick={() => onSelectProject(spotlightProject)}
                        className="flex-1 py-3 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
                      >
                        {isBn ? 'এখনই বিনিয়োগ করুন' : 'Invest in This Project'}
                      </button>
                      <button
                        onClick={() => onOpenFarmDetail(spotlightProject)}
                        className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                        title={isBn ? 'বিস্তারিত দেখুন' : 'View Breakdown'}
                      >
                        {isBn ? 'বিস্তারিত ↗' : 'Details ↗'}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 4-STEP HOW IT WORKS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                {isBn ? 'বিনিয়োগের সহজ ৪টি ধাপ' : 'Simple 4-Step Process'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isBn ? 'কীভাবে আপনার অর্থ নিরাপদ লাভে রূপান্তরিত হয়?' : 'How Your Investment Grows Safely'}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {isBn 
                  ? 'কোনো জটিলতা নেই। মাত্র ২ মিনিটে অ্যাকাউন্ট খুলে বাংলাদেশের সেরা কৃষি প্রকল্পগুলোতে নির্ভরযোগ্যভাবে যুক্ত হোন।'
                  : 'Zero complexity. Open an account in 2 minutes and deploy into vetted institutional agro-projects.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '০১',
                  stepEn: '01',
                  icon: '🌾',
                  titleBn: 'সমন্বিত প্রকল্প নির্বাচন',
                  titleEn: 'Select Integrated Project',
                  descBn: 'আমাদের অডিটেড সমন্বিত মেগা কৃষি প্রকল্পগুলো যাচাই করুন। যেখানে প্রত্যাশিত রিটার্ন, মেয়াদ ও খামার এলাকা স্পষ্টভাবে উল্লেখিত।',
                  descEn: 'Browse our audited master agricultural projects with transparent projected returns, cycle durations, and verified farm locations.'
                },
                {
                  step: '০২',
                  stepEn: '02',
                  icon: '📜',
                  titleBn: 'স্বয়ংক্রিয় বহু-খাত বন্টন',
                  titleEn: 'Automatic Capital Allocation',
                  descBn: 'একটি একক বিনিয়োগ করলেই আপনার অর্থ স্বয়ংক্রিয়ভাবে ধান, ডেইরি, মৎস্য ও সবজি প্রকল্পে বন্টন হয়ে ঝুঁকি কমায় এবং কিউআর কোডসহ সনদ পান।',
                  descEn: 'One investment automatically distributes capital across crops, dairy, fisheries, and horticulture to minimize risk while issuing a digital certificate.'
                },
                {
                  step: '০৩',
                  stepEn: '03',
                  icon: '🛰️',
                  titleBn: 'স্যাটেলাইট ও আইওটি ট্র্যাকিং',
                  titleEn: 'IoT & Satellite Tracking',
                  descBn: 'আপনার ব্যক্তিগত ড্যাশবোর্ডে মাটির আর্দ্রতা, ড্রোন সার্ভে ও ফসলের প্রতিটি অগ্রগতি সরাসরি পর্যবেক্ষণ করুন।',
                  descEn: 'Track soil moisture, weather indices, drone imagery, and agronomist inspection logs directly from your live investor dashboard.'
                },
                {
                  step: '০৪',
                  stepEn: '04',
                  icon: '💰',
                  titleBn: 'মুনাফাসহ অর্থ প্রাপ্তি',
                  titleEn: 'Harvest & High Returns',
                  descBn: 'ফসল কাটার পর পাইকারি বাজারে বিক্রির সাথে সাথে মূলধন ও নিশ্চিত লাভ আপনার ওয়ালেটে জমা হয়, যা সরাসরি ব্যাংকে তোলা যায়।',
                  descEn: 'Upon harvest maturity and wholesale liquidation, your principal and high yields are credited directly to your wallet for instant bank withdrawal.'
                }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 space-y-4 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl">
                      {s.icon}
                    </span>
                    <span className="text-3xl font-black text-slate-200 font-mono group-hover:text-emerald-400 transition">
                      {isBn ? s.step : s.stepEn}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">{isBn ? s.titleBn : s.titleEn}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{isBn ? s.descBn : s.descEn}</p>
                </div>
              ))}
            </div>
          </section>

          {/* WHY AGROFINANCE BD (TRUST & SECURITY) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl space-y-12 relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                  {isBn ? 'নিরাপত্তা ও বিশ্বাসের প্রতীক' : 'Enterprise Trust & Security'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                  {isBn ? 'সচেতন বিনিয়োগকারীরা কেন AgroFinance BD বেছে নেন?' : 'Why Conscientious Investors Choose AgroFinance BD'}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isBn 
                    ? 'আমরা কোনো কাল্পনিক প্রতিশ্রুতি দিই না। বাস্তব কৃষিপণ্য উৎপাদন, স্বয়ংক্রিয় ঝুঁকি নিয়ন্ত্রণ এবং ফসল বীমার মাধ্যমে মূলধনের শতভাগ নিরাপত্তা নিশ্চিত করি।'
                    : 'We replace speculation with real tangible agricultural production, algorithmic capital diversification, and comprehensive crop insurance.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs relative z-10">
                <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3 hover:bg-slate-800 transition">
                  <span className="text-3xl">🛡️</span>
                  <h4 className="font-black text-white text-sm">{isBn ? '১০০% ফসল ও গবাদিপশু বীমা' : 'Comprehensive Crop Insurance'}</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {isBn 
                      ? 'সাধারণ বীমা কর্পোরেশন দ্বারা বন্যা, খরা বা শিলাবৃষ্টির মতো প্রাকৃতিক দুর্যোগে মূলধন সম্পূর্ণ সুরক্ষিত।'
                      : 'Underwritten by licensed insurance partners against floods, hail, droughts, and cyclones to protect investor principal.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3 hover:bg-slate-800 transition">
                  <span className="text-3xl">✨</span>
                  <h4 className="font-black text-white text-sm">{isBn ? 'একক বিনিয়োগে বহু-খাত বন্টন' : 'Multi-Sector Diversification'}</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {isBn 
                      ? 'আপনার অর্থ কেবল একটি খামারে আটকে না থেকে ধান, ডেইরি, মাছ ও সবজিতে স্বয়ংক্রিয়ভাবে ভাগ হয়ে ঝুঁকি মুক্ত রাখে।'
                      : 'Your capital is never trapped in a single field—it automatically diversifies across grains, dairy, fisheries, and horticulture.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3 hover:bg-slate-800 transition">
                  <span className="text-3xl">📊</span>
                  <h4 className="font-black text-white text-sm">{isBn ? 'সরকারি পাইকারি বাজার যাচাই' : 'DAM Wholesale Price Sync'}</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {isBn 
                      ? 'কৃষি বিপণন অধিদপ্তরের পাইকারি দর যাচাই করে সরাসরি সুপারশপ ও আড়তে পণ্য বিক্রি করে মধ্যস্বত্বভোগী এড়ানো হয়।'
                      : 'Wholesale prices are synced daily with the Department of Agricultural Marketing to eliminate middleman margins.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-3 hover:bg-slate-800 transition">
                  <span className="text-3xl">🤖</span>
                  <h4 className="font-black text-white text-sm">{isBn ? 'স্মার্ট এআই বিনিয়োগ উপদেষ্টা' : 'Smart AI Investment Advisor'}</h4>
                  <p className="text-slate-300 leading-relaxed">
                    {isBn 
                      ? 'সার্বক্ষণিক এআই এজেন্টের মাধ্যমে আপনার বাজেটে কোন প্রকল্পে কত লাভ হবে তা তৎক্ষণাৎ হিসাব ও পরামর্শ পান।'
                      : 'Get 24/7 real-time ROI calculations, diversification breakdowns, and guidance from our OpenRouter-powered AI advisor.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                {isBn ? 'বিনিয়োগকারীদের অভিজ্ঞতা' : 'Investor Testimonials'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isBn ? 'হাজারো সন্তুষ্ট বিনিয়োগকারীর আস্থা' : 'Trusted by Over 4,800+ Active Investors'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg transition space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="text-amber-400 text-sm tracking-wider font-mono">{t.rating}</div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <span className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
                      {t.avatar}
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-xs">{t.name}</div>
                      <span className="text-[10px] text-slate-400 block">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ ACCORDION */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                {isBn ? 'সাধারণ প্রশ্নোত্তর' : 'Knowledge Base'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isBn ? 'আপনার মনে থাকা প্রশ্নগুলোর উত্তর' : 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-700"
                    >
                      <span>{faq.q}</span>
                      <span className="text-slate-400 font-mono text-base shrink-0">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* YOU ARE WARMLY INVITED TO VISIT THE FARMS BANNER (PLACED AT BOTTOM AS REQUESTED) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border-2 border-dashed border-emerald-400 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isBn ? 'আমাদের খামারসমূহ সশরীরে পরিদর্শনের সাদর আমন্ত্রণ' : 'You are Warmly Invited to Visit the Farms'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                  {isBn
                    ? 'বগুড়া আধুনিক ডেইরি হাব, ময়মনসিংহ বায়োফ্লক বা রাজশাহী ফলের বাগান যেকোনো সময় সশরীরে ঘুরে দেখুন।'
                    : 'Schedule an in-person tour of our Bogura Dairy Hub, Mymensingh Biofloc, or Rajshahi orchards anytime.'}
                </p>
              </div>
              <button
                onClick={onOpenFarmTour || (() => {})}
                className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition shrink-0 flex items-center gap-2 group"
              >
                <span>{isBn ? 'খামার পরিদর্শনের বুকিং' : 'Schedule Farm Tour'}</span>
                <span className="text-base group-hover:translate-x-0.5 transition">🚜</span>
              </button>
            </div>
          </section>

          {/* BOTTOM HIGH-CONVERTING CALL TO ACTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 border border-emerald-900/40 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-5 relative z-10">
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider inline-block">
                  {isBn ? 'আজই শুরু করুন' : 'Get Started Today'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                  {isBn ? 'বাংলাদেশের সম্ভাবনাময় কৃষিতে বিনিয়োগ করতে প্রস্তুত?' : 'Ready to Cultivate Bangladesh\'s Future?'}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isBn 
                    ? '৪,৮০০+ বিনিয়োগকারীর সাথে যুক্ত হয়ে আপনার অলস অর্থকে লাভজনক কৃষি প্রকল্পে বিনিয়োগ করুন এবং দেশের খাদ্য উৎপাদনে ভূমিকা রাখুন।'
                    : 'Join over 4,800 retail investors earning inflation-hedged returns while directly financing the farms that feed our nation.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (user) onExplore();
                      else if (onOpenRegister) onOpenRegister();
                      else onExplore();
                    }}
                    className="px-8 py-3.5 rounded-2xl gradient-agro text-white font-black text-sm shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2"
                  >
                    <span>🌱</span>
                    <span>{user ? (isBn ? 'সক্রিয় প্রকল্পগুলো দেখুন' : 'Browse Active Projects') : (isBn ? 'বিনামূল্যে অ্যাকাউন্ট খুলুন (২ মিনিটে)' : 'Create Free Account in 2 Minutes')}</span>
                  </button>
                  <button
                    onClick={onExplore}
                    className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition"
                  >
                    {isBn ? 'সকল প্রকল্প দেখুন' : 'View All Projects'}
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      );
    }

    // ==========================================
    // 3. DASHBOARD VIEW COMPONENT
    // ==========================================
    function DashboardView({ lang = 'bn', user, investments, totalInvested, totalReturns, projects, onNavigate, onInvestClick, onDepositClick, onWithdrawClick, notifications = [], onOpenVerifyEmail, onOpenFarmTour }) {
      const isBn = lang === 'bn';
      const activeInvs = investments.filter(i => i.status === 'active');
      const pendingInvs = investments.filter(i => i.status === 'pending' || i.status === 'under_review');
      const completedInvs = investments.filter(i => i.status === 'completed');

      const chartRef = useRef(null);
      useEffect(() => {
        if (!chartRef.current || typeof Chart === 'undefined') return;
        let chartInstance = null;
        try {
          const prev = Chart.getChart(chartRef.current);
          if (prev) prev.destroy();
          const ctx = chartRef.current.getContext('2d');
          chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              labels: isBn ? ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              datasets: [{
                label: isBn ? 'মোট অর্জিত লভ্যাংশ (টাকা)' : 'Cumulative Returns (BDT)',
                data: [5000, 12000, 19000, 27500, 38000, 49000, 62000, 78000, 95000, totalReturns || 120000],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: '#047857'
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true, ticks: { callback: v => '৳' + v.toLocaleString() } }
              }
            }
          });
        } catch (e) {
          console.warn('Dashboard trend chart initialization notice:', e.message);
        }
        return () => { if (chartInstance) chartInstance.destroy(); };
      }, [totalReturns, lang]);

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          {/* WELCOME BANNER & KYC STATUS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {isBn ? `স্বাগতম, ${user.name}!` : `Welcome, ${user.name}!`} 👋
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  user.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {user.kycStatus === 'verified' ? (isBn ? '✓ ভেরিফাইড বিনিয়োগকারী' : '✓ Verified Investor') : (isBn ? '⏳ কেওয়াইসি অপেক্ষমাণ' : '⏳ KYC Pending')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isBn 
                  ? `পোর্টফোলিও ড্যাশবোর্ড • সদস্যপদ শুরু: ${new Date(user.createdAt || Date.now()).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}`
                  : `Portfolio Dashboard • Member since ${new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onDepositClick}
                className="px-5 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow-md hover:opacity-95 transition"
              >
                👛 {isBn ? 'টাকা জমা দিন' : 'Deposit Funds'}
              </button>
              <button
                onClick={onWithdrawClick}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                📤 {isBn ? 'টাকা তুলুন' : 'Request Payout'}
              </button>
            </div>
          </div>

          {/* KYC NOTICE IF UNVERIFIED */}
          {user.kycStatus !== 'verified' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🪪</span>
                <span>
                  <strong>{isBn ? 'পরিচয় ও কেওয়াইসি যাচাই প্রয়োজন:' : 'Identity & Compliance Verification Required:'}</strong>{' '}
                  {isBn 
                    ? 'আপনার জাতীয় পরিচয়পত্র (NID) ও নমিনির তথ্য প্রোফাইলে আপলোড করে আনলিমিটেড বিনিয়োগ সুবিধা ও দ্রুত ব্যাংক ক্যাশ-আউট সুবিধা আনলক করুন।'
                    : 'Upload your National ID (NID) and nominee details in your profile to unlock unlimited investment limits and rapid bank withdrawals.'}
                </span>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 transition"
              >
                {isBn ? 'নথি আপলোড করুন →' : 'Upload Documents →'}
              </button>
            </div>
          )}

          {/* 4 CORE METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>{isBn ? 'মোট সক্রিয় বিনিয়োগ' : 'Total Invested'}</span>
                <span className="text-base">🌾</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{formatBDT(totalInvested, lang)}</div>
              <span className="text-[11px] text-emerald-700 font-bold">
                {activeInvs.length} {isBn ? 'টি প্রকল্পে নিয়োজিত' : 'Active Ventures'}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>{isBn ? 'অর্জিত মোট মুনাফা' : 'Total Returns Received'}</span>
                <span className="text-base">📈</span>
              </div>
              <div className="text-2xl font-black text-emerald-600">+{formatBDT(totalReturns, lang)}</div>
              <span className="text-[11px] text-slate-500">
                {isBn ? 'সময়মতো ওয়ালেটে জমা' : 'Disbursed to Wallet'}
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>{isBn ? 'ওয়ালেট ব্যালেন্স' : 'Wallet Balance'}</span>
                <span className="text-base">👛</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{formatBDT(user.walletBalance, lang)}</div>
              <button
                onClick={onWithdrawClick}
                className="text-[11px] text-emerald-700 font-bold hover:underline block"
              >
                {isBn ? 'ক্যাশআউট অনুরোধ করুন →' : 'Withdraw Funds →'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                <span>{isBn ? 'প্রকল্প অবস্থা' : 'Portfolio Status'}</span>
                <span className="text-base">🛡️</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {activeInvs.length} <span className="text-xs font-normal text-slate-400">{isBn ? 'সক্রিয়' : 'Active'}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">
                {isBn ? '১০০% ফসল বীমা অন্তর্ভুক্ত' : '100% Insured Underwriters'}
              </span>
            </div>
          </div>

          {/* CUMULATIVE RETURN CHART & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-900 text-base">{isBn ? 'মুনাফা বৃদ্ধির প্রবৃদ্ধি চার্ট' : 'Cumulative Growth Curve'}</h3>
                  <p className="text-xs text-slate-400">{isBn ? 'মাসিক ও চক্রবৃদ্ধি লভ্যাংশ ইতিহাস' : 'Monthly & Seasonal Harvest Profit Flow'}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {isBn ? 'নিয়মিত লভ্যাংশ প্রদান' : 'Regular Disbursal'}
                </span>
              </div>
              <div className="h-64">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-base">{isBn ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}</h3>
                
                <div className="space-y-2.5">
                  <button
                    onClick={() => onNavigate('projects')}
                    className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-black text-xs flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>🌾</span>
                      <span>{isBn ? 'নতুন সমন্বিত প্রকল্পে বিনিয়োগ' : 'Invest in Integrated Farm'}</span>
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => onNavigate('portfolio')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>📜</span>
                      <span>{isBn ? 'আমার সকল বিনিয়োগ ও সনদ' : 'My Investments & Certificates'}</span>
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={onOpenFarmTour || (() => {})}
                    className="w-full p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>🚜</span>
                      <span>{isBn ? 'সরাসরি খামার পরিদর্শনের বুকিং' : 'Schedule In-Person Farm Tour'}</span>
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => onNavigate('ai-agent')}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border border-teal-200 text-teal-900 font-black text-xs flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>🤖</span>
                      <span>{isBn ? 'এআই এগ্রো এজেন্ট ও সিমুলেটর' : 'AI Agro Agent Simulator'}</span>
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <span>🛡️</span>
                  <span>{isBn ? 'মূলধন বীমা পলিসি' : 'Capital Insurance Policy'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isBn 
                    ? 'আপনার বিনিয়োগ সাধারণ বীমা কর্পোরেশনের পলিসির আওতাভুক্ত। প্রাকৃতিক দুর্যোগে মূলধন সুরক্ষিত।'
                    : 'Your capital is insured against climate & biological risks under national insurance.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      );
    }
