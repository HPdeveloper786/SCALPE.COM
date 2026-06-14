/* =============================================
   SCALPÉ — Hair & Scalp Institute
   Animations, Interactions & Language Toggle
   ============================================= */

// ─── LANGUAGE ────────────────────────────────
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Translate every element that carries data-en / data-th
  document.querySelectorAll('[data-en]').forEach(function(el) {
    var text = el.getAttribute('data-' + lang);
    if (text === null || text === undefined || text === '') return;

    var tag = el.tagName;

    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      // Only update placeholder
      el.setAttribute('placeholder', text);

    } else if (tag === 'OPTION') {
      el.textContent = text;

    } else if (el.children.length > 0) {
      // Has child elements — only replace bare text nodes to preserve child HTML
      Array.from(el.childNodes).forEach(function(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          node.textContent = text + ' ';
        }
      });

    } else {
      // Plain text element — safe to replace
      el.textContent = text;
    }
  });

  // Update <html lang="...">
  document.documentElement.lang = lang;

  // Pulse animation on active button
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    if (btn.dataset.lang === lang) {
      btn.style.transform = 'scale(1.15)';
      setTimeout(function() { btn.style.transform = ''; }, 200);
    }
  });
}

// ─── NAVBAR SCROLL ───────────────────────────
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  var floatingBook = document.getElementById('floatingBook');
  if (floatingBook) {
    floatingBook.classList.toggle('visible', window.scrollY > 400);
  }
});

// ─── MOBILE MENU ─────────────────────────────
function toggleMenu() {
  var links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  var links = document.getElementById('navLinks');
  var hamburger = document.getElementById('hamburger');
  if (!links.contains(e.target) && !hamburger.contains(e.target)) {
    links.classList.remove('open');
  }
});

// ─── PARTICLES ───────────────────────────────
function createParticles() {
  var container = document.getElementById('particles');
  if (!container) return;
  var count = 40;
  for (var i = 0; i < count; i++) {
    var p = document.createElement('div');
    p.classList.add('particle');
    var size = Math.random() * 3 + 1;
    p.style.cssText =
      'left: ' + (Math.random() * 100) + '%;' +
      'width: ' + size + 'px;' +
      'height: ' + size + 'px;' +
      'animation-duration: ' + (Math.random() * 15 + 8) + 's;' +
      'animation-delay: ' + (Math.random() * 10) + 's;';
    container.appendChild(p);
  }
}

createParticles();

// ─── COUNTER ANIMATION ───────────────────────
function animateCounter(el, target, duration) {
  duration = duration || 2000;
  var start = 0;
  var step = target / (duration / 16);
  var timer = setInterval(function() {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

var countersStarted = false;

// ─── INTERSECTION OBSERVER ────────────────────
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .process-step, .treat-card').forEach(function(el) {
  observer.observe(el);
});

// Counter observer
var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(function(el) {
        animateCounter(el, parseInt(el.dataset.target), 2000);
      });
    }
  });
}, { threshold: 0.5 });

var statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

// ─── TREAT CARD STAGGER ───────────────────────
document.querySelectorAll('.treat-card').forEach(function(card, i) {
  card.style.transitionDelay = (i * 80) + 'ms';
});

// ─── TESTIMONIALS SLIDER ──────────────────────
var testiIndex = 0;
var testiCards = document.querySelectorAll('.testi-card');
var testiTrack = document.getElementById('testimonialsTrack');
var testiDotsEl = document.getElementById('testiDots');

function buildDots() {
  if (!testiDotsEl) return;
  var total = Math.ceil(testiCards.length / 2);
  for (var i = 0; i < total; i++) {
    var dot = document.createElement('button');
    dot.classList.add('testi-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    (function(idx) {
      dot.addEventListener('click', function() { goToTestimonial(idx); });
    })(i);
    testiDotsEl.appendChild(dot);
  }
}

