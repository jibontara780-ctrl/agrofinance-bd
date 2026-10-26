const https = require('https');
const { Project, MarketPrice } = require('../models');

/**
 * Call OpenRouter API
 */
async function callOpenRouter(messages, model = 'openai/gpt-4o-mini') {
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://agrofinance.bd',
        'X-Title': 'AgroFinance BD AI Advisor',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 25000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300 && parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            const errMsg = (parsed.error && parsed.error.message) ? parsed.error.message : `HTTP ${res.statusCode}: ${body.slice(0, 200)}`;
            reject(new Error(errMsg));
          }
        } catch (err) {
          reject(new Error(`Invalid JSON from OpenRouter: ${err.message}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('OpenRouter request timed out'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Fallback local response generator if network or API key runs out of quota
 */
function generateLocalFallback(userMessage, language, projects, marketPrices) {
  const lower = (userMessage || '').toLowerCase();
  const isBn = language === 'bn' || /[\u0980-\u09FF]/.test(userMessage);

  // Return calculation check
  const amountMatch = userMessage.match(/(\d+[\d,]*)\s*(টাকা|tk|bdt|hajar|k|lakh|লাখ)?/i);
  if (amountMatch && (lower.includes('লাভ') || lower.includes('রিটার্ন') || lower.includes('profit') || lower.includes('return') || lower.includes('invest'))) {
    let rawNum = parseInt(amountMatch[1].replace(/,/g, ''), 10);
    if (lower.includes('লাখ') || lower.includes('lakh')) {
      if (rawNum < 100) rawNum = rawNum * 100000;
    } else if (lower.includes('hajar') || lower.includes('হাজার')) {
      if (rawNum < 1000) rawNum = rawNum * 1000;
    }
    const annualReturnPct = 24;
    const sixMonthProfit = Math.round(rawNum * (annualReturnPct / 100) * (6 / 12));
    const annualProfit = Math.round(rawNum * (annualReturnPct / 100));

    if (isBn) {
      return `🌾 **বিনিয়োগ ও মুনাফার হিসেব:**\n\nআপনি যদি **৳${rawNum.toLocaleString('bn-BD')}** আমাদের সমন্বিত কৃষি প্রকল্পে বিনিয়োগ করেন:\n\n• **গড় বার্ষিক মুনাফার হার:** প্রায় ২৪%\n• **৬ মাসের সম্ভাব্য মুনাফা:** ৳${sixMonthProfit.toLocaleString('bn-BD')}\n• **১ বছরের সম্ভাব্য মুনাফা:** ৳${annualProfit.toLocaleString('bn-BD')}\n• **মোট সম্ভাব্য প্রাপ্তি (১ বছর পর):** ৳${(rawNum + annualProfit).toLocaleString('bn-BD')}\n\n💡 **গুরুত্বপূর্ণ বৈশিষ্ট্য:** আপনার পুরো টাকা একক কোনো খাতে না রেখে স্বয়ংক্রিয়ভাবে ধান, ডেইরি, মৎস্য ও ফল বাগানে বন্টন করা হবে, যার ফলে ঝুঁকি সর্বনিম্ন থাকে এবং সাধারণ বীমা কর্পোরেশনের ফসল বীমা দ্বারা মূলধন সুরক্ষিত থাকে।`;
    } else {
      return `🌾 **Investment & Expected Return Breakdown:**\n\nIf you deploy **৳${rawNum.toLocaleString()}** into our Integrated Agro Project:\n\n• **Average Projected Annual Return:** ~24%\n• **Estimated 6-Month Return:** ৳${sixMonthProfit.toLocaleString()}\n• **Estimated 1-Year Return:** ৳${annualProfit.toLocaleString()}\n• **Total Projected Maturity (1 Year):** ৳${(rawNum + annualProfit).toLocaleString()}\n\n💡 **Capital Diversification:** Your entire capital is automatically diversified across verified crop cycles, modern dairy, biofloc fishery, and orchards, minimizing single-crop volatility and backed by crop insurance.`;
    }
  }

  // Distribution explanation
  if (lower.includes('ভাগ') || lower.includes('বন্টন') || lower.includes('prokolpo') || lower.includes('distribut') || lower.includes('diversif')) {
    if (isBn) {
      return `🌾 **আমাদের এক-প্রকল্পে বহু-উদ্যোগ বন্টন ব্যবস্থা:**\n\nAgroFinance BD-তে বিনিয়োগকারীদের আলাদা করে ক্ষুদ্র ক্ষুদ্র উপ-প্রকল্পে ঝুঁকি নিতে হয় না। আপনি একটি **সমন্বিত মাস্টার প্রকল্পে** বিনিয়োগ করবেন এবং আপনার অর্থ স্বয়ংক্রিয়ভাবে একাধিক সম্ভাবনাময় প্রকল্পে বিনিয়োগ হবে:\n\n1. **উচ্চফলনশীল ধান চাষ (৪০%):** সরকারি বীজ ও আধুনিক সেচ সুবিধা।\n2. **আধুনিক ডেইরি ও দুগ্ধ খামার (২৫%):** উন্নত জাতের গাভী ও নিয়মিত দুগ্ধ বিক্রয়।\n3. **বৈজ্ঞানিক মৎস্য চাষ (২০%):** খাঁচায় ও বায়োফ্লক আধুনিক চাষ।\n4. **সবজি ও ফল বাগান (১৫%):** ড্রিপ-সেচ হাইড্রো-সবজি ও রফতানি আম।\n\nএর ফলে কোনো একটি খাতে প্রতিকূল আবহাওয়া থাকলেও অন্য খাতের উচ্চ লাভে আপনার পুরো বিনিয়োগ লাভজনক থাকে।`;
    } else {
      return `🌾 **Integrated Capital Allocation Model:**\n\nAt AgroFinance BD, investors do not need to pick fragmented sub-projects. You invest directly in a **Master Integrated Agricultural Project**, and your capital is automatically distributed into balanced production initiatives:\n\n1. **High-Yield Rice Cultivation (40%):** Boro harvest with automated irrigation.\n2. **Modern Dairy Farm (25%):** High-lactation dairy cattle & daily cold-chain milk supply.\n3. **Scientific Biofloc Fishery (20%):** Enclosed aquaculture supervised by BFRI.\n4. **Horticulture & Fruit Orchards (15%):** High-density drip-irrigated commercial fruit farming.\n\nThis multi-sector allocation protects your capital against weather volatility and secures high compounding yields.`;
    }
  }

  // Default welcome advice
  if (isBn) {
    return `🌾 **স্বাগতম! আমি AgroFinance BD-এর সার্বক্ষণিক এআই এগ্রো উপদেষ্টা।**\n\nআমি আপনাকে কীভাবে সহায়তা করতে পারি?\n• যেকোনো সমন্বিত প্রকল্পের বিস্তারিত তথ্য ও প্রত্যাশিত মুনাফা জানতে পারেন।\n• নির্দিষ্ট অঙ্কের বিনিয়োগে কত টাকা রিটার্ন আসবে তা হিসেব করতে পারেন।\n• আপনার বিনিয়োগকৃত টাকা কীভাবে বিভিন্ন কৃষি উদ্যোগে বন্টন হয় তা বুঝতে পারেন।\n• বর্তমান শস্য ও কৃষিপণ্যের বাজার দর যাচাই করতে পারেন।\n\nআপনার প্রশ্নটি লিখুন অথবা নিচের বাটনগুলোতে ক্লিক করুন।`;
  } else {
    return `🌾 **Welcome! I am your AgroFinance BD AI Agricultural Investment Advisor.**\n\nHow can I help you today?\n• Get projected ROI calculations for any investment sum.\n• Explore our integrated multi-sector farming projects.\n• Understand how your capital is automatically diversified across crops, dairy, and fisheries.\n• Check live agricultural commodity benchmark wholesale prices.\n\nFeel free to ask any question or tap a suggestion chip below!`;
  }
}

/**
 * Handle AI Chat Message
 */
exports.chat = async (req, res) => {
  try {
    const { message, history = [], conversationHistory = [], language = 'bn' } = req.body;
    const activeHistory = Array.isArray(conversationHistory) && conversationHistory.length > 0 ? conversationHistory : (Array.isArray(history) ? history : []);

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // 1. Fetch real-time platform data to enrich AI context
    let projects = [];
    try {
      projects = await Project.find({ status: { $in: ['active', 'upcoming'] } });
    } catch (e) {
      console.warn('[AI Advisor] Could not load database projects:', e.message);
    }

    // Prepare live system facts
    const projectSummary = (projects || []).map(p => {
      const prokolposList = (p.prokolpos || []).map(pr => `${pr.banglaName || pr.name} (${pr.allocationPercentage || 0}%)`).join(', ');
      return `- ${p.title} (${p.banglaTitle || ''}): Expected Return ${p.expectedReturn}%, Duration ${p.duration} ${p.durationUnit || 'months'}, Min Invest ৳${(p.minInvestment || 0).toLocaleString()}, Prokolpos: [${prokolposList || 'Integrated Multi-Sector Farming'}]`;
    }).join('\n');

    const isBn = language === 'bn' || /[\u0980-\u09FF]/.test(message);

    const systemPrompt = `You are "AgroAI", the premier Agricultural Investment Advisor for AgroFinance BD (Bangladesh's leading ethical agri-fintech platform).
Tone: Professional, warm, insightful, encouraging, mathematically precise, and transparent.

PLATFORM RULES & ARCHITECTURE (STRICT):
1. Single Project with Multiple Prokolpos: There are NO fragmented standalone sub-projects for investors. An investor invests in a master Integrated Agricultural Project, and their capital is automatically distributed into multiple verified production units (e.g. Rice cultivation 40%, Modern Dairy 25%, Biofloc Fishery 20%, Fruit Orchard 15%). Explain this multi-sector diversification proudly!
2. PROHIBITED WORDS: Do NOT use the word "Shariah", "শরীয়াহ", "শরিয়া", or "Mudaraba". Instead use phrases like:
   - Bengali: "স্বচ্ছ মুনাফা-বন্টন চুক্তি", "নৈতিক ও নিরাপদ কৃষি বিনিয়োগ", "ফসল-বীমাকৃত চুক্তি"
   - English: "Transparent profit-sharing partnership", "Ethical insured agricultural investment", "Crop-insured contracts".
3. Capital Protection: All projects have crop/livestock weather insurance backed by Sadharan Bima Corporation.
4. Farm Tours: Investors are warmly invited to visit our farms (Bogura Dairy Hub, Mymensingh Biofloc, Rajshahi Orchards, Sylhet Complex) in person anytime via the "Schedule Farm Tour" option.
5. Language Matching:
   - If the user writes in Bengali or language is 'bn', respond in fluent, polished Bengali.
   - If the user writes in English or language is 'en', respond in crisp, professional English.
6. ROI Calculations:
   - When asked about returns on a specific amount, compute clearly:
     Formula: Profit = Amount * (AnnualReturnRate / 100) * (Months / 12).
     Always show both total profit and final payout amount.

CURRENT LIVE PROJECTS ON PLATFORM:
${projectSummary || '- Integrated Agro Mega Farm: 22-35% expected annual return with multi-sector crop, dairy, and fishery units.'}

Keep responses beautifully structured with bold titles, bullet points, and clean numbers.`;

    // Construct message history for OpenRouter
    const apiMessages = [
      { role: 'system', content: systemPrompt }
    ];

    // Append last 8 exchanges for rich conversation context
    if (Array.isArray(activeHistory)) {
      activeHistory.slice(-8).forEach(h => {
        if (h.role && (h.content || h.text)) {
          apiMessages.push({ role: h.role, content: h.content || h.text });
        }
      });
    }

    apiMessages.push({ role: 'user', content: message.trim() });

    // Call OpenRouter with gpt-4o-mini primary, llama-3.3-70b fallback
    let reply = '';
    try {
      reply = await callOpenRouter(apiMessages, 'openai/gpt-4o-mini');
    } catch (err1) {
      console.warn('[OpenRouter] Primary model gpt-4o-mini error:', err1.message, '- Trying meta-llama/llama-3.3-70b-instruct...');
      try {
        reply = await callOpenRouter(apiMessages, 'meta-llama/llama-3.3-70b-instruct');
      } catch (err2) {
        console.warn('[OpenRouter] Fallback model error:', err2.message, '- Using local intelligent engine.');
        reply = generateLocalFallback(message, language, projects, []);
      }
    }

    // Dynamic suggestions based on language
    const suggestions = isBn ? [
      '১ লক্ষ টাকায় ৬ মাসে কত লাভ হবে?',
      'টাকা কীভাবে বিভিন্ন প্রকল্পে বন্টন হয়?',
      'কোন সমন্বিত প্রকল্পে বিনিয়োগ সেরা?',
      'খামার সরাসরি পরিদর্শনের নিয়ম কী?'
    ] : [
      'What is my return on ৳100k in 6 months?',
      'How is money distributed across units?',
      'Which integrated project is best?',
      'How can I schedule an in-person farm tour?'
    ];

    return res.json({
      success: true,
      reply,
      suggestions,
      data: {
        reply,
        suggestions,
        provider: 'AgroFinance AI Agent (OpenRouter / GPT-4o-Mini)'
      },
      provider: 'AgroFinance AI Agent (OpenRouter / GPT-4o-Mini)'
    });
  } catch (error) {
    console.error('[AI Chat Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request',
      error: error.message
    });
  }
};
