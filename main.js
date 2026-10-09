/* ─── main.js ─────────────────────────────────────────────────
   InvenSy Landing · Full Animation Suite
   ─────────────────────────────────────────────────────────── */

'use strict';

/* ══ 1. CUSTOM CURSOR GLOW ═══════════════════════════════════ */
(function() {
  const el = document.getElementById('cursorGlow');
  if (!el) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function raf() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    requestAnimationFrame(raf);
  })();
})();


/* ══ 2. NEURAL NETWORK CANVAS BACKGROUND ════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, nodes = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const COUNT  = 55;
  const RADIUS = 160;

  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -20;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.6 + 0.4;
      this.a  = Math.random();
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -20 || this.x > W+20 || this.y < -20 || this.y > H+20) this.reset();
    }
  }

  for (let i = 0; i < COUNT; i++) nodes.push(new Node());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < RADIUS) {
          const alpha = (1 - d / RADIUS) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,170,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,170,${n.a * 0.6})`;
      ctx.shadowColor = 'rgba(0,255,170,0.5)';
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.shadowBlur  = 0;
      n.update();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ══ 3. NAVBAR SCROLL ════════════════════════════════════════ */
(function() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('up', window.scrollY > 50);
  }, { passive: true });
})();


/* ══ 4. AOS — SCROLL REVEAL ENGINE ══════════════════════════ */
(function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const delay = el => +(el.dataset.aosDelay || 0);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      setTimeout(() => el.classList.add('aos-in'), delay(el));
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ══ 5. STAT COUNTERS ════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.count;
      const dur    = 1600;
      const start  = performance.now();
      (function tick(now) {
        const p    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();


/* ══ 6. TEXT SCRAMBLE ON SECTION TITLES ════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

function scramble(el) {
  // If it has child elements (gradient spans) just pop it in
  if (el.querySelector('span')) {
    el.style.opacity = '0';
    el.style.transition = 'opacity .5s';
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    return;
  }

  const orig = el.textContent;
  let iter   = 0;
  const total = orig.length * 2.2;

  const interval = setInterval(() => {
    el.textContent = orig.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i < Math.floor(iter / 2.2)) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');

    if (++iter >= total) {
      el.textContent = orig;
      clearInterval(interval);
    }
  }, 28);
}

(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      scramble(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.sec-title').forEach(el => io.observe(el));
})();


/* ══ 7. TYPING HERO WORD ════════════════════════════════════ */
/* (hero h1 uses CSS slide-up animation — no JS typing needed)  */


/* ══ 8. APP SCREEN SWITCHER ═════════════════════════════════ */
(function initTabs() {
  const tabs   = document.querySelectorAll('.stab');
  const labels = {
    login:     'InvenSy · Login Screen',
    dashboard: 'InvenSy · Dashboard',
    data:      'InvenSy · View Data — Library_Books',
    export:    'InvenSy · Export Data',
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.screen;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.screen-pane').forEach(p => {
        p.classList.remove('active');
        p.style.position = 'absolute';
      });

      const target = document.getElementById('screen-' + id);
      if (target) {
        target.style.position = 'relative';
        target.classList.add('active');
      }

      const lbl = document.getElementById('screenLabel');
      if (lbl) lbl.textContent = labels[id] || '';
    });
  });
})();


