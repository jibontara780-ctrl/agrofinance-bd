const { FarmVisit, Notification, User } = require('../models');
const { sendFarmVisitConfirmationEmail, sendFarmVisitCancellationEmail } = require('../utils/emailService');

/**
 * Public/User: Book an In-Person Farm Tour / Visit
 * POST /api/visits/book
 */
exports.bookFarmVisit = async (req, res) => {
  try {
    const { name, email, phone, farmLocation, visitDate, visitorsCount, notes } = req.body;

    if (!name || !email || !phone || !farmLocation || !visitDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, farm location, and preferred visit date are required.'
      });
    }

    // Clean inputs
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();
    const count = Math.max(1, parseInt(visitorsCount || 1, 10));

    // Optional user association if logged in
    const userId = req.user ? (req.user._id || req.user.id) : null;

    const newVisit = await FarmVisit.create({
      userId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      farmLocation,
      visitDate,
      visitorsCount: count,
      notes: notes ? notes.trim() : '',
      status: 'pending',
      adminRemarks: '',
      createdAt: new Date()
    });

    // Notify administrators
    try {
      await Notification.create({
        userId: 'all',
        type: 'farm_visit',
        title: '🚜 নতুন খামার পরিদর্শন আবেদন জমা হয়েছে',
        message: `${cleanName} (${cleanEmail}) ${farmLocation} খামার পরিদর্শনের জন্য আবেদন করেছেন (তারিখ: ${visitDate}, দর্শনার্থী: ${count} জন)।`,
        date: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }),
        read: false,
        icon: 'tractor'
      });
    } catch (notifErr) {
      console.warn('[Farm Visit] Could not create admin notification:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'আপনার খামার পরিদর্শনের আবেদনটি সফলভাবে গৃহীত হয়েছে! অ্যাডমিন অনুমোদনের পর ইমেইলে কনফার্মেশন পাঠানো হবে।',
      visit: newVisit
    });
  } catch (err) {
    console.error('[Farm Visit Booking Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error booking farm visit: ' + err.message });
  }
};

/**
 * Admin: Get All Farm Visits
 * GET /api/admin/visits
 */
exports.getAllFarmVisits = async (req, res) => {
  try {
    const { status, farmLocation, search } = req.query;
    let visits = await FarmVisit.find();

    // Sort descending by creation date
    visits.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    if (status && status !== 'all') {
      visits = visits.filter(v => v.status === status);
    }

    if (farmLocation && farmLocation !== 'all') {
      visits = visits.filter(v => (v.farmLocation || '').toLowerCase().includes(farmLocation.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      visits = visits.filter(v =>
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)) ||
        (v.phone && v.phone.includes(q)) ||
        (v.farmLocation && v.farmLocation.toLowerCase().includes(q))
      );
    }

    const stats = {
      total: visits.length,
      pending: visits.filter(v => v.status === 'pending').length,
      confirmed: visits.filter(v => v.status === 'confirmed').length,
      cancelled: visits.filter(v => v.status === 'cancelled').length
    };

    return res.json({
      success: true,
      count: visits.length,
      stats,
      visits
    });
  } catch (err) {
    console.error('[Admin Get Visits Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Admin: Update Farm Visit Status (Confirm or Cancel) + Dispatch Realtime Email
 * POST /api/admin/visits/:id/status
 */
exports.updateFarmVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be confirmed, cancelled, or pending.'
      });
    }

    const visit = await FarmVisit.findById(id);
    if (!visit) {
      return res.status(404).json({ success: false, message: 'Farm visit request not found.' });
    }

    const updateFields = {
      status,
      adminRemarks: adminRemarks ? adminRemarks.trim() : (visit.adminRemarks || '')
    };

    if (status === 'confirmed') {
      updateFields.confirmedAt = new Date();
    } else if (status === 'cancelled') {
      updateFields.cancelledAt = new Date();
    }

    const updated = await FarmVisit.updateById(id, updateFields);

    // Dispatch realtime Email to user via Nodemailer
    let emailSent = false;
    if (status === 'confirmed') {
      const emailRes = await sendFarmVisitConfirmationEmail({
        toEmail: visit.email,
        userName: visit.name,
        farmLocation: visit.farmLocation,
        visitDate: visit.visitDate,
        visitorsCount: visit.visitorsCount,
        adminRemarks: updateFields.adminRemarks
      });
      emailSent = emailRes.success;
    } else if (status === 'cancelled') {
      const emailRes = await sendFarmVisitCancellationEmail({
        toEmail: visit.email,
        userName: visit.name,
        farmLocation: visit.farmLocation,
        visitDate: visit.visitDate,
        adminRemarks: updateFields.adminRemarks
      });
      emailSent = emailRes.success;
    }

    // Also dispatch in-app notification if userId exists
    if (visit.userId) {
      try {
        await Notification.create({
          userId: visit.userId,
          type: 'farm_visit',
          title: status === 'confirmed' ? '✅ খামার পরিদর্শন আবেদন অনুমোদিত হয়েছে!' : '⚠️ খামার পরিদর্শন আপডেট',
          message: status === 'confirmed'
            ? `আপনার ${visit.farmLocation} পরিদর্শনের আবেদন অনুমোদিত হয়েছে (${visit.visitDate})। বিস্তারিত নির্দেশনা আপনার ইমেইলে (${visit.email}) পাঠানো হয়েছে।`
            : `আপনার ${visit.farmLocation} পরিদর্শনের আবেদনটি এই মুহূর্তে বাতিল করা হয়েছে। কারণ: ${updateFields.adminRemarks || 'অনিবার্য কারণবশত'}।`,
          date: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }),
          read: false,
          icon: status === 'confirmed' ? 'check-circle' : 'alert-circle'
        });
      } catch (e) {
        console.warn('[Notification Error]:', e.message);
      }
    }

    return res.json({
      success: true,
      message: status === 'confirmed'
        ? `খামার পরিদর্শন সফলভাবে নিশ্চিত করা হয়েছে এবং ব্যবহারকারীর ইমেইলে (${visit.email}) পাস পাঠানো হয়েছে।`
        : `খামার পরিদর্শন বাতিল করা হয়েছে এবং ব্যবহারকারীকে (${visit.email}) নোটিশ ইমেইল পাঠানো হয়েছে।`,
      emailSent,
      visit: updated
    });
  } catch (err) {
    console.error('[Admin Update Visit Status Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Admin: Delete Farm Visit Record
 * DELETE /api/admin/visits/:id
 */
exports.deleteFarmVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FarmVisit.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Visit record not found.' });
    }
    return res.json({ success: true, message: 'Visit record successfully removed.' });
  } catch (err) {
    console.error('[Admin Delete Visit Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
