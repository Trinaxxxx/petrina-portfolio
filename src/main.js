import './style.css';
import { initHero } from './hero.js';
import { initScene } from './scene.js';

// ── PAGE LOAD FADE-IN ──
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');

  // Nav slides down
  const nav = document.querySelector('nav');
  if (nav) setTimeout(() => nav.classList.add('visible'), 50);

  // Hero content fades in
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) setTimeout(() => heroContent.classList.add('visible'), 150);

  initHero();
  initScene();
  initReveal();
  initStatCountUp();
  initMobileNav();
});

// ── SCROLL REVEAL ──
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// ── STAT COUNT-UP ──
function initStatCountUp() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const raw = el.dataset.target;
      const isFloat = raw.includes('.');
      const suffix = raw.replace(/[\d.]/g, '');
      const target = parseFloat(raw);
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = isFloat
          ? (target * ease).toFixed(1)
          : Math.round(target * ease);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

// ── MOBILE NAV ──
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }
}

window.closeMobileMenu = function() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.remove('open');
};
