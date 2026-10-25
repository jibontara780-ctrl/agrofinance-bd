    // ==============================================================================
    // 03_PROJECTS_PORTFOLIO_MARKET_IMPACT.JSX
    // Projects View, Project Card, Portfolio View, Wallet View, Market View, Impact View, & AI Agent Full View
    // ==============================================================================

    const projectDescriptionsEn = {
      proj_001: 'Integrated mega-agricultural project automatically diversifying a single investment across high-yield Boro rice (40%), modern dairy hub (25%), scientific biofloc aquaculture (20%), and greenhouse vegetables (15%). Insured by Sadharan Bima Corporation.',
      proj_002: 'State-of-the-art commercial venture in the Barind tract. Capital is diversified into export mango orchards (45%), Black Bengal goat fattening (25%), drip-irrigated greenhouse farming (20%), and pure apiculture (10%). Insured under national livestock policy.',
      proj_003: 'Integrated coastal agro-fishery venture in the Meghna estuary. Capital is allocated to scientific cage fisheries (50%), eco-floating hydroponics (25%), and commercial duck breeding (25%). Fully insured against tidal surges.',
      proj_004: 'Modern commercial dairy industrial park in Pabna near Chalan Beel. Allocates capital to Friesian dairy milk (45%), nutritious maize silage (30%), and organic vermicompost fertilizer (25%). Backed by national livestock insurance.'
    };

    function ProjectCard({ lang = 'bn', project, onInvest, onOpenFarmDetail }) {
      const isBn = lang === 'bn';
      const isFunded = project.raisedAmount >= project.totalFunding || project.status === 'completed';
      const pct = Math.min(100, Math.round((project.raisedAmount / project.totalFunding) * 100));
      const handleOpenDetail = onOpenFarmDetail || (() => {});

      const prokolpos = (project.prokolpos && project.prokolpos.length > 0) ? project.prokolpos : [
        { id: 'p1', name: 'Boro Rice Cultivation', banglaName: 'বোরো ধান চাষ', allocationPercentage: 40, icon: '🌾' },
        { id: 'p2', name: 'Modern Dairy Farming', banglaName: 'আধুনিক ডেইরি খামার', allocationPercentage: 25, icon: '🐄' },
        { id: 'p3', name: 'Biofloc Aquaculture', banglaName: 'বায়োফ্লক মৎস্য চাষ', allocationPercentage: 20, icon: '🐟' },
        { id: 'p4', name: 'Greenhouse Vegetables', banglaName: 'গ্রিনহাউস সবজি বাগান', allocationPercentage: 15, icon: '🥦' }
      ];

      const categoryBadge = getCategoryBadge(project.category, lang);
      const imgSrc = getProjectImageUrl(project.image, project.category, project.title);

      return (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
          {/* IMAGE BANNER */}
          <div className="relative h-56 overflow-hidden bg-slate-900">
            <img
              src={imgSrc}
              alt={project.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/30" />

            {/* BADGES ON IMAGE */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
              <div className="flex flex-wrap items-center gap-1 max-w-[62%]">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 shrink-0 ${categoryBadge.color}`}>
                  <span>{categoryBadge.icon}</span>
                  <span className="truncate max-w-[105px]">{categoryBadge.label}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600/95 text-white shadow-xs backdrop-blur-md flex items-center gap-1 shrink-0">
                  <span>🛡️</span>
                  <span>{isBn ? 'বীমাকৃত' : 'Insured'}</span>
                </span>
              </div>

              <div className="shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-sm backdrop-blur-md flex items-center gap-1">
                  <span>✨</span>
                  <span>{prokolpos.length} {isBn ? 'টি ইউনিট' : 'Units'}</span>
                </span>
              </div>
            </div>

            {/* BOTTOM OVERLAY INFO */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 text-white pointer-events-none">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-emerald-300 flex items-center gap-1 truncate">
                  <span>📍</span>
                  <span>{project.location || (isBn ? 'বাংলাদেশ' : 'Bangladesh')}</span>
                </p>
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {isBn ? 'তত্ত্বাবধায়ক: ' : 'Manager: '}{project.manager || (isBn ? 'এগ্রো টেক লিমিটেড' : 'AgroTech Ltd.')}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block whitespace-nowrap">
                  {isBn ? 'সম্ভাব্য লাভ' : 'Expected ROI'}
                </span>
                <span className="text-xl font-black text-emerald-400">+{project.expectedReturn}%</span>
              </div>
            </div>
          </div>

          {/* CARD BODY */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                {isBn ? project.banglaTitle || project.title : project.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {isBn 
                  ? (project.descriptionBn || project.description) 
                  : (project.descriptionEn || projectDescriptionsEn[project.id] || project.description)}
              </p>
            </div>

            {/* PROKOLPO MULTI-UNIT ALLOCATION BREAKDOWN (USER CORE REQUIREMENT) */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <span>✨</span>
                  <span>{isBn ? `১টি বিনিয়োগে ${prokolpos.length}টি প্রকল্পে স্বয়ংক্রিয় বন্টন:` : `Diversified across ${prokolpos.length} Sub-Units:`}</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                  {isBn ? '১০০% বন্টন' : '100% Split'}
                </span>
              </div>

              {/* Segmented Color Bar */}
              <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-200">
                {prokolpos.map((pr, idx) => {
                  const colors = ['bg-amber-500', 'bg-cyan-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
                  return (
                    <div
                      key={pr.id || idx}
                      style={{ width: `${pr.allocationPercentage}%` }}
                      className={colors[idx % colors.length]}
                      title={`${isBn ? pr.banglaName || pr.name : pr.name} (${pr.allocationPercentage}%)`}
                    />
                  );
                })}
              </div>

              {/* Prokolpo Mini Chips */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-0.5">
                {prokolpos.map((pr, idx) => (
                  <div key={pr.id || idx} className="flex items-center gap-1 text-slate-700 truncate">
                    <span>{pr.icon || '🌾'}</span>
                    <span className="truncate">{isBn ? pr.banglaName || pr.name : pr.name}</span>
                    <span className="text-amber-800 font-bold text-[10px]">({pr.allocationPercentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FUNDING PROGRESS */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">
                  {isBn ? 'সংগৃহীত:' : 'Raised:'} <strong className="text-slate-800">{formatBDT(project.raisedAmount, lang)}</strong>
                </span>
                <span className="font-black text-emerald-700">{pct}% {isBn ? 'তহবিল সংগৃহীত' : 'Funded'}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="gradient-agro h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                <span>{isBn ? 'মোট লক্ষ্য:' : 'Target:'} {formatBDT(project.totalFunding, lang)}</span>
                <span>{project.investorsCount || 0} {isBn ? 'জন বিনিয়োগকারী' : 'Investors'}</span>
              </div>
            </div>

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{isBn ? 'মেয়াদ' : 'Duration'}</span>
                <span className="font-black text-slate-800 text-sm">
                  {project.duration} {isBn ? 'মাস' : 'Months'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{isBn ? 'ন্যূনতম বিনিয়োগ' : 'Min Investment'}</span>
                <span className="font-black text-slate-800 text-sm">{formatBDT(project.minInvestment, lang)}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => onInvest(project)}
                disabled={isFunded}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition shadow flex items-center justify-center gap-1.5 ${
                  isFunded
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'gradient-agro text-white shadow-emerald-950/20 hover:brightness-110 active:scale-95'
                }`}
              >
                <span>🌱</span>
                <span>{isFunded ? (isBn ? 'তহবিল সংগ্রহ সম্পন্ন' : 'Fully Funded') : (isBn ? 'এখনই বিনিয়োগ করুন' : 'Invest Now')}</span>
              </button>

              <button
                onClick={() => handleOpenDetail(project)}
                className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition whitespace-nowrap"
                title={isBn ? 'প্রকল্পের বিস্তারিত বিবরণ ও উপ-উদ্যোগসমূহ দেখুন' : 'View Full Details & Units Breakdown'}
              >
                {isBn ? 'বিস্তারিত ও উদ্যোগ ↗' : 'Units & Details ↗'}
              </button>
            </div>

          </div>
        </div>
      );
    }

    function ProjectsView({ lang = 'bn', projects = [], onInvest, onOpenFarmDetail, onOpenFarmTour }) {
      const isBn = lang === 'bn';
      const [categoryFilter, setCategoryFilter] = React.useState('all');
      const [statusFilter, setStatusFilter] = React.useState('all');
      const [searchTerm, setSearchTerm] = React.useState('');
      const [sortBy, setSortBy] = React.useState('return_desc');

      const filteredProjects = useMemo(() => {
        return projects.filter(p => {
          if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
          if (statusFilter !== 'all' && p.status !== statusFilter) return false;
          if (searchTerm) {
            const q = searchTerm.toLowerCase();
            const titleMatch = (p.title || '').toLowerCase().includes(q) || (p.banglaTitle || '').toLowerCase().includes(q);
            const locMatch = (p.location || '').toLowerCase().includes(q);
            const cropMatch = (p.cropType || '').toLowerCase().includes(q);
            if (!titleMatch && !locMatch && !cropMatch) return false;
          }
          return true;
        }).sort((a, b) => {
          if (sortBy === 'return_desc') return b.expectedReturn - a.expectedReturn;
          if (sortBy === 'funding_desc') return b.totalFunding - a.totalFunding;
          if (sortBy === 'duration_asc') return a.duration - b.duration;
          return 0;
        });
      }, [projects, categoryFilter, statusFilter, searchTerm, sortBy]);

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
          
          {/* HEADER */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              {isBn ? 'সমন্বিত কৃষি উদ্যোগ' : 'Integrated Agro Portfolios'}
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isBn ? 'সমন্বিত কৃষি প্রকল্পসমূহ' : 'Master Agricultural Projects'}
                </h1>
                <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  {isBn 
                    ? 'আমাদের প্রতিটি মাস্টার প্রকল্পে বিনিয়োগ করলে আপনার অর্থ স্বয়ংক্রিয়ভাবে একাধিক সম্ভাবনাময় প্রকল্পে (ধান, ডেইরি, মৎস্য, ফল বাগান) ভাগ হয়ে যায়। প্রতিটি চুক্তি সাধারণ বীমা কর্পোরেশনের ফসল সুরক্ষা পলিসি দ্বারা নিশ্চিত।'
                    : 'Each integrated project automatically diversifies your capital across vetted farming units (rice, dairy, fishery, fruit orchards), protected by national crop insurance.'}
                </p>
              </div>

              <div className="text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                {isBn ? 'মোট উপলব্ধ প্রকল্প:' : 'Available Projects:'} <strong className="text-emerald-700 text-sm">{filteredProjects.length}</strong>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder={isBn ? 'প্রকল্পের নাম, জেলা বা ফসলের ধরন দিয়ে খুঁজুন...' : 'Search by project name, district, or crop...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Status Select */}
              <div className="md:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="all">{isBn ? 'সকল অবস্থা (All Status)' : 'All Statuses'}</option>
                  <option value="active">{isBn ? 'সক্রিয় (তহবিল সংগ্রহ চলছে)' : 'Active (Funding Open)'}</option>
                  <option value="upcoming">{isBn ? 'আসন্ন প্রকল্পসমূহ' : 'Upcoming Pre-Launch'}</option>
                  <option value="completed">{isBn ? 'সম্পন্ন (রিটার্ন পরিশোধিত)' : 'Completed (Harvest Settled)'}</option>
                </select>
              </div>

              {/* Sort Select */}
              <div className="md:col-span-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="return_desc">{isBn ? 'সর্বোচ্চ লাভ (Highest ROI)' : 'Highest Projected Return'}</option>
                  <option value="funding_desc">{isBn ? 'বৃহত্তম তহবিল লক্ষ্য (Target Funding)' : 'Largest Total Funding'}</option>
                  <option value="duration_asc">{isBn ? 'স্বল্পতম মেয়াদ (Shortest Duration)' : 'Shortest Duration First'}</option>
                </select>
              </div>

            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs pt-1">
              {[
                { id: 'all', labelBn: 'সকল খাত', labelEn: 'All Sectors', icon: '🌐' },
                { id: 'grain', labelBn: 'ধান ও শস্য', labelEn: 'Paddy & Crops', icon: '🌾' },
                { id: 'dairy', labelBn: 'আধুনিক ডেইরি', labelEn: 'Modern Dairy', icon: '🐄' },
                { id: 'fishery', labelBn: 'বায়োফ্লক মৎস্য', labelEn: 'Fisheries', icon: '🐟' },
                { id: 'fruit', labelBn: 'আম ও ফল বাগান', labelEn: 'Fruit Orchards', icon: '🥭' },
                { id: 'vegetable', labelBn: 'গ্রিনহাউস সবজি', labelEn: 'Greenhouse Veg', icon: '🥦' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    categoryFilter === cat.id
                      ? 'gradient-agro text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PROJECTS GRID */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <span className="text-4xl">🌾</span>
              <h3 className="text-base font-black text-slate-800">
                {isBn ? 'কোনো প্রকল্প খুঁজে পাওয়া যায়নি' : 'No Agricultural Projects Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isBn ? 'আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।' : 'Try resetting your filter or search keywords.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project._id || project.id}
                  lang={lang}
                  project={project}
                  onInvest={onInvest}
                  onOpenFarmDetail={onOpenFarmDetail}
                />
              ))}
            </div>
          )}

          {/* YOU ARE WARMLY INVITED TO VISIT THE FARMS BANNER */}
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

        </div>
      );
    }

    // ==========================================
    // PORTFOLIO VIEW
    // ==========================================
    function PortfolioView({ lang = 'bn', user, investments = [], projects = [], token, onViewCertificate, onExploreProjects, showToast, onUserUpdate, onOpenFarmTour }) {
      const isBn = lang === 'bn';
      const [filter, setFilter] = React.useState('all');

      const filtered = investments.filter(inv => {
        if (filter === 'all') return true;
        return inv.status === filter;
      });

      const totalCapital = investments
        .filter(i => i.status === 'active' || i.status === 'completed')
        .reduce((sum, i) => sum + (Number(i.investedAmount) || 0), 0);

      const totalProfit = investments
        .reduce((sum, i) => sum + (Number(i.totalReturnReceived) || 0), 0);

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
          
          {/* PORTFOLIO SUMMARY HEADER */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {isBn ? 'আমার বিনিয়োগ পোর্টফোলিও' : 'My Investment Portfolio'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">
                {user.name} - {isBn ? 'পোর্টফোলিও ড্যাশবোর্ড' : 'Portfolio Dossier'}
              </h1>
              <p className="text-xs text-slate-300">
                {isBn 
                  ? 'আপনার বিনিয়োগকৃত মূলধন এবং প্রতিটি সমন্বিত প্রকল্পের অন্তর্ভুক্ত খাতের বিস্তারিত অবস্থা।'
                  : 'Real-time capital deployment, yield analytics, and multi-unit production tracking.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left shrink-0">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-[10px] text-slate-300 uppercase font-bold block">{isBn ? 'মোট বিনিয়োগ' : 'Active Capital'}</span>
                <span className="text-xl font-black text-white">{formatBDT(totalCapital, lang)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-[10px] text-slate-300 uppercase font-bold block">{isBn ? 'অর্জিত মোট লাভ' : 'Profit Received'}</span>
                <span className="text-xl font-black text-emerald-400">+{formatBDT(totalProfit, lang)}</span>
              </div>
            </div>
          </div>

          {/* STATUS FILTER TABS */}
          <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
            {[
              { id: 'all', labelBn: 'সকল বিনিয়োগ', labelEn: 'All Investments', count: investments.length },
              { id: 'active', labelBn: 'সক্রিয় প্রকল্প', labelEn: 'Active Contracts', count: investments.filter(i => i.status === 'active').length },
              { id: 'pending', labelBn: 'অপেক্ষমাণ (Pending)', labelEn: 'Under Review', count: investments.filter(i => i.status === 'pending').length },
              { id: 'completed', labelBn: 'সম্পন্ন ও লভ্যাংশ প্রাপ্ত', labelEn: 'Completed & Settled', count: investments.filter(i => i.status === 'completed').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  filter === tab.id
                    ? 'gradient-agro text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* INVESTMENTS LIST */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <span className="text-4xl">📜</span>
              <h3 className="text-base font-black text-slate-800">
                {isBn ? 'এই বিভাগে কোনো বিনিয়োগ নেই' : 'No Investments Found in This Category'}
              </h3>
              <button
                onClick={onExploreProjects}
                className="px-6 py-2.5 rounded-xl gradient-agro text-white text-xs font-black shadow hover:brightness-110"
              >
                {isBn ? 'নতুন প্রকল্পে বিনিয়োগ করুন →' : 'Explore Projects →'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map(inv => {
                const allocations = (inv.prokolpoAllocations && inv.prokolpoAllocations.length > 0)
                  ? inv.prokolpoAllocations
                  : [
                    { prokolpoName: 'Boro Rice Cultivation', banglaName: 'উচ্চফলনশীল বোরো ধান চাষ', percentage: 40, allocatedAmount: Math.round(inv.investedAmount * 0.4), icon: '🌾' },
                    { prokolpoName: 'Modern Dairy Farming', banglaName: 'আধুনিক ডেইরি খামার', percentage: 25, allocatedAmount: Math.round(inv.investedAmount * 0.25), icon: '🐄' },
                    { prokolpoName: 'Biofloc Aquaculture', banglaName: 'বায়োফ্লক বৈজ্ঞানিক মৎস্য চাষ', percentage: 20, allocatedAmount: Math.round(inv.investedAmount * 0.20), icon: '🐟' },
                    { prokolpoName: 'Greenhouse Vegetables', banglaName: 'গ্রিনহাউস বিষমুক্ত সবজি', percentage: 15, allocatedAmount: Math.round(inv.investedAmount * 0.15), icon: '🥦' }
                  ];

                return (
                  <div
                    key={inv._id || inv.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6 hover:shadow-md transition"
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            {inv.category || 'Agro Venture'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inv.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            inv.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {inv.status === 'active' ? (isBn ? 'সক্রিয় খামার' : 'Active') :
                             inv.status === 'completed' ? (isBn ? 'সম্পন্ন' : 'Completed') :
                             (isBn ? 'অপেক্ষমাণ' : 'Pending')}
                          </span>
                        </div>
                        <h2 className="text-lg font-black text-slate-900 mt-1">{inv.projectTitle}</h2>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {isBn ? 'সনদ নম্বর:' : 'Certificate ID:'} {inv.certificateId}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewCertificate(inv)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <span>📜</span>
                          <span>{isBn ? 'ডিজিটাল সনদ দেখুন' : 'View Certificate'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Financial Numbers Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'বিনিয়োগকৃত মূলধন' : 'Capital Invested'}</span>
                        <span className="text-base font-black text-slate-900">{formatBDT(inv.investedAmount, lang)}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'সম্ভাব্য লাভ' : 'Expected Return'}</span>
                        <span className="text-base font-black text-emerald-600">+{inv.expectedReturn}%</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'মোট প্রাপ্ত লাভ' : 'Profit Received'}</span>
                        <span className="text-base font-black text-slate-900">{formatBDT(inv.totalReturnReceived || 0, lang)}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'মেয়াদ উত্তীর্ণের তারিখ' : 'Maturity Date'}</span>
                        <span className="text-base font-black text-slate-900">{inv.maturityDate || 'N/A'}</span>
                      </div>
                    </div>

                    {/* PROKOLPO CAPITAL ALLOCATION VISUALIZER (SHOWING HOW THEIR MONEY WORKS) */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <span>✨</span>
                          <span>{isBn ? 'আপনার এই বিনিয়োগের অর্থ যেভাবে বিভিন্ন প্রকল্পে নিয়োজিত আছে:' : 'Capital Diversification Breakdown:'}</span>
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-200/60 px-2 py-0.5 rounded-full">
                          {allocations.length} {isBn ? 'টি উৎপাদন ইউনিট' : 'Units'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {allocations.map((pr, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200 shadow-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-base">{pr.icon || '🌾'}</span>
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                                {pr.percentage}%
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {isBn ? pr.banglaName || pr.prokolpoName : pr.prokolpoName}
                            </div>
                            <div className="text-xs font-black text-emerald-700">
                              {formatBDT(pr.allocatedAmount, lang)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* YOU ARE WARMLY INVITED TO VISIT THE FARMS BANNER */}
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

        </div>
      );
    }

    // ==========================================
    // WALLET VIEW
    // ==========================================
    function WalletView({ lang = 'bn', user, transactions = [], onDepositClick, onWithdrawClick }) {
      const isBn = lang === 'bn';

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
          
          {/* BALANCE CARD */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {isBn ? 'ডিজিটাল ওয়ালেট ও ফান্ড ব্যালেন্স' : 'Digital Platform Wallet'}
              </span>
              <div className="text-3xl sm:text-4xl font-black">
                {formatBDT(user?.walletBalance || 0, lang)}
              </div>
              <p className="text-xs text-slate-300">
                {isBn 
                  ? 'এই ব্যালেন্স দিয়ে আপনি যেকোনো নতুন সমন্বিত প্রকল্পে বিনিয়োগ করতে পারেন অথবা সরাসরি ব্যাংকে ক্যাশআউট করতে পারেন।'
                  : 'Available balance can be used to invest in any master project or withdrawn to your bank.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onDepositClick}
                className="px-6 py-3 rounded-xl gradient-agro text-white font-bold text-xs shadow-lg hover:brightness-110 transition"
              >
                ➕ {isBn ? 'টাকা যোগ করুন' : 'Deposit Funds'}
              </button>
              <button
                onClick={onWithdrawClick}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition"
              >
                📤 {isBn ? 'ব্যাংকে ক্যাশআউট' : 'Withdraw'}
              </button>
            </div>
          </div>

          {/* TRANSACTIONS HISTORY */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base">{isBn ? 'লেনদেন ইতিহাস (Ledger Records)' : 'Transaction History'}</h3>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">{isBn ? 'এখনও কোনো লেনদেন সম্পন্ন হয়নি।' : 'No transactions recorded yet.'}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                      <th className="py-3 px-3">{isBn ? 'বিবরণ' : 'Description'}</th>
                      <th className="py-3 px-3">{isBn ? 'পেমেন্ট চ্যানেল' : 'Method'}</th>
                      <th className="py-3 px-3">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                      <th className="py-3 px-3">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx, idx) => (
                      <tr key={tx._id || idx} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-3 text-slate-500 font-mono">{tx.date}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{tx.description}</td>
                        <td className="py-3.5 px-3 text-slate-600">{tx.method || 'Wallet'}</td>
                        <td className={`py-3.5 px-3 font-black ${tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {tx.amount >= 0 ? '+' : ''}{formatBDT(tx.amount, lang)}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {tx.status || 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      );
    }

    // ==========================================
    // MARKET VIEW (DEPRECATED & REMOVED PER USER REQUEST)
    // ==========================================
    function MarketView() {
      return null;
    }

    // ==========================================
    // IMPACT VIEW
    // ==========================================
    function ImpactView({ lang = 'bn', projects = [], onExplore }) {
      const isBn = lang === 'bn';

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              {isBn ? 'টেকসই সামাজিক প্রভাব' : 'Sustainable Rural Impact'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isBn ? 'কৃষক ও বিনিয়োগকারীর যৌথ সমৃদ্ধি' : 'Empowering Rural Agriculture & Food Security'}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {isBn 
                ? 'আপনার বিনিয়োগ শুধু উচ্চ মুনাফায় সীমাবদ্ধ নয়, এটি প্রান্তিক কৃষকদের আধুনিক যন্ত্রপাতি, উচ্চফলনশীল বীজ এবং মধ্যস্বত্বভোগীহীন ন্যায্য বাজার নিশ্চিত করে।'
                : 'Every taka invested finances advanced farming inputs, fair-value market linkages, and cold-chain resilience across rural Bangladesh.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <span className="text-4xl block mb-2">🚜</span>
              <div className="text-3xl font-black text-emerald-600">{isBn ? '১,৪৫০+' : '1,450+'}</div>
              <div className="text-xs font-bold text-slate-700">{isBn ? 'প্রশিক্ষিত ও স্বাবলম্বী কৃষক' : 'Empowered Farming Families'}</div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <span className="text-4xl block mb-2">🌾</span>
              <div className="text-3xl font-black text-emerald-600">{isBn ? '৩,২০০+' : '3,200+'}</div>
              <div className="text-xs font-bold text-slate-700">{isBn ? 'একর আবাদযোগ্য আধুনিক জমি' : 'Acres Cultivated'}</div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <span className="text-4xl block mb-2">📦</span>
              <div className="text-3xl font-black text-emerald-600">{isBn ? '১৮,৫০০+' : '18,500+'}</div>
              <div className="text-xs font-bold text-slate-700">{isBn ? 'মেট্রিক টন খাদ্যশস্য উৎপাদন' : 'Tons of Fresh Food Harvested'}</div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
              <span className="text-4xl block mb-2">💧</span>
              <div className="text-3xl font-black text-emerald-600">{isBn ? '৮৫%' : '85%'}</div>
              <div className="text-xs font-bold text-slate-700">{isBn ? 'সৌর সেচ ও পানি সাশ্রয়ী প্রযুক্তি' : 'Solar-Powered Irrigation'}</div>
            </div>
          </div>

        </div>
      );
    }

    // ==========================================
    // FULL-SCREEN DEDICATED AI AGENT VIEW & SIMULATOR
    // ==========================================
    function AiAgentFullView({ lang = 'bn', projects = [], marketPrices = [], onInvest }) {
      const isBn = lang === 'bn';
      const [messages, setMessages] = React.useState([
        {
          role: 'assistant',
          content: isBn
            ? '🌾 **স্বাগতম! আমি আপনার সার্বক্ষণিক এআই এগ্রো উপদেষ্টা (AgroAI)।**\n\nআপনি নির্দিষ্ট অঙ্কের বিনিয়োগে কত টাকা লাভ পাবেন, একটি বিনিয়োগে অর্থ কীভাবে একাধিক প্রকল্পে ভাগ হয়, বা সরাসরি খামার পরিদর্শনের নিয়মাবলী—যেকোনো প্রশ্ন করতে পারেন।'
            : '🌾 **Welcome! I am your 24/7 AI Agricultural Investment Advisor (AgroAI).**\n\nAsk me about expected returns, how your capital is automatically diversified across balanced farming units, or how to schedule an in-person farm tour!'
        }
      ]);
      const [inputMsg, setInputMsg] = React.useState('');
      const [loading, setLoading] = React.useState(false);
      const [simAmount, setSimAmount] = React.useState(100000);
      const [selectedProject, setSelectedProject] = React.useState(projects[0] || null);
      const chatEndRef = React.useRef(null);

      React.useEffect(() => {
        if (!selectedProject && projects.length > 0) {
          setSelectedProject(projects[0]);
        }
      }, [projects]);

      React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages, loading]);

      const handleSend = async (queryText) => {
        const text = (queryText || inputMsg).trim();
        if (!text || loading) return;

        const nextHistory = [...messages, { role: 'user', content: text }];
        setMessages(nextHistory);
        setInputMsg('');
        setLoading(true);

        try {
          const res = await apiCall('/api/ai/chat', 'POST', {
            message: text,
            history: nextHistory.map(m => ({ role: m.role, content: m.content })),
            language: lang
          });

          if (res.success && res.reply) {
            setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
          } else {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: isBn
                ? 'দুঃখিত, সংযোগে সামান্য বিলম্ব হচ্ছে। দয়া করে আবার প্রশ্ন করুন।'
                : 'Connection delayed. Please retry your query.'
            }]);
          }
        } catch (e) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: isBn ? 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' : 'Network error. Please try again.'
          }]);
        } finally {
          setLoading(false);
        }
      };

      // Simulator Calculations
      const proj = selectedProject || projects[0] || {
        title: 'Green Valley Integrated Agro Farm',
        banglaTitle: 'গ্রীন ভ্যালি সমন্বিত মেগা কৃষি প্রকল্প',
        expectedReturn: 24,
        duration: 6,
        prokolpos: [
          { id: '1', name: 'Boro Rice Cultivation', banglaName: 'বোরো ধান চাষ', allocationPercentage: 40, icon: '🌾' },
          { id: '2', name: 'Modern Dairy Farm', banglaName: 'আধুনিক ডেইরি খামার', allocationPercentage: 25, icon: '🐄' },
          { id: '3', name: 'Biofloc Fishery', banglaName: 'বায়োফ্লক মৎস্য চাষ', allocationPercentage: 20, icon: '🐟' },
          { id: '4', name: 'Greenhouse Vegetables', banglaName: 'গ্রিনহাউস সবজি বাগান', allocationPercentage: 15, icon: '🥦' }
        ]
      };

      const estProfit = Math.round(simAmount * (proj.expectedReturn / 100) * (proj.duration / 12));
      const estTotal = simAmount + estProfit;
      const prokolpos = (proj.prokolpos && proj.prokolpos.length > 0) ? proj.prokolpos : [];

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
          
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isBn ? '🤖 ওপেন-রাউটার চালিত এআই উপদেষ্টা' : '🤖 OpenRouter GPT-4o-Mini AI Advisor'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isBn ? 'স্মার্ট এআই এগ্রো এজেন্ট ও বিনিয়োগ সিমুলেটর' : 'Smart AI Agro Agent & Investment Simulator'}
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              {isBn 
                ? 'রিয়েল-টাইম মার্কেট ডাটা ও আমাদের সমন্বিত খামারগুলোর তথ্য নিয়ে সরাসরি এআই উপদেষ্টার সাথে কথা বলুন এবং আপনার কাঙ্ক্ষিত বিনিয়োগের নির্ভুল হিসাব দেখুন।'
                : 'Interact in real-time with our agricultural AI advisor to calculate exact return yields and visualize multi-sector capital diversification.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: INTERACTIVE AI CHAT CONSOLE */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px]">
              
              {/* Header */}
              <div className="p-4 gradient-agro text-white flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">🤖</span>
                  <div>
                    <h3 className="font-black text-sm">{isBn ? 'AgroAI সার্বক্ষণিক বিনিয়োগ সহকারী' : 'AgroAI Investment Assistant'}</h3>
                    <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                      <span>{isBn ? 'সক্রিয় • ওপেন-রাউটার জিপিটি-৪ও মিনি' : 'Online • OpenRouter GPT-4o-Mini'}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMessages([{ role: 'assistant', content: isBn ? 'চ্যাট রিসেট হয়েছে। কীভাবে সহায়তা করতে পারি?' : 'Chat reset. How may I assist you?' }])}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  title={isBn ? 'চ্যাট মুছে নতুন করে শুরু করুন' : 'Clear Chat'}
                >
                  🔄 {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs bg-slate-50/60 custom-scrollbar">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl leading-relaxed whitespace-pre-line shadow-xs ${
                      m.role === 'user'
                        ? 'gradient-agro text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-sm'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-200 flex items-center gap-2 text-xs text-slate-500 shadow-sm">
                      <span className="animate-spin text-sm">🌾</span>
                      <span>{isBn ? 'এআই উপদেষ্টা বিশ্লেষণ করছেন...' : 'AgroAI is formulating analysis...'}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="p-3 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] custom-scrollbar">
                {[
                  isBn ? '১ লক্ষ টাকায় কত লাভ পাবো?' : 'What is return on ৳100k?',
                  isBn ? 'টাকা কীভাবে ৪টি প্রকল্পে ভাগ হয়?' : 'How is money split across units?',
                  isBn ? 'কোন সমন্বিত প্রকল্পে রিটার্ন সর্বোচ্চ?' : 'Which project gives highest yield?',
                  isBn ? 'সরাসরি খামার পরিদর্শনের নিয়ম কী?' : 'How do I schedule a farm tour?'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold whitespace-nowrap transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3.5 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder={isBn ? 'আপনার প্রশ্নটি এখানে লিখুন...' : 'Type your investment question here...'}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMsg.trim()}
                  className="px-5 py-2.5 rounded-2xl gradient-agro text-white font-black text-xs shadow hover:brightness-110 disabled:opacity-50 transition"
                >
                  {isBn ? 'পাঠান ↵' : 'Send ↵'}
                </button>
              </form>

            </div>

            {/* RIGHT: INTERACTIVE SIMULATOR & PROKOLPO DIVERSIFICATION PREVIEW */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-7 space-y-6">
              
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {isBn ? 'লাইভ রিটার্ন ও বন্টন সিমুলেটর' : 'Live ROI & Allocation Simulator'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {isBn ? 'আপনার বিনিয়োগের সরাসরি হিসেব' : 'Project Your Investment & Allocation'}
                </h3>
              </div>

              {/* Amount Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{isBn ? 'বিনিয়োগের পরিমাণ (টাকা)' : 'Investment Amount (BDT)'}</span>
                  <span className="font-mono font-black text-emerald-700 text-base">{formatBDT(simAmount, lang)}</span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="1000000"
                  step="25000"
                  value={simAmount}
                  onChange={(e) => setSimAmount(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{isBn ? '৳২৫,০০০' : '৳25,000'}</span>
                  <span>{isBn ? '৳৫,০০,০০০' : '৳500,000'}</span>
                  <span>{isBn ? '৳১০,০০,০০০' : '৳1,000,000'}</span>
                </div>
              </div>

              {/* Project Select */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">{isBn ? 'সমন্বিত প্রকল্প নির্বাচন' : 'Choose Integrated Project'}</label>
                <select
                  value={selectedProject?._id || ''}
                  onChange={(e) => {
                    const found = projects.find(p => (p._id || p.id) === e.target.value);
                    if (found) setSelectedProject(found);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {isBn ? p.banglaTitle || p.title : p.title} (+{p.expectedReturn}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Payout Summary Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{isBn ? 'প্রত্যাশিত লাভ' : 'Estimated Profit'}</span>
                  <span className="text-lg font-black text-emerald-700">+{formatBDT(estProfit, lang)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">{isBn ? 'মেয়াদ শেষে মোট প্রাপ্তি' : 'Total Maturity Payout'}</span>
                  <span className="text-lg font-black text-slate-900">{formatBDT(estTotal, lang)}</span>
                </div>
              </div>

              {/* LIVE PROKOLPO ALLOCATION BREAKDOWN (REVEALING THE USER'S EXACT VISION) */}
              <div className="space-y-2.5 bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-amber-900 flex items-center gap-1">
                    <span>✨</span>
                    <span>{isBn ? 'এই টাকা যেভাবে ৪টি প্রকল্পে ভাগ হবে:' : 'Automatic Capital Diversification:'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    {prokolpos.length} {isBn ? 'টি উদ্যোগ' : 'Units'}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  {prokolpos.map((pr, idx) => {
                    const share = Math.round(simAmount * (pr.allocationPercentage / 100));
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-amber-200/90 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{pr.icon || '🌾'}</span>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{isBn ? pr.banglaName || pr.name : pr.name}</div>
                            <div className="text-[10px] text-slate-500">{pr.allocationPercentage}% {isBn ? 'বরাদ্দ' : 'Share'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-700 text-xs">{formatBDT(share, lang)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onInvest(proj)}
                className="w-full py-3.5 rounded-2xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>🌱</span>
                <span>{isBn ? 'এই সমন্বিত প্রকল্পে এখনই বিনিয়োগ করুন' : 'Invest in This Integrated Project'}</span>
              </button>

            </div>

          </div>

        </div>
      );
    }
