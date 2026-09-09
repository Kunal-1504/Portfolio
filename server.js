/**
 * ═══════════════════════════════════════════════════════════════════
 *  KUNAL DESHMUKH PORTFOLIO — server.js
 *  Dynamic Node.js + Express backend
 *
 *  Routes:
 *    GET  /                  → serves public/index.html
 *    GET  /api/health        → { status, uptime, timestamp }
 *    GET  /api/content       → portfolio content from content.json
 *    GET  /api/projects      → GitHub repos (cached 5 min) + fallback
 *    POST /api/contact       → validates + sends email via Nodemailer
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const path        = require('path');
const fs          = require('fs');
const axios       = require('axios');
const nodemailer  = require('nodemailer');
const NodeCache   = require('node-cache');
const rateLimit   = require('express-rate-limit');

/* ─── App init ────────────────────────────────────────────────────── */
const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── Cache (TTL = 5 minutes for GitHub, 10 min for content) ─────── */
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/* ─── Middleware ──────────────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow same origin + configured origin
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || true,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
}));

// Serve everything in /public as static files
app.use(express.static(path.join(__dirname, 'public')));

/* ─── Rate Limiters ───────────────────────────────────────────────── */

// Contact form: max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many messages sent. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API general: 60 req/min
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, error: 'Too many requests. Slow down.' },
});

app.use('/api', apiLimiter);

/* ═══════════════════════════════════════════════════════════════════
   ROUTE: GET /api/health
   Returns server health info
═══════════════════════════════════════════════════════════════════ */
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    uptime:    Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    node:      process.version,
  });
});

/* ═══════════════════════════════════════════════════════════════════
   ROUTE: GET /api/content
   Reads content.json from disk (cached 10 min) and returns it.
   Frontend JS fetches this instead of reading the file directly —
   enables server-side validation, transformation, or future DB swap.
═══════════════════════════════════════════════════════════════════ */
app.get('/api/content', (req, res) => {
  const CACHE_KEY = 'portfolio_content';
  const cached    = cache.get(CACHE_KEY);

  if (cached) {
    return res.json({ success: true, data: cached, source: 'cache' });
  }

  const contentPath = path.join(__dirname, 'content.json');
  fs.readFile(contentPath, 'utf8', (err, raw) => {
    if (err) {
      console.error('[/api/content] Failed to read content.json:', err.message);
      return res.status(500).json({ success: false, error: 'Content unavailable.' });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      console.error('[/api/content] Invalid JSON in content.json:', parseErr.message);
      return res.status(500).json({ success: false, error: 'Content parse error.' });
    }

    cache.set(CACHE_KEY, data, 600); // cache 10 minutes
    res.json({ success: true, data, source: 'disk' });
  });
});

