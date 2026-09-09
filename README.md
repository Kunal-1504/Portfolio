# Kunal Deshmukh — Portfolio (Dynamic Node.js + Express)

Full-stack dynamic portfolio. Express backend handles emails, GitHub API proxy with caching, and content serving. No third-party form services. No API keys in the browser.

---

## Architecture

```
Browser  ──→  GET /api/content    ──→  reads content.json (cached 10 min)
Browser  ──→  GET /api/projects   ──→  proxies GitHub API (cached 5 min) + fallback
Browser  ──→  POST /api/contact   ──→  Nodemailer sends real email via Gmail SMTP
```

## File Structure

```
portfolio/
├── server.js            ← Express backend (all API routes + email)
├── package.json
├── .env.example         ← Copy to .env and fill in your secrets
├── .env                 ← (git-ignored) your real secrets
├── .gitignore
├── content.json         ← Edit this to update all site content
│
└── public/              ← Static files served by Express
    ├── index.html
    ├── style.css
    ├── script.js        ← Fetches from /api/* (no raw GitHub API calls)
    └── assets/
        ├── favicon.svg
        └── Kunal_Deshmukh_Resume.pdf  ← Add your resume here
```

---

## ✏️ Step 1 — Edit Content

Open `content.json` to update any section without touching code:

| Key | Controls |
|---|---|
| `about.headline` | Bold headline in About section |
| `about.paragraphs` | Bio (array of strings) |
| `skills` | Skill categories + tags |
| `featured_projects` | Fallback projects if GitHub API has thin data |
| `education` | Degree, institution, CGPA |
| `certifications` | Certs + achievements |
| `value_props` | "Why Work With Me" cards |

---

## 📬 Step 2 — Enable Real Emails (Nodemailer + Gmail)

1. **Enable Gmail App Password** (required — regular Gmail password won't work):
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Sign in → Select app: **Mail** → Select device: **Other** → Generate
   - Copy the 16-character password

2. **Create your `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Fill in `.env`:**
   ```env
   PORT=3000
   EMAIL_USER=deshmukhkunal556@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx   # 16-char Gmail App Password
   EMAIL_TO=deshmukhkunal556@gmail.com
   GITHUB_USERNAME=Kunal-1504
   ```

4. That's it — form submissions now land directly in your inbox with a formatted HTML email.

> **Note:** If email is not configured, the server logs the message and still returns success to the visitor — so you never break the UX.

---

## 🐙 Step 3 — GitHub Projects (Auto-Pull + Cache)

The `/api/projects` endpoint:
- Fetches `https://api.github.com/users/Kunal-1504/repos`
- Filters out forks and repos with no/short descriptions
- Sorts by most recently updated
- Caches results for **5 minutes** (avoids rate limits)
- Falls back to `featured_projects` in `content.json` if GitHub returns < 3 usable repos

**To improve what shows up:** add descriptions to your GitHub repos at [github.com/Kunal-1504](https://github.com/Kunal-1504).

---

## 🚀 Step 4 — Run Locally

```bash
# Install dependencies (one time)
npm install

# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Step 5 — Deploy to Production

### Render (Recommended — free tier)
1. Push repo to GitHub
2. [render.com](https://render.com) → New Web Service → connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables in Render dashboard (same as your `.env`)

### Railway
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Add env vars → it auto-detects `npm start`

### VPS (DigitalOcean, Linode, etc.)
```bash
git clone your-repo
cd portfolio && npm install
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name portfolio
pm2 startup  # auto-restart on reboot
```

> **Note:** GitHub Pages / Netlify / Vercel static hosting won't work for this dynamic app — you need a Node.js-capable host (Render, Railway, VPS, or Vercel Serverless Functions).

---

## 🎨 Customizing Colors

In `public/style.css`, find the `:root` block (~line 10):
```css
:root {
  --accent: #63b3ed;   /* Change this for a full re-theme */
  --bg-primary: #0a0a0a;
}
```

---

## API Reference

| Endpoint | Method | Response |
|---|---|---|
| `/api/health` | GET | `{ status, uptime, timestamp, node }` |
| `/api/content` | GET | `{ success, data: {...}, source }` |
| `/api/projects` | GET | `{ success, projects: [...], source, total }` |
| `/api/contact` | POST | `{ success, message }` or `{ success, errors }` |
