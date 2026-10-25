const mongoose = require('mongoose');
const { isMongoConnected, getMemoryDb, saveOfflineDb } = require('../config/db');

// --- MONGOOSE SCHEMAS ---
const UserSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['investor', 'admin'], default: 'investor' },
  status: { type: String, enum: ['active', 'frozen'], default: 'active' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  nid: { type: String, default: '' },
  nidFront: { type: String, default: '' },
  nidBack: { type: String, default: '' },
  address: { type: String, default: '' },
  tin: { type: String, default: '' },
  nominee: {
    name: { type: String, default: '' },
    relation: { type: String, default: '' },
    phone: { type: String, default: '' },
    nid: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  bankDetails: {
    bankName: { type: String, default: 'Dutch Bangla Bank Ltd.' },
    accountNo: { type: String, default: '' },
    branch: { type: String, default: 'Dhaka Main Branch' },
    routingNo: { type: String, default: '' },
    bkashNo: { type: String, default: '' },
    nagadNo: { type: String, default: '' }
  },
  kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  kycRemarks: { type: String, default: '' },
  kycDocuments: [{ name: String, fileUrl: String, submittedAt: Date, docType: String, status: String }],
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationOtp: { type: String, default: '' },
  emailVerificationExpires: { type: Date, default: null },
  passwordResetOtp: { type: String, default: '' },
  passwordResetExpires: { type: Date, default: null },
  walletBalance: { type: Number, default: 0 },
  autoReinvest: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const ProjectSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  title: { type: String, required: true },
  banglaTitle: { type: String, default: '' },
  category: { type: String, enum: ['grain', 'fishery', 'fruit', 'vegetable', 'livestock', 'dairy'], required: true },
  cropType: { type: String, required: true },
  location: { type: String, required: true },
  totalFunding: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  minInvestment: { type: Number, required: true },
  maxInvestment: { type: Number, required: true },
  expectedReturn: { type: Number, required: true }, // percentage, e.g. 24
  duration: { type: Number, required: true }, // in months
  durationUnit: { type: String, default: 'months' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'upcoming', 'completed', 'paused'], default: 'active' },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  farmArea: { type: String, default: '' },
  farmerCount: { type: Number, default: 1 },
  investorsCount: { type: Number, default: 0 },
  description: { type: String, default: '' },
  descriptionBn: { type: String, default: '' },
  descriptionEn: { type: String, default: '' },
  highlights: [{ type: String }],
  highlightsEn: [{ type: String }],
  prokolpos: [{
    id: String,
    name: String,
    banglaName: String,
    category: String,
    allocationPercentage: Number,
    targetAmount: Number,
    location: String,
    description: String,
    descriptionBn: String,
    descriptionEn: String,
    icon: String,
    expectedReturn: Number,
    status: String
  }],
  image: { type: String, default: 'rice' },
  manager: { type: String, default: 'AgroFinance AgriTech' },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const InvestmentSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  projectTitle: { type: String, required: true },
  category: { type: String, required: true },
  investedAmount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  expectedAmount: { type: Number, required: true },
  prokolpoAllocations: [{
    prokolpoName: String,
    banglaName: String,
    percentage: Number,
    allocatedAmount: Number,
    category: String,
    icon: String
  }],
  actualReturn: { type: Number, default: null },
  monthlyReturn: { type: Number, default: 0 },
  totalReturnReceived: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'pending', 'completed', 'rejected', 'cancelled', 'under_review'], default: 'pending' },
  verificationStatus: { type: String, enum: ['verified', 'pending', 'rejected', 'pending_kyc'], default: 'pending' },
  paymentMethod: { type: String, default: 'Wallet' },
  trxId: { type: String, default: '' },
  senderAccount: { type: String, default: '' },
  adminRemarks: { type: String, default: '' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: String, default: null },
  nomineeSnapshot: {
    name: { type: String, default: '' },
    relation: { type: String, default: '' },
    phone: { type: String, default: '' },
    nid: { type: String, default: '' }
  },
  agreementAccepted: { type: Boolean, default: true },
  investmentDate: { type: String, required: true },
  maturityDate: { type: String, required: true },
  certificateId: { type: String, required: true },
  remainingDays: { type: Number, default: 180 },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const TransactionSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  userId: { type: String, required: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  type: { type: String, enum: ['investment', 'return', 'monthly_return', 'deposit', 'withdrawal'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['completed', 'pending', 'rejected'], default: 'completed' },
  method: { type: String, default: 'Wallet' },
  reference: { type: String, required: true },
  senderAccount: { type: String, default: '' },
  destinationAccount: { type: String, default: '' },
  proofDocument: { type: String, default: '' },
  adminRemarks: { type: String, default: '' },
  reviewedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  description: { type: String, required: true },
  projectId: { type: String, default: null },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const MarketPriceSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  cropName: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, default: 'per kg' },
  currentPrice: { type: Number, required: true },
  previousPrice: { type: Number, required: true },
  change: { type: Number, required: true },
  trend: { type: String, enum: ['up', 'down'], default: 'up' },
  market: { type: String, required: true },
  lastUpdated: { type: String, required: true }
}, { strict: false });

const NotificationSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  userId: { type: String, default: 'all' },
  type: { type: String, default: 'general' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  read: { type: Boolean, default: false },
  icon: { type: String, default: 'bell' }
}, { strict: false });

const FarmVisitSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String },
  userId: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  farmLocation: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitorsCount: { type: Number, default: 1 },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  adminRemarks: { type: String, default: '' },
  confirmedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// Compile Mongoose models
const MongooseUser = mongoose.model('User', UserSchema);
const MongooseProject = mongoose.model('Project', ProjectSchema);
const MongooseInvestment = mongoose.model('Investment', InvestmentSchema);
const MongooseTransaction = mongoose.model('Transaction', TransactionSchema);
const MongooseMarketPrice = mongoose.model('MarketPrice', MarketPriceSchema);
const MongooseNotification = mongoose.model('Notification', NotificationSchema);
const MongooseFarmVisit = mongoose.model('FarmVisit', FarmVisitSchema);

// Helper for unique ID generation in offline mode
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

// Helper for deep merging nested objects (preserves nested sub-properties)
function deepMerge(target, source) {
  if (!target || typeof target !== 'object') return source;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

// Unified Wrapper Factory
function createRepository(collectionName, MongooseModel, prefix) {
  return {
    async find(query = {}) {
      if (isMongoConnected()) {
        return await MongooseModel.find(query).lean();
      }
      const db = getMemoryDb();
      return (db[collectionName] || []).filter(item => {
        for (const key in query) {
          if (query[key] !== undefined && item[key] !== query[key]) return false;
        }
        return true;
      });
    },

    async findById(id) {
      if (isMongoConnected()) {
        const item = await MongooseModel.findOne({ $or: [{ _id: id }, { id: id }] }).lean();
        return item;
      }
      const db = getMemoryDb();
      return (db[collectionName] || []).find(item => item._id === id || item.id === id) || null;
    },

    async findOne(query) {
      if (isMongoConnected()) {
        return await MongooseModel.findOne(query).lean();
      }
      const db = getMemoryDb();
      return (db[collectionName] || []).find(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },

    async create(doc) {
      const idVal = doc._id || doc.id || generateId(prefix);
      const docWithId = {
        _id: idVal,
        id: idVal,
        ...doc,
        createdAt: doc.createdAt || new Date().toISOString()
      };
      if (isMongoConnected()) {
        try {
          const item = new MongooseModel(docWithId);
          await item.save();
          return item.toObject ? item.toObject() : item;
        } catch (mErr) {
          await mongoose.connection.db.collection(collectionName.toLowerCase()).insertOne(docWithId);
          return docWithId;
        }
      }
      const db = getMemoryDb();
      if (!db[collectionName]) db[collectionName] = [];
      db[collectionName].unshift(docWithId);
      saveOfflineDb();
      return docWithId;
    },

    async updateById(id, updateData) {
      if (isMongoConnected()) {
        const existing = await MongooseModel.findOne({ $or: [{ _id: id }, { id: id }] }).lean();
        if (!existing) return null;
        const merged = deepMerge(existing, updateData);
        const { _id, ...fieldsToSet } = merged;
        return await MongooseModel.findOneAndUpdate(
          { $or: [{ _id: id }, { id: id }] },
          { $set: fieldsToSet },
          { returnDocument: 'after' }
        ).lean();
      }
      const db = getMemoryDb();
      const index = (db[collectionName] || []).findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      db[collectionName][index] = deepMerge(db[collectionName][index], updateData);
      saveOfflineDb();
      return db[collectionName][index];
    },

    async deleteById(id) {
      if (isMongoConnected()) {
        const res = await MongooseModel.deleteOne({ $or: [{ _id: id }, { id: id }] });
        return res.deletedCount > 0;
      }
      const db = getMemoryDb();
      const initialLen = (db[collectionName] || []).length;
      db[collectionName] = (db[collectionName] || []).filter(item => item._id !== id && item.id !== id);
      saveOfflineDb();
      return db[collectionName].length < initialLen;
    },

    async countDocuments(query = {}) {
      if (isMongoConnected()) {
        return await MongooseModel.countDocuments(query);
      }
      const items = await this.find(query);
      return items.length;
    }
  };
}

module.exports = {
  User: createRepository('users', MongooseUser, 'usr'),
  Project: createRepository('projects', MongooseProject, 'proj'),
  Investment: createRepository('investments', MongooseInvestment, 'inv'),
  Transaction: createRepository('transactions', MongooseTransaction, 'txn'),
  MarketPrice: createRepository('marketPrices', MongooseMarketPrice, 'mp'),
  Notification: createRepository('notifications', MongooseNotification, 'notif'),
  FarmVisit: createRepository('farmVisits', MongooseFarmVisit, 'vst')
};
