/* ─── main.js ───────────────────────────────────────────────
   InvenSy Landing — Scroll Animations, Particles, Charts, etc.
   ─────────────────────────────────────────────────────────── */

/* ══ 1. PARTICLE CANVAS ══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['rgba(0,255,170,', 'rgba(0,255,204,', 'rgba(0,204,136,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : H + 10;
      this.r   = Math.random() * 1.8 + 0.4;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = -(Math.random() * 0.6 + 0.2);
      this.ttl = Math.random() * 200 + 80;
      this.age = 0;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.ttl || this.y < -10) this.reset(false);
    }
    draw() {
      const alpha = Math.sin(Math.PI * this.age / this.ttl) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + alpha + ')';
      ctx.shadowColor = this.col + '0.8)';
      ctx.shadowBlur  = 6;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();


/* ══ 2. NAVBAR SCROLL ════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ══ 3. TYPING HERO ══════════════════════════════════════════ */
(function initTyping() {
  const el     = document.getElementById('typed');
  const words  = ['Management System', 'for UCC Engineering', 'Built in Python', 'Offline & Fast'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci > word.length)      { deleting = true; setTimeout(tick, 1600); return; }
    if ( deleting && ci < 0)                { deleting = false; wi = (wi + 1) % words.length; ci = 0; }

    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();


/* ══ 4. COUNTER ANIMATION ════════════════════════════════════ */
function animateCounter(el) {
  const target = +el.dataset.target;
  const dur    = 1400;
  const start  = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  })(start);
}


/* ══ 5. REBUILD TEXT ANIMATION ═══════════════════════════════
   Splits section titles with .rebuild-text class into chars
   and animates each char in with a staggered delay when the
   element scrolls into view.
════════════════════════════════════════════════════════════ */
function wrapChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.transitionDelay = `${i * 28}ms`;
    el.appendChild(span);
  });
}

// Apply to all rebuild-text elements
document.querySelectorAll('.rebuild-text').forEach(wrapChars);


