/* =============================================
   SCALPÉ — Hair & Scalp Institute
   Animations, Interactions & Language Toggle
   ============================================= */

// ─── LANGUAGE ────────────────────────────────
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // Update html lang
  document.documentElement.lang = lang;

  // Language indicator animation
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === lang) {
      btn.style.transform = 'scale(1.1)';
      setTimeout(() => btn.style.transform = '', 200);
    }
  });
}

// ─── NAVBAR SCROLL ───────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // Floating book
  const floatingBook = document.getElementById('floatingBook');
  if (floatingBook) {
    floatingBook.classList.toggle('visible', window.scrollY > 400);
  }
});

// ─── MOBILE MENU ─────────────────────────────
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (!links.contains(e.target) && !hamburger.contains(e.target)) {
    links.classList.remove('open');
  }
});

// ─── PARTICLES ───────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 15 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

createParticles();

// ─── COUNTER ANIMATION ───────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

let countersStarted = false;

// ─── INTERSECTION OBSERVER ────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .process-step, .treat-card').forEach(el => {
  observer.observe(el);
});

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 2000);
      });
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

// ─── TREAT CARD STAGGER ───────────────────────
document.querySelectorAll('.treat-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

// ─── TESTIMONIALS SLIDER ──────────────────────
let testiIndex = 0;
const testiCards = document.querySelectorAll('.testi-card');
const testiTrack = document.getElementById('testimonialsTrack');
const testiDotsEl = document.getElementById('testiDots');

function buildDots() {
  if (!testiDotsEl) return;
  const total = Math.ceil(testiCards.length / 2);
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.classList.add('testi-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToTestimonial(i));
    testiDotsEl.appendChild(dot);
  }
}

function goToTestimonial(index) {
  const total = Math.ceil(testiCards.length / 2);
  testiIndex = Math.max(0, Math.min(index, total - 1));
  const cardWidth = testiCards[0] ? testiCards[0].offsetWidth + 24 : 0;
  testiTrack.style.transform = `translateX(-${testiIndex * cardWidth * 2}px)`;
  testiTrack.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';

  document.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === testiIndex);
  });
}

function moveTestimonials(dir) {
  const total = Math.ceil(testiCards.length / 2);
  goToTestimonial((testiIndex + dir + total) % total);
}

buildDots();

// Auto-advance testimonials
setInterval(() => moveTestimonials(1), 6000);

// ─── CURSOR GLOW ──────────────────────────────
const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ─── FEATURED LOGOS INFINITE SCROLL ───────────
// Duplicate logos for seamless scroll
const logosEl = document.querySelector('.featured-logos');
if (logosEl) {
  const clone = logosEl.cloneNode(true);
  logosEl.parentElement.appendChild(clone);
}

// ─── SMOOTH SCROLL NAV ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('navLinks').classList.remove('open');
    }
  });
});

// ─── FORM SUBMIT ─────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-primary');
  const originalText = btn.textContent;
  btn.textContent = currentLang === 'th' ? 'กำลังส่ง...' : 'Sending...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = currentLang === 'th' ? 'ส่งแล้ว! เราจะติดต่อกลับเร็วๆนี้' : 'Sent! We'll be in touch shortly.';
    btn.style.opacity = '1';
    btn.style.background = '#2d5a27';
    btn.style.color = '#a8e6a3';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
    }, 3500);
  }, 1200);
}

// ─── SECTION ENTRANCE ANIMATIONS ─────────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.treat-card, .doctor-card, .result-card, .why-item, .location').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${i * 60}ms, transform 0.6s ease ${i * 60}ms`;
  sectionObserver.observe(el);
});

// ─── GOLD LINE DIVIDERS ───────────────────────
document.querySelectorAll('.section-eyebrow').forEach(el => {
  const line = document.createElement('div');
  line.style.cssText = `
    width: 32px;
    height: 1px;
    background: var(--gold, #c9a84c);
    display: inline-block;
    margin-right: 12px;
    vertical-align: middle;
    opacity: 0.6;
  `;
  el.prepend(line);
});

// ─── PARALLAX HERO ────────────────────────────
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (hero) {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.15}px)`;
    hero.style.opacity = Math.max(0, 1 - y / 500);
  }
});

// ─── TREAT CARD TILT ──────────────────────────
document.querySelectorAll('.treat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── PROCESS STEP PROGRESSIVE REVEAL ─────────
const processObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = entry.target.querySelectorAll('.process-step');
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 180);
      });
    }
  });
}, { threshold: 0.2 });

const processSection = document.querySelector('.process-steps');
if (processSection) processObserver.observe(processSection);

// ─── PAGE LOAD ANIMATION ──────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});

// ─── RESIZE HANDLER ───────────────────────────
window.addEventListener('resize', () => {
  goToTestimonial(testiIndex);
});

console.log('%cScalpé Hair & Scalp Institute', 'color: #c9a84c; font-size: 16px; font-family: serif;');
console.log('%cBangkok · London · Dubai', 'color: #888; font-size: 11px;');
