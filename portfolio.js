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

// Per-video playback cap: only the active slide's iframes load (max 2 at once) -> no lag.
const PER_SLIDE = 2;

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

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

let currentCarousel = null; // { slides, dots, index }

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

  // Build carousel: PER_SLIDE cards per slide, lazy-load only active slide iframes
  const slidesData = chunk(shown, PER_SLIDE);
  const carousel = document.createElement("div");
  carousel.className = "carousel";

  const track = document.createElement("div");
  track.className = "carousel-track";

  slidesData.forEach((pair, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide" + (i === 0 ? " active" : "");
    pair.forEach((c) => {
      const src = embedUrl(c.platform, c.url);
      const card = document.createElement("div");
      card.className = "pf-card";
      if (src) {
        // data-src only -> iframe loads when slide becomes active (prevents 8 videos loading at once)
        card.innerHTML = `
          <div class="pf-embed"><iframe data-src="${src}" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>
          <div class="pf-title">${c.title || c.platform + " clip"}</div>`;
      } else {
        card.appendChild(placeholderCard(c.title));
      }
      slide.appendChild(card);
    });
    track.appendChild(slide);
  });

  carousel.appendChild(track);

  // Arrows
  const prev = document.createElement("button");
  prev.className = "carousel-btn carousel-prev";
  prev.setAttribute("aria-label", "Previous");
  prev.innerHTML = "&#8249;";
  const next = document.createElement("button");
  next.className = "carousel-btn carousel-next";
  next.setAttribute("aria-label", "Next");
  next.innerHTML = "&#8250;";
  carousel.appendChild(prev);
  carousel.appendChild(next);

  // Dots
  const dots = document.createElement("div");
  dots.className = "carousel-dots";
  slidesData.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => goToSlide(i));
    dots.appendChild(dot);
  });
  carousel.appendChild(dots);

  grid.appendChild(carousel);

  currentCarousel = { track, dots, index: 0, count: slidesData.length };
  activateSlide(0);

  prev.addEventListener("click", () => goToSlide((currentCarousel.index - 1 + currentCarousel.count) % currentCarousel.count));
  next.addEventListener("click", () => goToSlide((currentCarousel.index + 1) % currentCarousel.count));

  // trigger reveal observer for newly added cards
  if (window.__klyptoxReveal) window.__klyptoxReveal();
}

// Load iframes only for the active slide; unload others to keep playback smooth (max 2 at once)
function activateSlide(index) {
  if (!currentCarousel) return;
  const slides = currentCarousel.track.querySelectorAll(".carousel-slide");
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
  currentCarousel.dots.querySelectorAll(".carousel-dot").forEach((d, i) =>
    d.classList.toggle("active", i === index)
  );
  currentCarousel.index = index;

  // lazy: load active slide iframes, clear inactive ones so they stop playing/loading
  slides.forEach((s, i) => {
    const frames = s.querySelectorAll("iframe[data-src]");
    if (i === index) {
      frames.forEach((f) => { if (!f.src) f.src = f.getAttribute("data-src"); });
    } else {
      frames.forEach((f) => { if (f.src) f.removeAttribute("src"); });
    }
  });
}

function goToSlide(index) {
  if (!currentCarousel) return;
  const count = currentCarousel.count;
  const idx = ((index % count) + count) % count;
  activateSlide(idx);
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
  render("all"); // build carousel on load
  wireFilters();
}
