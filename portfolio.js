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

// Show at most this many clips per platform tab (keeps the page light, no lag)
const MAX_PER_PLATFORM = 2;

const PLATFORM_LABEL = {
  youtube: "YouTube",
  instagram: "Instagram Reels",
  tiktok: "TikTok",
  facebook: "Facebook"
};

function mediaHTML(c) {
  if (c.mp4 && c.mp4.trim() !== "") {
    return `<div class="pf-embed"><video src="videos/${c.mp4}" muted loop playsinline preload="metadata"></video></div>`;
  }
  const src = embedUrl(c.platform, c.url);
  if (src) {
    return `<div class="pf-embed"><iframe src="${src}" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>`;
  }
  return "";
}

function embedUrl(platform, url) {
  if (!url) return "";
  if (platform === "youtube") {
    const id = url.includes("youtu.be/")
      ? url.split("youtu.be/")[1].split(/[?/]/)[0]
      : (url.match(/shorts\/([^?/]+)/) || url.match(/v=([^?&]+)/) || [])[1];
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }
  if (platform === "tiktok") {
    const v = url.split("/video/")[1];
    return v ? `https://www.tiktok.com/embed/${v.split("?")[0]}` : "";
  }
  if (platform === "instagram") {
    const v = url.split("/reel/")[1];
    return v ? `https://www.instagram.com/reel/${v.split("/")[0]}/embed` : "";
  }
  if (platform === "facebook") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  }
  return "";
}

function render(filter) {
  const grid = document.getElementById("portfolio-grid");
  const empty = document.getElementById("portfolio-empty");
  if (!grid) return;
  grid.innerHTML = "";
  grid.classList.remove("all-view");

  const real = clips.filter((c) => c.platform !== "placeholder");
  // No "All" anymore: each tab shows only its own platform, capped at MAX_PER_PLATFORM
  const shown = real.filter((c) => c.platform === filter).slice(0, MAX_PER_PLATFORM);

  if (real.length === 0) {
    real.forEach((c) => grid.appendChild(placeholderCard(c.title)));
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  if (shown.length === 0) {
    const none = document.createElement("p");
    none.className = "note";
    none.textContent = "No clips for this platform yet.";
    grid.appendChild(none);
    return;
  }

  shown.forEach((c) => {
    const card = document.createElement("div");
    card.className = "pf-card";
    const media = mediaHTML(c);
    if (media) {
      card.innerHTML = media + `<div class="pf-title">${c.title || (PLATFORM_LABEL[c.platform] || c.platform) + " clip"}</div>`;
    } else {
      card.appendChild(placeholderCard(c.title));
    }
    grid.appendChild(card);
  });

  // play videos that are present in the newly rendered cards
  grid.querySelectorAll("video").forEach((v) => v.play().catch(() => {}));

  // trigger reveal observer for newly added cards
  if (window.__klyptoxReveal) window.__klyptoxReveal();
}

function placeholderCard(title) {
  const card = document.createElement("div");
  card.className = "pf-card";
  card.innerHTML = `
    <div class="pf-embed"><div class="pf-placeholder">
      <div class="pf-video-box">
        <div class="pf-play">&#9654;</div>
        <span>${title}</span>
      </div>
    </div></div>
    <div class="pf-title">Coming soon</div>`;
  return card;
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
  // default to the first platform tab (YouTube) so something shows on load
  const initial = document.querySelector(".filter-btn.active");
  render(initial ? initial.dataset.filter : "youtube");
  wireFilters();
}