/* ═══════════════════════════════════════════════════════════════════
   ROUTE: GET /api/projects
   Proxies GitHub API, applies filtering/sorting, caches 5 min.
   Falls back to featured_projects from content.json on any error.
═══════════════════════════════════════════════════════════════════ */
app.get('/api/projects', async (req, res) => {
  const CACHE_KEY      = 'github_projects';
  const GITHUB_USER    = process.env.GITHUB_USERNAME || 'Kunal-1504';
  const MIN_USABLE     = 3;

  // Return cached data if available
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    return res.json({ success: true, projects: cached, source: 'cache' });
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USER}/repos`,
      {
        params:  { per_page: 100, sort: 'updated' },
        timeout: 8000,
        headers: {
          'Accept':     'application/vnd.github.v3+json',
          'User-Agent': `${GITHUB_USER}-portfolio`,
          // Optionally add: 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        },
      }
    );

    const repos = response.data;

    // Filter: no forks, must have a non-empty description
    const usable = repos
      .filter(r => !r.fork && r.description && r.description.trim().length > 5)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 9) // top 9
      .map(r => ({
        name:        r.name,
        description: r.description,
        language:    r.language || 'Python',
        stars:       r.stargazers_count,
        forks:       r.forks_count,
        url:         r.html_url,
        homepage:    r.homepage || null,
        topics:      r.topics   || [],
        updated_at:  r.updated_at,
      }));

    if (usable.length >= MIN_USABLE) {
      cache.set(CACHE_KEY, usable);
      return res.json({ success: true, projects: usable, source: 'github', total: repos.length });
    }

    // Not enough good repos — fall back
    throw new Error(`Only ${usable.length} usable repos found (need ${MIN_USABLE})`);

  } catch (err) {
    console.warn('[/api/projects] GitHub fallback triggered:', err.message);

    // Load featured projects from content.json as fallback
    try {
      const contentPath = path.join(__dirname, 'content.json');
      const raw  = fs.readFileSync(contentPath, 'utf8');
      const data = JSON.parse(raw);
      const featured = data.featured_projects || [];
      return res.json({ success: true, projects: featured, source: 'fallback' });
    } catch (fallbackErr) {
      console.error('[/api/projects] Fallback also failed:', fallbackErr.message);
      return res.status(502).json({ success: false, error: 'Projects unavailable.', projects: [] });
    }
  }
});

/* ═══════════════════════════════════════════════════════════════════
   ROUTE: POST /api/contact
   Validates form fields then sends email via Nodemailer (Gmail SMTP).
   No third-party service needed — runs entirely on your server.
═══════════════════════════════════════════════════════════════════ */

// Create transporter once (reused across requests)
function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[Nodemailer] EMAIL_USER / EMAIL_PASS not set in .env — contact form disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

let transporter = createTransporter();

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  /* ── Server-side validation ──────────────────────────────── */
  const errors = {};
  if (!name || name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Invalid email address.';
  if (!message || message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters.';

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ success: false, errors });
  }

  /* ── Check transporter configured ───────────────────────── */
  if (!transporter) {
    console.warn('[/api/contact] Email not configured — logging message instead.');
    console.log('FORM SUBMISSION:', { name, email, message });
    // Still return success to the user (fail silently in dev)
    return res.json({ success: true, message: 'Message received! (email not yet configured)' });
  }

  /* ── Build and send email ────────────────────────────────── */
  const TO      = process.env.EMAIL_TO   || process.env.EMAIL_USER;
  const FROM    = process.env.EMAIL_USER;
  const cleanName    = sanitize(name);
  const cleanEmail   = sanitize(email);
  const cleanMessage = sanitize(message);

  const mailOptions = {
    from:    `"Portfolio Contact" <${FROM}>`,
    to:      TO,
    replyTo: `"${cleanName}" <${cleanEmail}>`,
    subject: `[Portfolio] New message from ${cleanName}`,
    text: `
New portfolio contact form submission
─────────────────────────────────────
Name:    ${cleanName}
Email:   ${cleanEmail}
Message:

${cleanMessage}

─────────────────────────────────────
Sent from: Kunal Deshmukh Portfolio
Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`.trim(),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:32px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
    <div style="background:#0a0a0a;padding:28px 32px;">
      <p style="color:#63b3ed;font-weight:700;font-size:18px;margin:0;letter-spacing:0.05em">[KD] Portfolio</p>
      <p style="color:#a0aec0;font-size:13px;margin:6px 0 0">New Contact Form Submission</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:10px 0;color:#718096;font-size:13px;width:80px;vertical-align:top">Name</td>
          <td style="padding:10px 0;color:#1a202c;font-weight:600">${cleanName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#718096;font-size:13px;vertical-align:top">Email</td>
          <td style="padding:10px 0"><a href="mailto:${cleanEmail}" style="color:#63b3ed">${cleanEmail}</a></td>
        </tr>
      </table>
      <div style="background:#f7fafc;border-left:4px solid #63b3ed;border-radius:4px;padding:20px;margin-bottom:24px;">
        <p style="color:#718096;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">Message</p>
        <p style="color:#2d3748;line-height:1.7;margin:0;white-space:pre-wrap">${cleanMessage}</p>
      </div>
      <a href="mailto:${cleanEmail}" style="display:inline-block;background:#63b3ed;color:#0a0a0a;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Reply to ${cleanName}</a>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #e2e8f0;background:#f7fafc;">
      <p style="color:#a0aec0;font-size:12px;margin:0">Sent from your portfolio • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[/api/contact] Email sent to ${TO} from ${cleanEmail}`);
    res.json({ success: true, message: 'Message sent! I\'ll get back to you within 24 hours.' });
  } catch (err) {
    console.error('[/api/contact] Failed to send email:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send your message. Please email me directly at deshmukhkunal556@gmail.com',
    });
  }
});

/* ─── Catch-all: SPA fallback ─────────────────────────────────────── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ─── Start server ────────────────────────────────────────────────── */
const server = app.listen(PORT, () => {
  console.log(`\n  🚀  Portfolio server running`);
  console.log(`  →   http://localhost:${PORT}`);
  console.log(`  →   /api/health    | /api/content | /api/projects | /api/contact`);
  console.log(`  →   Email: ${process.env.EMAIL_USER ? '✅ configured' : '⚠️  not configured — set EMAIL_PASS in .env'}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ❌  Port ${PORT} is already in use by another app.`);
    console.error(`  →   Change PORT in your .env file (e.g. PORT=4000)`);
    console.error(`  →   Then run: npm start\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

/* ─── Utility: basic sanitize (strip HTML tags) ───────────────────── */
function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/&/g,  '&amp;')
    .trim();
}

module.exports = app; // for testing