/* ══ 6. INTERSECTION OBSERVER — SCROLL REVEAL ═══════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el    = entry.target;
    const delay = +(el.dataset.delay || 0);

    setTimeout(() => {
      el.classList.add('in');

      // counter?
      if (el.classList.contains('counter')) animateCounter(el);

      // rebuild-text?
      if (el.classList.contains('rebuild-text')) el.classList.add('in');

    }, delay);

    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .rebuild-text'
).forEach(el => revealObserver.observe(el));

// Counters (not tagged with reveal classes)
document.querySelectorAll('.counter').forEach(el => revealObserver.observe(el));


/* ══ 7. DEMO TABS ════════════════════════════════════════════ */
(function initTabs() {
  const btns    = document.querySelectorAll('.tab-btn');
  const labels  = {
    dashboard: 'InvenSy · Dashboard',
    data:      'InvenSy · View Data',
    export:    'InvenSy · Export',
    users:     'InvenSy · Manage Users',
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.demo-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${tab}`).classList.add('active');

      document.getElementById('demo-label').textContent = labels[tab];
    });
  });
})();


/* ══ 8. DEMO CLOCK ════════════════════════════════════════════ */
(function initClock() {
  const el = document.getElementById('demo-clock');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTimeout(tick, 1000);
  }
  tick();
})();


/* ══ 9. DEMO CHARTS (Canvas) ═════════════════════════════════ */
(function initDemoCharts() {
  // Tiny donut chart
  const donut = document.getElementById('demoDonut');
  if (!donut) return;
  const dc = donut.getContext('2d');
  const data = [{ v: 142, c: '#00ffaa' }, { v: 18, c: '#00cc88' }, { v: 28, c: '#ffaa00' }];
  const total = data.reduce((s, d) => s + d.v, 0);
  let angle = -Math.PI / 2;
  const cx = 100, cy = 100, r = 72, stroke = 22;

  function drawDonut() {
    dc.clearRect(0, 0, 200, 200);
    // bg ring
    dc.beginPath();
    dc.arc(cx, cy, r, 0, Math.PI * 2);
    dc.strokeStyle = 'rgba(0,255,170,0.07)';
    dc.lineWidth = stroke;
    dc.stroke();
    // segments
    let a = angle;
    data.forEach(d => {
      const slice = (d.v / total) * Math.PI * 2;
      dc.beginPath();
      dc.arc(cx, cy, r, a, a + slice);
      dc.strokeStyle = d.c;
      dc.lineWidth = stroke;
      dc.lineCap = 'butt';
      dc.shadowColor = d.c;
      dc.shadowBlur = 8;
      dc.stroke();
      a += slice;
    });
    // center text
    dc.shadowBlur = 0;
    dc.fillStyle = '#00ffaa';
    dc.font = 'bold 22px Inter';
    dc.textAlign = 'center'; dc.textBaseline = 'middle';
    dc.fillText('188', cx, cy - 7);
    dc.fillStyle = 'rgba(255,255,255,0.35)';
    dc.font = '11px Inter';
    dc.fillText('total', cx, cy + 11);
  }

  // animated entrance
  let progress = 0;
  function animateDonut() {
    if (progress < 1) {
      progress = Math.min(progress + 0.02, 1);
      // simple fade-in via alpha
      dc.globalAlpha = progress;
      drawDonut();
      dc.globalAlpha = 1;
      requestAnimationFrame(animateDonut);
    } else {
      drawDonut();
    }
  }

  // observe it
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateDonut(); }
  }, { threshold: 0.5 }).observe(donut);


  // Bar chart
  const bar = document.getElementById('demoBar');
  if (!bar) return;
  const bc   = bar.getContext('2d');
  const bData = [
    { label: 'Lab A',  v: 72, c: '#00ffaa' },
    { label: 'Lab B',  v: 55, c: '#00cc88' },
    { label: 'Office', v: 38, c: '#00ddff' },
    { label: 'Stores', v: 23, c: '#7dd3c0' },
  ];
  const bW = 300, bH = 180;
  bar.width = bW; bar.height = bH;
  const maxV = Math.max(...bData.map(d => d.v));
  const barW = 40, gap = (bW - bData.length * barW) / (bData.length + 1);

  function drawBar(prog) {
    bc.clearRect(0, 0, bW, bH);
    bData.forEach((d, i) => {
      const x = gap + i * (barW + gap);
      const h = ((d.v / maxV) * (bH - 40)) * prog;
      const y = bH - 25 - h;

      // glow
      bc.shadowColor = d.c; bc.shadowBlur = 8;
      const grad = bc.createLinearGradient(0, y, 0, bH - 25);
      grad.addColorStop(0, d.c);
      grad.addColorStop(1, d.c + '44');
      bc.fillStyle = grad;
      bc.beginPath();
      bc.roundRect ? bc.roundRect(x, y, barW, h, [4, 4, 0, 0]) : bc.rect(x, y, barW, h);
      bc.fill();
      bc.shadowBlur = 0;

      // label
      bc.fillStyle = 'rgba(255,255,255,0.4)';
      bc.font = '10px Inter'; bc.textAlign = 'center';
      bc.fillText(d.label, x + barW / 2, bH - 8);
      if (prog === 1) {
        bc.fillStyle = d.c;
        bc.font = 'bold 10px Inter';
        bc.fillText(d.v, x + barW / 2, y - 5);
      }
    });
  }

  let bp = 0;
  function animateBar() {
    if (bp < 1) { bp = Math.min(bp + 0.035, 1); drawBar(bp); requestAnimationFrame(animateBar); }
    else drawBar(1);
  }

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animateBar();
  }, { threshold: 0.5 }).observe(bar);
})();


/* ══ 10. SMOOTH ANCHOR SCROLL ════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══ 11. SECTION TITLE REBUILD ON SCROLL ════════════════════
   Adds a "rebuild" 3D flip effect to section-title elements
   when they enter the viewport — characters assemble from
   a scramble / drop-in effect.
════════════════════════════════════════════════════════════ */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

function scrambleReveal(el) {
  // Skip if it contains child elements (gradient spans etc.)
  if (el.children.length > 0) {
    // Just fade the whole element
    el.style.opacity = '0';
    el.style.transition = 'opacity .6s ease';
    setTimeout(() => { el.style.opacity = '1'; }, 50);
    return;
  }

  const original = el.textContent;
  const len      = original.length;
  let   iteration = 0;
  const totalIter = len * 2.5;

  el.style.fontVariantNumeric = 'tabular-nums';

  const interval = setInterval(() => {
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i < Math.floor(iteration / 2.5)) return ch;
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join('');

    iteration++;
    if (iteration >= totalIter) {
      el.textContent = original;
      clearInterval(interval);
    }
  }, 30);
}

// Observe all section-title elements
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    scrambleReveal(entry.target);
    // pulse glow
    entry.target.style.transition = 'text-shadow 0.6s';
    entry.target.style.textShadow = '0 0 40px rgba(0,255,170,0.4)';
    setTimeout(() => { entry.target.style.textShadow = ''; }, 800);
    titleObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section-title').forEach(el => {
  // Only scramble plain-text direct children
  titleObserver.observe(el);
});


/* ══ 12. FEATURE CARD STAGGERED ENTRANCE ════════════════════ */
// Already handled by reveal-scale + IntersectionObserver above
// but we add a special "glow pulse" on first appear
const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    card.style.setProperty('--pulse-color', 'rgba(0,255,170,0.15)');
    card.classList.add('pulse-once');
    featureObserver.unobserve(card);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card').forEach(c => featureObserver.observe(c));


/* ══ 13. STEP CARDS — SLIDE + DRAW LINE ═════════════════════ */
// Already handled by reveal-left / reveal-right above


/* ══ 14. NAV ACTIVE HIGHLIGHT ON SCROLL ═════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--g)' : '';
  });
}, { passive: true });
