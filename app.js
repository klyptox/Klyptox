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
try {
  var savedTheme = localStorage.getItem("klyptox-theme");
  setTheme(savedTheme === "light" ? "light" : "dark"); // default to dark
} catch (e) { setTheme("dark"); }

// Assign alternating directional reveal to grid cards
document.querySelectorAll(".grid-2, .grid-3").forEach((grid) => {
  [...grid.children].forEach((child, i) => {
    if (!child.classList.contains("reveal")) child.classList.add("reveal");
    child.classList.add(i % 2 === 0 ? "left" : "right");
  });
});
// Section titles/leads reveal up
document.querySelectorAll(".section-title, .section-lead, .about-desc, .about-mission, .results-box, .contact-grid")
  .forEach((el) => { if (!el.classList.contains("reveal")) el.classList.add("reveal"); });

// Scroll reveal with stagger
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

// Nav shrink on scroll (lightweight, no parallax, no progress bar)
const navEl = document.querySelector(".nav");
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (navEl) navEl.classList.toggle("scrolled", y > 30);
    const heroEl = document.querySelector(".hero");
    const heroH = heroEl ? heroEl.offsetHeight : 0;
    document.body.classList.toggle("past-hero", y > heroH * 0.6);
    ticking = false;
  });
}, { passive: true });

// Subtle cursor glow (desktop only)
if (window.matchMedia("(pointer:fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  window.addEventListener("mousemove", (e) => {
    glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  });
  document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
  document.addEventListener("mouseenter", () => (glow.style.opacity = "1"));
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

// Scrollspy
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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
    }
  });
});