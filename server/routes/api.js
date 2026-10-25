const express = require('express');
const router = express.Router();

const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { apiLimiter, authLimiter, sanitizeInput, csrfDefense } = require('../middleware/security');

const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const investmentController = require('../controllers/investmentController');
const walletController = require('../controllers/walletController');
const marketController = require('../controllers/marketController');
const adminController = require('../controllers/adminController');
const aiController = require('../controllers/aiController');
const farmVisitController = require('../controllers/farmVisitController');
const { Notification } = require('../models');

// Apply CSRF defense & input sanitizer on all API routes
router.use(csrfDefense);
router.use(sanitizeInput);

const { testLiveSmtp } = require('../utils/emailService');
router.get('/test-smtp', async (req, res) => {
  const to = req.query.to || 'cse12105048@gmail.com';
  const result = await testLiveSmtp(to);
  res.json(result);
});

// --- AUTH & PROFILE (Protected with Brute-Force Rate Limiting) ---
router.post('/auth/register', authLimiter, authController.register);
router.post('/auth/verify-email', authLimiter, authController.verifyEmail);
router.post('/auth/resend-verification', authLimiter, authController.resendVerification);
router.post('/auth/forgot-password', authLimiter, authController.forgotPassword);
router.post('/auth/reset-password', authLimiter, authController.resetPassword);
router.post('/auth/login', authLimiter, authController.login);
router.post('/auth/admin-login', authLimiter, authController.adminLogin);
router.get('/auth/me', authMiddleware, authController.getMe);
router.put('/auth/profile', authMiddleware, authController.updateProfile);
router.post('/auth/kyc', authMiddleware, authController.submitKyc);
router.post('/auth/2fa/verify', authMiddleware, authController.verify2FA);

// --- AGRICULTURAL PROJECTS ---
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', authMiddleware, adminMiddleware, projectController.createProject);
router.put('/projects/:id', authMiddleware, adminMiddleware, projectController.updateProject);
router.delete('/projects/:id', authMiddleware, adminMiddleware, projectController.deleteProject);

// --- INVESTMENTS & PORTFOLIO ---
router.post('/investments', authMiddleware, investmentController.createInvestment);
router.get('/investments/my', authMiddleware, investmentController.getMyInvestments);
router.get('/investments/:id', authMiddleware, investmentController.getInvestmentById);
router.post('/investments/disburse', authMiddleware, adminMiddleware, investmentController.disburseReturn);

// --- DIGITAL WALLET & TRANSACTIONS ---
router.post('/wallet/deposit', authMiddleware, walletController.depositFunds);
router.post('/wallet/withdraw', authMiddleware, walletController.requestWithdrawal);
router.get('/wallet/transactions', authMiddleware, walletController.getTransactions);

// --- COMMODITY MARKET PRICES ---
router.get('/market', marketController.getMarketPrices);
router.post('/market', authMiddleware, adminMiddleware, marketController.createMarketPrice);
router.put('/market/:id', authMiddleware, adminMiddleware, marketController.updateMarketPrice);
router.delete('/market/:id', authMiddleware, adminMiddleware, marketController.deleteMarketPrice);

// --- AI AGRICULTURAL INVESTMENT AGENT (OpenRouter GPT-4o-Mini) ---
router.post('/ai/chat', aiController.chat);

// --- FARM TOURS & IN-PERSON VISITS ---
router.post('/visits/book', farmVisitController.bookFarmVisit);
router.get('/admin/visits', authMiddleware, adminMiddleware, farmVisitController.getAllFarmVisits);
router.post('/admin/visits/:id/status', authMiddleware, adminMiddleware, farmVisitController.updateFarmVisitStatus);
router.delete('/admin/visits/:id', authMiddleware, adminMiddleware, farmVisitController.deleteFarmVisit);


// --- NOTIFICATIONS ---
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const all = await Notification.find();
    const userNotifs = all.filter(n => n.userId === userId || n.userId === 'all');
    return res.json({ success: true, count: userNotifs.length, data: userNotifs, notifications: userNotifs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const all = await Notification.find();
    for (const n of all) {
      if (n.userId === userId || n.userId === 'all') {
        await Notification.updateById(n._id || n.id, { read: true });
      }
    }
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const updated = await Notification.updateById(req.params.id, { read: true });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- ADMIN CONTROL PANEL & VERIFICATION QUEUES ---
router.get('/admin/stats', authMiddleware, adminMiddleware, adminController.getAdminStats);
router.get('/admin/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.get('/admin/users/:id/full', authMiddleware, adminMiddleware, adminController.getUserFullDetails);
router.post('/admin/users/balance', authMiddleware, adminMiddleware, adminController.adjustUserBalance);
router.post('/admin/users/adjust-balance', authMiddleware, adminMiddleware, adminController.adjustUserBalance);
router.post('/admin/users/verify-email', authMiddleware, adminMiddleware, adminController.adminVerifyUserEmail);
router.post('/admin/broadcast', authMiddleware, adminMiddleware, adminController.broadcastAnnouncement);
router.get('/admin/verifications', authMiddleware, adminMiddleware, adminController.getPendingVerifications);
router.post('/admin/kyc', authMiddleware, adminMiddleware, adminController.updateKycStatus);
router.post('/admin/kyc/status', authMiddleware, adminMiddleware, adminController.updateKycStatus);
router.post('/admin/freeze', authMiddleware, adminMiddleware, adminController.toggleUserFreeze);
router.post('/admin/users/freeze', authMiddleware, adminMiddleware, adminController.toggleUserFreeze);
router.get('/admin/transactions', authMiddleware, adminMiddleware, adminController.getPendingTransactions);
router.post('/admin/transactions/review', authMiddleware, adminMiddleware, adminController.reviewTransaction);
router.get('/admin/investments', authMiddleware, adminMiddleware, adminController.getAllInvestments);
router.post('/admin/investments/review', authMiddleware, adminMiddleware, adminController.reviewInvestment);
router.get('/admin/security', authMiddleware, adminMiddleware, adminController.getSecurityAudit);
router.post('/admin/security/simulate-attack', authMiddleware, adminMiddleware, adminController.simulateThreatAttack);
router.post('/admin/security/mitigate', authMiddleware, adminMiddleware, adminController.mitigateThreats);
router.get('/admin/email-config', authMiddleware, adminMiddleware, adminController.getEmailConfig);
router.post('/admin/email-config', authMiddleware, adminMiddleware, adminController.updateEmailConfig);
router.post('/admin/test-email', authMiddleware, adminMiddleware, adminController.testSendEmail);

module.exports = router;
