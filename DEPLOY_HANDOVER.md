# Deploy Handover — GitHub + Vercel

## Current state
- Git repo lives in: `Claude Portfolio/portfolio/`
- 6 commits on `master`, no remote yet
- `vercel.json` already added and committed
- Security headers, OG tags, robots.txt all in place

---

## Step 1 — Install GitHub CLI

Download and install from: https://cli.github.com

After install, open a terminal and run:
```
gh auth login
```
Choose: GitHub.com → HTTPS → Login with a web browser → follow the prompt.

---

## Step 2 — Create the GitHub repo and push

Open a terminal, navigate to the portfolio folder:
```
cd "C:\Users\pkinz\OneDrive\Documents\Claude Portfolio\portfolio"
```

Then run:
```
gh repo create petrina-portfolio --private --source=. --remote=origin --push
```

This creates a private repo called `petrina-portfolio` on your GitHub account, sets it as the remote, and pushes all 6 commits in one command.

---

## Step 3 — Connect Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **Add New → Project**
3. Find and import `petrina-portfolio`
4. Vercel auto-detects Next.js — no settings to change (vercel.json handles it)
5. Click **Deploy**

You'll get a preview URL like `petrina-portfolio-xxx.vercel.app` in ~60 seconds.
This URL is live but not indexed and not your main domain.

---

## Step 4 — When ready to go fully public

1. Buy a domain (Namecheap, Cloudflare, etc.)
2. In Vercel project → Settings → Domains → Add your domain
3. Follow the DNS instructions Vercel provides
4. Update `robots.txt` in the repo — replace the sitemap URL:
   ```
   Sitemap: https://YOUR-REAL-DOMAIN.com/sitemap.xml
   ```

---

## What's NOT done yet (do before pointing real domain)

- [ ] Convert GIFs to MP4/WebM — each GIF is 1.1 GB, will break mobile
- [ ] Three.js GLB environment viewer (environment.tsx is a placeholder)
- [ ] OG image at proper 1200×630px (currently uses alphaplanes-hero.png which is smaller)
- [ ] Sitemap.xml (robots.txt references one that doesn't exist yet)
