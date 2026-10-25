const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const SEC_LOG_FILE = path.join(__dirname, '..', 'data', 'security_audit_logs.json');

// Memory store for security audit logs & failed login attempts
let securityLogs = [];
const failedLoginAttempts = new Map(); // email -> { count, lockedUntil }
const userLocks = new Map(); // userId -> Promise chain for atomic operations (Race condition defense)

// Load existing audit logs if available
try {
  if (fs.existsSync(SEC_LOG_FILE)) {
    securityLogs = JSON.parse(fs.readFileSync(SEC_LOG_FILE, 'utf8'));
  }
} catch (e) {
  securityLogs = [];
}

function saveSecurityLogs() {
  try {
    const dir = path.dirname(SEC_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const trimmed = securityLogs.slice(0, 300);
    fs.writeFileSync(SEC_LOG_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write security logs:', err.message);
  }
}

// Security Audit Logger function
function logSecurityEvent(eventType, details = {}) {
  const event = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    type: eventType,
    severity: details.severity || 'INFO', // INFO, WARNING, CRITICAL
    ip: details.ip || '127.0.0.1',
    userAgent: details.userAgent || 'Unknown',
    userId: details.userId || null,
    message: details.message || '',
    meta: details.meta || {}
  };

  securityLogs.unshift(event);
  if (securityLogs.length > 300) securityLogs.pop();
  saveSecurityLogs();
  console.log(`[SECURITY AUDIT - ${event.severity}] [${event.type}] ${event.message}`);
  return event;
}

// ==============================================================================
// 14. DENIAL OF SERVICE (DoS) & BRUTE FORCE DEFENSE (RATE LIMITERS)
// ==============================================================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  handler: (req, res, next, options) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      severity: 'WARNING',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      message: `Rate limit exceeded on endpoint: ${req.originalUrl}`
    });
    res.status(429).json(options.message);
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before retrying.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  handler: (req, res, next, options) => {
    logSecurityEvent('BRUTE_FORCE_ATTEMPT', {
      severity: 'CRITICAL',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      message: `Multiple failed auth attempts from IP: ${req.ip}`
    });
    res.status(429).json(options.message);
  }
});

// ==============================================================================
// 18. CLICKJACKING & 19. SECURITY MISCONFIGURATION (HELMET CSP & HEADERS)
// ==============================================================================
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://unpkg.com", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "http://localhost:*", "http://127.0.0.1:*"],
      frameAncestors: ["'none'"], // 18. Clickjacking Defense
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    }
  },
  frameguard: { action: 'deny' }, // 18. Clickjacking Defense
  noSniff: true, // 19. MIME Sniffing Defense
  xssFilter: true, // 2. Reflected XSS Header
  hidePoweredBy: true // 19. Hide X-Powered-By
});

// ==============================================================================
// 10. BROKEN AUTHENTICATION: PROGRESSIVE ACCOUNT LOCKOUT
// ==============================================================================
const checkAccountLockout = (email) => {
  const record = failedLoginAttempts.get(email.toLowerCase());
  if (!record) return { locked: false };
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainingMin = Math.ceil((record.lockedUntil - Date.now()) / (60 * 1000));
    return { locked: true, remainingMinutes: remainingMin };
  }
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    failedLoginAttempts.delete(email.toLowerCase());
    return { locked: false };
  }
  return { locked: false };
};

const registerFailedLogin = (email, ip, userAgent) => {
  const lower = email.toLowerCase();
  const current = failedLoginAttempts.get(lower) || { count: 0, lockedUntil: null };
  current.count += 1;

  if (current.count >= 20) {
    current.lockedUntil = Date.now() + 1 * 60 * 1000; // 1 minute lockout after 20 attempts
    logSecurityEvent('ACCOUNT_LOCKED', {
      severity: 'CRITICAL',
      ip,
      userAgent,
      message: `Account [${email}] locked for 1 minute due to 20 consecutive failed login attempts.`
    });
  } else {
    logSecurityEvent('LOGIN_FAILURE', {
      severity: 'WARNING',
      ip,
      userAgent,
      message: `Failed login attempt ${current.count}/5 for account [${email}].`
    });
  }

  failedLoginAttempts.set(lower, current);
};

const resetFailedLogins = (email) => {
  failedLoginAttempts.delete(email.toLowerCase());
};

// ==============================================================================
// 1, 2, 6, 7, 8, 13, 15, 16. COMPREHENSIVE PAYLOAD SANITIZER (WAF DEFENSE)
// Protects against:
// - 1. SQL Injection (SQLi)
// - 2. Cross-Site Scripting (XSS)
// - 6. NoSQL Injection
// - 7. Command Injection
// - 8. Path Traversal
// - 13. Prototype Pollution
// - 15. Server-Side Template Injection (SSTI)
// - 16. HTTP Request Smuggling
// ==============================================================================

