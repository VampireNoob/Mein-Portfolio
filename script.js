// =========================================================
// Alexander Nikel — Portfolio
// =========================================================

document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---------- Header background on scroll ----------
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Interactive hero grid ----------
const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
const heroSection = canvas.closest('.hero');

let mouse = { x: -9999, y: -9999 };
let w, h;

function resizeCanvas() {
  w = canvas.width = heroSection.clientWidth * devicePixelRatio;
  h = canvas.height = heroSection.clientHeight * devicePixelRatio;
  canvas.style.width = heroSection.clientWidth + 'px';
  canvas.style.height = heroSection.clientHeight + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

heroSection.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * devicePixelRatio;
  mouse.y = (e.clientY - rect.top) * devicePixelRatio;
});
heroSection.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

const GRID_SPACING = 46 * devicePixelRatio;
const MAX_DIST = 160 * devicePixelRatio;
const MAX_OFFSET = 10 * devicePixelRatio;

function drawGrid() {
  ctx.clearRect(0, 0, w, h);
  const cols = Math.ceil(w / GRID_SPACING) + 1;
  const rows = Math.ceil(h / GRID_SPACING) + 1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * GRID_SPACING;
      let y = j * GRID_SPACING;

      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DIST) {
        const force = (1 - dist / MAX_DIST) * MAX_OFFSET;
        const angle = Math.atan2(dy, dx);
        x -= Math.cos(angle) * force;
        y -= Math.sin(angle) * force;
      }

      const alpha = dist < MAX_DIST ? 0.5 - (dist / MAX_DIST) * 0.35 : 0.15;

      ctx.beginPath();
      ctx.arc(x, y, 1.4 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 244, 247, ${alpha})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(drawGrid);
}
drawGrid();

// ---------- Project card glow + page background tint ----------
const bgTint = document.getElementById('bg-tint');

document.querySelectorAll('.project-card').forEach(card => {
  const accent = getComputedStyle(card).getPropertyValue('--accent').trim();

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', mx + '%');
    card.style.setProperty('--my', my + '%');
  });

  card.addEventListener('mouseenter', () => {
    document.documentElement.style.setProperty('--tint-color', hexToRgba(accent, 0.12));
    bgTint.classList.add('active');
  });

  card.addEventListener('mouseleave', () => {
    bgTint.classList.remove('active');
  });
});

function hexToRgba(hex, alpha) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------- Tech pill hover accent ----------
document.querySelectorAll('.tech-pill').forEach(pill => {
  const accent = pill.dataset.accent;
  if (accent) pill.style.setProperty('--pill-accent', accent);
});

// ---------- Timeline scroll fill + active dots ----------
const timelineFill = document.getElementById('timelineFill');
const timelineWrap = document.getElementById('timelineWrap');
const timelineDots = document.querySelectorAll('.timeline-dot');

function updateTimelineFill() {
  const rect = timelineWrap.getBoundingClientRect();
  const viewportTrigger = window.innerHeight * 0.75;
  const total = rect.height;

  let progress = (viewportTrigger - rect.top) / total;
  progress = Math.max(0, Math.min(1, progress));

  timelineFill.style.height = (progress * 100) + '%';
}
window.addEventListener('scroll', updateTimelineFill);
updateTimelineFill();

const dotObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.6 });
timelineDots.forEach(dot => dotObserver.observe(dot));

// ---------- Modals (Impressum / Datenschutz) ----------
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById('modal-' + btn.dataset.modalOpen);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('[data-modal-close]').forEach(el => {
  el.addEventListener('click', () => {
    const modal = el.closest('.modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });
});