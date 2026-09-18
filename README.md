# KLYPTOX Website

Static portfolio site for KLYPTOX clipping agency. Built with plain HTML/CSS/JS, no build step.

## Files
- `index.html` - page structure + content
- `styles.css` - premium teal + white theme (light/dark mode)
- `portfolio.js` - **edit this to add your clips** (see comments at top)
- `app.js` - theme toggle, scroll reveal, subtle cursor glow

## Add a clip
Open `portfolio.js`, follow the instructions at the top. Each clip needs:
```js
{ platform: "youtube", url: "https://youtube.com/shorts/XXXX", title: "Podcast clip 1" }
```
Supported: `youtube`, `tiktok`, `instagram`, `facebook`.

## Deploy to Vercel
**Option A: Vercel CLI (fastest):**
1. Install Node.js, then: `npm i -g vercel`
2. In this folder: `vercel login` (opens browser, log in with your account)
3. `vercel --prod`
4. Done, you get a `https://klyptox-xxx.vercel.app` link.

**Option B: GitHub + Vercel Dashboard (no CLI):**
1. Create a GitHub repo, push this folder.
2. Go to vercel.com → "Add New" → import the repo.
3. Framework preset: "Other" → Deploy.
4. (Optional) add a custom domain in Project Settings.

## Local preview
Open `index.html` in any browser, or run `npx serve` in this folder.
