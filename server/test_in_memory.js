const { app } = require('./server');
const { User, Project, Investment, Transaction } = require('./models');
const { connectDB } = require('./config/db');

// Lightweight In-Memory Request Dispatcher (bypasses network/socket sandbox limits)
function requestInMemory(app, options) {
  return new Promise((resolve, reject) => {
    const { method = 'GET', url, headers = {}, body = null } = options;
    const http = require('http');
    const { EventEmitter } = require('events');

    const socket = new EventEmitter();
    socket.remoteAddress = '127.0.0.1';
    socket.encrypted = false;
    socket.writable = true;

    const normalizedHeaders = {};
    for (const [k, v] of Object.entries(headers)) {
      normalizedHeaders[k.toLowerCase()] = v;
    }

    const req = new http.IncomingMessage(socket);
    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.headers = {
      'host': 'localhost',
      'user-agent': 'InMemoryTest/1.0',
      'content-type': 'application/json',
      ...normalizedHeaders
    };
    req.connection = socket;
    req.socket = socket;
    req.ip = '127.0.0.1';
    req.body = body || {};

    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    let resData = '';
    res.write = function (chunk) {
      if (chunk) resData += chunk.toString();
      return true;
    };
    res.end = function (chunk) {
      if (chunk) resData += chunk.toString();
      try {
        resolve({ status: res.statusCode, headers: res.getHeaders(), data: JSON.parse(resData) });
      } catch (e) {
        resolve({ status: res.statusCode, headers: res.getHeaders(), raw: resData });
      }
    };

    try {
      app.handle(req, res);
    } catch (err) {
      reject(err);
    }
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING AGROFINANCE IN-MEMORY COMPREHENSIVE TEST SUITE');
  console.log('======================================================\n');

  await connectDB();

  // Test 1: Health Check Endpoint
  const health = await requestInMemory(app, { method: 'GET', url: '/api/health' });
  console.log('1. Health Check status:', health.status, '| Platform:', health.data?.platform);
  if (health.status !== 200) throw new Error('Health check failed');

  // Test 2: Authentication - Weak Password Rejection
  const weakAuth = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/register',
    body: { name: 'Weak User', email: 'weak@agro.bd', password: '123' }
  });
  console.log('2. Weak Password Rejected (400):', weakAuth.status === 400, '| Msg:', weakAuth.data?.message);
  if (weakAuth.status !== 400) throw new Error('Weak password was not rejected');

  // Test 3: Demo Investor Login
  const login = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/login',
    body: { email: 'ahmed@agrofinance.bd', password: 'password123' }
  });
  console.log('3. Demo Login status:', login.status, '| User:', login.data?.user?.name);
  if (login.status !== 200 || !login.data?.token) throw new Error('Login failed');
  const token = login.data.token;

  // Test 4: Projects Filter
  const projs = await requestInMemory(app, { method: 'GET', url: '/api/projects?category=grain' });
  console.log('4. Projects filtered (grain):', projs.data?.count, 'projects found');
  if (projs.status !== 200 || !projs.data?.data) throw new Error('Projects query failed');

  // Test 5: IDOR Defense Test
  const idorAllowed = await requestInMemory(app, {
    method: 'GET',
    url: '/api/investments/inv_001',
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('5a. Owner accessing own investment status:', idorAllowed.status, 'data:', idorAllowed.data);
  if (idorAllowed.status !== 200) throw new Error('Owner could not access own investment: ' + JSON.stringify(idorAllowed.data));

  // Test 6: Wallet Deposit
  const deposit = await requestInMemory(app, {
    method: 'POST',
    url: '/api/wallet/deposit',
    headers: { Authorization: `Bearer ${token}` },
    body: { amount: 100000, method: 'bKash', trxId: 'BASH_TRX_888' }
  });
  console.log('6. Wallet deposit success:', deposit.status === 200, '| New balance: ৳' + deposit.data?.newBalance);
  if (deposit.status !== 200) throw new Error('Deposit failed');

  // Test 7: Deep Merge Check on Profile Update
  const profUpdate = await requestInMemory(app, {
    method: 'PUT',
    url: '/api/auth/profile',
    headers: { Authorization: `Bearer ${token}` },
    body: { bankDetails: { bkashNo: '01799999999' } }
  });
  console.log('7. Profile deep update success:', profUpdate.status === 200, '| Bank Name preserved:', profUpdate.data?.user?.bankDetails?.bankName);
  if (profUpdate.status !== 200 || !profUpdate.data?.user?.bankDetails?.bankName) {
    throw new Error('Deep merge profile update failed: bankName was overwritten!');
  }

  // Test 8: Admin Security SIEM Radar
  const sec = await requestInMemory(app, {
    method: 'GET',
    url: '/api/admin/security',
    headers: { Authorization: 'Bearer demo-token-admin' }
  });
  console.log('8. Admin Security Score:', sec.data?.securityScore, '| Defenses:', sec.data?.defenseLayers?.length);
  if (sec.status !== 200 || !sec.data?.securityScore) throw new Error('Security audit endpoint failed');

  // Test 9: IDOR / BOLA Prevention (Unauthorized Access Rejection)
  const fatimaLogin = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/login',
    body: { email: 'fatima@agrofinance.bd', password: 'password123' }
  });
  const fatimaToken = fatimaLogin.data?.token;
  const idorBlocked = await requestInMemory(app, {
    method: 'GET',
    url: '/api/investments/inv_001', // Owned by Ahmed (usr_001)
    headers: { Authorization: `Bearer ${fatimaToken}` }
  });
  console.log('9. IDOR Unauthorized Access Blocked (403):', idorBlocked.status === 403);
  if (idorBlocked.status !== 403) throw new Error('IDOR security failed: Fatima was able to access Ahmed\'s investment!');

  // Test 10: Investment Flow with Wallet Deduction (Starts as Pending)
  const investTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/investments',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      projectId: 'proj_001',
      amount: 50000,
      paymentMethod: 'Wallet'
    }
  });
  const createdInvId = investTest.data?.data?._id || investTest.data?.data?.id;
  console.log('10. Investment created in Pending Review status:', investTest.status === 201 && investTest.data?.data?.status === 'pending', '| Cert ID:', investTest.data?.data?.certificateId);
  if (investTest.status !== 201 || investTest.data?.data?.status !== 'pending') throw new Error('Investment placement in pending status failed');

  // Test 11: Wallet Withdrawal
  const withdrawTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/wallet/withdraw',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      amount: 5000,
      method: 'Bank Transfer',
      destinationAccount: 'DBBL Acc #115.120.985678'
    }
  });
  console.log('11. Withdrawal processed:', withdrawTest.status === 200, '| New balance: ৳' + withdrawTest.data?.newBalance);
  if (withdrawTest.status !== 200) throw new Error('Withdrawal processing failed');

  // Test 12: Registration initiates OTP verification (User is not yet in database before OTP)
  const testEmail = `test_investor_${Date.now()}@agrofinance.bd`;
  const regTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/register',
    body: {
      name: 'Rahim Uddin',
      email: testEmail,
      password: 'password123',
      phone: '01711223344'
    }
  });
  const unverifiedInDb = await User.findOne({ email: testEmail });
  console.log('12. Registration requires OTP verification:', regTest.data?.requiresVerification === true, '| Account held pending (not yet in DB):', unverifiedInDb === null, '| OTP generated:', !!regTest.data?.devOtp);
  if (!regTest.data?.requiresVerification || unverifiedInDb !== null) throw new Error('Registration pending verification flow failed');

  // Test 13: Email Verification with OTP -> Account is officially added to database and activated!
  const verifyTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/verify-email',
    body: {
      email: testEmail,
      otp: regTest.data?.devOtp || '123456'
    }
  });
  const createdUser = await User.findOne({ email: testEmail });
  console.log('13. Email OTP verification success:', verifyTest.data?.user?.isEmailVerified === true, '| Account now created in DB:', !!createdUser);
  if (!verifyTest.data?.user?.isEmailVerified || !createdUser) throw new Error('Email verification and DB activation failed');

  // Test 14: Dedicated Admin Gateway Login & Admin 360° User Inspector Access
  const adminLogin = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/admin-login',
    body: { email: 'admin@agrofinance.bd', password: 'admin123' }
  });
  const adminToken = adminLogin.data?.token;

  const admin360Test = await requestInMemory(app, {
    method: 'GET',
    url: '/api/admin/users/usr_001/full',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('14. Admin 360° User Inspector:', admin360Test.status === 200, '| User:', admin360Test.data?.data?.user?.name, '| Investments count:', admin360Test.data?.data?.investments?.length);
  if (admin360Test.status !== 200 || !admin360Test.data?.data?.user?.bankDetails) throw new Error('Admin 360 profile access failed');

  // Test 15: Admin Balance Adjustment
  const adjustTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/admin/users/balance',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      userId: 'usr_001',
      type: 'credit',
      amount: 15000,
      reason: 'Special Agricultural Subsidy Bonus 2026'
    }
  });
  console.log('15. Admin Balance Adjustment:', adjustTest.status === 200, '| New balance: ৳' + adjustTest.data?.newBalance);
  if (adjustTest.status !== 200) throw new Error('Admin balance adjustment failed');

  // Test 16: Admin Broadcast Announcement
  const broadcastTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/admin/broadcast',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      title: 'নতুন বোরো মৌসুমে ২০% বোনাস রিটার্ন',
      message: 'সকল সম্মানিত বিনিয়োগকারীগণকে জানানো যাচ্ছে যে সিলেট প্রকল্পের ধান কাটার কার্যক্রম সফলভাবে সম্পন্ন হয়েছে।'
    }
  });
  console.log('16. Admin Broadcast Announcement:', broadcastTest.status === 200, '| Total users notified:', broadcastTest.data?.notifiedCount);
  if (broadcastTest.status !== 200) throw new Error('Admin broadcast failed');

  // Test 17: Admin Reviews and Approves Pending Investment
  const approveTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/admin/investments/review',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      investmentId: createdInvId,
      action: 'approve',
      adminRemarks: 'NID ও পেমেন্ট যাচাইপূর্বক অনুমোদন সম্পন্ন'
    }
  });
  console.log('17. Admin Investment Approval:', approveTest.status === 200, '| Active status:', approveTest.data?.status === 'active');
  if (approveTest.status !== 200 || approveTest.data?.status !== 'active') throw new Error('Admin investment approval failed');

  // Test 18: Admin Rejects Investment and User Wallet is Refunded
  const investToReject = await requestInMemory(app, {
    method: 'POST',
    url: '/api/investments',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      projectId: 'proj_001',
      amount: 50000,
      paymentMethod: 'Wallet'
    }
  });
  const rejectInvId = investToReject.data?.data?._id || investToReject.data?.data?.id;

  const rejectTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/admin/investments/review',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      investmentId: rejectInvId,
      action: 'reject',
      adminRemarks: 'নমিনির তথ্যে ত্রুটি থাকায় সাময়িক বাতিল ও রিফান্ড'
    }
  });
  console.log('18. Admin Investment Rejection & Wallet Refund:', rejectTest.status === 200, '| Refund applied:', rejectTest.data?.refundApplied === true);
  if (rejectTest.status !== 200 || !rejectTest.data?.refundApplied) throw new Error('Admin investment rejection refund failed');

  // Test 19: Direct Payment Gateway Investment (e.g. bKash Direct without wallet deduction)
  const directInvestTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/investments',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      projectId: 'proj_001',
      amount: 50000,
      paymentMethod: 'bKash Direct',
      trxId: 'BKASH99214488',
      senderAccount: '01712-345678',
      agreementAccepted: true
    }
  });
  console.log('19. Direct Payment Investment created:', directInvestTest.status === 201, '| Payment Method:', directInvestTest.data?.data?.paymentMethod);
  if (directInvestTest.status !== 201 || directInvestTest.data?.data?.paymentMethod !== 'bKash Direct') {
    throw new Error('Direct payment investment failed');
  }

  // Test 20: Investor KYC Document Upload (NID Front/Back, TIN, Bank Info, Nominee)
  const kycTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/kyc',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      nid: '19922691234567890',
      nidFront: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      nidBack: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      tin: '562145892301',
      nominee: {
        name: 'Sultana Jahan',
        relation: 'Spouse',
        phone: '01712-998877',
        nid: '8219401283'
      },
      bankInfo: {
        bankName: 'Islami Bank Bangladesh PLC',
        branchName: 'Gulshan Branch',
        accountName: 'Ahmed Hasan',
        accountNumber: '20501234567890100',
        routingNumber: '125271829'
      }
    }
  });
  console.log('20. KYC Document Upload success:', kycTest.status === 200, '| KYC Status:', kycTest.data?.user?.kycStatus);
  if (kycTest.status !== 200 || kycTest.data?.user?.kycStatus !== 'pending') {
    throw new Error('KYC document upload failed');
  }

  // Test 21: Admin Approves KYC & Identity Documentation
  const adminKycApprove = await requestInMemory(app, {
    method: 'POST',
    url: '/api/admin/kyc/status',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      userId: 'usr_001',
      status: 'verified',
      remarks: 'Verified NID smart card and bank routing details'
    }
  });
  console.log('21. Admin KYC Approval success:', adminKycApprove.status === 200, '| User KYC Status:', adminKycApprove.data?.user?.kycStatus);
  if (adminKycApprove.status !== 200 || adminKycApprove.data?.user?.kycStatus !== 'verified') {
    throw new Error('Admin KYC approval failed');
  }

  // Test 22: Email Verification with Universal Master Code 123456 (Instant login, no admin approval needed)
  const masterCodeEmail = `instant_verify_${Date.now()}@agrofinance.bd`;
  await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/register',
    body: {
      name: 'Tanvir Hossain',
      email: masterCodeEmail,
      password: 'password123',
      phone: '01819998877'
    }
  });

  const masterVerify = await requestInMemory(app, {
    method: 'POST',
    url: '/api/auth/verify-email',
    body: {
      email: masterCodeEmail,
      otp: '123456'
    }
  });
  const masterInDb = await User.findOne({ email: masterCodeEmail });
  console.log('22. Universal Master OTP Verification & Immediate Login:', masterVerify.status === 200, '| Token granted:', !!masterVerify.data?.token, '| Added to DB:', !!masterInDb);
  if (masterVerify.status !== 200 || !masterVerify.data?.token || !masterVerify.data?.user?.isEmailVerified || !masterInDb) {
    throw new Error('Universal master code verification failed');
  }

  // Test 23: Profile Password Change Verification
  const badPassUpdate = await requestInMemory(app, {
    method: 'PUT',
    url: '/api/auth/profile',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      currentPassword: 'wrongPassword999',
      newPassword: 'newSecurePassword123'
    }
  });
  const goodPassUpdate = await requestInMemory(app, {
    method: 'PUT',
    url: '/api/auth/profile',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      currentPassword: 'password123',
      newPassword: 'newSecurePassword123'
    }
  });
  // Restore original password so subsequent test runs stay clean
  await requestInMemory(app, {
    method: 'PUT',
    url: '/api/auth/profile',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      currentPassword: 'newSecurePassword123',
      newPassword: 'password123'
    }
  });
  console.log('23. Account Password Change Verification:', badPassUpdate.status === 400, '| Valid Change (200):', goodPassUpdate.status === 200);
  if (badPassUpdate.status !== 400 || goodPassUpdate.status !== 200) {
    throw new Error('Password change validation failed');
  }

  // Test 24: Favicon SVG Route
  const faviconTest = await requestInMemory(app, {
    method: 'GET',
    url: '/favicon.ico'
  });
  console.log('24. Favicon Direct Asset Check (200):', faviconTest.status === 200);
  if (faviconTest.status !== 200) {
    throw new Error('Favicon route failed');
  }

  // Test 25: Admin Live Market Price Management (Update & Create Rate)
  const updatePriceTest = await requestInMemory(app, {
    method: 'PUT',
    url: '/api/market/mp_001',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      currentPrice: 1400,
      market: 'Badamtoli Wholesale Hub, Dhaka'
    }
  });
  const addCommodityTest = await requestInMemory(app, {
    method: 'POST',
    url: '/api/market',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      cropName: 'Aromatic Chinigura Rice (চিনিগুঁড়া চাল)',
      category: 'grain',
      unit: 'per kg',
      currentPrice: 135,
      market: 'Dinajpur Central Mandi'
    }
  });
  console.log('25. Admin Market Price Management (PUT/POST):', updatePriceTest.status === 200, '| Rate created:', addCommodityTest.status === 201);
  if (updatePriceTest.status !== 200 || addCommodityTest.status !== 201) {
    throw new Error('Market price management failed');
  }

  // Test 26: Enhanced Admin 360° User Inspector Intelligence
  const full360Test = await requestInMemory(app, {
    method: 'GET',
    url: '/api/admin/users/usr_001/full',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const stats360 = full360Test.data?.data?.stats;
  console.log('26. Enhanced Admin 360° Intelligence (200):', full360Test.status === 200, '| Enriched stats present:', stats360 && stats360.totalDeposits !== undefined);
  if (full360Test.status !== 200 || !stats360 || stats360.totalDeposits === undefined) {
    throw new Error('Admin 360 intelligence test failed');
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 26 IN-MEMORY VERIFICATION TESTS PASSED (100%)!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});

