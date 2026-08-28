// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", open);
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
    })
  );
}

// Day / Night toggle
const toggle = document.getElementById("themeToggle");
const fade = document.getElementById("themeFade");
const body = document.body;
function setTheme(t) {
  body.setAttribute("data-theme", t);
  toggle.textContent = t === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("klyptox-theme", t); } catch (e) {}
}
toggle.addEventListener("click", () => {
  const next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  if (fade) {
    fade.classList.add("go");
    setTimeout(() => fade.classList.remove("go"), 240);
  }
  setTheme(next);
});
try { setTheme(localStorage.getItem("klyptox-theme") || "light"); } catch (e) { setTheme("light"); }

// Assign alternating directional reveal to grid cards for layered scroll motion
document.querySelectorAll(".grid-2, .grid-3").forEach((grid) => {
  [...grid.children].forEach((child, i) => {
    if (!child.classList.contains("reveal")) child.classList.add("reveal");
    child.classList.add(i % 2 === 0 ? "left" : "right");
  });
});
// Section titles/leads reveal up
document.querySelectorAll(".section-title, .section-lead, .about-desc, .about-mission, .results-box, .contact-grid")
  .forEach((el) => { if (!el.classList.contains("reveal")) el.classList.add("reveal"); });

// Scroll reveal with stagger + direction
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const siblings = [...e.target.parentElement.querySelectorAll(":scope > .reveal")];
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = (idx > 0 ? idx * 90 : 0) + "ms";
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach((r) => io.observe(r));

// Scroll progress bar
const progress = document.getElementById("scrollProgress");
// Nav shrink + progress + hero parallax (throttled with rAF to avoid jank)
const navEl = document.querySelector(".nav");
const heroBg = document.getElementById("heroBg");
const isMobile = window.matchMedia("(max-width: 820px)").matches;
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (y / h) * 100 : 0;
    if (progress) progress.style.transform = `scaleX(${pct / 100})`;
    if (navEl) navEl.classList.toggle("scrolled", y > 30);
    if (heroBg && !isMobile) heroBg.style.transform = `translateY(${y * 0.15}px)`;
    ticking = false;
  });
}, { passive: true });

// Subtle cursor glow (desktop only)
if (window.matchMedia("(pointer:fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
  document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
  document.addEventListener("mouseenter", () => (glow.style.opacity = "1"));
  // grow glow over interactive elements
  document.querySelectorAll("a, button, input, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => glow.classList.add("hover"));
    el.addEventListener("mouseleave", () => glow.classList.remove("hover"));
  });
}

// Count-up stats on scroll
const statNums = document.querySelectorAll(".stat-num");
const statIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.getAttribute("data-count"), 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; }
        else { el.textContent = cur; requestAnimationFrame(tick); }
      };
      tick();
      statIO.unobserve(el);
    }
  });
}, { threshold: 0.4 });
statNums.forEach((n) => statIO.observe(n));

// 3D tilt on cards (cursor-following)
if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".pf-card, .card").forEach((el) => {
    el.classList.add("tilt");
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

// Stat frames: one-time pop effect when cursor passes over
document.querySelectorAll(".stat").forEach((stat) => {
  let armed = true;
  stat.addEventListener("mouseenter", () => {
    if (armed) {
      stat.classList.remove("touched");
      void stat.offsetWidth; // restart animation
      stat.classList.add("touched");
      armed = false;
    }
  });
  stat.addEventListener("mouseleave", () => { armed = true; });
});

// Scrollspy: highlight active nav link
const navLinksEls = document.querySelectorAll(".nav-links a");
const sections = [...navLinksEls].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const id = "#" + e.target.id;
      navLinksEls.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => spy.observe(s));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
    }
  });
});