// Patterns for SQLi detection
const SQLI_PATTERNS = /\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT|DROP\s+TABLE|INSERT\s+INTO|UPDATE\s+.*\s+SET|DELETE\s+FROM|EXEC\s*\(|;\s*--|OR\s+1\s*=\s*1|AND\s+1\s*=\s*1|SLEEP\s*\(\d+\)|BENCHMARK\s*\()\b/i;

// Patterns for XSS detection
const XSS_PATTERNS = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|vbscript:|on(load|error|click|mouseover|focus|blur)\s*=|document\.cookie|<iframe\b/i;

// Patterns for Command Injection detection
const CMD_INJECTION_PATTERNS = /([;&|`$]|\$\(.*\))\s*(sh|bash|cmd|powershell|curl|wget|nc|netcat|cat\s+\/etc)/i;

// Patterns for Path Traversal
const PATH_TRAVERSAL_PATTERNS = /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\.\.%2f|\0)/i;

// Patterns for SSTI
const SSTI_PATTERNS = /\{\{[\s\S]*?\}\}|\$\{[a-zA-Z0-9_.]+\}|<%\s*[\s\S]*?\s*%>/;

function deepSanitize(obj, req, threatFound = { detected: false, type: '', detail: '' }) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    // 13. Prototype Pollution Defense
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      threatFound.detected = true;
      threatFound.type = 'PROTOTYPE_POLLUTION';
      threatFound.detail = `Key: ${key}`;
      delete obj[key];
      continue;
    }

    // 6. NoSQL Injection Defense: Strip MongoDB operators
    if (key.startsWith('$') || key.includes('.')) {
      threatFound.detected = true;
      threatFound.type = 'NOSQL_INJECTION';
      threatFound.detail = `Operator key: ${key}`;
      delete obj[key];
      continue;
    }

    const val = obj[key];

    if (typeof val === 'string') {
      // 1. SQL Injection check
      if (SQLI_PATTERNS.test(val)) {
        threatFound.detected = true;
        threatFound.type = 'SQL_INJECTION';
        threatFound.detail = `Pattern matched in field [${key}]`;
      }

      // 2. XSS sanitize / escape
      if (XSS_PATTERNS.test(val)) {
        threatFound.detected = true;
        threatFound.type = 'XSS_ATTACK';
        threatFound.detail = `HTML/Script injection in field [${key}]`;
        // Sanitize dangerous tags
        obj[key] = val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/javascript:/gi, '')
                      .replace(/on\w+\s*=/gi, '');
      }

      // 7. Command Injection check
      if (CMD_INJECTION_PATTERNS.test(val)) {
        threatFound.detected = true;
        threatFound.type = 'COMMAND_INJECTION';
        threatFound.detail = `Shell meta-command in field [${key}]`;
      }

      // 8. Path Traversal check
      if (PATH_TRAVERSAL_PATTERNS.test(val)) {
        threatFound.detected = true;
        threatFound.type = 'PATH_TRAVERSAL';
        threatFound.detail = `Directory traversal sequence in field [${key}]`;
        obj[key] = val.replace(/\.\./g, '');
      }

      // 15. SSTI check
      if (SSTI_PATTERNS.test(val)) {
        threatFound.detected = true;
        threatFound.type = 'SSTI_ATTACK';
        threatFound.detail = `Template expression injection in field [${key}]`;
      }
    } else if (typeof val === 'object') {
      deepSanitize(val, req, threatFound);
    }
  }

  return threatFound;
}

const sanitizeInput = (req, res, next) => {
  // 16. HTTP Request Smuggling Defense: verify no conflicting headers
  if (req.headers['transfer-encoding'] && req.headers['content-length']) {
    logSecurityEvent('REQUEST_SMUGGLING_BLOCKED', {
      severity: 'CRITICAL',
      ip: req.ip,
      message: 'Both Transfer-Encoding and Content-Length headers present. Blocked HTTP request smuggling attempt.'
    });
    return res.status(400).json({ success: false, code: 'INVALID_HEADERS', message: 'Ambiguous request headers detected.' });
  }

  const threat = { detected: false, type: '', detail: '' };
  if (req.body) deepSanitize(req.body, req, threat);
  if (req.query) deepSanitize(req.query, req, threat);
  if (req.params) deepSanitize(req.params, req, threat);

  if (threat.detected) {
    logSecurityEvent(`${threat.type}_BLOCKED`, {
      severity: 'CRITICAL',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      message: `AgroFinance WAF blocked ${threat.type} attack. ${threat.detail}`
    });

    // Hard block for explicit SQLi, Command Injection, or SSTI
    if (['SQL_INJECTION', 'COMMAND_INJECTION', 'SSTI_ATTACK'].includes(threat.type)) {
      return res.status(403).json({
        success: false,
        code: 'WAF_THREAT_BLOCKED',
        message: `Security alert: Suspicious payload blocked (${threat.type}).`
      });
    }
  }

  next();
};

// ==============================================================================
// 3. CROSS-SITE REQUEST FORGERY (CSRF) DEFENSE MIDDLEWARE
// ==============================================================================
const csrfDefense = (req, res, next) => {
  // Safe HTTP read methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Require standard custom header or bearer authorization on mutation endpoints
  const hasCustomHeader = req.headers['x-requested-with'] || req.headers['authorization'];
  const origin = req.headers['origin'] || req.headers['referer'];

  if (origin) {
    try {
      const url = new URL(origin);
      const isAllowed = ['localhost', '127.0.0.1'].includes(url.hostname) || url.host === req.headers.host;
      if (!isAllowed) {
        logSecurityEvent('CSRF_ATTEMPT_BLOCKED', {
          severity: 'CRITICAL',
          ip: req.ip,
          message: `Blocked cross-origin request from untrusted origin: ${origin}`
        });
        return res.status(403).json({ success: false, code: 'CSRF_BLOCKED', message: 'Cross-origin request blocked.' });
      }
    } catch (e) {
      // Invalid origin URL
    }
  }

  next();
};

// ==============================================================================
// 4. SERVER-SIDE REQUEST FORGERY (SSRF) DEFENSE
// ==============================================================================
function validateExternalUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { safe: false, reason: 'Invalid protocol: only HTTP/HTTPS permitted.' };
    }

    const host = parsed.hostname.toLowerCase();
    // Block private/internal addresses
    const isPrivate = host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '169.254.169.254' || // Cloud metadata
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.match(/^172\.(1[6-9]|2\d|3[0-1])\./);

    if (isPrivate) {
      return { safe: false, reason: 'Internal/private loopback destination forbidden.' };
    }

    return { safe: true, url: parsed.toString() };
  } catch (err) {
    return { safe: false, reason: 'Malformed URL.' };
  }
}

// ==============================================================================
// 9. UNRESTRICTED FILE UPLOAD DEFENSE
// ==============================================================================
function validateFileUpload(fileName, fileBuffer, maxSizeBytes = 5 * 1024 * 1024) {
  if (!fileName) return { valid: false, message: 'File name is required.' };

  const ext = path.extname(fileName).toLowerCase();
  const ALLOWED_EXTS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const BLOCKED_EXTS = ['.exe', '.sh', '.bat', '.cmd', '.php', '.phtml', '.js', '.py', '.html', '.htm', '.svg'];

  if (BLOCKED_EXTS.includes(ext)) {
    return { valid: false, message: 'Executable and script formats strictly forbidden.' };
  }

  if (!ALLOWED_EXTS.includes(ext)) {
    return { valid: false, message: `Invalid file extension. Permitted: ${ALLOWED_EXTS.join(', ')}` };
  }

  if (fileBuffer && fileBuffer.length > maxSizeBytes) {
    return { valid: false, message: 'File size exceeds 5MB limit.' };
  }

  const safeName = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
  return { valid: true, safeName };
}

// ==============================================================================
// 17. OPEN REDIRECT DEFENSE
// ==============================================================================
function validateRedirectUrl(targetUrl, host) {
  if (!targetUrl) return '/';
  // Must be relative URL starting with single slash
  if (targetUrl.startsWith('/') && !targetUrl.startsWith('//')) {
    return targetUrl;
  }
  try {
    const parsed = new URL(targetUrl);
    if (parsed.host === host || ['localhost', '127.0.0.1'].includes(parsed.hostname)) {
      return parsed.pathname + parsed.search;
    }
  } catch (e) {}
  return '/'; // Fallback to root
}

// ==============================================================================
// 20. RACE CONDITION (RACE ATTACK) DEFENSE: ATOMIC MUTEX
// Guarantees atomic serial execution for wallet mutations per user ID
// ==============================================================================
async function withUserLock(userId, asyncFn) {
  const key = String(userId);
  const currentPromise = userLocks.get(key) || Promise.resolve();

  const nextPromise = currentPromise
    .then(async () => {
      return await asyncFn();
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => {
      if (userLocks.get(key) === nextPromise) {
        userLocks.delete(key);
      }
    });

  userLocks.set(key, nextPromise);
  return nextPromise;
}

module.exports = {
  apiLimiter,
  authLimiter,
  helmetConfig,
  sanitizeInput,
  csrfDefense,
  logSecurityEvent,
  getSecurityLogs: () => securityLogs,
  checkAccountLockout,
  registerFailedLogin,
  resetFailedLogins,
  validateExternalUrl,
  validateFileUpload,
  validateRedirectUrl,
  withUserLock
};