/* ══ 9. MINI DASHBOARD CHARTS (Canvas) ══════════════════════ */
(function initCharts() {
  /* ─ Donut ─ */
  function drawDonut(canvas) {
    const ctx = canvas.getContext('2d');
    const cx = 50, cy = 50, r = 36, sw = 14;
    const segs = [
      { v: 142, c: '#00ffaa' },
      { v: 28,  c: '#ffaa00' },
      { v: 18,  c: '#00aaff' },
    ];
    const total = segs.reduce((s, x) => s + x.v, 0);
    let a = -Math.PI / 2;

    // bg ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,255,170,0.07)';
    ctx.lineWidth = sw;
    ctx.stroke();

    let prog = 0;
    const dur = 1200;
    const start = performance.now();

    function draw(now) {
      prog = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      ctx.clearRect(0, 0, 100, 100);

      // bg
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,255,170,0.07)';
      ctx.lineWidth = sw;
      ctx.stroke();

      let aa = -Math.PI / 2;
      segs.forEach(seg => {
        const slice = (seg.v / total) * Math.PI * 2 * ease;
        ctx.beginPath();
        ctx.arc(cx, cy, r, aa, aa + slice);
        ctx.strokeStyle = seg.c;
        ctx.lineWidth = sw;
        ctx.lineCap = 'butt';
        ctx.shadowColor = seg.c;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
        aa += slice;
      });

      // center text
      ctx.fillStyle = '#00ffaa';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('188', cx, cy - 5);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px Inter';
      ctx.fillText('total', cx, cy + 8);

      if (prog < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ─ Bar ─ */
  function drawBar(canvas) {
    const ctx  = canvas.getContext('2d');
    const bW   = 140, bH = 100;
    const data = [
      { l: 'Lib A', v: 72, c: '#00ffaa' },
      { l: 'Lib B', v: 45, c: '#00cc88' },
      { l: 'Office', v: 25, c: '#00ddff' },
    ];
    const maxV = Math.max(...data.map(d => d.v));
    const barW = 28, gap = (bW - data.length * barW) / (data.length + 1);

    const start = performance.now();
    const dur   = 1000;

    function draw(now) {
      const prog = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      ctx.clearRect(0, 0, bW, bH);

      data.forEach((d, i) => {
        const x = gap + i * (barW + gap);
        const h = ((d.v / maxV) * (bH - 28)) * ease;
        const y = bH - 18 - h;

        ctx.shadowColor = d.c;
        ctx.shadowBlur  = 8;
        const grad = ctx.createLinearGradient(0, y, 0, bH - 18);
        grad.addColorStop(0, d.c);
        grad.addColorStop(1, d.c + '44');
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, barW, h, [3, 3, 0, 0]);
        else ctx.rect(x, y, barW, h);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '8px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(d.l, x + barW / 2, bH - 5);
      });

      if (prog < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // Only draw when dashboard pane becomes visible
  let donutDone = false;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || donutDone) return;
      donutDone = true;
      const donut = document.getElementById('miniDonut');
      const bar   = document.getElementById('miniBar');
      if (donut) drawDonut(donut);
      if (bar)   drawBar(bar);
    });
  }, { threshold: 0.3 });

  const dash = document.getElementById('screen-dashboard');
  if (dash) io.observe(dash);

  // Also trigger when tab is clicked
  document.querySelectorAll('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.screen === 'dashboard' && !donutDone) {
        donutDone = true;
        setTimeout(() => {
          const donut = document.getElementById('miniDonut');
          const bar   = document.getElementById('miniBar');
          if (donut) drawDonut(donut);
          if (bar)   drawBar(bar);
        }, 100);
      }
    });
  });
})();


/* ══ 10. FEATURE CARD MAGNETIC HOVER ════════════════════════ */
(function() {
  document.querySelectorAll('.feat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
    });
  });
})();


/* ══ 11. TEAM CARD GLINT EFFECT ═════════════════════════════ */
(function() {
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(0,255,170,.1) 0%, rgba(8,20,16,.82) 60%)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ══ 12. SMOOTH ANCHOR SCROLL ════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


/* ══ 13. PARALLAX ON UCC PHOTO ═══════════════════════════════ */
(function() {
  const band  = document.querySelector('.ucc-photo-band');
  const photo = document.querySelector('.ucc-photo');
  if (!band || !photo) return;
  window.addEventListener('scroll', () => {
    const rect = band.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    photo.style.transform = `translateY(${(progress - 0.5) * -40}px)`;
  }, { passive: true });
})();


/* ══ 14. STAGGER FEAT CARDS ON SCROLL ═══════════════════════ */
/* Handled by AOS data-aos-delay attributes */


/* ══ 15. MARQUEE PAUSE ON HOVER ════════════════════════════ */
(function() {
  const track = document.querySelector('.mq-track');
  if (!track) return;
  const strip = document.querySelector('.marquee-strip');
  if (!strip) return;
  strip.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  strip.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
})();


/* ══ 16. NAV ACTIVE LINK HIGHLIGHT ON SCROLL ════════════════ */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) cur = s.id;
    });
    navAs.forEach(a => {
      const match = a.getAttribute('href') === '#' + cur;
      a.style.color = match ? 'var(--g)' : '';
    });
  }, { passive: true });
})();
