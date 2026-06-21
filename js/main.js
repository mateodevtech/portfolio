/* ============================================================
   EPHRAIM ANANI — Portfolio
   Main interaction script
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initHeaderBlend();
  initMobileNav();
  initPageTransitions();
  initRevealAnimations();
  initLocalClock(); 
  initProjectPreview();
  initFormFeedback();
});

/* ----------------------------------------------------------
   Smooth scroll (Lenis)
---------------------------------------------------------- */
let lenisInstance = null;

function initSmoothScroll() {
  if (typeof Lenis === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.gsap && window.gsap.ticker) {
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ----------------------------------------------------------
   Header: mix-blend-mode already handles contrast,
   just toggle a scrolled class for subtle bg on inner pages
---------------------------------------------------------- */
function initHeaderBlend() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

/* ----------------------------------------------------------
   Mobile nav drawer
---------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    const isOpen = drawer.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ----------------------------------------------------------
   Custom page transitions (Barba-style, vanilla)
   Slides an overlay panel up, swaps content, slides down.
---------------------------------------------------------- */
function initPageTransitions() {
  const overlay = document.querySelector(".transition-overlay");
  if (!overlay) return;

  // Entrance: reveal current page from behind the overlay
  if (window.gsap) {
    gsap.timeline()
      .set(overlay, { transform: "translateY(0%)" })
      .to(".t-label", { opacity: 1, duration: 0.25 })
      .to(overlay, {
        transform: "translateY(-100%)",
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.15,
      })
      .set(overlay, { transform: "translateY(100%)" });
  }

  const internalLinks = document.querySelectorAll('a[href^="/"], a[data-transition]');
  internalLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || link.target === "_blank") return;

    link.addEventListener("click", (e) => {
      // allow modifier-clicks (new tab etc.) to behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      navigateWithTransition(href);
    });
  });
}

function navigateWithTransition(href) {
  const overlay = document.querySelector(".transition-overlay");
  if (!overlay || !window.gsap) {
    window.location.href = href;
    return;
  }
  gsap.timeline({
    onComplete: () => { window.location.href = href; }
  })
  .set(overlay, { transform: "translateY(100%)" })
  .to(overlay, {
    transform: "translateY(0%)",
    duration: 0.7,
    ease: "power4.inOut",
  })
  .to(".t-label", { opacity: 1, duration: 0.2 }, "-=0.2");
}

/* ----------------------------------------------------------
   Scroll-triggered reveal animations
---------------------------------------------------------- */
function initRevealAnimations() {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero title lines: split already in markup as .line > span
  gsap.utils.toArray(".hero-title .line span").forEach((el, i) => {
    gsap.fromTo(el,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, ease: "power4.out", delay: 0.5 + i * 0.08 }
    );
  });

  // gsap.fromTo(".hero-kicker", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  // gsap.fromTo(".hero-portrait", { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.4, ease: "power3.out" });
  // gsap.fromTo(".hero-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, delay: 1.0 });
  // gsap.fromTo(".hero-bottom", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, delay: 1.15 });
  // gsap.fromTo(".terminal", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, delay: 1.3, ease: "power3.out" });

  // Hero-full entrance
  gsap.fromTo(".hero-full-tagline", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  gsap.fromTo(".hero-full-clock", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3 });
  gsap.fromTo(".hf-firstname", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.35, ease: "power4.out" });
  gsap.fromTo(".hf-lastname-wrap", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.55, ease: "power4.out" });
  gsap.fromTo(".hero-full-scrollcue", { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 1.1 });
  gsap.fromTo(".hero-marquee", { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 1.0 });
  gsap.fromTo(".glow-field span", { opacity: 0 }, { opacity: 0.85, duration: 1.8, delay: 0.1, stagger: 0.15, ease: "power2.out" });

  // Generic reveal-up for elements marked [data-reveal]
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );
  });

  // Stagger reveal for groups [data-reveal-group]
  gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
    const items = group.children;
    gsap.fromTo(items,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: group, start: "top 85%" }
      }
    );
  });
}

/* ----------------------------------------------------------
   Hero terminal — typewriter effect
---------------------------------------------------------- */
function initTerminal() {
  const body = document.querySelector(".terminal-body");
  if (!body) return;

  const lines = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "Ephraim Anani — Développeur Fullstack" },
    { type: "cmd", text: "cat skills.txt" },
    { type: "out", text: "Java · Spring Boot · React · Next.js · Docker" },
    { type: "cmd", text: "status --available" },
    { type: "out", text: "→ ouvert aux stages & opportunités" },
  ];

  body.innerHTML = "";
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      body.appendChild(cursor);
      return;
    }
    const current = lines[lineIndex];
    const p = document.createElement("div");

    if (current.type === "cmd") {
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "ephraim@portfolio ~ % ";
      p.appendChild(prompt);
      const txt = document.createElement("span");
      p.appendChild(txt);
      body.appendChild(p);

      let i = 0;
      const typeChar = () => {
        if (i < current.text.length) {
          txt.textContent += current.text[i];
          i++;
          setTimeout(typeChar, 35 + Math.random() * 35);
        } else {
          lineIndex++;
          setTimeout(typeLine, 220);
        }
      };
      setTimeout(typeChar, 200);
    } else {
      p.className = "out";
      p.textContent = current.text;
      body.appendChild(p);
      lineIndex++;
      setTimeout(typeLine, 320);
    }
  }

  // Start after hero entrance settles
  setTimeout(typeLine, 1900);
}

/* ----------------------------------------------------------
   Project list — floating preview image follows cursor
---------------------------------------------------------- */

/* ----------------------------------------------------------
   Hero — live local time (Abidjan, GMT)
---------------------------------------------------------- */
function initLocalClock() {
  const el = document.getElementById("local-time");
  if (!el) return;

  function update() {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Abidjan",
    }).format(now);
    el.textContent = formatted;
  }

  update();
  setInterval(update, 30000);
}
function initProjectPreview() {
  const rows = document.querySelectorAll(".project-row[data-preview]");
  const preview = document.querySelector(".project-preview");
  if (!rows.length || !preview) return;

  const img = preview.querySelector("img");
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let active = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    preview.style.transform = `translate(${curX + 24}px, ${curY - 110}px) scale(${active ? 1 : 0.9})`;
    requestAnimationFrame(loop);
  }
  loop();

  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      active = true;
      const src = row.getAttribute("data-preview");
      if (src) img.src = src;
      preview.style.opacity = "1";
    });
    row.addEventListener("mouseleave", () => {
      active = false;
      preview.style.opacity = "0";
    });
  });
}

/* ----------------------------------------------------------
   Contact form — placeholder feedback (no backend yet)
---------------------------------------------------------- */
function initFormFeedback() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".form-submit button");
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = "Message envoyé";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
    }, 2400);
  });
}
