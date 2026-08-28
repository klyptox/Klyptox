// ============================================================
//  KLYPTOX PORTFOLIO | EDIT THIS LIST TO ADD YOUR CLIPS
//  How to add a clip:
//    1. Copy a block below (between the { } braces)
//    2. Paste it as a new item in the array
//    3. Set platform: "youtube" | "tiktok" | "instagram" | "facebook"
//    4. Paste the clip URL into "url"
//    5. Tell Jerald/Hermes to rebuild, or commit & redeploy
//
//  Supported URL formats:
//    youtube : https://youtube.com/shorts/XXXX  or  https://youtu.be/XXXX
//    tiktok  : https://www.tiktok.com/@user/video/XXXX
//    instagram: https://www.instagram.com/reel/XXXX
//    facebook : https://www.facebook.com/USER/videos/XXXX
// ============================================================

const clips = [
  // ---- PLACEHOLDER CARDS (remove these once real clips are added) ----
  // YouTube Shorts (2)
  { platform: "youtube", url: "", title: "YouTube Shorts showcase 1" },
  { platform: "youtube", url: "", title: "YouTube Shorts showcase 2" },
  // Instagram Reels (2)
  { platform: "instagram", url: "", title: "Instagram Reels showcase 1" },
  { platform: "instagram", url: "", title: "Instagram Reels showcase 2" },
  // Facebook (2)
  { platform: "facebook", url: "", title: "Facebook showcase 1" },
  { platform: "facebook", url: "", title: "Facebook showcase 2" },
  // TikTok (2)
  { platform: "tiktok", url: "", title: "TikTok showcase 1" },
  { platform: "tiktok", url: "", title: "TikTok showcase 2" },
  // --------------------------------------------------------------------
];

function embedUrl(platform, url) {
  if (platform === "youtube") {
    const id = url.includes("youtu.be/")
      ? url.split("youtu.be/")[1].split(/[?/]/)[0]
      : (url.match(/shorts\/([^?/]+)/) || url.match(/v=([^?&]+)/) || [])[1];
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }
  if (platform === "tiktok") {
    return `https://www.tiktok.com/embed/${url.split("/video/")[1].split("?")[0]}`;
  }
  if (platform === "instagram") {
    return `https://www.instagram.com/reel/${url.split("/reel/")[1].split("/")[0]}/embed`;
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
  grid.classList.toggle("all-view", !filter || filter === "all");

  const real = clips.filter((c) => c.platform !== "placeholder");
  const shown = filter && filter !== "all" ? real.filter((c) => c.platform === filter) : real;

  if (real.length === 0) {
    clips.forEach((c) => grid.appendChild(placeholderCard(c.title)));
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
    const src = embedUrl(c.platform, c.url);
    const card = document.createElement("div");
    card.className = "pf-card";
    if (src) {
      card.innerHTML = `
        <div class="pf-embed"><iframe src="${src}" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>
        <div class="pf-title">${c.title || c.platform + " clip"}</div>`;
    } else {
      card.appendChild(placeholderCard(c.title));
    }
    grid.appendChild(card);
  });
  // trigger reveal observer for newly added cards
  if (window.__klyptoxReveal) window.__klyptoxReveal();
}

function placeholderCard(title) {
  const card = document.createElement("div");
  card.className = "pf-card";
  card.innerHTML = `
    <div class="pf-embed"><div class="pf-placeholder">
      <div class="pf-video-box">
        <div class="pf-play">▶</div>
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
  document.addEventListener("DOMContentLoaded", () => { window.KLYPTOX_CLIPS = (window.KLYPTOX_CLIPS || clips); });
} else {
  window.KLYPTOX_CLIPS = (window.KLYPTOX_CLIPS || clips);
}