function goToTestimonial(index) {
  var total = Math.ceil(testiCards.length / 2);
  testiIndex = Math.max(0, Math.min(index, total - 1));
  var cardWidth = testiCards[0] ? testiCards[0].offsetWidth + 24 : 0;
  testiTrack.style.transform = 'translateX(-' + (testiIndex * cardWidth * 2) + 'px)';
  testiTrack.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  document.querySelectorAll('.testi-dot').forEach(function(dot, i) {
    dot.classList.toggle('active', i === testiIndex);
  });
}

function moveTestimonials(dir) {
  var total = Math.ceil(testiCards.length / 2);
  goToTestimonial((testiIndex + dir + total) % total);
}

buildDots();

setInterval(function() { moveTestimonials(1); }, 6000);

// ─── CURSOR GLOW ──────────────────────────────
var cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

var mouseX = 0, mouseY = 0;
var glowX = 0, glowY = 0;

document.addEventListener('mousemove', function(e) {
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
var logosEl = document.querySelector('.featured-logos');
if (logosEl) {
  var clone = logosEl.cloneNode(true);
  logosEl.parentElement.appendChild(clone);
}

// ─── SMOOTH SCROLL NAV ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
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
  var btn = e.target.querySelector('.btn-primary');
  var originalText = btn.textContent;
  btn.textContent = currentLang === 'th' ? 'กำลังส่ง...' : 'Sending...';
  btn.style.opacity = '0.7';
  setTimeout(function() {
    btn.textContent = currentLang === 'th' ? 'ส่งแล้ว! เราจะติดต่อกลับเร็วๆนี้' : 'Sent! We\'ll be in touch shortly.';
    btn.style.opacity = '1';
    btn.style.background = '#2d5a27';
    btn.style.color = '#a8e6a3';
    setTimeout(function() {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
    }, 3500);
  }, 1200);
}

// ─── SECTION ENTRANCE ANIMATIONS ─────────────
var sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.treat-card, .doctor-card, .result-card, .why-item, .location').forEach(function(el, i) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease ' + (i * 60) + 'ms, transform 0.6s ease ' + (i * 60) + 'ms';
  sectionObserver.observe(el);
});

// ─── GOLD LINE DIVIDERS ───────────────────────
document.querySelectorAll('.section-eyebrow').forEach(function(el) {
  var line = document.createElement('div');
  line.style.cssText =
    'width:32px;height:1px;background:var(--gold,#c9a84c);' +
    'display:inline-block;margin-right:12px;vertical-align:middle;opacity:0.6;';
  el.prepend(line);
});

// ─── PARALLAX HERO ────────────────────────────
window.addEventListener('scroll', function() {
  var hero = document.querySelector('.hero-content');
  if (hero) {
    var y = window.scrollY;
    hero.style.transform = 'translateY(' + (y * 0.15) + 'px)';
    hero.style.opacity = Math.max(0, 1 - y / 500);
  }
});

// ─── TREAT CARD TILT ──────────────────────────
document.querySelectorAll('.treat-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateZ(4px)';
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
  });
});

// ─── PROCESS STEP PROGRESSIVE REVEAL ─────────
var processObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var steps = entry.target.querySelectorAll('.process-step');
      steps.forEach(function(step, i) {
        setTimeout(function() { step.classList.add('visible'); }, i * 180);
      });
    }
  });
}, { threshold: 0.2 });

var processSection = document.querySelector('.process-steps');
if (processSection) processObserver.observe(processSection);

// ─── PAGE LOAD ANIMATION ──────────────────────
window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(function() {
    document.body.style.opacity = '1';
  }, 50);
});

// ─── RESIZE HANDLER ───────────────────────────
window.addEventListener('resize', function() {
  goToTestimonial(testiIndex);
});

console.log('%cScalpé Hair & Scalp Institute', 'color: #c9a84c; font-size: 16px; font-family: serif;');
console.log('%cBangkok · London · Dubai', 'color: #888; font-size: 11px;');
