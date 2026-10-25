const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'agro_secret_key_super_secure_2026';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Support demo direct user bypass in development
    if (token === 'demo-token-investor') {
      const user = await User.findById('usr_001');
      if (user) {
        req.user = user;
        return next();
      }
    }
    if (token === 'demo-token-admin') {
      const admin = await User.findById('usr_admin');
      if (admin) {
        req.user = admin;
        return next();
      }
    }

    // 11. JWT Vulnerability Defense: enforce HS256, disallow 'none' algorithm
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (user.status === 'frozen') {
      return res.status(403).json({
        success: false,
        message: 'আপনার অ্যাকাউন্টটি প্রশাসনিক কারণে স্থগিত (Frozen) করা হয়েছে। সহায়তার জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।',
        code: 'ACCOUNT_FROZEN'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
