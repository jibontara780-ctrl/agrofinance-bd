const { User, Transaction, Notification } = require('../models');
const {
  sendPaymentGatewaySuccessEmail,
  sendBankDepositSlipSubmittedEmail
} = require('../utils/emailService');

exports.depositFunds = async (req, res) => {
  try {
    const {
      amount,
      method,
      senderAccount,
      trxId,
      channelType,
      bankPaymentDetails
    } = req.body;
    const userId = req.user._id || req.user.id;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount < 500) {
      return res.status(400).json({ success: false, message: 'Minimum deposit amount is ৳500.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const isBankTransfer = channelType === 'bank_transfer' || method === 'Bank Wire' || method === 'Bank Transfer';

    if (isBankTransfer) {
      // 1. Direct Bank Transfer / Deposit Slip Flow (Pending Admin Approval)
      const ref = trxId || (bankPaymentDetails && bankPaymentDetails.scrollNumber) || `BANK-DEP${Date.now().toString().slice(-8)}`;

      const newTxn = await Transaction.create({
        userId,
        userName: user.name,
        userEmail: user.email,
        type: 'deposit',
        amount: depositAmount,
        status: 'pending',
        method: 'Bank Transfer',
        channelType: 'bank_transfer',
        reference: ref,
        senderAccount: senderAccount || (bankPaymentDetails && bankPaymentDetails.depositorAccountName) || '',
        bankPaymentDetails: bankPaymentDetails || {},
        proofDocument: (bankPaymentDetails && bankPaymentDetails.depositSlipUrl) || '',
        description: `Direct Bank Deposit via ${(bankPaymentDetails && bankPaymentDetails.corporateBank) || 'DBBL'} (${(bankPaymentDetails && bankPaymentDetails.transferType) || 'BEFTN/NPSB'}) - Ref: ${ref}`,
        date: new Date().toISOString().split('T')[0]
      });

      await Notification.create({
        userId,
        type: 'general',
        title: 'ব্যাংক ডিপোজিট স্লিপ জমা হয়েছে (Pending Verification)',
        message: `আপনার ৳${depositAmount.toLocaleString('en-BD')} ব্যাংক ডিপোজিট স্লিপ জমা হয়েছে। ব্যাংকিং ক্লিয়ারেন্স সম্পন্ন হলে টাকা আপনার ওয়ালেটে যুক্ত হবে। রেফারেন্স: ${ref}`,
        date: new Date().toISOString().split('T')[0],
        icon: 'money'
      });

      sendBankDepositSlipSubmittedEmail({
        toEmail: user.email,
        userName: user.name,
        amount: depositAmount,
        corporateBank: (bankPaymentDetails && bankPaymentDetails.corporateBank) || 'Dutch-Bangla Bank PLC',
        transferType: (bankPaymentDetails && bankPaymentDetails.transferType) || 'BEFTN / NPSB',
        scrollNumber: ref,
        depositorBank: (bankPaymentDetails && bankPaymentDetails.depositorBank) || '',
        isDeposit: true
      }).catch(err => console.error('[EMAIL ERROR]', err.message));

      return res.status(200).json({
        success: true,
        isPending: true,
        message: 'ব্যাংক ডিপোজিট স্লিপ সফলভাবে জমা হয়েছে! অ্যাডমিন ভেরিফিকেশন সম্পন্ন হলে আপনার ওয়ালেটে টাকা যুক্ত হবে।',
        newBalance: user.walletBalance || 0,
        transaction: newTxn
      });
    } else {
      // 2. Instant Payment Gateway Flow (bKash, Nagad, Rocket, Cards, NetBanking)
      const newBalance = (user.walletBalance || 0) + depositAmount;
      await User.updateById(userId, { walletBalance: newBalance });

      const ref = trxId || `PGW-${(method || 'ONLINE').toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-8)}`;
      const newTxn = await Transaction.create({
        userId,
        userName: user.name,
        userEmail: user.email,
        type: 'deposit',
        amount: depositAmount,
        status: 'completed',
        method: method || 'Payment Gateway',
        channelType: 'gateway',
        reference: ref,
        senderAccount: senderAccount || user.phone || '',
        description: `Instant Wallet Deposit via ${method || 'Payment Gateway'}`,
        date: new Date().toISOString().split('T')[0]
      });

      await Notification.create({
        userId,
        type: 'general',
        title: 'Wallet Deposit Confirmed!',
        message: `৳${depositAmount.toLocaleString('en-BD')} has been successfully credited to your wallet via ${method || 'Payment Gateway'}. New Balance: ৳${newBalance.toLocaleString('en-BD')}`,
        date: new Date().toISOString().split('T')[0],
        icon: 'money'
      });

      sendPaymentGatewaySuccessEmail({
        toEmail: user.email,
        userName: user.name,
        amount: depositAmount,
        method: method || 'Payment Gateway',
        trxId: ref,
        isDeposit: true
      }).catch(err => console.error('[EMAIL ERROR]', err.message));

      return res.status(200).json({
        success: true,
        isPending: false,
        message: `৳${depositAmount.toLocaleString('en-BD')} সফলভাবে আপনার ওয়ালেটে জমা হয়েছে!`,
        newBalance,
        transaction: newTxn
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Deposit failed', error: error.message });
  }
};

exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, method, destinationAccount } = req.body;
    const userId = req.user._id || req.user.id;
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount < 500) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ৳500.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    if ((user.walletBalance || 0) < withdrawAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ৳${(user.walletBalance || 0).toLocaleString('en-BD')}`
      });
    }

    const newBalance = user.walletBalance - withdrawAmount;
    await User.updateById(userId, { walletBalance: newBalance });

    const ref = `WTH${Date.now().toString().slice(-8)}`;
    const newTxn = await Transaction.create({
      userId,
      userName: user.name,
      userEmail: user.email,
      type: 'withdrawal',
      amount: -withdrawAmount,
      status: 'completed', // Auto-cleared in demo
      method: method || 'Bank Transfer',
      reference: ref,
      description: `Withdrawal to ${destinationAccount || user.bankDetails?.bankName || 'Bank Account'}`,
      date: new Date().toISOString().split('T')[0]
    });

    await Notification.create({
      userId,
      type: 'general',
      title: 'Withdrawal Processed Successfully',
      message: `Your withdrawal request of ৳${withdrawAmount.toLocaleString('en-BD')} has been processed. Funds will be credited to your account within 1-2 business days.`,
      date: new Date().toISOString().split('T')[0],
      icon: 'money'
    });

    return res.status(200).json({
      success: true,
      message: 'Withdrawal processed successfully!',
      newBalance,
      transaction: newTxn
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Withdrawal failed', error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { type } = req.query;

    let query = { userId };
    if (type && type !== 'all') {
      query.type = type;
    }

    let txns = await Transaction.find(query);
    txns.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());

    return res.json({ success: true, count: txns.length, data: txns });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
