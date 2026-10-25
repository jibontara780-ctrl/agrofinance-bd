const bcrypt = require('bcryptjs');

async function getSeedData() {
  const investorHash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const users = [
    {
      _id: 'usr_001',
      id: 'usr_001',
      name: 'Ahmed Rahman',
      email: 'ahmed@agrofinance.bd',
      password: investorHash,
      role: 'investor',
      phone: '+880 1712-345678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      nid: '19902692015000123',
      address: 'House 42, Road 11, Banani, Dhaka-1213',
      bankDetails: {
        bankName: 'Dutch Bangla Bank Ltd.',
        accountNo: '115.120.985678',
        branch: 'Gulshan Branch',
        bkashNo: '01712345678'
      },
      kycStatus: 'verified',
      kycDocuments: [
        { name: 'NID Card (Front & Back)', fileUrl: '/docs/nid_verified.pdf', submittedAt: '2025-01-10' },
        { name: 'Bank Statement 6 Months', fileUrl: '/docs/bank_statement.pdf', submittedAt: '2025-01-10' }
      ],
      riskProfile: 'moderate',
      walletBalance: 427500,
      isEmailVerified: true,
      createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
      _id: 'usr_admin',
      id: 'usr_admin',
      name: 'Dr. Rafiqul Islam (Admin)',
      email: 'admin@agrofinance.bd',
      password: adminHash,
      role: 'admin',
      phone: '+880 1819-000000',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      nid: '19822692015000999',
      address: 'AgroFinance Tower, Kawran Bazar, Dhaka',
      bankDetails: {
        bankName: 'Brac Bank Ltd.',
        accountNo: '1501209999990001',
        branch: 'Kawran Bazar',
        bkashNo: '01819000000'
      },
      kycStatus: 'verified',
      kycDocuments: [],
      riskProfile: 'aggressive',
      walletBalance: 12500000,
      isEmailVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: 'usr_002',
      id: 'usr_002',
      name: 'Fatima Khanam',
      email: 'fatima@agrofinance.bd',
      password: investorHash,
      role: 'investor',
      phone: '+880 1914-778899',
      nid: '19952692015000456',
      address: 'Nasirabad, Chattogram',
      bankDetails: {
        bankName: 'Eastern Bank PLC',
        accountNo: '1041005544332',
        branch: 'Agrabad',
        bkashNo: '01914778899'
      },
      kycStatus: 'verified',
      riskProfile: 'conservative',
      walletBalance: 150000,
      isEmailVerified: true,
      createdAt: '2025-02-15T00:00:00.000Z'
    },
    {
      _id: 'usr_003',
      id: 'usr_003',
      name: 'Rahim Uddin',
      email: 'rahim@agrofinance.bd',
      password: investorHash,
      role: 'investor',
      phone: '+880 1611-223344',
      nid: '19922692015000789',
      address: 'Kazir Dewri, Sylhet',
      bankDetails: {
        bankName: 'City Bank PLC',
        accountNo: '2050123456789',
        branch: 'Zindabazar',
        bkashNo: '01611223344'
      },
      kycStatus: 'pending',
      riskProfile: 'moderate',
      walletBalance: 50000,
      isEmailVerified: true,
      createdAt: '2025-05-10T00:00:00.000Z'
    }
  ];

  const projects = [
    {
      _id: 'proj_001',
      id: 'proj_001',
      title: 'Green Valley Integrated Agro Mega Farm - Sylhet',
      banglaTitle: 'গ্রীন ভ্যালি সমন্বিত মেগা কৃষি প্রকল্প - সিলেট',
      category: 'grain',
      cropType: 'Multi-Agri Portfolio (Boro Rice, Dairy, Fishery, Greenhouse)',
      location: 'Sunamganj & Sylhet Basin, Bangladesh',
      totalFunding: 6000000,
      raisedAmount: 4500000,
      minInvestment: 50000,
      maxInvestment: 600000,
      expectedReturn: 24,
      duration: 6,
      durationUnit: 'months',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      status: 'active',
      riskLevel: 'low',
      farmArea: '75 acres integrated farm',
      farmerCount: 28,
      investorsCount: 54,
      description: 'সমন্বিত মেগা কৃষি প্রকল্প যেখানে একটি একক বিনিয়োগের অর্থ স্বয়ংক্রিয়ভাবে উচ্চফলনশীল বোরো ধান চাষ (৪০%), আধুনিক ডেইরি ফার্ম (২৫%), বৈজ্ঞানিক বায়োফ্লক মৎস্য চাষ (২০%) এবং গ্রিনহাউস সবজি উৎপাদনে (১৫%) বন্টন হয়। পুরো প্রকল্পে সাধারণ বীমা কর্পোরেশনের ফসল ও প্রাণিসম্পদ বীমা কভারেজ রয়েছে।',
      descriptionBn: 'সমন্বিত মেগা কৃষি প্রকল্প যেখানে একটি একক বিনিয়োগের অর্থ স্বয়ংক্রিয়ভাবে উচ্চফলনশীল বোরো ধান চাষ (৪০%), আধুনিক ডেইরি ফার্ম (২৫%), বৈজ্ঞানিক বায়োফ্লক মৎস্য চাষ (২০%) এবং গ্রিনহাউস সবজি উৎপাদনে (১৫%) বন্টন হয়। পুরো প্রকল্পে সাধারণ বীমা কর্পোরেশনের ফসল ও প্রাণিসম্পদ বীমা কভারেজ রয়েছে।',
      descriptionEn: 'Integrated mega-agricultural project automatically diversifying a single investment across high-yield Boro rice (40%), modern dairy hub (25%), scientific biofloc aquaculture (20%), and greenhouse vegetables (15%). Insured by Sadharan Bima Corporation.',
      highlights: [
        '১টি বিনিয়োগে ৪টি ভিন্ন লাভজনক কৃষি প্রকল্পে অর্থ বন্টন',
        'সাধারণ বীমা কর্পোরেশন কর্তৃক ১০০% ফসল ও গবাদিপশু বীমা',
        'সৌরবিদ্যুৎ চালিত স্বয়ংক্রিয় সেচ ও বায়োফ্লক মনিটরিং',
        'সুপারশপ স্বপ্ন ও আড়ং ডেইরির সাথে সরাসরি করপোরেট বাই-ব্যাক চুক্তি'
      ],
      highlightsEn: [
        'Single investment auto-diversified across 4 high-yield agricultural units',
        '100% crop and livestock insured by Sadharan Bima Corporation',
        'Solar-powered automated drip irrigation and biofloc telemetry',
        'Direct corporate off-taker agreements with Shwapno and Aarong Dairy'
      ],
      prokolpos: [
        {
          id: 'prk_101',
          name: 'High-Yield Boro Rice Cultivation & Processing',
          banglaName: 'উচ্চফলনশীল বোরো ধান চাষ ও প্রসেসিং',
          category: 'grain',
          allocationPercentage: 40,
          targetAmount: 2400000,
          location: 'Sunamganj Haor Basin',
          description: 'ব্রি-২৯ ও ব্রি-৮৯ জাতের উচ্চফলনশীল সুগন্ধি ধান চাষ এবং সরাসরি মিল প্রসেসিং।',
          descriptionBn: 'ব্রি-২৯ ও ব্রি-৮৯ জাতের উচ্চফলনশীল সুগন্ধি ধান চাষ এবং সরাসরি মিল প্রসেসিং।',
          descriptionEn: 'BRRI-29 & BRRI-89 high-yielding aromatic rice farming with direct automated mill processing.',
          icon: '🌾',
          expectedReturn: 22,
          status: 'in_progress'
        },
        {
          id: 'prk_102',
          name: 'Modern Dairy Farming & Milk Chilling Center',
          banglaName: 'আধুনিক ডেইরি খামার ও মিল্ক চিলিং সেন্টার',
          category: 'dairy',
          allocationPercentage: 25,
          targetAmount: 1500000,
          location: 'Sylhet Sadar Dairy Cluster',
          description: 'উন্নত জাতের অস্ট্রেলিয়ান ফ্রিজিয়ান গাভী পালন এবং দৈনিক ১,৫০০ লিটার দুধ সংগ্রহ।',
          descriptionBn: 'উন্নত জাতের অস্ট্রেলিয়ান ফ্রিজিয়ান গাভী পালন এবং দৈনিক ১,৫০০ লিটার দুধ সংগ্রহ।',
          descriptionEn: 'Australian Holstein-Friesian dairy cattle rearing producing 1,500 liters of fresh milk daily.',
          icon: '🐄',
          expectedReturn: 26,
          status: 'active'
        },
        {
          id: 'prk_103',
          name: 'Scientific Biofloc Aquaculture & Hatchery',
          banglaName: 'বায়োফ্লক বৈজ্ঞানিক মৎস্য চাষ ও পোনা উৎপাদন',
          category: 'fishery',
          allocationPercentage: 20,
          targetAmount: 1200000,
          location: 'Surma River Basin Enclosure',
          description: 'নিয়ন্ত্রিত পানির গুণাগুণ বজায় রেখে শিং, পাবদা ও রুই মাছের নিবিড় বৈজ্ঞানিক চাষ।',
          descriptionBn: 'নিয়ন্ত্রিত পানির গুণাগুণ বজায় রেখে শিং, পাবদা ও রুই মাছের নিবিড় বৈজ্ঞানিক চাষ।',
          descriptionEn: 'Intensive scientific farming of Shing, Pabda, and Rui fingerlings with automated biofloc water quality control.',
          icon: '🐟',
          expectedReturn: 25,
          status: 'active'
        },
        {
          id: 'prk_104',
          name: 'Climate-Controlled Vegetable Greenhouses',
          banglaName: 'নিয়ন্ত্রিত পরিবেশ বিষমুক্ত সবজি গ্রিনহাউস',
          category: 'vegetable',
          allocationPercentage: 15,
          targetAmount: 900000,
          location: 'Green Valley Agro Park',
          description: 'ডাচ হাইড্রোপনিক পদ্ধতিতে ক্যাপসিকাম, চেরি টমেটো ও ইংলিশ শসা উৎপাদন।',
          descriptionBn: 'ডাচ হাইড্রোপনিক পদ্ধতিতে ক্যাপসিকাম, চেরি টমেটো ও ইংলিশ শসা উৎপাদন।',
          descriptionEn: 'Dutch hydroponic greenhouse cultivation of pesticide-free bell peppers, cherry tomatoes, and English cucumbers.',
          icon: '🥦',
          expectedReturn: 20,
          status: 'active'
        }
      ],
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      manager: 'Green Sylhet Integrated Agro Ltd.',
      progress: 75,
      createdAt: '2024-12-15T00:00:00.000Z'
    },
    {
      _id: 'proj_002',
      id: 'proj_002',
      title: 'Barind Multi-Sector Commercial Agro Complex - Rajshahi',
      banglaTitle: 'বরেন্দ্র সমন্বিত বাণিজ্যিক কৃষি কমপ্লেক্স - রাজশাহী',
      category: 'fruit',
      cropType: 'Multi-Agri Portfolio (Export Mango, Black Bengal Goat, Drip Greenhouse, Honey)',
      location: 'Bagha & Charghat, Rajshahi',
      totalFunding: 10000000,
      raisedAmount: 7000000,
      minInvestment: 75000,
      maxInvestment: 1000000,
      expectedReturn: 32,
      duration: 12,
      durationUnit: 'months',
      startDate: '2025-02-01',
      endDate: '2026-01-31',
      status: 'active',
      riskLevel: 'medium',
      farmArea: '95 acres multi-crop terrain',
      farmerCount: 35,
      investorsCount: 68,
      description: 'বরেন্দ্র অঞ্চলের সর্বাধুনিক সমন্বিত খামার। এখানে বিনিয়োগ করলে আপনার তহবিল আম ও মাল্টা বাগান (৪৫%), ব্ল্যাক বেঙ্গল ছাগল পালন (২৫%), ড্রিপ-সেচ সবজি গ্রিনহাউস (২০%) এবং খামারে আধুনিক মৌমাছি পালন ও মধু সংগ্রহে (১০%) বন্টন করা হয়।',
      descriptionBn: 'বরেন্দ্র অঞ্চলের সর্বাধুনিক সমন্বিত খামার। এখানে বিনিয়োগ করলে আপনার তহবিল আম ও মাল্টা বাগান (৪৫%), ব্ল্যাক বেঙ্গল ছাগল পালন (২৫%), ড্রিপ-সেচ সবজি গ্রিনহাউস (২০%) এবং খামারে আধুনিক মৌমাছি পালন ও মধু সংগ্রহে (১০%) বন্টন করা হয়।',
      descriptionEn: 'State-of-the-art commercial venture in the Barind tract. Capital is diversified into export mango orchards (45%), Black Bengal goat fattening (25%), drip-irrigated greenhouse farming (20%), and pure apiculture (10%). Insured under national livestock & agriculture policy.',
      highlights: [
        'আম, ছাগল ও সবজি সমন্বয়ে উচ্চ বাণিজ্যিক রিটার্ন',
        'ফ্রুট ব্যাগিং প্রযুক্তিতে শতভাগ নিরাপদ কীটনাশকমুক্ত ফল',
        'ইউরোপ ও মধ্যপ্রাচ্যে হিমসাগর ও ল্যাংড়া রফতানি চুক্তি',
        'জাতীয় প্রাণী ও কৃষি বীমা দ্বারা মূলধন সুরক্ষিত'
      ],
      highlightsEn: [
        'High commercial yields combining export mangoes, goats, and greenhouse crops',
        '100% pesticide-free fruit utilizing double-layer fruit bagging technology',
        'Direct export off-take contracts to Europe and Middle Eastern markets',
        'Capital fully insured by National Crop and Livestock Insurance'
      ],
      prokolpos: [
        {
          id: 'prk_201',
          name: 'Export Mango & Sweet Malta High-Density Orchard',
          banglaName: 'রপ্তানি গ্রেড আম ও বারি মাল্টা বাগান',
          category: 'fruit',
          allocationPercentage: 45,
          targetAmount: 4500000,
          location: 'Bagha High-Density Orchard',
          description: 'হিমসাগর, ল্যাংড়া ও আম্রপালি আমের আধুনিক ফ্রুট ব্যাগিং ও উন্নত কোল্ড চেইন।',
          descriptionBn: 'হিমসাগর, ল্যাংড়া ও আম্রপালি আমের আধুনিক ফ্রুট ব্যাগিং ও উন্নত কোল্ড চেইন।',
          descriptionEn: 'Himsagar, Langra, and Amrapali export-grade mangoes with Chinese fruit-bagging and cold-chain storage.',
          icon: '🥭',
          expectedReturn: 35,
          status: 'in_progress'
        },
        {
          id: 'prk_202',
          name: 'Black Bengal Goat & Cattle Fattening Facility',
          banglaName: 'ব্ল্যাক বেঙ্গল ছাগল ও মাংসল পশু মোটাতাজাকরণ',
          category: 'livestock',
          allocationPercentage: 25,
          targetAmount: 2500000,
          location: 'Charghat Barind Agro Sheds',
          description: 'উন্নত বায়োসিকিউরিটি শেডে ১,০০০টি উন্নত ব্ল্যাক বেঙ্গল জাতের ছাগল পালন।',
          descriptionBn: 'উন্নত বায়োসিকিউরিটি শেডে ১,০০০টি উন্নত ব্ল্যাক বেঙ্গল জাতের ছাগল পালন।',
          descriptionEn: 'Commercial rearing and fattening of 1,000 pure Black Bengal goats under strict biosecurity protocols.',
          icon: '🐐',
          expectedReturn: 30,
          status: 'active'
        },
        {
          id: 'prk_203',
          name: 'Drip-Irrigated High-Value Vegetables & Dragon Fruit',
          banglaName: 'ড্রিপ-সেচ হাইড্রো সবজি ও ড্রাগন ফল প্রকল্প',
          category: 'vegetable',
          allocationPercentage: 20,
          targetAmount: 2000000,
          location: 'Barind Agri Innovation Zone',
          description: 'ইসরায়েলি ড্রিপ সেচ প্রযুক্তি ব্যবহার করে সারা বছর লাভজনক ড্রাগন ও সবজি চাষ।',
          descriptionBn: 'ইসরায়েলি ড্রিপ সেচ প্রযুক্তি ব্যবহার করে সারা বছর লাভজনক ড্রাগন ও সবজি চাষ।',
          descriptionEn: 'Year-round commercial dragon fruit and off-season cash crop production powered by Israeli drip irrigation.',
          icon: '🌱',
          expectedReturn: 28,
          status: 'active'
        },
        {
          id: 'prk_204',
          name: 'Apiculture & Pure Mustard-Litchi Honey Unit',
          banglaName: 'খামারে মৌমাছি পালন ও খাঁটি মধু সংগ্রহ',
          category: 'grain',
          allocationPercentage: 10,
          targetAmount: 1000000,
          location: 'Rajshahi Orchard Zone',
          description: 'আম ও লিচু মুকুলের প্রাকৃতিক পরাগায়ন ও প্রিমিয়াম মধু প্রক্রিয়াজাতকরণ।',
          descriptionBn: 'আম ও লিচু মুকুলের প্রাকৃতিক পরাগায়ন ও প্রিমিয়াম মধু প্রক্রিয়াজাতকরণ।',
          descriptionEn: 'Natural pollination of orchards and high-grade unpasteurized mustard and litchi blossom honey processing.',
          icon: '🍯',
          expectedReturn: 24,
          status: 'active'
        }
      ],
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      manager: 'Barind Agro Commercial Enterprise',
      progress: 70,
      createdAt: '2025-01-10T00:00:00.000Z'
    },
    {
      _id: 'proj_003',
      id: 'proj_003',
      title: 'Padma Coastal Agro & Blue Fishery Hub - Chandpur',
      banglaTitle: 'পদ্মা উপকূলীয় সমন্বিত কৃষি ও ব্লু ফিশারিজ হাব',
      category: 'fishery',
      cropType: 'Multi-Agri Portfolio (Riverine Aquaculture, Floating Veg, Layer Poultry)',
      location: 'Chandpur & Meghna Estuary, Bangladesh',
      totalFunding: 8000000,
      raisedAmount: 5800000,
      minInvestment: 50000,
      maxInvestment: 800000,
      expectedReturn: 28,
      duration: 8,
      durationUnit: 'months',
      startDate: '2025-03-01',
      endDate: '2025-10-31',
      status: 'active',
      riskLevel: 'medium',
      farmArea: '40 acres water bio-enclosure',
      farmerCount: 18,
      investorsCount: 45,
      description: 'মেঘনা মোহনায় সমন্বিত উপকূলীয় কৃষি ও মৎস্য প্রকল্প। বিনিয়োগকৃত অর্থ বৈজ্ঞানিক নদী মৎস্য চাষ (৫০%), ভাসমান আধুনিক সবজি চাষ (২৫%) এবং উপকূলীয় ডিম খামারে (২৫%) বন্টন হয়।',
      descriptionBn: 'মেঘনা মোহনায় সমন্বিত উপকূলীয় কৃষি ও মৎস্য প্রকল্প। বিনিয়োগকৃত অর্থ বৈজ্ঞানিক নদী মৎস্য চাষ (৫০%), ভাসমান আধুনিক সবজি চাষ (২৫%) এবং উপকূলীয় ডিম খামারে (২৫%) বন্টন হয়।',
      descriptionEn: 'Integrated coastal agro-fishery venture in the Meghna estuary. Capital is allocated to scientific cage fisheries (50%), eco-floating hydroponics (25%), and commercial duck breeding (25%). Fully insured against tidal surges and fish mortality.',
      highlights: [
        'বিএফআরআই তত্ত্বাবধানে বৈজ্ঞানিক মৎস্য চাষ',
        'পদ্মা-মেঘনা মোহনায় খাঁচায় লাভজনক মাছ উৎপাদন',
        'ভাসমান বেডে পরিবেশবান্ধব বিষমুক্ত সবজি চাষ',
        'দৈনিক পাইকারি বাজারে নগদ বিক্রয় ব্যবস্থা'
      ],
      highlightsEn: [
        'Scientific aquaculture supervised by Bangladesh Fisheries Research Institute (BFRI)',
        'Profitable riverine cage culture in the nutrient-rich Padma-Meghna confluence',
        'Eco-friendly pesticide-free floating hydroponic vegetable beds',
        'Direct cash liquidation via daily urban wholesale fish markets'
      ],
      prokolpos: [
        {
          id: 'prk_301',
          name: 'Scientific Riverine Enclosure Aquaculture',
          banglaName: 'মেঘনা অববাহিকায় বৈজ্ঞানিক নদী মৎস্য চাষ',
          category: 'fishery',
          allocationPercentage: 50,
          targetAmount: 4000000,
          location: 'Chandpur Estuary Enclosure',
          description: 'নিয়ন্ত্রিত খাঁচায় ও ঘেরে ইলিশ, রুই, কাতলা ও পাঙ্গাশ মাছের বৈজ্ঞানিক চাষ।',
          descriptionBn: 'নিয়ন্ত্রিত খাঁচায় ও ঘেরে ইলিশ, রুই, কাতলা ও পাঙ্গাশ মাছের বৈজ্ঞানিক চাষ।',
          descriptionEn: 'Controlled river cage culture of indigenous carp, pangas, and juvenile hilsa with real-time DO sensors.',
          icon: '🐟',
          expectedReturn: 30,
          status: 'in_progress'
        },
        {
          id: 'prk_302',
          name: 'Eco Floating Agriculture & Hydro-Veggies',
          banglaName: 'ভাসমান পদ্ধতিতে শাকসবজি ও মসলা উৎপাদন',
          category: 'vegetable',
          allocationPercentage: 25,
          targetAmount: 2000000,
          location: 'Meghna Wetland Platform',
          description: 'কচুরিপানার ভাসমান বেডে সম্পূর্ণ কীটনাশকমুক্ত হাই-ভ্যালু শাকসবজি চাষ।',
          descriptionBn: 'কচুরিপানার ভাসমান বেডে সম্পূর্ণ কীটনাশকমুক্ত হাই-ভ্যালু শাকসবজি চাষ।',
          descriptionEn: 'Zero-chemical floating hydroponic beds utilizing water hyacinth mats for year-round organic greens.',
          icon: '🌿',
          expectedReturn: 26,
          status: 'active'
        },
        {
          id: 'prk_303',
          name: 'Coastal Khaki Campbell Duck & Egg Hatchery',
          banglaName: 'উপকূলীয় খাকি ক্যাম্পবেল হাঁস ও ডিম খামার',
          category: 'livestock',
          allocationPercentage: 25,
          targetAmount: 2000000,
          location: 'Chandpur Coastal Farm',
          description: 'উচ্চ ডিম্বপ্রসূ জাতের খাকি ক্যাম্পবেল হাঁস পালন ও দৈনিক ডিম সরবরাহ।',
          descriptionBn: 'উচ্চ ডিম্বপ্রসূ জাতের খাকি ক্যাম্পবেল হাঁস পালন ও দৈনিক ডিম সরবরাহ।',
          descriptionEn: 'Free-range Khaki Campbell layer duck farming yielding 8,000 fresh organic eggs daily for city distribution.',
          icon: '🦆',
          expectedReturn: 25,
          status: 'active'
        }
      ],
      image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      manager: 'Blue Waters Aqua & Agro BD',
      progress: 72,
      createdAt: '2025-02-15T00:00:00.000Z'
    },
    {
      _id: 'proj_004',
      id: 'proj_004',
      title: 'Northern Horizon Dairy & Fodder Complex - Pabna',
      banglaTitle: 'উত্তরাঞ্চল সমন্বিত ডেইরি ও পুষ্টি খাদ্য কমপ্লেক্স - পাবনা',
      category: 'dairy',
      cropType: 'Multi-Agri Portfolio (Friesian Dairy Herd, Maize Silage, Biogas Fertilizer)',
      location: 'Santhia & Bhangura, Pabna',
      totalFunding: 7500000,
      raisedAmount: 5200000,
      minInvestment: 50000,
      maxInvestment: 750000,
      expectedReturn: 26,
      duration: 10,
      durationUnit: 'months',
      startDate: '2025-03-15',
      endDate: '2026-01-15',
      status: 'active',
      riskLevel: 'low',
      farmArea: '50 acres pasture & sheds',
      farmerCount: 16,
      investorsCount: 39,
      description: 'চলনবিল সংলগ্ন বৃহত্তর পাবনার আধুনিক ডেইরি শিল্পাঞ্চল। আপনার অর্থ দুধ উৎপাদন (৪৫%), পুষ্টিকর ভুট্টা সাইলেজ ও ঘাস চাষ (৩০%) এবং জৈব ভার্মিকম্পোস্ট সারে (২৫%) বন্টন হয়।',
      descriptionBn: 'চলনবিল সংলগ্ন বৃহত্তর পাবনার আধুনিক ডেইরি শিল্পাঞ্চল। আপনার অর্থ দুধ উৎপাদন (৪৫%), পুষ্টিকর ভুট্টা সাইলেজ ও ঘাস চাষ (৩০%) এবং জৈব ভার্মিকম্পোস্ট সারে (২৫%) বন্টন হয়।',
      descriptionEn: 'Modern commercial dairy industrial park in Pabna near Chalan Beel. Allocates capital to Friesian dairy milk (45%), nutritious maize silage (30%), and organic vermicompost fertilizer (25%). Backed by national livestock insurance.',
      highlights: [
        'মিল্ক ভিটা ও প্রাণ ডেইরির সাথে দৈনিক বাল্ক চিলিং চুক্তি',
        'উচ্চ পুষ্টিসম্পন্ন ভুট্টা সাইলেজ উৎপাদন ও বাজারজাতকরণ',
        'পরিবেশবান্ধব বায়োগ্যাস বিদ্যুৎ ও ভার্মিকম্পোস্ট সার',
        'স্থির মাসিক লভ্যাংশ প্রদানের বিশেষ সুবিধা'
      ],
      highlightsEn: [
        'Daily bulk milk off-take contracts with Milk Vita and PRAN Dairy',
        'Commercial production and retail packaging of high-protein maize silage',
        'Eco-friendly biogas electricity generation and premium vermicompost fertilizer',
        'Structured predictable bi-monthly dividend payout schedules'
      ],
      prokolpos: [
        {
          id: 'prk_401',
          name: 'Friesian Dairy Cow Herd & Milk Cold Chain',
          banglaName: 'উন্নত ফ্রিজিয়ান গাভী পালন ও দুগ্ধ কোল্ড চেইন',
          category: 'dairy',
          allocationPercentage: 45,
          targetAmount: 3375000,
          location: 'Chalonbeel Dairy Station',
          description: 'উন্নত ডেনিশ ও অস্ট্রেলিয়ান ফ্রিজিয়ান জাতের গাভী পালন ও স্বয়ংক্রিয় মিল্কিং।',
          descriptionBn: 'উন্নত ডেনিশ ও অস্ট্রেলিয়ান ফ্রিজিয়ান জাতের গাভী পালন ও স্বয়ংক্রিয় মিল্কিং।',
          descriptionEn: 'High-lactation Danish and Australian Friesian dairy cattle equipped with automatic rotary milking parlors.',
          icon: '🐄',
          expectedReturn: 28,
          status: 'in_progress'
        },
        {
          id: 'prk_402',
          name: 'Nutritious Maize Silage & Napier Grass Farm',
          banglaName: 'ভুট্টা সাইলেজ ও নেপিয়ার ঘাস উৎপাদন খামার',
          category: 'grain',
          allocationPercentage: 30,
          targetAmount: 2250000,
          location: 'Santhia Agricultural Zone',
          description: 'উচ্চ পুষ্টিসম্পন্ন সাইলেজ প্যাক তৈরি এবং স্থানীয় খামারগুলোতে বিক্রয়।',
          descriptionBn: 'উচ্চ পুষ্টিসম্পন্ন সাইলেজ প্যাক তৈরি এবং স্থানীয় খামারগুলোতে বিক্রয়।',
          descriptionEn: 'Baled hybrid maize silage and high-protein green fodder processing supplying 50+ local commercial farms.',
          icon: '🌽',
          expectedReturn: 25,
          status: 'active'
        },
        {
          id: 'prk_403',
          name: 'Eco Biogas & Organic Vermicompost Fertilizer',
          banglaName: 'বায়োগ্যাস বিদ্যুৎ ও জৈব কেঁচো সার প্রকল্প',
          category: 'vegetable',
          allocationPercentage: 25,
          targetAmount: 1875000,
          location: 'Green Fodder Center',
          description: 'খামারের বর্জ্য থেকে বায়োগ্যাস উৎপাদন এবং প্রিমিয়াম জৈব সার প্রস্তুত।',
          descriptionBn: 'খামারের বর্জ্য থেকে বায়োগ্যাস উৎপাদন এবং প্রিমিয়াম জৈব সার প্রস্তুত।',
          descriptionEn: 'Zero-waste earthworm vermicomposting and clean biogas generation supplying organic retail fertilizers.',
          icon: '♻️',
          expectedReturn: 24,
          status: 'active'
        }
      ],
      image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      manager: 'Pabna Heritage Agro Industries',
      progress: 69,
      createdAt: '2025-02-20T00:00:00.000Z'
    }
  ];

  const investments = [
    {
      _id: 'inv_001',
      id: 'inv_001',
      userId: 'usr_001',
      projectId: 'proj_001',
      projectTitle: 'Green Valley Integrated Agro Mega Farm - Sylhet',
      category: 'grain',
      investedAmount: 200000,
      expectedReturn: 24,
      expectedAmount: 248000,
      actualReturn: null,
      monthlyReturn: 4000,
      totalReturnReceived: 120000,
      prokolpoAllocations: [
        { prokolpoName: 'High-Yield Boro Rice Cultivation', banglaName: 'উচ্চফলনশীল বোরো ধান চাষ ও প্রসেসিং', percentage: 40, allocatedAmount: 80000, category: 'grain', icon: '🌾' },
        { prokolpoName: 'Modern Dairy Farming & Milk Chilling', banglaName: 'আধুনিক ডেইরি খামার ও মিল্ক চিলিং', percentage: 25, allocatedAmount: 50000, category: 'dairy', icon: '🐄' },
        { prokolpoName: 'Scientific Biofloc Aquaculture', banglaName: 'বায়োফ্লক বৈজ্ঞানিক মৎস্য চাষ', percentage: 20, allocatedAmount: 40000, category: 'fishery', icon: '🐟' },
        { prokolpoName: 'Climate-Controlled Vegetable Greenhouses', banglaName: 'নিয়ন্ত্রিত পরিবেশ বিষমুক্ত সবজি', percentage: 15, allocatedAmount: 30000, category: 'vegetable', icon: '🥦' }
      ],
      status: 'active',
      investmentDate: '2025-01-05',
      maturityDate: '2025-06-30',
      certificateId: 'AGRO-CERT-2025-001',
      remainingDays: 78
    },
    {
      _id: 'inv_002',
      id: 'inv_002',
      userId: 'usr_001',
      projectId: 'proj_002',
      projectTitle: 'Barind Multi-Sector Commercial Agro Complex - Rajshahi',
      category: 'fruit',
      investedAmount: 300000,
      expectedReturn: 32,
      expectedAmount: 396000,
      actualReturn: null,
      monthlyReturn: 8000,
      totalReturnReceived: 24000,
      prokolpoAllocations: [
        { prokolpoName: 'Export Mango & Malta Orchard', banglaName: 'রপ্তানি গ্রেড আম ও মাল্টা বাগান', percentage: 45, allocatedAmount: 135000, category: 'fruit', icon: '🥭' },
        { prokolpoName: 'Black Bengal Goat Facility', banglaName: 'ব্ল্যাক বেঙ্গল ছাগল ও মাংসল পশু', percentage: 25, allocatedAmount: 75000, category: 'livestock', icon: '🐐' },
        { prokolpoName: 'Drip Hydroponic Vegetables', banglaName: 'ড্রিপ-সেচ হাইড্রো সবজি ও ড্রাগন', percentage: 20, allocatedAmount: 60000, category: 'vegetable', icon: '🌱' },
        { prokolpoName: 'Apiculture Honey Unit', banglaName: 'মৌমাছি পালন ও খাঁটি মধু সংগ্রহ', percentage: 10, allocatedAmount: 30000, category: 'grain', icon: '🍯' }
      ],
      status: 'active',
      investmentDate: '2025-03-15',
      maturityDate: '2026-01-31',
      certificateId: 'AGRO-CERT-2025-104',
      remainingDays: 280
    }
  ];

  const transactions = [
    { _id: 'txn_001', id: 'txn_001', userId: 'usr_001', type: 'investment', projectId: 'proj_001', description: 'Investment in Green Valley Integrated Agro Farm - Sylhet', amount: -200000, date: '2025-01-05', status: 'completed', method: 'Bank Transfer', reference: 'TXN20250105001' },
    { _id: 'txn_002', id: 'txn_002', userId: 'usr_001', type: 'investment', projectId: 'proj_002', description: 'Investment in Barind Multi-Sector Agro Complex - Rajshahi', amount: -300000, date: '2025-03-15', status: 'completed', method: 'Wallet', reference: 'TXN20250315003' },
    { _id: 'txn_003', id: 'txn_003', userId: 'usr_001', type: 'deposit', projectId: null, description: 'Wallet Deposit via bKash Merchant Gateway', amount: 500000, date: '2025-04-28', status: 'completed', method: 'bKash', reference: 'TXN20250428004' },
    { _id: 'txn_004', id: 'txn_004', userId: 'usr_001', type: 'monthly_return', projectId: 'proj_001', description: 'Monthly Profit - Green Valley Integrated Farm', amount: 4000, date: '2025-04-30', status: 'completed', method: 'Wallet', reference: 'TXN20250430006' },
    { _id: 'txn_005', id: 'txn_005', userId: 'usr_001', type: 'withdrawal', projectId: null, description: 'Withdrawal to Dutch Bangla Bank ****5678', amount: -100000, date: '2025-05-15', status: 'completed', method: 'Bank Transfer', reference: 'TXN20250515008' }
  ];

  const marketPrices = [
    { _id: 'mp_001', id: 'mp_001', cropName: 'Paddy / BRRI-29 Rice (ব্রি-২৯ ধান)', category: 'grain', unit: 'per মণ (40kg)', currentPrice: 1380, previousPrice: 1290, change: 6.98, trend: 'up', market: 'Badamtoli Wholesale, Dhaka', lastUpdated: 'Today, 10:30 AM' },
    { _id: 'mp_002', id: 'mp_002', cropName: 'Hilsa Fish (ইলিশ মাছ ১ কেজি+)', category: 'fishery', unit: 'per kg', currentPrice: 1520, previousPrice: 1400, change: 8.57, trend: 'up', market: 'Chandpur Ghat, Chandpur', lastUpdated: 'Today, 09:15 AM' },
    { _id: 'mp_003', id: 'mp_003', cropName: 'Himsagar & Amrapali Mango (আম)', category: 'fruit', unit: 'per মণ (40kg)', currentPrice: 3950, previousPrice: 3600, change: 9.72, trend: 'up', market: 'Baneswar Mango Hat, Rajshahi', lastUpdated: 'Today, 11:00 AM' },
    { _id: 'mp_004', id: 'mp_004', cropName: 'Pabda & Shing Fish (পাবদা ও শিং মাছ)', category: 'fishery', unit: 'per kg', currentPrice: 480, previousPrice: 450, change: 6.67, trend: 'up', market: 'Mymensingh Fish Landing Center', lastUpdated: 'Today, 08:45 AM' },
    { _id: 'mp_005', id: 'mp_005', cropName: 'Layer Farm Fresh Eggs (ফার্মের ডিম)', category: 'livestock', unit: 'per ১০০ পিস', currentPrice: 1280, previousPrice: 1310, change: -2.29, trend: 'down', market: 'Tejgaon Wholesale, Dhaka', lastUpdated: 'Today, 07:00 AM' },
    { _id: 'mp_006', id: 'mp_006', cropName: 'Greenhouse Dutch Capsicum (ক্যাপসিকাম)', category: 'vegetable', unit: 'per kg', currentPrice: 190, previousPrice: 175, change: 8.57, trend: 'up', market: 'Karwan Bazar, Dhaka', lastUpdated: 'Today, 06:30 AM' },
    { _id: 'mp_007', id: 'mp_007', cropName: 'Pure Cow Milk (খাঁটি গরুর দুধ)', category: 'dairy', unit: 'per Liter', currentPrice: 88, previousPrice: 82, change: 7.32, trend: 'up', market: 'Chalonbeel Dairy Coop, Pabna', lastUpdated: 'Today, 08:00 AM' },
    { _id: 'mp_008', id: 'mp_008', cropName: 'Hybrid Maize / Corn Silage (ভুট্টা সাইলেজ)', category: 'grain', unit: 'per মণ (40kg)', currentPrice: 1120, previousPrice: 1080, change: 3.70, trend: 'up', market: 'Dinajpur Central Mandi', lastUpdated: 'Today, 10:00 AM' }
  ];

  const notifications = [
    { _id: 'notif_001', id: 'notif_001', userId: 'usr_001', type: 'return', title: 'মাসিক লভ্যাংশ জমা হয়েছে ৳৪,০০০', message: 'গ্রীন ভ্যালি সমন্বিত মেগা কৃষি প্রকল্প হতে মে মাসের লভ্যাংশ আপনার ওয়ালেটে সফলভাবে জমা করা হয়েছে।', date: '২০২৫-০৫-৩১', read: false, icon: 'money' },
    { _id: 'notif_002', id: 'notif_002', userId: 'usr_001', type: 'project', title: 'তহবিল সংগ্রহ সফল: বরেন্দ্র মেগা কমপ্লেক্স', message: 'বরেন্দ্র সমন্বিত বাণিজ্যিক কৃষি কমপ্লেক্সের ৭০% তহবিল সফলভাবে সংগৃহীত হয়েছে।', date: '২০২৫-০৫-১৫', read: false, icon: 'check' },
    { _id: 'notif_003', id: 'notif_003', userId: 'usr_001', type: 'kyc', title: 'KYC নথি অনুমোদিত', message: 'আপনার জাতীয় পরিচয়পত্র ও ব্যাংক অ্যাকাউন্ট যাচাই সম্পন্ন হয়েছে। আপনি এখন যেকোনো অঙ্কের বিনিয়োগ করতে পারবেন।', date: '২০২৫-০১-১০', read: true, icon: 'verify' },
    { _id: 'notif_004', id: 'notif_004', userId: 'all', type: 'alert', title: 'নতুন সমন্বিত প্রকল্প উন্মুক্ত: পাবনা ডেইরি কমপ্লেক্স', message: '২৬% বার্ষিক সম্ভাব্য মুনাফায় পাবনা ডেইরি ও পুষ্টি খাদ্য কমপ্লেক্সে বিনিয়োগের জন্য আবেদন গ্রহণ শুরু হয়েছে।', date: '২০২৫-০৬-০৫', read: false, icon: 'new' }
  ];

  return { users, projects, investments, transactions, marketPrices, notifications };
}

module.exports = { getSeedData };
