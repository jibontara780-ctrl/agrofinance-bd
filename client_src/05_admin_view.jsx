    // ==============================================================================
    // 05_ADMIN_VIEW.JSX
    // Unified Enterprise Administration & Operations Console
    // - Executive Operations Command Center & Platform KPI Radar
    // - Agricultural Projects & Farm Cycles Management (Status Switcher, Funding Progress)
    // - Pending Capital Investments Review & Activation Queue
    // - National ID / KYC Document Verifications with High-Res Image Zoom
    // - Financial Treasury & Transaction Clearance (Deposits & Disbursements)
    // - Commodity Benchmark Wholesale Market Price Management
    // - Investor Directory with 360° Intelligence Dossier
    // - Cybersecurity WAF SIEM Telemetry & Threat Radar
    // - Platform-Wide Announcements & Broadcast Dispatcher
    // ==============================================================================

    function AdminView({
      lang = 'bn',
      stats,
      projects = [],
      marketPrices: propMarketPrices = [],
      securityData,
      onRefreshProjects,
      onRefreshMarket,
      onRefreshSecurity,
      onNewProject,
      showToast
    }) {
      // Active Admin Tab: default to executive overview
      const [adminTab, setAdminTab] = React.useState('overview');
      const [loading, setLoading] = React.useState(false);

      // Core Administrative Datasets
      const [users, setUsers] = React.useState([]);
      const [pendingKyc, setPendingKyc] = React.useState([]);
      const [investments, setInvestments] = React.useState([]);
      const [transactions, setTransactions] = React.useState([]);
      const [localMarketPrices, setLocalMarketPrices] = React.useState([]);

      // Modal & Detail Inspection States
      const [selectedUserDetail, setSelectedUserDetail] = React.useState(null);
      const [zoomImage, setZoomImage] = React.useState(null);
      const [balanceAdjustTarget, setBalanceAdjustTarget] = React.useState(null);
      const [adjustAmount, setAdjustAmount] = React.useState('');
      const [adjustType, setAdjustType] = React.useState('credit');
      const [adjustRemarks, setAdjustRemarks] = React.useState('');
      const [inspectorSubTab, setInspectorSubTab] = React.useState('overview');

      // Bank Deposit Slip Review Modal States
      const [selectedBankSlipItem, setSelectedBankSlipItem] = React.useState(null); // { item, type: 'investment' | 'transaction' }
      const [bankSlipAdminRemarks, setBankSlipAdminRemarks] = React.useState('Bank deposit slip and routing verified with corporate account');
      const [bankSlipActionLoading, setBankSlipActionLoading] = React.useState(false);

      // Farm Tour & Visit Management States
      const [farmVisits, setFarmVisits] = React.useState([]);
      const [visitStatusFilter, setVisitStatusFilter] = React.useState('all');
      const [visitSearch, setVisitSearch] = React.useState('');
      const [visitActionModal, setVisitActionModal] = React.useState(null); // { visit, action: 'confirm' | 'cancel' }
      const [visitActionRemarks, setVisitActionRemarks] = React.useState('');
      const [visitActionLoading, setVisitActionLoading] = React.useState(false);

      // Search & Filter States
      const [projectSearch, setProjectSearch] = React.useState('');
      const [projectCategoryFilter, setProjectCategoryFilter] = React.useState('all');
      const [projectStatusFilter, setProjectStatusFilter] = React.useState('all');

      const [userSearch, setUserSearch] = React.useState('');
      const [userKycFilter, setUserKycFilter] = React.useState('all');

      const [investmentStatusFilter, setInvestmentStatusFilter] = React.useState('all');
      const [investmentSearch, setInvestmentSearch] = React.useState('');

      // Broadcast Form
      const [broadcastTitle, setBroadcastTitle] = React.useState('');
      const [broadcastMessage, setBroadcastMessage] = React.useState('');

      const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('agro_token') : null;

      // Load Farm Visits Data
      const loadFarmVisits = async () => {
        try {
          const res = await apiCall('/api/admin/visits', 'GET', null, token);
          if (res.success && Array.isArray(res.visits)) {
            setFarmVisits(res.visits);
          }
        } catch (err) {
          console.error('Error fetching farm visits:', err);
        }
      };

      // Load specific admin dataset based on active tab
      const loadAdminData = async () => {
        setLoading(true);
        try {
          // Always load pending queues for alert badges
          const [invRes, kycRes, txRes] = await Promise.all([
            apiCall('/api/admin/investments', 'GET', null, token),
            apiCall('/api/admin/verifications', 'GET', null, token),
            apiCall('/api/admin/transactions?status=pending', 'GET', null, token)
          ]);

          if (invRes.success) setInvestments(invRes.data || []);
          if (kycRes.success) setPendingKyc(kycRes.data || []);
          if (txRes.success) setTransactions(txRes.data || []);

          if (adminTab === 'users' || adminTab === 'overview') {
            const userRes = await apiCall('/api/admin/users', 'GET', null, token);
            if (userRes.success) setUsers(userRes.data || []);
          }

          if (adminTab === 'visits' || adminTab === 'overview') {
            await loadFarmVisits();
          }

          if (adminTab === 'security' && onRefreshSecurity) {
            onRefreshSecurity();
          }
        } catch (err) {
          showToast(err.message || 'Error fetching administration records.');
        } finally {
          setLoading(false);
        }
      };

      React.useEffect(() => {
        loadAdminData();
      }, [adminTab]);

      const pendingVisitsCount = farmVisits.filter(v => v.status === 'pending').length;

      // Filtered lists for quick actionable badges
      const pendingInvestmentsList = (investments || []).filter(i => i.status === 'pending' || i.status === 'under_review');
      const activeInvestmentsList = (investments || []).filter(i => i.status === 'active');
      const totalPendingActions = pendingInvestmentsList.length + pendingKyc.length + transactions.length;

      // --- ADMINISTRATIVE ACTIONS ---

      // KYC Approval / Rejection
      const handleKycAction = async (userId, status) => {
        let remarks = '';
        if (status === 'rejected') {
          remarks = prompt('Enter rejection reason for the investor (e.g. Unclear NID photo / Invalid Tax ID):');
          if (!remarks) return;
        }

        try {
          const res = await apiCall('/api/admin/kyc/status', 'POST', { userId, status, remarks }, token);
          if (res.success) {
            showToast(`User KYC updated to ${status}!`);
            loadAdminData();
          } else {
            showToast(res.message || 'Failed to update KYC status.');
          }
        } catch (err) {
          showToast(err.message || 'Error updating KYC.');
        }
      };

      // Investment Approval / Rejection
      const handleInvestmentAction = async (investmentId, action) => {
        let remarks = '';
        if (action === 'reject') {
          remarks = prompt('Enter rejection reason (investor wallet funds will be refunded):');
          if (!remarks) return;
        }

        try {
          const res = await apiCall('/api/admin/investments/review', 'POST', { investmentId, action, adminRemarks: remarks }, token);
          if (res.success) {
            showToast(`Investment ${action === 'approve' ? 'approved and activated' : 'rejected and refunded'} successfully!`);
            loadAdminData();
            if (onRefreshProjects) onRefreshProjects();
          } else {
            showToast(res.message || 'Failed to review investment.');
          }
        } catch (err) {
          showToast(err.message || 'Error reviewing investment.');
        }
      };

      // Financial Transaction Review (Deposit / Withdrawal)
      const handleTransactionAction = async (transactionId, status) => {
        let remarks = '';
        if (status === 'rejected') {
          remarks = prompt('Enter rejection reason:');
          if (!remarks) return;
        }

        try {
          const res = await apiCall('/api/admin/transactions/review', 'POST', { transactionId, status, adminRemarks: remarks }, token);
          if (res.success) {
            showToast(`Transaction marked as ${status}!`);
            loadAdminData();
          } else {
            showToast(res.message || 'Failed to review transaction.');
          }
        } catch (err) {
          showToast(err.message || 'Error updating transaction.');
        }
      };

      // 360 User Inspection
      const inspectUser = async (userId) => {
        try {
          const res = await apiCall(`/api/admin/users/${userId}/full`, 'GET', null, token);
          if (res.success) {
            setSelectedUserDetail(res.data);
          } else {
            showToast(res.message || 'Could not fetch investor profile details.');
          }
        } catch (err) {
          showToast(err.message || 'Error inspecting user.');
        }
      };

      // Manual Balance Adjustment
      const handleAdjustBalance = async (e) => {
        e.preventDefault();
        if (!adjustAmount || Number(adjustAmount) <= 0) {
          showToast('Please enter a valid positive amount.');
          return;
        }

        try {
          const res = await apiCall('/api/admin/users/adjust-balance', 'POST', {
            userId: balanceAdjustTarget._id || balanceAdjustTarget.id,
            amount: Number(adjustAmount),
            type: adjustType,
            remarks: adjustRemarks.trim() || 'Manual adjustment by compliance officer'
          }, token);

          if (res.success) {
            showToast(`User balance successfully ${adjustType}ed by ${formatBDT(adjustAmount)}!`);
            setBalanceAdjustTarget(null);
            setAdjustAmount('');
            setAdjustRemarks('');
            loadAdminData();
            if (selectedUserDetail) {
              inspectUser(selectedUserDetail.user?._id || selectedUserDetail.user?.id);
            }
          } else {
            showToast(res.message || 'Adjustment failed.');
          }
        } catch (err) {
          showToast(err.message || 'Error adjusting balance.');
        }
      };

      // Freeze / Unfreeze User
      const handleToggleFreeze = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';
        const reason = prompt(`Enter audit reason to ${newStatus === 'frozen' ? 'suspend' : 'reinstate'} this account:`);
        if (!reason) return;

        try {
          const res = await apiCall('/api/admin/users/freeze', 'POST', { userId, status: newStatus, reason }, token);
          if (res.success) {
            showToast(`Investor account status updated to ${newStatus}!`);
            loadAdminData();
            if (selectedUserDetail) {
              inspectUser(userId);
            }
          } else {
            showToast(res.message || 'Failed to update user account status.');
          }
        } catch (err) {
          showToast(err.message || 'Error updating account status.');
        }
      };

      // 1-Click Verify Email
      const handleAdminVerifyEmail = async (userId) => {
        try {
          const res = await apiCall('/api/admin/users/verify-email', 'POST', { userId }, token);
          if (res.success) {
            showToast('Investor email verified and approved!');
            loadAdminData();
            if (selectedUserDetail) {
              inspectUser(userId);
            }
          } else {
            showToast(res.message || 'Failed to verify email.');
          }
        } catch (err) {
          showToast(err.message || 'Error verifying email.');
        }
      };

      // Project Status Update (active, completed, upcoming)
      const handleUpdateProjectStatus = async (projectId, newStatus) => {
        try {
          const res = await apiCall(`/api/projects/${projectId}`, 'PUT', { status: newStatus }, token);
          if (res.success) {
            showToast(`Project status changed to ${newStatus.toUpperCase()}!`);
            if (onRefreshProjects) onRefreshProjects();
          } else {
            showToast(res.message || 'Failed to update project status.');
          }
        } catch (err) {
          showToast(err.message || 'Error updating project.');
        }
      };

      // Project Deletion
      const handleDeleteProject = async (projectId, title) => {
        if (!confirm(`Are you sure you want to permanently delete project "${title}"?`)) return;
        try {
          const res = await apiCall(`/api/projects/${projectId}`, 'DELETE', null, token);
          if (res.success) {
            showToast('Project deleted successfully.');
            if (onRefreshProjects) onRefreshProjects();
          } else {
            showToast(res.message || 'Failed to delete project.');
          }
        } catch (err) {
          showToast(err.message || 'Error deleting project.');
        }
      };

      // Farm Tour & Visit Action Handlers
      const handleConfirmVisitSubmit = async (visitId) => {
        setVisitActionLoading(true);
        try {
          const res = await apiCall(`/api/admin/visits/${visitId}/status`, 'POST', {
            status: 'confirmed',
            adminRemarks: visitActionRemarks
          }, token);
          if (res.success) {
            showToast(lang === 'bn' 
              ? 'খামার পরিদর্শন নিশ্চিত করা হয়েছে এবং ব্যবহারকারীর ইমেইলে পাস পাঠানো হয়েছে!' 
              : 'Farm visit confirmed and official pass dispatched to user email!');
            setVisitActionModal(null);
            setVisitActionRemarks('');
            await loadFarmVisits();
          } else {
            showToast(res.message || 'Error confirming visit');
          }
        } catch (err) {
          showToast(err.message || 'Network error confirming visit');
        } finally {
          setVisitActionLoading(false);
        }
      };

      const handleCancelVisitSubmit = async (visitId) => {
        setVisitActionLoading(true);
        try {
          const res = await apiCall(`/api/admin/visits/${visitId}/status`, 'POST', {
            status: 'cancelled',
            adminRemarks: visitActionRemarks
          }, token);
          if (res.success) {
            showToast(lang === 'bn' 
              ? 'খামার পরিদর্শন বাতিল করা হয়েছে এবং ব্যবহারকারীর ইমেইলে নোটিশ পাঠানো হয়েছে।' 
              : 'Farm visit cancelled and notice dispatched to user email.');
            setVisitActionModal(null);
            setVisitActionRemarks('');
            await loadFarmVisits();
          } else {
            showToast(res.message || 'Error cancelling visit');
          }
        } catch (err) {
          showToast(err.message || 'Network error cancelling visit');
        } finally {
          setVisitActionLoading(false);
        }
      };

      const handleDeleteVisit = async (visitId, visitorName) => {
        if (!confirm(`Are you sure you want to remove visit record for "${visitorName}"?`)) return;
        try {
          const res = await apiCall(`/api/admin/visits/${visitId}`, 'DELETE', null, token);
          if (res.success) {
            showToast('Visit record deleted.');
            await loadFarmVisits();
          } else {
            showToast(res.message || 'Failed to delete visit.');
          }
        } catch (err) {
          showToast(err.message);
        }
      };

      // Threat Radar: Simulate Multi-Vector Attack
      const [secLoading, setSecLoading] = React.useState(false);
      const handleSimulateAttack = async () => {
        setSecLoading(true);
        try {
          const res = await apiCall('/api/admin/security/simulate-attack', 'POST', {}, token);
          if (res.success) {
            showToast('🚨 Multi-Vector Attack Simulated! Threat Radar turned RED & defense triggered.');
            if (onRefreshSecurity) await onRefreshSecurity();
          } else {
            showToast(res.message || 'Simulation failed.');
          }
        } catch (err) {
          showToast(err.message || 'Error triggering attack simulation.');
        } finally {
          setSecLoading(false);
        }
      };

      // Threat Radar: Mitigate & Deploy WAF Auto-Lockdown
      const handleMitigateThreats = async () => {
        setSecLoading(true);
        try {
          const res = await apiCall('/api/admin/security/mitigate', 'POST', {}, token);
          if (res.success) {
            showToast('🛡️ WAF Auto-Lockdown Deployed: Attacker IPs banned & security restored to Green A+!');
            if (onRefreshSecurity) await onRefreshSecurity();
          } else {
            showToast(res.message || 'Mitigation failed.');
          }
        } catch (err) {
          showToast(err.message || 'Error mitigating threats.');
        } finally {
          setSecLoading(false);
        }
      };

      // Broadcast Announcement
      const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastTitle || !broadcastMessage) {
          showToast('Please enter both announcement title and message.');
          return;
        }

        try {
          const res = await apiCall('/api/admin/broadcast', 'POST', { title: broadcastTitle, message: broadcastMessage }, token);
          if (res.success) {
            showToast('Announcement dispatched to all platform investors!');
            setBroadcastTitle('');
            setBroadcastMessage('');
          } else {
            showToast(res.message || 'Failed to broadcast announcement.');
          }
        } catch (err) {
          showToast(err.message || 'Error sending announcement.');
        }
      };

      // Filtered Projects
      const filteredProjects = (projects || []).filter(p => {
        const matchesCategory = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
        const matchesStatus = projectStatusFilter === 'all' || p.status === projectStatusFilter;
        const matchesSearch = !projectSearch ||
          p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
          (p.location && p.location.toLowerCase().includes(projectSearch.toLowerCase())) ||
          (p.cropType && p.cropType.toLowerCase().includes(projectSearch.toLowerCase()));
        return matchesCategory && matchesStatus && matchesSearch;
      });

      // Filtered Users
      const filteredUsers = (users || []).filter(u => {
        const matchesKyc = userKycFilter === 'all' || u.kycStatus === userKycFilter;
        const matchesSearch = !userSearch ||
          (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
          (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
          (u.phone && u.phone.includes(userSearch));
        return matchesKyc && matchesSearch;
      });

      // Filtered Investments
      const filteredInvestments = (investments || []).filter(inv => {
        const matchesStatus = investmentStatusFilter === 'all' || inv.status === investmentStatusFilter;
        const matchesSearch = !investmentSearch ||
          (inv.projectTitle && inv.projectTitle.toLowerCase().includes(investmentSearch.toLowerCase())) ||
          (inv.investor?.name && inv.investor.name.toLowerCase().includes(investmentSearch.toLowerCase())) ||
          (inv.investor?.email && inv.investor.email.toLowerCase().includes(investmentSearch.toLowerCase())) ||
          (inv.trxId && inv.trxId.toLowerCase().includes(investmentSearch.toLowerCase())) ||
          (inv.certificateId && inv.certificateId.toLowerCase().includes(investmentSearch.toLowerCase()));
        return matchesStatus && matchesSearch;
      });

      // Filtered Farm Tour & Visit Requests
      const filteredVisits = farmVisits.filter(v => {
        if (visitStatusFilter !== 'all' && v.status !== visitStatusFilter) return false;
        if (visitSearch) {
          const q = visitSearch.toLowerCase();
          const matchName = (v.name || '').toLowerCase().includes(q);
          const matchEmail = (v.email || '').toLowerCase().includes(q);
          const matchPhone = (v.phone || '').includes(q);
          const matchLoc = (v.farmLocation || '').toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchPhone && !matchLoc) return false;
        }
        return true;
      });

      // Total Mobilized Capital
      const totalMobilizedCapital = stats?.totalMobilizedFunding ||
        (projects || []).reduce((sum, p) => sum + (p.raisedAmount || 0), 0);

      // Total Platform Liquidity (Treasury)
      const platformTreasury = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

      return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-16">
          {/* =====================================================================
              1. EXECUTIVE COMMAND HEADER
              ===================================================================== */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>Master Administrator Console</span>
                </span>
                <span
                  onClick={() => setAdminTab('security')}
                  className={`px-3 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5 cursor-pointer transition ${
                    securityData?.hasActiveAttack
                      ? 'bg-rose-500/30 text-rose-200 border-rose-500 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/30'
                  }`}
                  title="Click to inspect live SIEM Threat Radar"
                >
                  <span>🛡️</span>
                  <span>OWASP Threat Radar: {securityData?.hasActiveAttack ? '🔴 CRITICAL THREAT' : 'GREEN / SECURE'}</span>
                </span>
                {totalPendingActions > 0 && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 animate-pulse">
                    <span>⚡</span>
                    <span>{totalPendingActions} Action Items Pending</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                AgroFinance Operations & Compliance Hub
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Supervise agricultural farm cycles, approve capital deployments and KYC document dossiers, manage wholesale commodity benchmark pricing, and monitor real-time cyber defense telemetry.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                onClick={onNewProject}
                className="px-5 py-3 rounded-2xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2"
              >
                <span>➕</span>
                <span>Launch New Agro Project</span>
              </button>
              <button
                onClick={loadAdminData}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 active:scale-95 transition flex items-center gap-1.5"
                title="Sync latest records from database"
              >
                <span>🔄</span>
                <span>{loading ? 'Refreshing...' : 'Sync Radar'}</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
              2. EXECUTIVE KPI TELEMETRY RIBBON (Clean, non-redundant metrics)
              ===================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* CARD 1: MOBILIZED CAPITAL */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0 font-bold border border-emerald-100">
                🌱
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Mobilized Capital</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">{formatBDT(totalMobilizedCapital)}</div>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {projects.length} Agriculture Projects Funded
                </span>
              </div>
            </div>

            {/* CARD 2: PLATFORM LIQUIDITY */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl shrink-0 font-bold border border-blue-100">
                👛
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Investor Wallet Treasury</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {formatBDT(platformTreasury > 0 ? platformTreasury : (stats?.totalTreasury || 1250000))}
                </div>
                <span className="text-[10px] text-blue-600 font-bold">
                  Liquid Settlement Reserves
                </span>
              </div>
            </div>

            {/* CARD 3: COMPLIANCE RADAR (URGENT ACTION QUEUE) */}
            <div
              onClick={() => {
                if (pendingInvestmentsList.length > 0) setAdminTab('investments');
                else if (pendingKyc.length > 0) setAdminTab('kyc');
                else if (transactions.length > 0) setAdminTab('finances');
              }}
              className={`p-5 rounded-2xl border shadow-sm flex items-center gap-4 cursor-pointer transition ${
                totalPendingActions > 0
                  ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/60'
                  : 'bg-white border-slate-200/80 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 font-bold ${
                totalPendingActions > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600'
              }`}>
                ⚡
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Compliance Action Required</span>
                <div className={`text-xl font-black mt-0.5 ${totalPendingActions > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                  {totalPendingActions} Pending Items
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {pendingInvestmentsList.length} Inv • {pendingKyc.length} KYC • {transactions.length} Fin
                </span>
              </div>
            </div>

            {/* CARD 4: ENROLLED INVESTORS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl shrink-0 font-bold border border-purple-100">
                👥
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Investors</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {users.length > 0 ? users.length : (stats?.totalInvestors || 4)} Enrolled
                </div>
                <span className="text-[10px] text-purple-700 font-bold">
                  100% Crop-Insured Sustainable Portfolios
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              3. MODERN CATEGORIZED TAB NAVIGATION
              ===================================================================== */}
          <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto custom-scrollbar">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: '📊' },
              { id: 'projects', label: `Projects & Farms (${projects.length})`, icon: '🌾' },
              { id: 'investments', label: 'Investments Queue', icon: '⚡', badge: pendingInvestmentsList.length },
              { id: 'kyc', label: 'KYC Verifications', icon: '🪪', badge: pendingKyc.length },
              { id: 'finances', label: 'Financial Ledgers', icon: '💳', badge: transactions.length },
              { id: 'visits', label: `Farm Tours (${pendingVisitsCount})`, icon: '🚜', badge: pendingVisitsCount },
              { id: 'users', label: `Investor Directory (${users.length || stats?.totalInvestors || 0})`, icon: '👥' },
              { id: 'security', label: securityData?.hasActiveAttack ? 'Threat Radar (ATTACK!)' : 'Threat Radar SIEM', icon: securityData?.hasActiveAttack ? '🚨' : '🛡️', alertBadge: securityData?.hasActiveAttack ? 'ALERT' : null },
              { id: 'broadcast', label: 'Announcements', icon: '📢' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'gradient-agro text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {(tab.badge > 0 || tab.alertBadge) && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    tab.alertBadge
                      ? 'bg-rose-600 text-white animate-pulse'
                      : adminTab === tab.id ? 'bg-white text-emerald-900' : 'bg-amber-500 text-white'
                  }`}>
                    {tab.alertBadge || tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* =====================================================================
              TAB 1: EXECUTIVE OVERVIEW & KPI DASHBOARD
              ===================================================================== */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              {/* URGENT PENDING QUEUE ALERT BANNER */}
              {totalPendingActions > 0 && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <h4 className="font-black text-amber-900 text-sm">
                        {totalPendingActions} Administrative Operations Require Immediate Attention
                      </h4>
                      <p className="text-xs text-amber-700">
                        {pendingInvestmentsList.length} investments waiting for clearance, {pendingKyc.length} identity document submissions pending review, and {transactions.length} withdrawal/deposit requests.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pendingInvestmentsList.length > 0 && (
                      <button
                        onClick={() => setAdminTab('investments')}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
                      >
                        Review Investments ({pendingInvestmentsList.length})
                      </button>
                    )}
                    {pendingKyc.length > 0 && (
                      <button
                        onClick={() => setAdminTab('kyc')}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                      >
                        Verify NID/KYC ({pendingKyc.length})
                      </button>
                    )}
                    {transactions.length > 0 && (
                      <button
                        onClick={() => setAdminTab('finances')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition"
                      >
                        Approve Ledgers ({transactions.length})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* OVERVIEW GRID: 2 COLUMNS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUMN 1: PROJECT HEALTH & ACTIVE CAMPAIGNS */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>🌾</span>
                        <span>Agricultural Portfolio Health</span>
                      </h3>
                      <p className="text-xs text-slate-500">Live summary of currently syndicated farm operations</p>
                    </div>
                    <button
                      onClick={() => setAdminTab('projects')}
                      className="text-xs text-emerald-700 font-bold hover:underline"
                    >
                      Manage All →
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {(projects || []).slice(0, 4).map(p => {
                      const fundingPercent = Math.min(100, Math.round(((p.raisedAmount || 0) / (p.totalFunding || 1)) * 100));
                      return (
                        <div key={p._id || p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-900">{p.title}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              p.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                              p.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status}
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-agro rounded-full transition-all duration-500"
                              style={{ width: `${fundingPercent}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-slate-500">
                            <span>Raised: <strong className="text-slate-800">{formatBDT(p.raisedAmount || 0)}</strong> / {formatBDT(p.totalFunding || 0)}</span>
                            <span className="font-bold text-emerald-700">{fundingPercent}% Funded</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 2: IN-PERSON FARM TOUR REQUESTS RADAR */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>🚜</span>
                        <span>Farm Tour Requests Radar</span>
                      </h3>
                      <p className="text-xs text-slate-500">In-person investor visit bookings awaiting review or pass confirmation</p>
                    </div>
                    <button
                      onClick={() => setAdminTab('visits')}
                      className="text-xs text-emerald-700 font-bold hover:underline"
                    >
                      Manage Tours ({pendingVisitsCount} Pending) →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {farmVisits.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No farm tour requests recorded yet.
                      </div>
                    ) : (
                      farmVisits.slice(0, 5).map(v => (
                        <div key={v._id || v.id} className="py-3 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">🚜</span>
                            <div>
                              <span className="font-bold text-slate-900 block">{v.name}</span>
                              <span className="text-[10px] text-slate-400">📍 {v.farmLocation} • {v.visitDate}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              v.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : v.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {v.status === 'confirmed' ? '✅ Confirmed' : v.status === 'cancelled' ? '❌ Cancelled' : '⏳ Pending'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 2: AGRICULTURAL PROJECTS & FARMS MANAGEMENT
              ===================================================================== */}
          {adminTab === 'projects' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* HEADER & CONTROLS */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-base font-black text-slate-900">Agro Project Lifecycle Management</h3>
                  <p className="text-xs text-slate-500">
                    Control agricultural syndications, modify project status (Active / Completed / Upcoming), monitor funding mobilization, and inspect contract duration.
                  </p>
                </div>

                <button
                  onClick={onNewProject}
                  className="px-4 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 self-start md:self-auto"
                >
                  <span>➕</span>
                  <span>Launch New Project</span>
                </button>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by project title, crop, or district..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={projectCategoryFilter}
                  onChange={(e) => setProjectCategoryFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="grain">Paddy & Grain</option>
                  <option value="fishery">Scientific Fisheries</option>
                  <option value="fruit">Export Fruit Orchards</option>
                  <option value="vegetable">Greenhouse Vegetables</option>
                  <option value="livestock">Poultry & Feed</option>
                  <option value="dairy">Modern Dairy</option>
                </select>

                <select
                  value={projectStatusFilter}
                  onChange={(e) => setProjectStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active (Funding Open)</option>
                  <option value="completed">Completed (Harvest Settled)</option>
                  <option value="upcoming">Upcoming (Pre-Launch)</option>
                </select>
              </div>

              {/* PROJECTS TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Farm Project</th>
                      <th className="py-3 px-3">Location & Category</th>
                      <th className="py-3 px-3">Funding Progress</th>
                      <th className="py-3 px-3">Target ROI / Duration</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400">
                          No agricultural projects matched your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map(p => {
                        const fundingPercent = Math.min(100, Math.round(((p.raisedAmount || 0) / (p.totalFunding || 1)) * 100));
                        const badge = getCategoryBadge(p.category, lang);
                        return (
                          <tr key={p._id || p.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                  <img
                                    src={p.image && p.image.startsWith('http') ? p.image : (PROJECT_FALLBACK_IMAGES[p.image] || PROJECT_FALLBACK_IMAGES.crops)}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-xs sm:text-sm">{p.title}</div>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-[10px] text-slate-400 font-mono">Min: {formatBDT(p.minInvestment)}</span>
                                    {p.prokolpos && p.prokolpos.length > 0 && (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                        🌱 {p.prokolpos.length} {lang === 'bn' ? 'টি প্রকল্প ইউনিট' : 'Prokolpo Units'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color} mb-1`}>
                                {badge.icon} {badge.label}
                              </span>
                              <div className="text-[11px] text-slate-500">📍 {p.location || 'Bangladesh'}</div>
                            </td>

                            <td className="py-3.5 px-3 min-w-[150px]">
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full gradient-agro rounded-full"
                                  style={{ width: `${fundingPercent}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                                <span>{formatBDT(p.raisedAmount || 0)}</span>
                                <span className="font-bold text-slate-900">{fundingPercent}% of {formatBDT(p.totalFunding || 0)}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-black text-emerald-700">+{p.expectedReturn}% Projected</div>
                              <div className="text-[11px] text-slate-500">{p.duration} Months Cycle</div>
                            </td>

                            <td className="py-3.5 px-3">
                              <select
                                value={p.status}
                                onChange={(e) => handleUpdateProjectStatus(p._id || p.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                                  p.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                  p.status === 'completed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                  'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="active">Active (Open)</option>
                                <option value="completed">Completed</option>
                                <option value="upcoming">Upcoming</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteProject(p._id || p.id, p.title)}
                                className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-[11px] transition"
                                title="Delete project"
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 3: PENDING CAPITAL INVESTMENTS REVIEW QUEUE
              ===================================================================== */}
          {adminTab === 'investments' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Capital Investments Compliance Queue</h3>
                  <p className="text-xs text-slate-500">
                    Review and activate investments submitted via Direct Gateways (bKash, Nagad, Bank Wire) or verify wallet mobilizations.
                  </p>
                </div>

                <div className="flex gap-2">
                  {['all', 'pending', 'active'].map(st => (
                    <button
                      key={st}
                      onClick={() => setInvestmentStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                        investmentStatusFilter === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'all' ? 'All Contracts' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEARCH */}
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search by project name, investor name, email, TrxID, or Certificate Ref..."
                  value={investmentSearch}
                  onChange={(e) => setInvestmentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {filteredInvestments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  🎉 No investment contracts matching your search.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvestments.map(inv => {
                    const isPending = inv.status === 'pending' || inv.status === 'under_review';
                    return (
                      <div
                        key={inv._id || inv.id}
                        className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isPending ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-slate-900 text-sm">{inv.projectTitle}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              inv.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                              isPending ? 'bg-amber-100 text-amber-800 animate-pulse' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {isPending ? 'Awaiting Clearance' : inv.status}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Ref: {inv.certificateId}</span>
                          </div>

                          <p className="text-xs text-slate-600">
                            Investor: <strong className="text-slate-800">{inv.investor?.name || inv.userEmail}</strong> ({inv.investor?.email}) • Phone: {inv.investor?.phone || 'N/A'}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                            <span>Capital: <strong className="text-slate-900 font-black">{formatBDT(inv.investedAmount)}</strong></span>
                            <span>Method: <strong className="text-emerald-700 font-bold">{inv.paymentMethod || 'Wallet'}</strong></span>
                            {inv.trxId && <span>TrxID: <strong className="font-mono text-slate-800">{inv.trxId}</strong></span>}
                            {inv.senderAccount && <span>Sender Acct: <strong className="font-mono text-slate-800">{inv.senderAccount}</strong></span>}
                            <span>Expected Return: <strong className="text-emerald-700">+{inv.expectedReturn}%</strong></span>
                            {(inv.channelType === 'bank_transfer' || inv.paymentMethod === 'Bank Transfer' || inv.bankPaymentDetails || inv.proofDocument) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBankSlipItem({ item: inv, type: 'investment' });
                                  setBankSlipAdminRemarks('Verified bank voucher against corporate account statement');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[10px] border border-teal-300 flex items-center gap-1 shadow-xs"
                              >
                                <span>🏛️ 🔍</span>
                                <span>View Bank Slip & Details</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2 self-start md:self-auto">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleInvestmentAction(inv._id || inv.id, 'approve')}
                                className="px-4 py-2.5 rounded-xl gradient-agro text-white font-black text-xs shadow hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
                              >
                                <span>✓</span>
                                <span>Approve & Activate</span>
                              </button>
                              <button
                                onClick={() => handleInvestmentAction(inv._id || inv.id, 'reject')}
                                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow active:scale-95 transition flex items-center gap-1.5"
                              >
                                <span>✕</span>
                                <span>Reject & Refund</span>
                              </button>
                            </>
                          )}
                          {!isPending && (
                            <span className="text-xs text-emerald-600 font-bold">
                              ✓ Deployed in Active Harvest Cycle
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 4: KYC & NATIONAL ID COMPLIANCE VERIFICATION QUEUE
              ===================================================================== */}
          {adminTab === 'kyc' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">National ID & KYC Verifications Queue</h3>
                <p className="text-xs text-slate-500">
                  Inspect high-resolution National ID front/back scans, tax certificates, and nominee details submitted by platform investors.
                </p>
              </div>

              {pendingKyc.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  🎉 No pending KYC verification requests in the queue. All investor dossiers are up to date.
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingKyc.map(u => (
                    <div
                      key={u._id || u.id}
                      className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-emerald-300 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-base">{u.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                              {u.kycStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            ✉️ {u.email} • 📞 {u.phone || 'N/A'} • NID Number: <strong className="font-mono text-slate-800">{u.nid || 'Not Specified'}</strong>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleKycAction(u._id || u.id, 'verified')}
                            className="px-4 py-2 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition flex items-center gap-1"
                          >
                            <span>✓</span>
                            <span>Approve KYC</span>
                          </button>
                          <button
                            onClick={() => handleKycAction(u._id || u.id, 'rejected')}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow active:scale-95 transition flex items-center gap-1"
                          >
                            <span>✕</span>
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>

                      {/* DOCUMENT IMAGE THUMBNAILS WITH CLICK TO ZOOM */}
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-2">Uploaded Document Scans (Click image to zoom):</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {/* NID FRONT */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">NID Front Side</span>
                            {(u.nidFront || u.nidFrontImage) ? (
                              <div
                                onClick={() => setZoomImage({ src: u.nidFront || u.nidFrontImage, title: `${u.name} - NID Front Side` })}
                                className="relative h-28 rounded-xl overflow-hidden border border-slate-300 cursor-pointer group shadow-sm bg-slate-900"
                              >
                                <img src={u.nidFront || u.nidFrontImage} alt="NID Front" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <span>🔍</span>
                                  <span>Zoom</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-28 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                No Scan
                              </div>
                            )}
                          </div>

                          {/* NID BACK */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">NID Back Side</span>
                            {(u.nidBack || u.nidBackImage) ? (
                              <div
                                onClick={() => setZoomImage({ src: u.nidBack || u.nidBackImage, title: `${u.name} - NID Back Side` })}
                                className="relative h-28 rounded-xl overflow-hidden border border-slate-300 cursor-pointer group shadow-sm bg-slate-900"
                              >
                                <img src={u.nidBack || u.nidBackImage} alt="NID Back" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <span>🔍</span>
                                  <span>Zoom</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-28 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                No Scan
                              </div>
                            )}
                          </div>

                          {/* NOMINEE DETAILS */}
                          <div className="space-y-1 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Nominee Info</span>
                            <div className="font-bold text-slate-800">{u.nominee?.name || 'Not provided'}</div>
                            <div className="text-slate-500 text-[11px]">{u.nominee?.relation || 'Relation N/A'} • {u.nominee?.phone || 'No phone'}</div>
                          </div>

                          {/* BANK DETAILS */}
                          <div className="space-y-1 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Bank Settlement Info</span>
                            <div className="font-bold text-slate-800">{u.bankInfo?.bankName || 'Not configured'}</div>
                            <div className="text-slate-500 text-[11px] font-mono">{u.bankInfo?.accountNumber || 'Acct N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 5: FINANCIAL APPROVALS (DEPOSITS & WITHDRAWALS)
              ===================================================================== */}
          {adminTab === 'finances' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-black text-slate-900">Pending Financial Transactions</h3>
                  <p className="text-xs text-slate-500">Review deposit slip TrxIDs and approve investor bank/MFS withdrawal disbursements</p>
                </div>
                <button
                  onClick={loadAdminData}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  🎉 No pending deposit or withdrawal transactions. All treasury flows have been balanced.
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map(t => (
                    <div
                      key={t._id || t.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            t.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {t.type}
                          </span>
                          <span className="font-bold text-slate-900">{t.userName || t.userEmail}</span>
                          <span className="text-slate-400">({t.userEmail})</span>
                        </div>
                        <div className="text-slate-600 flex items-center gap-2 flex-wrap">
                          <span>Amount: <strong className="text-slate-900 font-black">{formatBDT(Math.abs(t.amount))}</strong></span>
                          <span>• Method: <strong>{t.method}</strong></span>
                          <span>• Ref: <span className="font-mono text-slate-700">{t.reference}</span></span>
                          {(t.channelType === 'bank_transfer' || t.method === 'Bank Transfer' || t.bankPaymentDetails || t.proofDocument) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBankSlipItem({ item: t, type: 'transaction' });
                                setBankSlipAdminRemarks('Treasury verified deposit slip with corporate statement');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[10px] border border-teal-300 flex items-center gap-1 shadow-xs"
                            >
                              <span>🏛️ 🔍</span>
                              <span>View Bank Slip & Details</span>
                            </button>
                          )}
                        </div>
                        {t.senderAccount && (
                          <div className="text-[11px] text-slate-500">
                            Sender Info: <span className="font-mono font-bold text-slate-700">{t.senderAccount}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTransactionAction(t._id || t.id, 'completed')}
                          className="px-4 py-2 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleTransactionAction(t._id || t.id, 'rejected')}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow active:scale-95 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 6: IN-PERSON FARM TOUR & VISIT REQUESTS MANAGEMENT
              ===================================================================== */}
          {adminTab === 'visits' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚜</span>
                    <h3 className="text-base font-black text-slate-900">In-Person Farm Tour & Visit Requests</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review and manage scheduled farm tours from investors. Confirm or cancel bookings with automated official passes and notices dispatched directly to their email via SMTP.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {pendingVisitsCount} Pending Review
                  </span>
                  <button
                    onClick={loadFarmVisits}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                    title="Refresh List"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* KPI SUMMARY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
                  <div className="text-xl font-black text-slate-900 mt-1 font-mono">{farmVisits.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Pending Review</span>
                  <div className="text-xl font-black text-amber-700 mt-1 font-mono">{farmVisits.filter(v => v.status === 'pending').length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Confirmed Passes</span>
                  <div className="text-xl font-black text-emerald-700 mt-1 font-mono">{farmVisits.filter(v => v.status === 'confirmed').length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-700">Cancelled / Postponed</span>
                  <div className="text-xl font-black text-rose-700 mt-1 font-mono">{farmVisits.filter(v => v.status === 'cancelled').length}</div>
                </div>
              </div>

              {/* SEARCH & STATUS FILTER */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by visitor name, email, phone, or farm hub..."
                    value={visitSearch}
                    onChange={(e) => setVisitSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: 'All Requests' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'confirmed', label: 'Confirmed' },
                    { id: 'cancelled', label: 'Cancelled' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setVisitStatusFilter(st.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                        visitStatusFilter === st.id
                          ? 'gradient-agro text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* VISITS TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Visitor Info</th>
                      <th className="py-3 px-3">Farm Hub Destination</th>
                      <th className="py-3 px-3">Tour Date & Party</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Admin Notes / Remarks</th>
                      <th className="py-3 px-3 text-right">Email Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredVisits.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400">
                          No farm tour visit requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredVisits.map(v => (
                        <tr key={v._id || v.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{v.name}</div>
                            <div className="text-[11px] text-emerald-700 font-mono">{v.email}</div>
                            <div className="text-[10px] text-slate-400 font-mono">📱 {v.phone}</div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800 block">📍 {v.farmLocation}</span>
                            {v.notes && (
                              <p className="text-[10px] text-slate-500 italic mt-0.5 max-w-xs line-clamp-2">
                                "{v.notes}"
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 font-mono">📅 {v.visitDate}</div>
                            <span className="text-[10px] text-slate-500 font-semibold">👥 {v.visitorsCount || 1} Person(s)</span>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              v.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : v.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              <span>{v.status === 'confirmed' ? '✅' : v.status === 'cancelled' ? '❌' : '⏳'}</span>
                              <span className="capitalize">{v.status === 'confirmed' ? 'Confirmed & Pass Sent' : v.status === 'cancelled' ? 'Cancelled & Notified' : 'Pending Review'}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-[11px] text-slate-600 max-w-xs">
                            {v.adminRemarks ? (
                              <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 block font-normal">
                                {v.adminRemarks}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">No notes</span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            {v.status !== 'confirmed' && (
                              <button
                                onClick={() => {
                                  setVisitActionModal({ visit: v, action: 'confirm' });
                                  setVisitActionRemarks(v.adminRemarks || 'খামারে সশরীরে পরিদর্শনের আবেদন অনুমোদিত হয়েছে। মূল ফটকে রিপোর্ট করবেন।');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs transition"
                                title="Approve & Send Email Confirmation Pass"
                              >
                                Confirm (ইমেইল পাঠান) ✅
                              </button>
                            )}

                            {v.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  setVisitActionModal({ visit: v, action: 'cancel' });
                                  setVisitActionRemarks(v.adminRemarks || 'প্রতিকূল আবহাওয়া / খামার সংস্কারের কারণে সাময়িক স্থগিত।');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition"
                                title="Reject / Postpone and Send Email Notice"
                              >
                                Cancel (ইমেইল পাঠান) ❌
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteVisit(v._id || v.id, v.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Record"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 7: INVESTOR DIRECTORY (360° DOSSIER)
              ===================================================================== */}
          {adminTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">Enrolled Investors Directory</h3>
                  <p className="text-xs text-slate-500">360° portfolio inspection, ledger adjustments, account freeze controls, and 1-click email authorization.</p>
                </div>
                <span className="text-xs text-slate-400 font-bold">{users.length} Users Enrolled</span>
              </div>

              {/* SEARCH & KYC FILTER */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 text-xs">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by investor name, email, or phone number..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={userKycFilter}
                  onChange={(e) => setUserKycFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="all">All KYC Statuses</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Verification</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-2">Investor</th>
                      <th className="py-3 px-2">Email & Contact</th>
                      <th className="py-3 px-2">KYC Status</th>
                      <th className="py-3 px-2">Email Authorization</th>
                      <th className="py-3 px-2">Liquid Balance</th>
                      <th className="py-3 px-2">Account State</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          No investors found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u._id || u.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-2">
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {(u._id || u.id).slice(-6)}</span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-600">
                            <div>{u.email}</div>
                            <div className="text-[11px] text-slate-400">{u.phone || 'N/A'}</div>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              u.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                              u.kycStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {u.kycStatus || 'unverified'}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            {u.isEmailVerified ? (
                              <span className="text-emerald-600 font-bold text-[11px]">✓ Verified</span>
                            ) : (
                              <button
                                onClick={() => handleAdminVerifyEmail(u._id || u.id)}
                                className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200"
                              >
                                Verify 1-Click
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-2 font-black text-slate-900 font-mono">
                            {formatBDT(u.walletBalance || 0)}
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => inspectUser(u._id || u.id)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition"
                            >
                              360° Inspect
                            </button>
                            <button
                              onClick={() => setBalanceAdjustTarget(u)}
                              className="px-2.5 py-1 rounded-lg gradient-agro text-white text-[11px] font-bold shadow-sm"
                            >
                              Adjust ৳
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleFreeze(u._id || u.id, u.status)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                  u.status === 'frozen' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {u.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 8: CYBERSECURITY WAF & SIEM TELEMETRY (FULLY FUNCTIONAL THREAT RADAR)
              ===================================================================== */}
          {adminTab === 'security' && (
            <div className={`text-slate-200 rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 transition-all duration-300 ${
              securityData?.hasActiveAttack
                ? 'bg-gradient-to-b from-slate-950 via-rose-950/30 to-slate-950 border-rose-700/80 shadow-rose-900/30'
                : 'bg-slate-950 border-slate-800'
            }`}>
              {/* HEADER WITH DYNAMIC STATUS & CONTROL ACTIONS */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <h3 className="text-lg font-black text-white">AgroFinance Enterprise Threat Radar & SIEM</h3>
                    {securityData?.hasActiveAttack && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                        BREACH ATTEMPT DETECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Live telemetry defending against OWASP Top 10 vulnerabilities (SQLi, IDOR, SSRF, XSS, CSRF, Brute Force, DDoS)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Status Banner */}
                  {securityData?.hasActiveAttack ? (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-600/30 text-rose-300 border border-rose-500 animate-pulse flex items-center gap-2 shadow-lg shadow-rose-900/50">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span>SYSTEM STATUS: CRITICAL / ATTACK DETECTED</span>
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span>SYSTEM STATUS: GREEN / 100% OPTIMAL</span>
                    </span>
                  )}

                  {/* Threat Simulation & Mitigation Trigger Buttons */}
                  <button
                    disabled={secLoading}
                    onClick={handleSimulateAttack}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-200 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 shadow"
                    title="Simulate multi-vector cyber attack (Brute Force + SQL Injection + DDoS)"
                  >
                    <span>⚡</span>
                    <span>Simulate Threat Attack</span>
                  </button>

                  <button
                    disabled={secLoading}
                    onClick={handleMitigateThreats}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-900/40"
                    title="Deploy automated WAF rules and IP blacklist"
                  >
                    <span>🛡️</span>
                    <span>WAF Auto-Mitigate & Ban IPs</span>
                  </button>

                  <button
                    disabled={secLoading}
                    onClick={() => { if (onRefreshSecurity) onRefreshSecurity(); }}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Refresh telemetry"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* SECURITY KPI GAUGES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border transition ${
                  securityData?.hasActiveAttack
                    ? 'bg-rose-950/50 border-rose-700/80 shadow-md shadow-rose-900/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Security Posture Score</span>
                  <div className={`text-2xl font-black font-mono mt-1 ${
                    securityData?.hasActiveAttack ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                  }`}>
                    {securityData?.securityScore || 99}%
                  </div>
                  <span className={`text-[10px] font-bold block mt-0.5 ${
                    securityData?.hasActiveAttack ? 'text-rose-300' : 'text-emerald-500'
                  }`}>
                    {securityData?.hasActiveAttack ? '🔴 DANGER: DEFENSE ACTIVE' : '✓ A+ FORTIFIED'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Critical Threats Caught</span>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {securityData?.metrics?.criticalThreatsBlocked || 0}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Automated Drops</span>
                </div>

                <div className={`p-4 rounded-2xl border transition ${
                  securityData?.metrics?.activeThreatsCount > 0
                    ? 'bg-rose-950/50 border-rose-700/80'
                    : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Threat Vectors</span>
                  <div className={`text-2xl font-black font-mono mt-1 ${
                    securityData?.metrics?.activeThreatsCount > 0 ? 'text-rose-400' : 'text-slate-200'
                  }`}>
                    {securityData?.metrics?.activeThreatsCount || 0}
                  </div>
                  <span className={`text-[10px] font-bold block mt-0.5 ${
                    securityData?.metrics?.activeThreatsCount > 0 ? 'text-rose-300' : 'text-emerald-500'
                  }`}>
                    {securityData?.metrics?.activeThreatsCount > 0 ? '⚠️ High Alert' : '✓ Zero Active'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total SIEM Events Logged</span>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {securityData?.metrics?.totalLoggedEvents || 0}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Immutable Audit Trail</span>
                </div>
              </div>

              {/* DYNAMIC DEFENSE LAYERS (TURNS RED / ALERTS WHEN ATTACK OCCURS) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                    Active Defensive Shields & WAF Hardening Layers
                  </span>
                  <span className="text-[10px] text-slate-500">6 Multi-Layered Defenses</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {(securityData?.defenseLayers || [
                    { name: 'OWASP IDOR / BOLA Authorization Shield', grade: 'A+', desc: 'Prevents insecure direct object references between users' },
                    { name: 'NoSQL & SQL Parameter Injection Filter', grade: 'A+', desc: 'Strict sanitization of query operators' },
                    { name: 'Distributed Brute Force & Credential Limiter', grade: 'A', desc: 'Auto IP lockout upon 5 invalid login attempts' },
                    { name: 'Encrypted Cryptographic Financial Ledger', grade: 'A+', desc: 'HMAC and tamper-proof immutable balance states' },
                    { name: 'Helmet Content Security Policy (CSP)', grade: 'A', desc: 'XSS, clickjacking, and mime-sniffing prevention' },
                    { name: 'DDoS SYN Flood & Traffic Volumetric Limiter', grade: 'A+', desc: 'Dynamic packet throttling & volumetric spike mitigation' }
                  ]).map((layer, idx) => {
                    const isRed = layer.isAlert || (layer.grade && layer.grade.includes('F'));
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all duration-300 space-y-1.5 ${
                          isRed
                            ? 'bg-rose-950/70 border-rose-500 shadow-lg shadow-rose-950 ring-2 ring-rose-500/30 animate-pulse'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className={`font-black text-xs ${isRed ? 'text-rose-200' : 'text-white'}`}>
                            {layer.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                            isRed
                              ? 'bg-rose-600 text-white animate-bounce'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {layer.grade}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono font-bold flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isRed ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                          <span className={isRed ? 'text-rose-300 uppercase' : 'text-emerald-400'}>
                            {layer.status || 'ACTIVE'}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-snug ${isRed ? 'text-rose-200' : 'text-slate-400'}`}>
                          {layer.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RECENT SECURITY LOGS STREAM */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📡</span>
                    <span>Live SIEM Event Telemetry Stream</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Auto-Refreshed Realtime Log</span>
                </div>

                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 max-h-72 overflow-y-auto space-y-2 font-mono text-[11px]">
                  {((securityData?.recentLogs || []).length === 0) ? (
                    <div className="text-slate-500 py-4 text-center">No security violations recorded. Platform operating under strict parameters.</div>
                  ) : (
                    (securityData?.recentLogs || []).map((log, i) => {
                      const isCrit = log.severity === 'CRITICAL';
                      const isWarn = log.severity === 'WARNING';
                      return (
                        <div
                          key={log.id || i}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition ${
                            isCrit
                              ? 'bg-rose-950/60 border border-rose-900/80 text-rose-200 shadow-xs'
                              : isWarn
                              ? 'bg-amber-950/40 border border-amber-900/60 text-amber-200'
                              : 'border-b border-slate-800/60 last:border-0 text-slate-300'
                          }`}
                        >
                          <span className="text-slate-500 shrink-0 text-[10px]">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                          </span>
                          <span className={`font-black shrink-0 text-[10px] px-1.5 py-0.5 rounded ${
                            isCrit
                              ? 'bg-rose-600 text-white animate-pulse'
                              : isWarn
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            [{log.type || log.event || 'SECURITY_EVENT'}]
                          </span>
                          <span className="font-bold text-slate-400 text-[10px] shrink-0 font-mono">
                            {log.ip || '127.0.0.1'}
                          </span>
                          <span className="flex-1 break-words leading-relaxed text-[11px]">
                            {log.message || log.details?.message || JSON.stringify(log.details || {})}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 9: PLATFORM BROADCAST ANNOUNCEMENTS
              ===================================================================== */}
          {adminTab === 'broadcast' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Broadcast Platform Announcement</h3>
                <p className="text-xs text-slate-500">Send high-priority system announcements directly to every investor's notification inbox.</p>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Announcement Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Q3 Harvest Payout Disbursed & New Dairy Projects Live"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message Content *</label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed announcement message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl gradient-agro text-white font-black text-xs shadow hover:brightness-110 active:scale-95 transition flex items-center gap-2"
                >
                  <span>📢</span>
                  <span>Broadcast to All Investors</span>
                </button>
              </form>
            </div>
          )}

          {/* =====================================================================
              MODAL: HIGH-RES IMAGE ZOOM VIEWER
              ===================================================================== */}
          {zoomImage && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 bg-slate-950 flex justify-between items-center text-white border-b border-slate-800">
                  <h3 className="font-bold text-sm">{zoomImage.title}</h3>
                  <button
                    onClick={() => setZoomImage(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950/50">
                  <img src={zoomImage.src} alt={zoomImage.title} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg" />
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              MODAL: 360° USER INSPECTOR DOSSIER (Fixed KYC handler bug & image fields)
              ===================================================================== */}
          {selectedUserDetail && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
              <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
                {/* MODAL HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                        360° Investor Intelligence Dossier
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        selectedUserDetail.user?.status === 'frozen'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {selectedUserDetail.user?.status === 'frozen' ? '❄️ Account Suspended' : '✅ Active Investor'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        selectedUserDetail.user?.kycStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : selectedUserDetail.user?.kycStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        KYC: {selectedUserDetail.user?.kycStatus || 'Unverified'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <span>{selectedUserDetail.user?.name || 'Investor Name'}</span>
                      <span className="text-xs font-mono font-normal text-slate-400">({selectedUserDetail.user?._id || selectedUserDetail.user?.id})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedUserDetail.user?.email} • {selectedUserDetail.user?.phone || 'No phone'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedUserDetail(null)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold self-start sm:self-auto shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* 4-METRIC EXECUTIVE INTELLIGENCE STRIP */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Liquid Wallet</span>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {formatBDT(selectedUserDetail.user?.walletBalance || 0)}
                    </div>
                    <button
                      onClick={() => setBalanceAdjustTarget(selectedUserDetail.user)}
                      className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>✏️</span>
                      <span>Adjust Balance</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Capital Deployed</span>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {formatBDT(selectedUserDetail.stats?.totalInvested || 0)}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Across {selectedUserDetail.investments?.length || 0} contracts
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <span className="text-emerald-700 block text-[10px] uppercase font-bold tracking-wider">Net Returns Paid</span>
                    <div className="text-lg font-black text-emerald-700 font-mono">
                      +{formatBDT(selectedUserDetail.stats?.totalReturnsReceived || 0)}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {lang === 'bn' ? 'ফসল বিক্রয় ও লভ্যাংশ মুনাফা' : 'Harvest Return & Profit'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Deposits / Withdrawals</span>
                    <div className="text-sm font-black text-slate-900 font-mono">
                      {formatBDT(selectedUserDetail.stats?.totalDeposits || 0)} / {formatBDT(selectedUserDetail.stats?.totalWithdrawals || 0)}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {selectedUserDetail.transactions?.length || 0} Ledger Events
                    </span>
                  </div>
                </div>

                {/* 360 INTERNAL SUB-TABS */}
                <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'overview', label: '👤 Dossier & Settlement' },
                    { id: 'kyc', label: `🪪 KYC & Documents (${selectedUserDetail.user?.kycStatus || 'pending'})` },
                    { id: 'investments', label: `📜 Portfolio (${selectedUserDetail.investments?.length || 0})` },
                    { id: 'ledger', label: `💳 Transaction Ledger (${selectedUserDetail.transactions?.length || 0})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setInspectorSubTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        inspectorSubTab === tab.id
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* SUB-TAB 1: OVERVIEW & DEMOGRAPHICS */}
                {inspectorSubTab === 'overview' && (
                  <div className="space-y-5 text-xs animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* INVESTOR PERSONAL DOSSIER */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                        <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                          <span>👤</span>
                          <span>Personal & Account Credentials</span>
                        </h4>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Full Legal Name:</span>
                            <span className="font-bold text-slate-800">{selectedUserDetail.user?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Email Address:</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              {selectedUserDetail.user?.email}
                              {selectedUserDetail.user?.isEmailVerified ? (
                                <span className="text-emerald-600 text-[10px]">✓</span>
                              ) : (
                                <button
                                  onClick={() => handleAdminVerifyEmail(selectedUserDetail.user?._id || selectedUserDetail.user?.id)}
                                  className="text-[9px] text-blue-600 underline font-bold"
                                >
                                  Verify Now
                                </button>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Contact Number:</span>
                            <span className="font-bold text-slate-800">{selectedUserDetail.user?.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Registered Address:</span>
                            <span className="font-bold text-slate-800 text-right max-w-[200px]">{selectedUserDetail.user?.address || 'Dhaka, Bangladesh'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Occupation / Sector:</span>
                            <span className="font-bold text-slate-800">{selectedUserDetail.user?.occupation || 'Private Professional'}</span>
                          </div>
                        </div>
                      </div>

                      {/* NOMINEE DOSSIER */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                        <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                          <span>🤝</span>
                          <span>Legal Nominee & Succession Dossier</span>
                        </h4>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Nominee Name:</span>
                            <span className="font-bold text-slate-800">{selectedUserDetail.user?.nominee?.name || selectedUserDetail.user?.nomineeName || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Relationship:</span>
                            <span className="font-bold text-slate-800">{selectedUserDetail.user?.nominee?.relation || selectedUserDetail.user?.nomineeRelation || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Nominee Contact:</span>
                            <span className="font-bold text-slate-800">{selectedUserDetail.user?.nominee?.phone || selectedUserDetail.user?.nomineePhone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Succession Share:</span>
                            <span className="font-bold text-emerald-700">100% Principal & Yield</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SETTLEMENT & BANKING DETAILS */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                      <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200/60 pb-2">
                        <span>🏦</span>
                        <span>Designated Settlement Bank & MFS Accounts</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Bank Name</span>
                          <span className="font-bold text-slate-900">
                            {selectedUserDetail.user?.bankInfo?.bankName || selectedUserDetail.user?.bankDetails?.bankName || 'Not configured'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Account Number</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {selectedUserDetail.user?.bankInfo?.accountNumber || selectedUserDetail.user?.bankDetails?.accountNumber || 'N/A'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Routing / Branch</span>
                          <span className="font-bold text-slate-900">
                            {selectedUserDetail.user?.bankInfo?.branch || selectedUserDetail.user?.bankDetails?.branch || 'Head Office'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: KYC & DOCUMENTS (FIXED: calls handleKycAction) */}
                {inspectorSubTab === 'kyc' && (
                  <div className="space-y-5 text-xs animate-fade-in">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">National ID (NID / Smart Card) Number</span>
                        <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                          {selectedUserDetail.user?.nidNumber || selectedUserDetail.user?.nid || 'Not Provided'}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Status: <strong className="capitalize">{selectedUserDetail.user?.kycStatus || 'Unverified'}</strong> • Remarks: {selectedUserDetail.user?.kycRemarks || 'No audit remarks'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {selectedUserDetail.user?.kycStatus !== 'verified' && (
                          <button
                            onClick={async () => {
                              await handleKycAction(selectedUserDetail.user?._id || selectedUserDetail.user?.id, 'verified');
                              inspectUser(selectedUserDetail.user?._id || selectedUserDetail.user?.id);
                            }}
                            className="px-4 py-2 rounded-xl gradient-agro text-white font-bold shadow-md hover:brightness-110"
                          >
                            ✅ Approve KYC Verification
                          </button>
                        )}
                        {selectedUserDetail.user?.kycStatus !== 'rejected' && (
                          <button
                            onClick={async () => {
                              await handleKycAction(selectedUserDetail.user?._id || selectedUserDetail.user?.id, 'rejected');
                              inspectUser(selectedUserDetail.user?._id || selectedUserDetail.user?.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100"
                          >
                            ❌ Reject Documents
                          </button>
                        )}
                      </div>
                    </div>

                    {/* NID DOCUMENT IMAGES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* FRONT */}
                      <div className="space-y-2">
                        <span className="font-bold text-slate-700 block">NID Front Document (Smart Card)</span>
                        {(selectedUserDetail.user?.nidFront || selectedUserDetail.user?.nidFrontImage) ? (
                          <div
                            onClick={() => setZoomImage({
                              src: selectedUserDetail.user?.nidFront || selectedUserDetail.user?.nidFrontImage,
                              title: `${selectedUserDetail.user?.name} - NID Front Side`
                            })}
                            className="h-44 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden relative group cursor-pointer shadow-inner flex items-center justify-center"
                          >
                            <img
                              src={selectedUserDetail.user?.nidFront || selectedUserDetail.user?.nidFrontImage}
                              alt="NID Front"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1.5">
                              <span>🔍</span>
                              <span>Click to Zoom Preview</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            No NID Front Image Uploaded
                          </div>
                        )}
                      </div>

                      {/* BACK */}
                      <div className="space-y-2">
                        <span className="font-bold text-slate-700 block">NID Back Document (Address & Barcode)</span>
                        {(selectedUserDetail.user?.nidBack || selectedUserDetail.user?.nidBackImage) ? (
                          <div
                            onClick={() => setZoomImage({
                              src: selectedUserDetail.user?.nidBack || selectedUserDetail.user?.nidBackImage,
                              title: `${selectedUserDetail.user?.name} - NID Back Side`
                            })}
                            className="h-44 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden relative group cursor-pointer shadow-inner flex items-center justify-center"
                          >
                            <img
                              src={selectedUserDetail.user?.nidBack || selectedUserDetail.user?.nidBackImage}
                              alt="NID Back"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1.5">
                              <span>🔍</span>
                              <span>Click to Zoom Preview</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            No NID Back Image Uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: INVESTMENT PORTFOLIO */}
                {inspectorSubTab === 'investments' && (
                  <div className="space-y-3 text-xs animate-fade-in">
                    {selectedUserDetail.investments?.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-2">
                        <span className="text-3xl">🌾</span>
                        <h4 className="font-bold text-slate-800">No Investments on Record</h4>
                        <p className="text-slate-400">This user has not yet deployed capital in any agricultural cycles.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {selectedUserDetail.investments.map(inv => (
                          <div
                            key={inv._id || inv.id}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">{inv.projectTitle}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  inv.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                  inv.status === 'pending' || inv.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-200 text-slate-800'
                                }`}>
                                  {inv.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Cert: <strong className="font-mono text-slate-700">{inv.certificateId}</strong> • Method: <strong className="text-slate-700">{inv.paymentMethod || 'Wallet'}</strong> • Expected ROI: <strong className="text-emerald-700">+{inv.expectedReturn}%</strong>
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-black text-slate-900 font-mono">{formatBDT(inv.investedAmount)}</span>
                              <span className="text-[10px] text-slate-400 block">
                                Payout: {formatBDT(inv.investedAmount + (inv.investedAmount * (inv.expectedReturn || 0)) / 100)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TAB 4: TRANSACTION LEDGER */}
                {inspectorSubTab === 'ledger' && (
                  <div className="space-y-3 text-xs animate-fade-in">
                    {selectedUserDetail.transactions?.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-2">
                        <span className="text-3xl">💳</span>
                        <h4 className="font-bold text-slate-800">No Transactions on Record</h4>
                        <p className="text-slate-400">No deposit, withdrawal, or investment transactions exist for this user.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-72 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                              <th className="py-2 px-2">Date</th>
                              <th className="py-2 px-2">Type</th>
                              <th className="py-2 px-2">Reference</th>
                              <th className="py-2 px-2">Method</th>
                              <th className="py-2 px-2 text-right">Amount</th>
                              <th className="py-2 px-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedUserDetail.transactions.map((tx, idx) => (
                              <tr key={tx._id || tx.id || idx} className="hover:bg-slate-50">
                                <td className="py-2 px-2 text-slate-500 font-mono text-[11px]">
                                  {tx.date || tx.createdAt?.split('T')[0] || 'Today'}
                                </td>
                                <td className="py-2 px-2 font-bold capitalize text-slate-800">
                                  {tx.type}
                                </td>
                                <td className="py-2 px-2 font-mono text-slate-500 text-[11px]">
                                  {tx.reference || 'N/A'}
                                </td>
                                <td className="py-2 px-2 text-slate-600">
                                  {tx.method || 'Wallet'}
                                </td>
                                <td className="py-2 px-2 text-right font-black font-mono text-slate-900">
                                  {formatBDT(tx.amount)}
                                </td>
                                <td className="py-2 px-2 text-right">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                    tx.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                    'bg-rose-100 text-rose-800'
                                  }`}>
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* BOTTOM ACTION BAR */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setBalanceAdjustTarget(selectedUserDetail.user)}
                      className="px-3.5 py-2 rounded-xl gradient-agro text-white font-bold shadow-sm hover:brightness-110 flex items-center gap-1.5"
                    >
                      <span>💰</span>
                      <span>Adjust Balance</span>
                    </button>

                    <button
                      onClick={async () => {
                        await handleToggleFreeze(selectedUserDetail.user?._id || selectedUserDetail.user?.id, selectedUserDetail.user?.status);
                        inspectUser(selectedUserDetail.user?._id || selectedUserDetail.user?.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                        selectedUserDetail.user?.status === 'frozen'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      <span>{selectedUserDetail.user?.status === 'frozen' ? '☀️' : '❄️'}</span>
                      <span>{selectedUserDetail.user?.status === 'frozen' ? 'Unfreeze Account' : 'Freeze Account'}</span>
                    </button>

                    {!selectedUserDetail.user?.isEmailVerified && (
                      <button
                        onClick={async () => {
                          await handleAdminVerifyEmail(selectedUserDetail.user?._id || selectedUserDetail.user?.id);
                          inspectUser(selectedUserDetail.user?._id || selectedUserDetail.user?.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100 flex items-center gap-1.5"
                      >
                        <span>✉️</span>
                        <span>Verify Email</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedUserDetail(null)}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              MODAL: MANUAL BALANCE ADJUSTMENT
              ===================================================================== */}
          {balanceAdjustTarget && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Adjust Wallet Balance</h3>
                    <p className="text-xs text-slate-500">{balanceAdjustTarget.name} ({balanceAdjustTarget.email})</p>
                  </div>
                  <button
                    onClick={() => setBalanceAdjustTarget(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAdjustBalance} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Adjustment Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdjustType('credit')}
                        className={`py-2 rounded-xl font-bold transition ${
                          adjustType === 'credit' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        + Credit (Add ৳)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjustType('debit')}
                        className={`py-2 rounded-xl font-bold transition ${
                          adjustType === 'debit' ? 'bg-rose-600 text-white shadow' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        - Debit (Deduct ৳)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Amount (BDT) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Administrative Audit Reason *</label>
                    <input
                      type="text"
                      placeholder="e.g. Offline bank transfer clearance / promotional yield"
                      value={adjustRemarks}
                      onChange={(e) => setAdjustRemarks(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBalanceAdjustTarget(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl gradient-agro text-white font-black shadow"
                    >
                      Confirm Ledger Adjustment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


          {/* =====================================================================
              MODAL: CONFIRM / CANCEL FARM TOUR REQUEST WITH REALTIME EMAIL DISPATCH
              ===================================================================== */}
          {visitActionModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn text-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      visitActionModal.action === 'confirm' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {visitActionModal.action === 'confirm' ? '✅ Confirm & Email Tour Pass' : '❌ Cancel & Email Notice'}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {visitActionModal.action === 'confirm' ? 'Confirm In-Person Farm Tour' : 'Cancel Farm Tour Request'}
                    </h3>
                  </div>
                  <button
                    onClick={() => { setVisitActionModal(null); setVisitActionRemarks(''); }}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Visitor Name:</span>
                    <span className="font-bold text-slate-900">{visitActionModal.visit.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Email Address:</span>
                    <span className="font-bold text-emerald-700 font-mono">{visitActionModal.visit.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Farm Hub:</span>
                    <span className="font-bold text-slate-900">{visitActionModal.visit.farmLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Scheduled Date:</span>
                    <span className="font-bold text-slate-900 font-mono">📅 {visitActionModal.visit.visitDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Visitors Count:</span>
                    <span className="font-bold text-slate-900">👥 {visitActionModal.visit.visitorsCount || 1} Person(s)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {visitActionModal.action === 'confirm' 
                      ? 'Reporting Instructions / Tour Pass Notes (Sent in Email) *' 
                      : 'Cancellation / Reschedule Reason (Sent in Email) *'}
                  </label>
                  <textarea
                    rows={3}
                    value={visitActionRemarks}
                    onChange={(e) => setVisitActionRemarks(e.target.value)}
                    placeholder={visitActionModal.action === 'confirm'
                      ? 'e.g., Reporting time 10:00 AM at Gate 2. Field Officer Tareq will receive you (+880 1712-000000).'
                      : 'e.g., Heavy monsoon rainfall alert; farm tour postponed for bio-safety.'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                  <span className="text-base shrink-0">📧</span>
                  <span>
                    Clicking below will dispatch an official HTML pass/notice to <strong>{visitActionModal.visit.email}</strong> via live Gmail SMTP.
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setVisitActionModal(null); setVisitActionRemarks(''); }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={visitActionLoading}
                    onClick={() => {
                      if (visitActionModal.action === 'confirm') {
                        handleConfirmVisitSubmit(visitActionModal.visit._id || visitActionModal.visit.id);
                      } else {
                        handleCancelVisitSubmit(visitActionModal.visit._id || visitActionModal.visit.id);
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-white font-black shadow transition flex items-center justify-center gap-1.5 ${
                      visitActionModal.action === 'confirm'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {visitActionLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{visitActionModal.action === 'confirm' ? 'Dispatch Pass ✉️' : 'Send Notice ✉️'}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              MODAL: BANK DEPOSIT SLIP & TREASURY AUDIT INSPECTOR
              ===================================================================== */}
          {selectedBankSlipItem && (
            <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto relative">
                <button
                  type="button"
                  onClick={() => setSelectedBankSlipItem(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
                >
                  ✕
                </button>

                <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-xl">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Bank Deposit Slip & Corporate Treasury Audit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verify depositor bank, scroll number, and high-resolution deposit slip voucher
                    </p>
                  </div>
                </div>

                {(() => {
                  const it = selectedBankSlipItem.item;
                  const b = it.bankPaymentDetails || {};
                  const isInv = selectedBankSlipItem.type === 'investment';
                  const amountVal = it.investedAmount || Math.abs(it.amount || 0);

                  return (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Deposit Amount</span>
                          <span className="font-mono font-black text-emerald-700 text-sm">{formatBDT(amountVal)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Target Corporate Bank</span>
                          <span className="font-bold text-slate-900">{b.corporateBank || 'Dutch-Bangla Bank PLC'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Transfer Mode</span>
                          <span className="font-bold text-teal-700">{b.transferType || 'BEFTN / NPSB Transfer'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Depositor / Sender Bank</span>
                          <span className="font-bold text-slate-800">{b.depositorBank || it.senderAccount || 'Bank Transfer'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Depositor A/C Name</span>
                          <span className="font-semibold text-slate-800">{b.depositorAccountName || it.userName || it.userEmail}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Bank Scroll / Slip Ref</span>
                          <span className="font-mono font-bold text-slate-900">{b.scrollNumber || it.trxId || it.reference}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Deposit Date</span>
                          <span className="font-mono text-slate-700">{b.depositDate || it.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Contact Phone</span>
                          <span className="font-mono text-slate-700">{b.depositorPhone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Audit Target</span>
                          <span className="font-bold text-slate-700 capitalize">{isInv ? 'Agro Investment' : 'Wallet Deposit'}</span>
                        </div>
                      </div>

                      {/* DEPOSIT SLIP IMAGE PREVIEW */}
                      <div>
                        <span className="font-bold text-slate-800 text-xs block mb-2">
                          Deposit Voucher / Slip Proof Document:
                        </span>
                        {(b.depositSlipUrl || it.proofDocument) ? (
                          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                            <img
                              src={b.depositSlipUrl || it.proofDocument}
                              alt="Deposit Slip Proof"
                              className="max-h-72 max-w-full mx-auto object-contain rounded-xl shadow-lg border border-slate-700"
                            />
                            <div className="flex justify-center gap-3 pt-1">
                              <a
                                href={b.depositSlipUrl || it.proofDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px]"
                              >
                                ↗ Open Full Voucher In New Tab
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center text-amber-800">
                            <span className="text-xl block mb-1">📄</span>
                            <span className="font-bold">No Physical Image Slip Uploaded</span>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              User submitted electronic reference: <code className="font-mono font-bold">{b.scrollNumber || it.trxId || it.reference}</code>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* ADMIN REMARKS */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Admin Audit Remarks / Clearance Note:</label>
                        <input
                          type="text"
                          value={bankSlipAdminRemarks}
                          onChange={(e) => setBankSlipAdminRemarks(e.target.value)}
                          placeholder="Verified against DBBL corporate internet banking statement"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          disabled={bankSlipActionLoading}
                          onClick={async () => {
                            setBankSlipActionLoading(true);
                            if (isInv) {
                              await handleInvestmentAction(it._id || it.id, 'approve');
                            } else {
                              await handleTransactionAction(it._id || it.id, 'completed');
                            }
                            setBankSlipActionLoading(false);
                            setSelectedBankSlipItem(null);
                          }}
                          className="flex-1 py-3 rounded-xl gradient-agro text-white font-black text-xs shadow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                        >
                          <span>✓</span>
                          <span>Approve & Credit / Activate ({formatBDT(amountVal)})</span>
                        </button>

                        <button
                          type="button"
                          disabled={bankSlipActionLoading}
                          onClick={async () => {
                            setBankSlipActionLoading(true);
                            if (isInv) {
                              await handleInvestmentAction(it._id || it.id, 'reject');
                            } else {
                              await handleTransactionAction(it._id || it.id, 'rejected');
                            }
                            setBankSlipActionLoading(false);
                            setSelectedBankSlipItem(null);
                          }}
                          className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow active:scale-95 transition"
                        >
                          ✕ Reject Slip
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      );
    }
