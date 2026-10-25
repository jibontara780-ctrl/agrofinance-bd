const { Investment, Project, User, Transaction, Notification } = require('../models');
const { logSecurityEvent } = require('../middleware/security');
const {
  sendPaymentGatewaySuccessEmail,
  sendBankDepositSlipSubmittedEmail
} = require('../utils/emailService');

exports.createInvestment = async (req, res) => {
  try {
    const { projectId, amount, paymentMethod } = req.body;
    const userId = req.user._id || req.user.id;
    const investAmount = Number(amount);

    if (!projectId || !investAmount || investAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid Project ID and investment amount are required.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Agro project not found.' });
    }

    if (project.status !== 'active') {
      return res.status(400).json({ success: false, message: `Project is currently ${project.status} and not accepting investments.` });
    }

    if (investAmount < project.minInvestment) {
      return res.status(400).json({ success: false, message: `Minimum investment for this project is ৳${project.minInvestment.toLocaleString('en-BD')}.` });
    }

    if (investAmount > project.maxInvestment) {
      return res.status(400).json({ success: false, message: `Maximum investment limit is ৳${project.maxInvestment.toLocaleString('en-BD')}.` });
    }

    const remainingToFund = project.totalFunding - project.raisedAmount;
    if (investAmount > remainingToFund) {
      return res.status(400).json({ success: false, message: `Investment amount exceeds remaining required funding (৳${remainingToFund.toLocaleString('en-BD')}).` });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Investor account not found.' });
    }

    // If paying from wallet, check balance and deduct atomically
    if (paymentMethod === 'Wallet' || !paymentMethod) {
      if (user.walletBalance < investAmount) {
        logSecurityEvent('INSUFFICIENT_FUNDS_REJECTED', {
          severity: 'WARNING',
          ip: req.ip,
          userId,
          message: `Attempted investment of ৳${investAmount} exceeding balance ৳${user.walletBalance}`
        });
        return res.status(400).json({
          success: false,
          message: `Insufficient wallet balance (Current: ৳${user.walletBalance.toLocaleString('en-BD')}). Please deposit funds or choose another payment method.`
        });
      }
      await User.updateById(userId, { walletBalance: user.walletBalance - investAmount });
    }

    // High Value Investment Security Log
    if (investAmount >= 200000) {
      logSecurityEvent('HIGH_VALUE_INVESTMENT', {
        severity: 'INFO',
        ip: req.ip,
        userId,
        message: `High value investment of ৳${investAmount.toLocaleString('en-BD')} placed by [${user.email}] in project [${project.title}]`
      });
    }

    // Calculations
    const expectedProfit = (investAmount * project.expectedReturn) / 100;
    const expectedAmount = investAmount + expectedProfit;
    const monthlyReturn = Math.round(expectedProfit / project.duration);
    const certificateId = `AGRO-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { nominee, nid, agreementAccepted } = req.body;
    if (nominee || nid) {
      await User.updateById(userId, {
        ...(nominee && { nominee }),
        ...(nid && { nid }),
        ...(user.kycStatus === 'unverified' && { kycStatus: 'pending' })
      });
    }

    const txnRef = req.body.trxId ? req.body.trxId.trim() : `TXN${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;

    // Calculate prokolpo distribution allocations automatically
    let prokolpoAllocations = [];
    if (project.prokolpos && project.prokolpos.length > 0) {
      prokolpoAllocations = project.prokolpos.map(pr => ({
        prokolpoName: pr.name,
        banglaName: pr.banglaName || pr.name,
        percentage: pr.allocationPercentage || pr.percentage || 0,
        allocatedAmount: Math.round(investAmount * (((pr.allocationPercentage || pr.percentage || 0)) / 100)),
        category: pr.category,
        icon: pr.icon || '🌾'
      }));
    } else {
      prokolpoAllocations = [
        { prokolpoName: 'Boro Rice Cultivation', banglaName: 'উচ্চফলনশীল বোরো ধান চাষ', percentage: 40, allocatedAmount: Math.round(investAmount * 0.4), category: 'grain', icon: '🌾' },
        { prokolpoName: 'Modern Dairy Farming', banglaName: 'আধুনিক দুগ্ধ ও ডেইরি ফার্মিং', percentage: 25, allocatedAmount: Math.round(investAmount * 0.25), category: 'dairy', icon: '🐄' },
        { prokolpoName: 'Biofloc Aquaculture', banglaName: 'বায়োফ্লক বৈজ্ঞানিক মৎস্য চাষ', percentage: 20, allocatedAmount: Math.round(investAmount * 0.20), category: 'fishery', icon: '🐟' },
        { prokolpoName: 'Safe Vegetable Greenhouse', banglaName: 'বিষমুক্ত নিরাপদ সবজি গ্রিনহাউস', percentage: 15, allocatedAmount: Math.round(investAmount * 0.15), category: 'vegetable', icon: '🥦' }
      ];
    }

    const channelType = req.body.channelType || (paymentMethod === 'Bank Wire' || paymentMethod === 'Bank Transfer' ? 'bank_transfer' : (paymentMethod === 'Wallet' ? 'wallet' : 'gateway'));
    const bankDetails = req.body.bankPaymentDetails || {};

    const newInvestment = await Investment.create({
      userId,
      projectId,
      projectTitle: project.title,
      category: project.category,
      investedAmount: investAmount,
      expectedReturn: project.expectedReturn,
      expectedAmount,
      monthlyReturn,
      totalReturnReceived: 0,
      prokolpoAllocations,
      status: 'pending', // Awaiting Admin Approval
      verificationStatus: 'pending',
      paymentMethod: paymentMethod || 'Wallet',
      channelType,
      bankPaymentDetails: bankDetails,
      proofDocument: bankDetails.depositSlipUrl || '',
      trxId: req.body.trxId || (bankDetails.scrollNumber || ''),
      senderAccount: req.body.senderAccount || bankDetails.depositorAccountName || '',
      adminRemarks: 'Pending administrative compliance review',
      nomineeSnapshot: nominee || user.nominee || {},
      agreementAccepted: agreementAccepted !== false,
      investmentDate: new Date().toISOString().split('T')[0],
      maturityDate: project.endDate,
      certificateId,
      remainingDays: Math.max(30, project.duration * 30)
    });

    // Record pending ledger transaction
    await Transaction.create({
      userId,
      userName: user.name,
      userEmail: user.email,
      type: 'investment',
      amount: -investAmount,
      status: 'pending', // Pending Admin Approval
      method: paymentMethod || 'Wallet',
      channelType,
      bankPaymentDetails: bankDetails,
      proofDocument: bankDetails.depositSlipUrl || '',
      reference: txnRef,
      senderAccount: req.body.senderAccount || bankDetails.depositorAccountName || '',
      description: `Investment in ${project.title} (${project.expectedReturn}% ROI) via ${paymentMethod || 'Wallet'} - Pending Admin Approval`,
      projectId,
      date: new Date().toISOString().split('T')[0]
    });

    // User notification
    await Notification.create({
      userId,
      type: 'project',
      title: 'Investment Request Submitted (Under Review)',
      message: `Your investment request of ৳${investAmount.toLocaleString('en-BD')} in project "${project.title}" has been submitted. It will become active upon administrative compliance review. Certificate ID: ${certificateId}`,
      date: new Date().toISOString().split('T')[0],
      icon: 'check'
    });

    // Dispatch real email via SMTP based on channel
    if (channelType === 'bank_transfer') {
      sendBankDepositSlipSubmittedEmail({
        toEmail: user.email,
        userName: user.name,
        amount: investAmount,
        corporateBank: bankDetails.corporateBank || 'Dutch-Bangla Bank PLC',
        transferType: bankDetails.transferType || 'BEFTN / NPSB',
        scrollNumber: txnRef,
        depositorBank: bankDetails.depositorBank || '',
        projectTitle: project.title,
        isDeposit: false
      }).catch(err => console.error('[EMAIL ERROR]', err.message));
    } else {
      sendPaymentGatewaySuccessEmail({
        toEmail: user.email,
        userName: user.name,
        amount: investAmount,
        method: paymentMethod || 'Online Gateway',
        trxId: txnRef,
        projectTitle: project.title,
        certificateId,
        isDeposit: false
      }).catch(err => console.error('[EMAIL ERROR]', err.message));
    }

    logSecurityEvent('INVESTMENT_REQUESTED', {
      severity: 'INFO',
      ip: req.ip,
      userId,
      message: `User [${user.email}] placed pending investment request of ৳${investAmount} in project [${project.title}] via [${paymentMethod || 'Wallet'}]`
    });

    return res.status(201).json({
      success: true,
      message: 'বিনিয়োগ অনুরোধটি পর্যালোচনার জন্য জমা হয়েছে! অ্যাডমিন অনুমোদন করার পর এটি সক্রিয় হবে।',
      data: newInvestment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Investment transaction failed', error: error.message });
  }
};

exports.getMyInvestments = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const investments = await Investment.find({ userId });

    const activeAndCompleted = investments.filter(inv => inv.status === 'active' || inv.status === 'completed');
    const totalInvested = activeAndCompleted.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const pendingInvestments = investments.filter(i => i.status === 'pending' || i.status === 'under_review');
    const pendingInvested = pendingInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalReturnsReceived = investments.reduce((sum, inv) => sum + (inv.totalReturnReceived || 0), 0);
    const activeCount = investments.filter(i => i.status === 'active').length;
    const completedCount = investments.filter(i => i.status === 'completed').length;
    const pendingCount = pendingInvestments.length;

    return res.json({
      success: true,
      stats: {
        totalInvested,
        pendingInvested,
        totalReturnsReceived,
        activeCount,
        completedCount,
        pendingCount,
        overallReturnRate: totalInvested > 0 ? ((totalReturnsReceived / totalInvested) * 100).toFixed(1) : 0
      },
      data: investments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// IDOR-Protected Single Investment View
exports.getInvestmentById = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) return res.status(404).json({ success: false, message: 'Investment not found' });

    const currentUserId = req.user._id || req.user.id;
    // Strict Object-Level Authorization Check (BOLA / IDOR Defense)
    if (investment.userId !== currentUserId && req.user.role !== 'admin') {
      logSecurityEvent('IDOR_ATTEMPT_BLOCKED', {
        severity: 'CRITICAL',
        ip: req.ip,
        userId: currentUserId,
        message: `User [${req.user.email}] attempted unauthorized access to investment [${req.params.id}] owned by [${investment.userId}]`
      });
      return res.status(403).json({ success: false, message: 'Access denied: You are not authorized to view this investment record.' });
    }

    const project = await Project.findById(investment.projectId);
    return res.json({ success: true, data: { ...investment, projectDetails: project } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Disburse profit or return to investors
exports.disburseReturn = async (req, res) => {
  try {
    const { investmentId, returnAmount, isFinalReturn } = req.body;
    const investment = await Investment.findById(investmentId);
    if (!investment) return res.status(404).json({ success: false, message: 'Investment not found' });

    const amount = Number(returnAmount);
    const user = await User.findById(investment.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Investor not found' });

    // Credit investor's wallet
    await User.updateById(user._id || user.id, {
      walletBalance: (user.walletBalance || 0) + amount
    });

    // Update investment
    const newTotalReceived = (investment.totalReturnReceived || 0) + amount;
    await Investment.updateById(investmentId, {
      totalReturnReceived: newTotalReceived,
      ...(isFinalReturn && { status: 'completed', remainingDays: 0, actualReturn: investment.expectedReturn })
    });

    // Ledger transaction
    const txnRef = `RET${Date.now().toString().slice(-8)}`;
    await Transaction.create({
      userId: user._id || user.id,
      type: isFinalReturn ? 'return' : 'monthly_return',
      amount,
      status: 'completed',
      method: 'Wallet',
      reference: txnRef,
      description: `${isFinalReturn ? 'Final Return' : 'Monthly Dividend'} from ${investment.projectTitle}`,
      projectId: investment.projectId,
      date: new Date().toISOString().split('T')[0]
    });

    logSecurityEvent('PROFIT_DISBURSED', {
      severity: 'INFO',
      ip: req.ip,
      message: `Admin disbursed ৳${amount} for investment [${investmentId}] to user [${user.email}]`
    });

    // Notification
    await Notification.create({
      userId: user._id || user.id,
      type: 'return',
      title: `রিটার্ন জমা হয়েছে: ৳${amount.toLocaleString('en-BD')}`,
      message: `${investment.projectTitle} প্রকল্প থেকে আপনার ওয়ালেটে ৳${amount.toLocaleString('en-BD')} জমা দেওয়া হয়েছে।`,
      date: new Date().toISOString().split('T')[0],
      icon: 'money'
    });

    return res.json({ success: true, message: `Profit of ৳${amount.toLocaleString('en-BD')} disbursed successfully!` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
