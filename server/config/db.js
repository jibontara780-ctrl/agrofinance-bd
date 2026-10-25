const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'agro_db.json');

// Memory store for offline mode
let memoryDb = {
  users: [],
  projects: [],
  investments: [],
  transactions: [],
  marketPrices: [],
  notifications: []
};

// Load existing file data if present
function loadOfflineDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      memoryDb = JSON.parse(data);
    } else {
      saveOfflineDb();
    }
  } catch (err) {
    console.error('Error loading offline DB:', err.message);
  }
}

function saveOfflineDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving offline DB:', err.message);
  }
}

let isMongoConnected = false;

async function ensureSeedData() {
  try {
    const { getSeedData } = require('../data/seedData');
    const seed = await getSeedData();
    let needsSave = false;

    if (!memoryDb.users) memoryDb.users = [];
    for (const defaultUser of seed.users) {
      const existingUser = memoryDb.users.find(u => (u.email || '').toLowerCase() === defaultUser.email.toLowerCase());
      if (!existingUser) {
        memoryDb.users.push(defaultUser);
        needsSave = true;
      } else {
        if (!existingUser.password || !existingUser.isEmailVerified) {
          existingUser.password = defaultUser.password;
          existingUser.isEmailVerified = true;
          needsSave = true;
        }
      }
    }

    if (!memoryDb.projects || memoryDb.projects.length === 0) {
      memoryDb.projects = seed.projects;
      needsSave = true;
    } else {
      for (const sp of seed.projects) {
        const found = memoryDb.projects.find(p => p.id === sp.id || p._id === sp._id || p.title === sp.title);
        if (found) {
          found.descriptionEn = sp.descriptionEn;
          found.descriptionBn = sp.descriptionBn;
          found.highlightsEn = sp.highlightsEn;
          found.prokolpos = sp.prokolpos;
          needsSave = true;
        }
      }
    }

    if (!memoryDb.marketPrices || memoryDb.marketPrices.length === 0) {
      memoryDb.marketPrices = seed.marketPrices;
      needsSave = true;
    }

    if (!memoryDb.notifications) {
      memoryDb.notifications = seed.notifications;
      needsSave = true;
    }
    if (!memoryDb.investments) memoryDb.investments = [];
    const existingInvIds = new Set(memoryDb.investments.map(i => i._id || i.id));
    for (const defaultInv of seed.investments) {
      if (!existingInvIds.has(defaultInv._id || defaultInv.id)) {
        memoryDb.investments.push(defaultInv);
        needsSave = true;
      }
    }

    if (!memoryDb.transactions) memoryDb.transactions = [];
    const existingTxnRefs = new Set(memoryDb.transactions.map(t => t.reference || t._id || t.id));
    for (const defaultTxn of seed.transactions) {
      if (!existingTxnRefs.has(defaultTxn.reference || defaultTxn._id || defaultTxn.id)) {
        memoryDb.transactions.push(defaultTxn);
        needsSave = true;
      }
    }

    if (needsSave) {
      saveOfflineDb();
    }
  } catch (err) {
    console.error('Error ensuring seed data:', err.message);
  }
}

async function migrateToMongo() {
  try {
    loadOfflineDb();
    await ensureSeedData();
    const { getSeedData } = require('../data/seedData');
    const seed = await getSeedData();

    const db = mongoose.connection.db;

    // Users
    const userCount = await db.collection('users').countDocuments();
    if (userCount === 0) {
      const usersToInsert = (memoryDb.users && memoryDb.users.length > 0) ? memoryDb.users : seed.users;
      if (usersToInsert.length > 0) {
        await db.collection('users').insertMany(usersToInsert);
        console.log(`[MongoDB Migration] Populated ${usersToInsert.length} users into MongoDB collection 'users'.`);
      }
    }

    // Projects
    const projectCount = await db.collection('projects').countDocuments();
    if (projectCount === 0) {
      const projectsToInsert = (memoryDb.projects && memoryDb.projects.length > 0) ? memoryDb.projects : seed.projects;
      if (projectsToInsert.length > 0) {
        await db.collection('projects').insertMany(projectsToInsert);
        console.log(`[MongoDB Migration] Populated ${projectsToInsert.length} projects into MongoDB collection 'projects'.`);
      }
    } else {
      // Sync bilingual descriptions and prokolpos into MongoDB
      for (const sp of seed.projects) {
        await db.collection('projects').updateOne(
          { $or: [{ id: sp.id }, { _id: sp._id }, { title: sp.title }] },
          {
            $set: {
              descriptionEn: sp.descriptionEn,
              descriptionBn: sp.descriptionBn,
              highlightsEn: sp.highlightsEn,
              prokolpos: sp.prokolpos
            }
          }
        );
      }
      console.log(`[MongoDB Migration] Synced bilingual descriptions for ${seed.projects.length} projects in MongoDB.`);
    }

    // Investments
    const invCount = await db.collection('investments').countDocuments();
    if (invCount === 0) {
      const invsToInsert = (memoryDb.investments && memoryDb.investments.length > 0) ? memoryDb.investments : seed.investments;
      if (invsToInsert.length > 0) {
        await db.collection('investments').insertMany(invsToInsert);
        console.log(`[MongoDB Migration] Populated ${invsToInsert.length} investments into MongoDB collection 'investments'.`);
      }
    }

    // Transactions
    const txnCount = await db.collection('transactions').countDocuments();
    if (txnCount === 0) {
      const txnsToInsert = (memoryDb.transactions && memoryDb.transactions.length > 0) ? memoryDb.transactions : seed.transactions;
      if (txnsToInsert.length > 0) {
        await db.collection('transactions').insertMany(txnsToInsert);
        console.log(`[MongoDB Migration] Populated ${txnsToInsert.length} transactions into MongoDB collection 'transactions'.`);
      }
    }

    // MarketPrices
    const mpCount = await db.collection('marketprices').countDocuments();
    if (mpCount === 0) {
      const mpToInsert = (memoryDb.marketPrices && memoryDb.marketPrices.length > 0) ? memoryDb.marketPrices : seed.marketPrices;
      if (mpToInsert.length > 0) {
        await db.collection('marketprices').insertMany(mpToInsert);
        console.log(`[MongoDB Migration] Populated ${mpToInsert.length} market prices into MongoDB collection 'marketprices'.`);
      }
    }

    // Notifications
    const notifCount = await db.collection('notifications').countDocuments();
    if (notifCount === 0) {
      const notifsToInsert = (memoryDb.notifications && memoryDb.notifications.length > 0) ? memoryDb.notifications : seed.notifications;
      if (notifsToInsert.length > 0) {
        await db.collection('notifications').insertMany(notifsToInsert);
        console.log(`[MongoDB Migration] Populated ${notifsToInsert.length} notifications into MongoDB collection 'notifications'.`);
      }
    }
  } catch (err) {
    console.error('[MongoDB Migration Error]:', err.message);
  }
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrofinance_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    await migrateToMongo();
    return true;
  } catch (error) {
    console.warn(`[Database] Live MongoDB not detected (${error.message}).`);
    console.log(`[Database] Running in Standalone Database Mode with local persistence: ${DB_FILE}`);
    loadOfflineDb();
    await ensureSeedData();
    isMongoConnected = false;
    return false;
  }
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  getMemoryDb: () => memoryDb,
  saveOfflineDb,
  loadOfflineDb
};
