const { Project, Notification } = require('../models');

exports.getAllProjects = async (req, res) => {
  try {
    const { category, status, riskLevel, search, sortBy } = req.query;
    let projects = await Project.find();

    // Filters
    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category);
    }
    if (status && status !== 'all') {
      projects = projects.filter(p => p.status === status);
    }
    if (riskLevel && riskLevel !== 'all') {
      projects = projects.filter(p => p.riskLevel === riskLevel);
    }
    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.banglaTitle && p.banglaTitle.toLowerCase().includes(q)) ||
        p.location.toLowerCase().includes(q) ||
        p.cropType.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'return_desc') {
      projects.sort((a, b) => b.expectedReturn - a.expectedReturn);
    } else if (sortBy === 'funding_desc') {
      projects.sort((a, b) => b.totalFunding - a.totalFunding);
    } else if (sortBy === 'duration_asc') {
      projects.sort((a, b) => a.duration - b.duration);
    } else {
      // Default: active first, then highest return
      projects.sort((a, b) => (b.status === 'active' ? 1 : 0) - (a.status === 'active' ? 1 : 0) || b.expectedReturn - a.expectedReturn);
    }

    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const {
      title, banglaTitle, category, cropType, location,
      totalFunding, minInvestment, maxInvestment, expectedReturn,
      duration, startDate, endDate, riskLevel, farmArea, farmerCount,
      description, highlights, image, manager
    } = req.body;

    if (!title || !category || !totalFunding || !minInvestment || !expectedReturn || !duration) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory project fields.' });
    }

    const newProject = await Project.create({
      title,
      banglaTitle: banglaTitle || title,
      category,
      cropType: cropType || title,
      location: location || 'Bangladesh',
      totalFunding: Number(totalFunding),
      raisedAmount: 0,
      minInvestment: Number(minInvestment),
      maxInvestment: Number(maxInvestment || totalFunding),
      expectedReturn: Number(expectedReturn),
      duration: Number(duration),
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + duration * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'active',
      riskLevel: riskLevel || 'low',
      farmArea: farmArea || '10 acres',
      farmerCount: Number(farmerCount || 5),
      investorsCount: 0,
      description: description || '',
      highlights: highlights || ['বীমা কভারেজ অন্তর্ভুক্ত', 'বিশেষজ্ঞ কৃষিবিদ তত্ত্বাবধান'],
      prokolpos: req.body.prokolpos || [
        { id: `prk_${Date.now()}_1`, name: 'Primary Agro Unit', banglaName: 'প্রধান কৃষি উৎপাদন ইউনিট', allocationPercentage: 60, targetAmount: Math.round(Number(totalFunding) * 0.6), category, icon: '🌾' },
        { id: `prk_${Date.now()}_2`, name: 'Diversified Agri Facility', banglaName: 'সহায়ক কৃষি ও প্রক্রিয়াজাতকরণ ইউনিট', allocationPercentage: 40, targetAmount: Math.round(Number(totalFunding) * 0.4), category: 'dairy', icon: '🐄' }
      ],
      image: image || 'rice',
      manager: manager || 'AgroFinance Ltd.',
      progress: 0
    });

    // Broadcast notification to all investors
    await Notification.create({
      userId: 'all',
      type: 'project',
      title: `নতুন প্রকল্প: ${title}`,
      message: `${expectedReturn}% সম্ভাব্য রিটার্নে নতুন কৃষি প্রকল্প উন্মুক্ত করা হয়েছে। এখনই বিনিয়োগ করুন।`,
      date: new Date().toISOString().split('T')[0],
      icon: 'new'
    });

    return res.status(201).json({ success: true, message: 'Agricultural project created successfully!', data: newProject });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Project creation failed', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.updateById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, message: 'Project updated successfully', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
