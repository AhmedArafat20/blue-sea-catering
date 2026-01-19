// ============ Helpers ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============ Navbar: scroll + hide/show + scrolled class ============
(() => {
  const navbar = $(".navbar-custom");
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // add/remove scrolled style
    navbar.classList.toggle("scrolled", currentScroll > 50);

    // hide on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 120) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  });
})();

// ============ Mobile Menu ============
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".menu-close");
  const overlay = document.querySelector(".nav-overlay");
  const links = document.querySelectorAll(".nav-links a");

  if (!toggle) return;

  const openMenu = () => {
    document.body.classList.add("nav-open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    openMenu();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  links.forEach((a) => {
    a.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      a.classList.add("active");
      closeMenu();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();


// ============ Projects Tabs ============
(() => {
  const tabButtons = $$(".tab-btn");
  const tabContents = $$(".tab-content");
  if (!tabButtons.length || !tabContents.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });
})();

// ============ Projects Accordion (lists) ============
(() => {
  const accButtons = $$(".acc-btn");
  if (!accButtons.length) return;

  accButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = btn.dataset.acc;
      const body = document.getElementById(targetId);
      const icon = btn.querySelector(".acc-icon");
      if (!body) return;

      const isOpen = body.classList.contains("open");

      // close all
      $$(".acc-body").forEach((b) => b.classList.remove("open"));
      $$(".acc-icon").forEach((i) => (i.textContent = "+"));

      // open clicked
      if (!isOpen) {
        body.classList.add("open");
        if (icon) icon.textContent = "−";
      }

      btn.blur(); // prevent focus scroll
    });
  });
})();

// ============ Services Details (no white gap fix) ============
(() => {
  const serviceItems = $$(".service-item");
  const serviceDetailsWrap = $(".service-details");
  const serviceDetails = $$(".service-detail");

  if (!serviceItems.length || !serviceDetailsWrap || !serviceDetails.length) return;

  // hide wrapper by default to avoid empty white space
  serviceDetailsWrap.classList.remove("active");
  serviceDetailsWrap.style.display = "none";
  serviceDetails.forEach((d) => (d.style.display = "none"));

  serviceItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.dataset.target;
      if (!target) return;

      // show wrapper
      serviceDetailsWrap.style.display = "block";
      serviceDetailsWrap.classList.add("active");

      // close all details
      serviceDetails.forEach((detail) => (detail.style.display = "none"));

      // open target detail
      const targetEl = document.getElementById(target);
      if (targetEl) {
        targetEl.style.display = "block";
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();


// ============ Luxury Scroll Reveal (side fade-in) ============
(() => {
  const isRTL = (document.documentElement.getAttribute("dir") || "").toLowerCase() === "rtl";

  // Auto-mark sections (except hero) for reveal if they aren't already
  const sections = document.querySelectorAll("section:not(.hero)");
  let sIndex = 0;
  sections.forEach((sec) => {
    // avoid revealing tiny utility sections if needed
    if (!sec.classList.contains("reveal") && !sec.closest(".no-reveal")) {
      sec.classList.add("reveal");
    }

    // assign direction only if not specified
    if (!sec.classList.contains("reveal-left") && !sec.classList.contains("reveal-right") && !sec.classList.contains("reveal-up")) {
      const even = sIndex % 2 === 0;
      sec.classList.add(even ? (isRTL ? "reveal-right" : "reveal-left") : (isRTL ? "reveal-left" : "reveal-right"));
      sIndex++;
    }
  });

  // Stagger: animate direct children smoothly
  document.querySelectorAll(".stagger").forEach((wrap) => {
    const children = Array.from(wrap.children);
    children.forEach((ch, i) => {
      // keep original if already visible / special
      ch.style.transitionDelay = `${Math.min(i * 90, 420)}ms`;
    });
  });

  const targets = document.querySelectorAll(".reveal, .stagger");
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
  );

  targets.forEach((el) => io.observe(el));
})();

// ============ Active Nav Link (by current page) ============
(function(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const links = document.querySelectorAll(".nav-links a");

  links.forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    // لو اللينك ملف صفحة
    if(href && !href.startsWith("#") && href === path){
      a.classList.add("active");
    }
  });
})();

// ============ Smart Language Switch (page-to-page) ============
(function(){
  const langBtn = document.querySelector(".lang-switch");
  if(!langBtn) return;

  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // لو عربي -> روح لنفس الصفحة -en
  // لو إنجليزي -> ارجع لنفس الصفحة بدون -en
  const isEn = current.includes("-en");
  let target;

  if(isEn){
    target = current.replace("-en", "");
  }else{
    const dot = current.lastIndexOf(".");
    target = dot > -1 ? current.slice(0, dot) + "-en" + current.slice(dot) : current + "-en";
  }

  langBtn.setAttribute("href", target);
})();

// ============ Element-only reveal on scroll ============
(function(){
  const els = document.querySelectorAll(".reveal-text, .reveal-item, .reveal-left, .reveal-right");
  if(!els.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("reveal-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach((el)=>{
    io.observe(el);
  });
})();
