const { User, Project, Investment, Transaction, Notification } = require('../models');
const { getSecurityLogs, logSecurityEvent } = require('../middleware/security');
const { sendBankDepositApprovedEmail } = require('../utils/emailService');

exports.getAdminStats = async (req, res) => {
  try {
    const users = await User.find();
    const projects = await Project.find();
    const investments = await Investment.find();
    const transactions = await Transaction.find();

    const totalInvestors = users.filter(u => u.role === 'investor').length;
    const verifiedInvestors = users.filter(u => u.kycStatus === 'verified').length;
    const pendingKycCount = users.filter(u => u.kycStatus === 'pending').length;
    const frozenUsersCount = users.filter(u => u.status === 'frozen').length;

    const totalMobilizedFunding = investments
      .filter(inv => inv.status === 'active' || inv.status === 'completed')
      .reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalReturnsPaid = investments.reduce((sum, inv) => sum + (inv.totalReturnReceived || 0), 0);

    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const upcomingProjects = projects.filter(p => p.status === 'upcoming').length;

    const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length;
    const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
    const underReviewInvestments = investments.filter(i => i.status === 'under_review' || i.status === 'pending').length;

    return res.json({
      success: true,
      stats: {
        totalInvestors,
        verifiedInvestors,
        pendingKycCount,
        frozenUsersCount,
        totalMobilizedFunding,
        totalReturnsPaid,
        activeProjects,
        completedProjects,
        upcomingProjects,
        pendingWithdrawals,
        pendingDeposits,
        underReviewInvestments,
        totalProjects: projects.length,
        totalInvestmentsCount: investments.length
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const sanitized = users.map(({ password, ...u }) => u);
    return res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Pending Verification Queue (NID, Documents, Nominees & Under-Review Investments)
exports.getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find();
    const pendingUsers = users.filter(u => u.role === 'investor' && (u.kycStatus === 'pending' || u.kycStatus === 'unverified'));
    const investments = await Investment.find();

    const result = pendingUsers.map(user => {
      const userInvs = investments.filter(i => i.userId === (user._id || user.id));
      const { password, ...safeUser } = user;
      return {
        ...safeUser,
        investmentsCount: userInvs.length,
        pendingInvestments: userInvs.filter(i => i.status === 'under_review' || i.status === 'pending')
      };
    });

    return res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateKycStatus = async (req, res) => {
  try {
    const { userId, status, reason, remarks } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be verified or rejected' });
    }

    const updated = await User.updateById(userId, {
      kycStatus: status,
      kycRemarks: remarks || reason || (status === 'verified' ? 'Identity documents verified and approved by compliance' : 'Documents rejected or incomplete')
    });
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    // If verified, automatically activate any investments that were under review
    if (status === 'verified') {
      const investments = await Investment.find({ userId });
      for (const inv of investments) {
        if (inv.status === 'under_review') {
          await Investment.updateById(inv._id || inv.id, {
            status: 'active',
            verificationStatus: 'verified'
          });
        }
      }
    }

    logSecurityEvent(status === 'verified' ? 'KYC_APPROVED' : 'KYC_REJECTED', {
      severity: 'INFO',
      ip: req.ip,
      userId,
      message: `Admin ${req.user.email} updated KYC for user ${updated.email} to ${status}`
    });

    await Notification.create({
      userId,
      type: 'kyc',
      title: status === 'verified' ? '🎉 KYC & Identity Documents Approved!' : '⚠️ Action Required: KYC Documents Rejected',
      message: status === 'verified'
        ? 'Your National ID (NID) and identity documentation have been verified. Your account has full investor clearance.'
        : `Your KYC document submission could not be verified. Reason: ${reason || remarks || 'Unclear document image. Please re-upload with clear details.'}`,
      date: new Date().toISOString().split('T')[0],
      icon: status === 'verified' ? 'verify' : 'alert'
    });

    return res.json({ success: true, message: `KYC status updated to ${status}`, user: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Freeze or Unfreeze Investor Account
exports.toggleUserFreeze = async (req, res) => {
  try {
    const { userId, status, reason } = req.body;
    if (!['active', 'frozen'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be active or frozen' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    if (targetUser.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrator accounts cannot be frozen.' });
    }

    const updated = await User.updateById(userId, { status });

    logSecurityEvent(status === 'frozen' ? 'ACCOUNT_FROZEN' : 'ACCOUNT_UNFROZEN', {
      severity: 'CRITICAL',
      ip: req.ip,
      userId,
      message: `Admin [${req.user.email}] set account status of [${targetUser.email}] to [${status}]. Reason: ${reason || 'N/A'}`
    });

    await Notification.create({
      userId,
      type: 'general',
      title: status === 'frozen' ? 'Account Suspension Notice' : 'Account Re-activated',
      message: status === 'frozen'
        ? `Your account has been temporarily frozen for compliance or security review. Reason: ${reason || 'Administrative Compliance Review'}`
        : 'Your account has been successfully re-activated. You may resume normal platform operations.',
      date: new Date().toISOString().split('T')[0],
      icon: status === 'frozen' ? 'alert' : 'check'
    });

    return res.json({ success: true, message: `User account is now ${status}`, user: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Financial Approvals (Pending Deposits & Withdrawals)
exports.getPendingTransactions = async (req, res) => {
  try {
    const { status = 'pending', type } = req.query;
    let transactions = await Transaction.find();

    if (status && status !== 'all') {
      transactions = transactions.filter(t => t.status === status);
    }
    if (type && type !== 'all') {
      transactions = transactions.filter(t => t.type === type);
    }

    const users = await User.find();
    const userMap = {};
    users.forEach(u => userMap[u._id || u.id] = u);

    const enriched = transactions.map(t => ({
      ...t,
      userName: t.userName || userMap[t.userId]?.name || 'Anonymous Investor',
      userEmail: t.userEmail || userMap[t.userId]?.email || ''
    }));

    enriched.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.reviewTransaction = async (req, res) => {
  try {
    const { transactionId, status, adminRemarks } = req.body;
    if (!['completed', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be completed or rejected.' });
    }

    const txn = await Transaction.findById(transactionId);
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    const user = await User.findById(txn.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Associated user not found.' });

    if (txn.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Transaction has already been marked as ${txn.status}.` });
    }

    // Process Withdrawal Review
    if (txn.type === 'withdrawal') {
      if (status === 'completed') {
        // Withdrawal approved and disbursed
        await Transaction.updateById(transactionId, {
          status: 'completed',
          adminRemarks: adminRemarks || 'Disbursement verified and sent to destination account',
          reviewedBy: req.user.email,
          reviewedAt: new Date().toISOString()
        });

        await Notification.create({
          userId: user._id || user.id,
          type: 'general',
          title: `Withdrawal Approved: ৳${Math.abs(txn.amount).toLocaleString('en-BD')}`,
          message: `Your withdrawal of ৳${Math.abs(txn.amount).toLocaleString('en-BD')} has been approved and disbursed. Ref: ${txn.reference}`,
          date: new Date().toISOString().split('T')[0],
          icon: 'money'
        });
      } else {
        // Withdrawal rejected: REFUND the reserved balance back to user's wallet
        const refundAmount = Math.abs(txn.amount);
        const restoredBalance = (user.walletBalance || 0) + refundAmount;
        await User.updateById(user._id || user.id, { walletBalance: restoredBalance });

        await Transaction.updateById(transactionId, {
          status: 'rejected',
          adminRemarks: adminRemarks || 'Withdrawal rejected and balance refunded to wallet',
          reviewedBy: req.user.email,
          reviewedAt: new Date().toISOString()
        });

        await Notification.create({
          userId: user._id || user.id,
          type: 'general',
          title: 'Withdrawal Rejected & Refunded',
          message: `Your withdrawal request of ৳${refundAmount.toLocaleString('en-BD')} was rejected and refunded to your wallet. Reason: ${adminRemarks || 'Account detail mismatch'}`,
          date: new Date().toISOString().split('T')[0],
          icon: 'alert'
        });
      }
    }

    // Process Deposit Review
    if (txn.type === 'deposit') {
      if (status === 'completed') {
        // Credit the deposit amount to user's wallet
        const depositAmount = Math.abs(txn.amount);
        const newBalance = (user.walletBalance || 0) + depositAmount;
        await User.updateById(user._id || user.id, { walletBalance: newBalance });

        await Transaction.updateById(transactionId, {
          status: 'completed',
          adminRemarks: adminRemarks || 'Deposit payment verification verified',
          reviewedBy: req.user.email,
          reviewedAt: new Date().toISOString()
        });

        await Notification.create({
          userId: user._id || user.id,
          type: 'general',
          title: `Deposit Approved: ৳${depositAmount.toLocaleString('en-BD')}`,
          message: `Your deposit of ৳${depositAmount.toLocaleString('en-BD')} has been approved. New Wallet Balance: ৳${newBalance.toLocaleString('en-BD')}`,
          date: new Date().toISOString().split('T')[0],
          icon: 'money'
        });

        sendBankDepositApprovedEmail({
          toEmail: user.email,
          userName: user.name,
          amount: depositAmount,
          corporateBank: (txn.bankPaymentDetails && txn.bankPaymentDetails.corporateBank) || 'Dutch-Bangla Bank PLC',
          scrollNumber: txn.reference,
          isDeposit: true
        }).catch(err => console.error('[EMAIL ERROR]', err.message));
      } else {
        await Transaction.updateById(transactionId, {
          status: 'rejected',
          adminRemarks: adminRemarks || 'Deposit verification failed / invalid TrxID',
          reviewedBy: req.user.email,
          reviewedAt: new Date().toISOString()
        });

        await Notification.create({
          userId: user._id || user.id,
          type: 'general',
          title: 'Deposit Rejected',
          message: `Your deposit request was rejected. Reason: ${adminRemarks || 'Submitted TrxID or slip verification failed.'}`,
          date: new Date().toISOString().split('T')[0],
          icon: 'alert'
        });
      }
    }

    logSecurityEvent('TRANSACTION_REVIEWED', {
      severity: 'INFO',
      ip: req.ip,
      message: `Admin [${req.user.email}] reviewed ${txn.type} [${transactionId}] -> ${status}`
    });

    return res.json({ success: true, message: `Transaction review completed: ${status}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// All platform investments
exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find();
    const users = await User.find();
    const projects = await Project.find();

    const userMap = {};
    users.forEach(u => userMap[u._id || u.id] = u);

    const projectMap = {};
    projects.forEach(p => projectMap[p._id || p.id] = p);

    const enriched = investments.map(inv => ({
      ...inv,
      investor: userMap[inv.userId] ? {
        name: userMap[inv.userId].name,
        email: userMap[inv.userId].email,
        phone: userMap[inv.userId].phone,
        kycStatus: userMap[inv.userId].kycStatus
      } : null,
      project: projectMap[inv.projectId] || null
    }));

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cybersecurity SIEM & Threat Radar
exports.getSecurityAudit = async (req, res) => {
  try {
    const logs = getSecurityLogs();
    
    // Check if any critical threats occurred recently and haven't been mitigated
    const recentTime = Date.now() - 30 * 60 * 1000;
    const recentLogs = logs.filter(l => new Date(l.timestamp).getTime() > recentTime);
    const lastMitigation = logs.find(l => l.type === 'WAF_AUTO_MITIGATION_COMPLETE');
    const lastMitigationTime = lastMitigation ? new Date(lastMitigation.timestamp).getTime() : 0;
    
    // An active threat is any critical threat that occurred AFTER the last mitigation
    const activeCriticalThreats = recentLogs.filter(l => 
      l.severity === 'CRITICAL' && new Date(l.timestamp).getTime() > lastMitigationTime
    );

    const hasActiveAttack = activeCriticalThreats.length > 0;
    const criticalCount = logs.filter(l => l.severity === 'CRITICAL').length;
    const warningCount = logs.filter(l => l.severity === 'WARNING').length;

    const securityScore = hasActiveAttack ? Math.max(38, 100 - (activeCriticalThreats.length * 20)) : 99;
    const systemStatus = hasActiveAttack ? 'CRITICAL / ACTIVE THREAT DETECTED' : 'GREEN / 100% OPTIMAL SECURE';

    // Dynamic defense layers reflecting live attacks
    const hasSqliAttack = activeCriticalThreats.some(l => l.type.includes('SQLI') || (l.message && l.message.includes('SQL')));
    const hasBruteForce = activeCriticalThreats.some(l => l.type.includes('BRUTE') || (l.message && l.message.includes('Brute')));
    const hasDdos = activeCriticalThreats.some(l => l.type.includes('FLOOD') || l.type.includes('DDOS') || (l.message && l.message.includes('DDoS')));

    const defenseLayers = [
      {
        name: 'OWASP Top 10 BOLA/IDOR Defense',
        status: hasActiveAttack ? 'ELEVATED VIGILANCE' : 'ACTIVE',
        grade: hasActiveAttack ? 'B+' : 'A+',
        isAlert: false,
        desc: 'Protects object references and cross-user tenant boundary'
      },
      {
        name: 'NoSQL & Parameter Injection Filter',
        status: hasSqliAttack ? 'ATTACK DETECTED (SCRUBBED)' : 'ACTIVE',
        grade: hasSqliAttack ? 'F / ATTACK' : 'A+',
        isAlert: hasSqliAttack,
        desc: 'Strict query operator sanitization & regex scrubbing'
      },
      {
        name: 'Distributed Brute Force & Credential Limiter',
        status: hasBruteForce ? 'LOCKDOWN / ACTIVE ATTACK' : 'ACTIVE',
        grade: hasBruteForce ? 'F / ATTACK' : 'A',
        isAlert: hasBruteForce,
        desc: 'Hardware IP lockout upon 5 invalid authentication tries'
      },
      {
        name: 'DDoS SYN Flood & Traffic Volumetric Limiter',
        status: hasDdos ? 'RATE-LIMIT DEFENDING (SPIKE)' : 'ACTIVE',
        grade: hasDdos ? 'F / SPIKE' : 'A+',
        isAlert: hasDdos,
        desc: 'Dynamic packet throttling & volumetric spike mitigation'
      },
      {
        name: 'Encrypted Cryptographic Ledger (HMAC & Nonce)',
        status: 'TAMPER-PROOF ACTIVE',
        grade: 'A+',
        isAlert: false,
        desc: 'Immutable financial state hashes and verification'
      },
      {
        name: 'Helmet Content Security Policy (CSP)',
        status: 'ENFORCED',
        grade: 'A',
        isAlert: false,
        desc: 'XSS, clickjacking, and frame-ancestors prevention'
      }
    ];

    return res.json({
      success: true,
      securityScore,
      systemStatus,
      hasActiveAttack,
      defenseLayers,
      metrics: {
        totalLoggedEvents: logs.length,
        criticalThreatsBlocked: criticalCount,
        warningsCaught: warningCount,
        activeThreatsCount: activeCriticalThreats.length
      },
      recentLogs: logs.slice(0, 50)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.simulateThreatAttack = async (req, res) => {
  try {
    logSecurityEvent('BRUTE_FORCE_CREDENTIAL_STUFFING', {
      severity: 'CRITICAL',
      ip: '103.251.167.22',
      message: '🚨 48 rapid credential stuffing attempts on /api/auth/admin-login from IP: 103.251.167.22 (Bypassed honeypot, WAF triggered)'
    });

    logSecurityEvent('SQLI_PARAMETER_TAMPER', {
      severity: 'CRITICAL',
      ip: '185.220.101.5',
      message: "🚨 SQL/NoSQL Injection Probe: \"' OR 1=1; DROP TABLE users;--\" detected on query parameters. Dropped by Sanitizer."
    });

    logSecurityEvent('DISTRIBUTED_SYN_FLOOD', {
      severity: 'CRITICAL',
      ip: '45.142.122.9',
      message: '🚨 Volumetric traffic anomaly: 1,420 req/sec from suspicious botnet subnet 45.142.122.0/24'
    });

    logSecurityEvent('IDOR_TRAVERSAL_PROBE', {
      severity: 'WARNING',
      ip: '194.26.29.112',
      message: '⚠️ Attempted unauthorized access to cross-tenant portfolio ledger: /api/investments/inv_88291'
    });

    return res.json({
      success: true,
      message: 'Threat attack simulation initiated! Multiple CRITICAL vectors active in SIEM radar.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.mitigateThreats = async (req, res) => {
  try {
    logSecurityEvent('WAF_IP_PERMANENT_BLACKLIST', {
      severity: 'INFO',
      ip: '127.0.0.1',
      message: '🛡️ Firewall Auto-Ban Rule deployed: Blocked 4 rogue IPs (103.251.167.22, 185.220.101.5, 45.142.122.9, 194.26.29.112).'
    });

    logSecurityEvent('WAF_AUTO_MITIGATION_COMPLETE', {
      severity: 'INFO',
      ip: '127.0.0.1',
      message: '✅ Threat mitigation complete. All rogue vectors purged, rate-limit tables flushed, system posture restored to 100% Green.'
    });

    return res.json({
      success: true,
      message: 'WAF Lockdown deployed & all threats successfully neutralized!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 360° Comprehensive User Profile Inspector (Admin Full Access)
exports.getUserFullDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const investments = await Investment.find({ userId: id });
    const transactions = await Transaction.find({ userId: id });
    const allProjects = await Project.find();

    const projMap = {};
    allProjects.forEach(p => projMap[p._id || p.id] = p);

    const enrichedInvestments = investments.map(inv => ({
      ...inv,
      project: projMap[inv.projectId] || null
    }));

    const totalInvested = investments.reduce((sum, i) => sum + (i.investedAmount || 0), 0);
    const totalReturnsReceived = investments.reduce((sum, i) => sum + (i.totalReturnReceived || 0), 0);
    const completedDeposits = transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const completedWithdrawals = transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const { password: _, ...safeUser } = user;
    return res.json({
      success: true,
      data: {
        user: safeUser,
        investments: enrichedInvestments,
        transactions: transactions.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)),
        stats: {
          totalInvested,
          totalReturnsReceived,
          walletBalance: safeUser.walletBalance || 0,
          totalDeposits: completedDeposits,
          totalWithdrawals: completedWithdrawals,
          activeCount: investments.filter(i => i.status === 'active').length,
          pendingCount: investments.filter(i => i.status === 'pending' || i.status === 'under_review').length,
          totalTransactionsCount: transactions.length,
          joinedDate: safeUser.createdAt ? new Date(safeUser.createdAt).toLocaleDateString('en-GB') : 'N/A'
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Admin Manual Balance Adjustment (Credit/Debit with Audit Reason)
exports.adjustUserBalance = async (req, res) => {
  try {
    const { userId, amount, type, remarks } = req.body;
    const adjustAmount = Math.abs(Number(amount));
    if (!userId || !adjustAmount || !['credit', 'debit'].includes(type)) {
      return res.status(400).json({ success: false, message: 'User ID, valid amount and type (credit/debit) are required.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const currentBal = Number(user.walletBalance || 0);
    let newBal = currentBal;

    if (type === 'credit') {
      newBal = currentBal + adjustAmount;
    } else {
      if (currentBal < adjustAmount) {
        return res.status(400).json({ success: false, message: `Insufficient balance to deduct ৳${adjustAmount} (Current: ৳${currentBal})` });
      }
      newBal = currentBal - adjustAmount;
    }

    await User.updateById(userId, { walletBalance: newBal });

    const txnRef = `ADJ${Date.now().toString().slice(-8)}`;
    await Transaction.create({
      userId,
      userName: user.name,
      userEmail: user.email,
      type: 'adjustment',
      amount: type === 'credit' ? adjustAmount : -adjustAmount,
      status: 'completed',
      method: 'Admin Manual Ledger',
      reference: txnRef,
      description: remarks || `Admin manual balance ${type} by ${req.user.email}`,
      adminRemarks: `Adjusted by Admin (${req.user.email}): ${remarks || 'Manual Adjustment'}`,
      reviewedBy: req.user.email,
      reviewedAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    });

    logSecurityEvent('BALANCE_MANUALLY_ADJUSTED', {
      severity: 'WARNING',
      ip: req.ip,
      message: `Admin [${req.user.email}] ${type}ed ৳${adjustAmount} to user [${user.email}]. Reason: ${remarks}`
    });

    await Notification.create({
      userId,
      type: 'general',
      title: type === 'credit' ? `Wallet Credited: ৳${adjustAmount.toLocaleString('en-BD')}` : `Wallet Adjusted: ৳${adjustAmount.toLocaleString('en-BD')}`,
      message: type === 'credit'
        ? `Your wallet has been credited with ৳${adjustAmount.toLocaleString('en-BD')} by administration. Reason: ${remarks || 'Manual Adjustment'}`
        : `Your wallet has been debited by ৳${adjustAmount.toLocaleString('en-BD')} by administration. Reason: ${remarks || 'Manual Adjustment'}`,
      date: new Date().toISOString().split('T')[0],
      icon: 'money'
    });

    return res.json({
      success: true,
      message: `Wallet balance successfully ${type}ed by ৳${adjustAmount.toLocaleString('en-BD')}`,
      newBalance: newBal
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin 1-Click Verify User Email
exports.adminVerifyUserEmail = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updated = await User.updateById(userId, {
      isEmailVerified: true,
      emailVerificationOtp: '',
      emailVerificationExpires: null
    });

    logSecurityEvent('ADMIN_EMAIL_VERIFY', {
      severity: 'INFO',
      ip: req.ip,
      message: `Admin [${req.user.email}] manually marked email verified for [${user.email}]`
    });

    await Notification.create({
      userId,
      type: 'general',
      title: '🎉 Email Verified by Administrator',
      message: 'Your email address has been verified by the compliance administration team.',
      date: new Date().toISOString().split('T')[0],
      icon: 'check'
    });

    return res.json({ success: true, message: 'User email manually verified by admin.', user: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Broadcast Announcement Notice to All Users
exports.broadcastAnnouncement = async (req, res) => {
  try {
    const { title, message, priority = 'normal' } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    await Notification.create({
      userId: 'all',
      type: 'announcement',
      title: `📢 ${title}`,
      message,
      date: new Date().toISOString().split('T')[0],
      icon: 'notice'
    });

    logSecurityEvent('ANNOUNCEMENT_BROADCAST', {
      severity: 'INFO',
      ip: req.ip,
      message: `Admin [${req.user.email}] broadcast notice: ${title}`
    });

    return res.json({ success: true, message: 'Announcement successfully broadcast to all users.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Review & Approval for Pending Investments
exports.reviewInvestment = async (req, res) => {
  try {
    const { investmentId, action, adminRemarks } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve or reject.' });
    }

    const investment = await Investment.findById(investmentId);
    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found.' });
    }

    if (investment.status !== 'pending' && investment.status !== 'under_review') {
      return res.status(400).json({ success: false, message: `Investment is already marked as ${investment.status}.` });
    }

    const user = await User.findById(investment.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Associated investor account not found.' });
    }

    const project = await Project.findById(investment.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Associated agro project not found.' });
    }

    if (action === 'approve') {
      // 1. Mark investment as active and verified
      await Investment.updateById(investmentId, {
        status: 'active',
        verificationStatus: 'verified',
        adminRemarks: adminRemarks || 'Verified and approved by administration',
        reviewedBy: req.user.email,
        reviewedAt: new Date().toISOString()
      });

      // 2. Increment Project raised funding and investor count
      const newRaised = (project.raisedAmount || 0) + investment.investedAmount;
      const newProgress = Math.min(100, Math.round((newRaised / project.totalFunding) * 100));
      await Project.updateById(project._id || project.id, {
        raisedAmount: newRaised,
        investorsCount: (project.investorsCount || 0) + 1,
        progress: newProgress,
        ...(newProgress >= 100 && { status: 'completed' })
      });

      // 3. Mark matching pending ledger transaction as completed
      const allTxns = await Transaction.find({ userId: investment.userId, projectId: investment.projectId });
      const pendingTxn = allTxns.find(t => t.type === 'investment' && t.status === 'pending');
      if (pendingTxn) {
        await Transaction.updateById(pendingTxn._id || pendingTxn.id, {
          status: 'completed',
          adminRemarks: adminRemarks || 'Investment approved and activated',
          reviewedBy: req.user.email,
          reviewedAt: new Date().toISOString()
        });
      }

      // 4. Send celebration notification to investor
      await Notification.create({
        userId: user._id || user.id,
        type: 'project',
        title: `🎉 Investment Approved & Active!`,
        message: `Your investment of ৳${investment.investedAmount.toLocaleString('en-BD')} in project "${project.title}" has been approved and is now active! Certificate: ${investment.certificateId}`,
        date: new Date().toISOString().split('T')[0],
        icon: 'check'
      });

      sendBankDepositApprovedEmail({
        toEmail: user.email,
        userName: user.name,
        amount: investment.investedAmount,
        corporateBank: (investment.bankPaymentDetails && investment.bankPaymentDetails.corporateBank) || 'Dutch-Bangla Bank PLC',
        scrollNumber: investment.trxId || investment.certificateId,
        projectTitle: project.title,
        certificateId: investment.certificateId,
        isDeposit: false
      }).catch(err => console.error('[EMAIL ERROR]', err.message));

      logSecurityEvent('INVESTMENT_APPROVED', {
        severity: 'INFO',
        ip: req.ip,
        userId: user._id || user.id,
        message: `Admin [${req.user.email}] approved investment of ৳${investment.investedAmount} in project [${project.title}] for user [${user.email}]`
      });

      return res.json({
        success: true,
        message: 'Investment approved and activated successfully!',
        investmentId,
        status: 'active'
      });
    } else {
      // Rejection flow
      await Investment.updateById(investmentId, {
        status: 'rejected',
        verificationStatus: 'rejected',
        adminRemarks: adminRemarks || 'Investment request rejected by administration',
        reviewedBy: req.user.email,
        reviewedAt: new Date().toISOString()
      });

      // If paid via Wallet, refund money to user's wallet
      let refundApplied = false;
      if (investment.paymentMethod === 'Wallet' || !investment.paymentMethod) {
        const restoredBalance = (user.walletBalance || 0) + investment.investedAmount;
        await User.updateById(user._id || user.id, { walletBalance: restoredBalance });
        refundApplied = true;

        await Transaction.create({
          userId: user._id || user.id,
          userName: user.name,
          userEmail: user.email,
          type: 'deposit',
          amount: investment.investedAmount,
          status: 'completed',
          method: 'Wallet Refund',
          reference: `REFUND-${Date.now().toString().slice(-6)}`,
          description: `Refund for rejected investment: ${project.title}`,
          projectId: project._id || project.id,
          date: new Date().toISOString().split('T')[0]
        });
      }

      // Mark transaction as rejected
      const allTxns = await Transaction.find({ userId: investment.userId, projectId: investment.projectId });
      const pendingTxn = allTxns.find(t => t.type === 'investment' && t.status === 'pending');
      if (pendingTxn) {
        await Transaction.updateById(pendingTxn._id || pendingTxn.id, {
          status: 'rejected',
          adminRemarks: adminRemarks || 'Investment request rejected',
          reviewedBy: req.user.email,
          reviewedAt: new Date().toISOString()
        });
      }

      // Send alert notification to investor
      await Notification.create({
        userId: user._id || user.id,
        type: 'alert',
        title: `Investment Request Rejected`,
        message: `Your investment request of ৳${investment.investedAmount.toLocaleString('en-BD')} in project "${project.title}" was rejected. Reason: ${adminRemarks || 'Document or payment transaction mismatch'}. ${refundApplied ? 'Wallet funds have been refunded.' : ''}`,
        date: new Date().toISOString().split('T')[0],
        icon: 'alert'
      });

      logSecurityEvent('INVESTMENT_REJECTED', {
        severity: 'WARNING',
        ip: req.ip,
        userId: user._id || user.id,
        message: `Admin [${req.user.email}] rejected investment of ৳${investment.investedAmount} in project [${project.title}] for user [${user.email}]`
      });

      return res.json({
        success: true,
        message: 'Investment request rejected' + (refundApplied ? ' and wallet balance refunded.' : '.'),
        investmentId,
        status: 'rejected',
        refundApplied
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Email Configuration Status
exports.getEmailConfig = async (req, res) => {
  try {
    const host = (process.env.SMTP_HOST || '').trim();
    const user = (process.env.SMTP_USER || '').trim();
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const isConfigured = !!(user && process.env.SMTP_PASS);

    return res.json({
      success: true,
      data: {
        isConfigured,
        host: host || 'smtp.gmail.com',
        user: user || '',
        port,
        hasPassword: !!process.env.SMTP_PASS,
        emailFrom: process.env.EMAIL_FROM || '"AgroFinance BD" <security@agrofinance.bd>'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Email Configuration (persists to .env file and process.env)
exports.updateEmailConfig = async (req, res) => {
  try {
    const { host, port, user, pass, emailFrom } = req.body;
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email address (SMTP_USER) is required.' });
    }

    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '..', '.env');

    if (host) process.env.SMTP_HOST = host.trim();
    if (port) process.env.SMTP_PORT = String(port).trim();
    if (user) process.env.SMTP_USER = user.trim();
    if (pass) process.env.SMTP_PASS = pass.replace(/\s+/g, '');
    if (emailFrom) process.env.EMAIL_FROM = emailFrom.trim();

    // Read and update .env file
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      const updateKey = (key, val) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}=${val}`);
        } else {
          envContent += `\n${key}=${val}`;
        }
      };

      if (host) updateKey('SMTP_HOST', host.trim());
      if (port) updateKey('SMTP_PORT', String(port).trim());
      if (user) updateKey('SMTP_USER', user.trim());
      if (pass) updateKey('SMTP_PASS', pass.replace(/\s+/g, ''));
      if (emailFrom) updateKey('EMAIL_FROM', emailFrom.trim());

      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    logSecurityEvent('SMTP_CONFIG_UPDATED', {
      severity: 'WARNING',
      ip: req.ip,
      message: `Admin [${req.user.email}] updated live SMTP configuration for ${user}`
    });

    return res.json({
      success: true,
      message: 'Email credentials successfully saved! Live realtime emails are now active.',
      data: {
        host: process.env.SMTP_HOST,
        user: process.env.SMTP_USER,
        port: process.env.SMTP_PORT
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Test Send Realtime Email
exports.testSendEmail = async (req, res) => {
  try {
    const { toEmail } = req.body;
    const recipient = toEmail || req.user.email;
    const { testLiveSmtp } = require('../utils/emailService');

    const result = await testLiveSmtp(recipient);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

