// ============================================================
//  KLYPTOX PORTFOLIO | EDIT THIS LIST TO ADD YOUR CLIPS
//  How to add a clip:
//    1. Copy a block below (between the { } braces)
//    2. Paste it as a new item in the array
//    3. Set platform: "youtube" | "tiktok" | "instagram" | "facebook"
//    4. For a YouTube clip: set  yt: "VIDEO_ID"   (the part after /shorts/ or v=)
//       For a self-hosted MP4:  set  mp4: "clip1.mp4"  (file in /videos folder)
//    5. Tell Jerald/Hermes to rebuild, or commit & redeploy
//
//  MP4 notes: drop files in the /videos folder (e.g. videos/clip1.mp4).
//  No view count, no YouTube branding, client sees only your edit quality.
//  Keep files ~30-50MB, 9:16, 720p for fast mobile load.
// ============================================================

const clips = [
  // ---- PLACEHOLDER CARDS (remove these once real clips are added) ----
  // YouTube Shorts (slot 1 - self-hosted MP4)
  { platform: "youtube", mp4: "clip1.mp4", title: "YouTube Shorts 1" },
  { platform: "youtube", mp4: "yt2.mp4", title: "YouTube Shorts 2" },
  // Instagram Reels
  { platform: "instagram", mp4: "ig1.mp4", title: "Instagram Reels 1" },
  { platform: "instagram", mp4: "ig2.mp4", title: "Instagram Reels 2" },
  // Facebook
  { platform: "facebook", mp4: "fb1.mp4", title: "Facebook 1" },
  { platform: "facebook", mp4: "fb2.mp4", title: "Facebook 2" },
  // TikTok
  { platform: "tiktok", mp4: "tk1.mp4", title: "TikTok 1" },
  { platform: "tiktok", mp4: "tk2.mp4", title: "TikTok 2" }
  // --------------------------------------------------------------------
];

const PLATFORM_LABEL = {
  youtube: "YouTube",
  instagram: "Instagram Reels",
  tiktok: "TikTok",
  facebook: "Facebook"
};

const hasMp4 = (c) => c.mp4 && String(c.mp4).trim() !== "";
const hasUrl = (c) => c.url && String(c.url).trim() !== "";

function buildMedia(c, lazy) {
  // Returns HTML for the embed. lazy=true uses data-src so only the active (big) player loads.
  if (hasMp4(c)) {
    const src = "videos/" + c.mp4;
    return lazy
      ? `<video data-src="${src}" muted loop playsinline preload="none"></video>`
      : `<video src="${src}" muted loop playsinline preload="metadata"></video>`;
  }
  if (hasUrl(c)) {
    const u = c.url;
    let embed = "";
    if (c.platform === "youtube") {
      const id = u.includes("youtu.be/") ? u.split("youtu.be/")[1].split(/[?/]/)[0]
        : (u.match(/shorts\/([^?/]+)/) || u.match(/v=([^?&]+)/) || [])[1];
      if (id) embed = `https://www.youtube.com/embed/${id}`;
    } else if (c.platform === "tiktok") {
      const v = u.split("/video/")[1];
      if (v) embed = `https://www.tiktok.com/embed/${v.split("?")[0]}`;
    } else if (c.platform === "instagram") {
      const v = u.split("/reel/")[1];
      if (v) embed = `https://www.instagram.com/reel/${v.split("/")[0]}/embed`;
    } else if (c.platform === "facebook") {
      embed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=0`;
    }
    if (!embed) return "";
    return lazy
      ? `<iframe data-src="${embed}" allowfullscreen scrolling="no" allow="encrypted-media"></iframe>`
      : `<iframe src="${embed}" allowfullscreen scrolling="no" allow="encrypted-media"></iframe>`;
  }
  return "";
}

function placeholderCardHTML(title) {
  return `
    <div class="pf-embed"><div class="pf-placeholder">
      <div class="pf-video-box">
        <div class="pf-play">&#9654;</div>
        <span>${title}</span>
      </div>
    </div></div>
    <div class="pf-title">Coming soon</div>`;
}

let activeClip = null;

function render(filter) {
  const grid = document.getElementById("portfolio-grid");
  const empty = document.getElementById("portfolio-empty");
  if (!grid) return;
  grid.innerHTML = "";
  grid.classList.toggle("all-view", !filter || filter === "all");

  const real = clips.filter((c) => c.platform !== "placeholder");
  const shown = filter && filter !== "all" ? real.filter((c) => c.platform === filter) : real;

  if (real.length === 0) {
    clips.forEach((c) => grid.insertAdjacentHTML("beforeend", `<div class="pf-card">${placeholderCardHTML(c.title)}</div>`));
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";
  if (shown.length === 0) {
    grid.innerHTML = `<p class="note">No clips for this platform yet.</p>`;
    return;
  }

  // BIG centered player (one video plays at a time = no lag)
  const big = document.createElement("div");
  big.className = "pf-big";
  grid.appendChild(big);

  // Small thumbnail row
  const row = document.createElement("div");
  row.className = "pf-thumbs";
  grid.appendChild(row);

  const defaultIdx = 0;
  shown.forEach((c, i) => {
    const thumb = document.createElement("button");
    thumb.className = "pf-thumb" + (i === defaultIdx ? " active" : "");
    const label = c.title || (PLATFORM_LABEL[c.platform] || c.platform) + " clip";
    // thumbnails stay lightweight: show a placeholder visual only; real media loads in the big player
    thumb.innerHTML = `<div class="pf-embed"><div class="pf-placeholder"><div class="pf-video-box"><div class="pf-play">&#9654;</div></div></div></div><span class="pf-thumb-label">${label}</span>`;
    thumb.addEventListener("click", () => selectClip(shown, i, big, row));
    row.appendChild(thumb);
  });

  selectClip(shown, defaultIdx, big, row);

  if (window.__klyptoxReveal) window.__klyptoxReveal();
}

function selectClip(shown, idx, big, row) {
  activeClip = shown[idx];
  // update active thumbnail
  row.querySelectorAll(".pf-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));

  const c = shown[idx];
  const label = c.title || (PLATFORM_LABEL[c.platform] || c.platform) + " clip";
  const media = buildMedia(c, false); // eager load for the big player
  big.innerHTML = media
    ? `<div class="pf-embed pf-embed-big">${media}</div><div class="pf-title">${label}</div>`
    : placeholderCardHTML(label);

  // play the video if present
  const v = big.querySelector("video");
  if (v) v.play().catch(() => {});
}

function wireFilters() {
  const bar = document.querySelector(".filter-bar");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.filter);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}

function initPortfolio() {
  window.KLYPTOX_CLIPS = (window.KLYPTOX_CLIPS || clips);
  render("all");
  wireFilters();
}
