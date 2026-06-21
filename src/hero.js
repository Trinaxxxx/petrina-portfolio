export function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, spores, t = 0, vel = 2; // start with a little velocity so it looks alive immediately

  const trail = document.createElement('canvas');
  const tCtx = trail.getContext('2d');

  function setup() {
    W = canvas.width = trail.width = window.innerWidth;
    H = canvas.height = trail.height = window.innerHeight;

    spores = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 2.5,
      big: Math.random() < 0.12,
      vx: 0, vy: 0,
      phase: Math.random() * Math.PI * 2,
      green: Math.random() < 0.75,
    }));
  }

  function noise(x, y, z) {
    return Math.sin(x * 1.4 + z) * Math.cos(y * 0.9 + z * 0.8)
         + Math.sin(x * 0.6 + y * 1.2 + z * 1.1) * 0.5;
  }

  function angle(x, y) {
    return noise(x / 300, y / 220, t * 0.0003) * Math.PI * 2.8;
  }

  function frame() {
    t++;
    vel *= 0.992; // very slow decay so it keeps moving gently

    const speed = 0.5 + vel * 0.06;

    tCtx.fillStyle = 'rgba(11,13,9,0.004)';
    tCtx.fillRect(0, 0, W, H);

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(trail, 0, 0);

    spores.forEach((sp, i) => {
      const a = angle(sp.x, sp.y);
      const wobble = Math.sin(t * 0.012 + sp.phase) * 0.6;
      sp.x += Math.cos(a + wobble) * speed;
      sp.y += Math.sin(a + wobble) * speed;
      if (sp.x < 0) sp.x = W;
      if (sp.x > W) sp.x = 0;
      if (sp.y < 0) sp.y = H;
      if (sp.y > H) sp.y = 0;

      const pulse = 1 + Math.sin(t * 0.02 + sp.phase) * 0.25;
      const r = (sp.big ? sp.r * 1.8 : sp.r) * pulse;

      tCtx.beginPath();
      tCtx.arc(sp.x, sp.y, 0.8, 0, Math.PI * 2);
      tCtx.fillStyle = sp.green
        ? `rgba(100,145,80,${0.12 + vel * 0.004})`
        : `rgba(165,135,70,${0.09 + vel * 0.003})`;
      tCtx.fill();

      const alpha = Math.min(0.55 + vel * 0.012, 0.9);
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2);
      ctx.fillStyle = sp.green
        ? `rgba(138,170,116,${alpha})`
        : `rgba(200,168,106,${alpha * 0.85})`;
      ctx.fill();

      if (sp.big) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, r * 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(138,170,116,${0.08 + vel * 0.003})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let j = i + 1; j < spores.length; j++) {
        const b = spores[j];
        const d = Math.hypot(sp.x - b.x, sp.y - b.y);
        if (d < 130) {
          const a2 = (1 - d / 130) * Math.min(0.05 + vel * 0.003, 0.18);
          const mx = (sp.x + b.x) / 2 + Math.sin(t * 0.005 + i) * 20;
          const my = (sp.y + b.y) / 2 + Math.cos(t * 0.004 + j) * 20;
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y);
          ctx.quadraticCurveTo(mx, my, b.x, b.y);
          ctx.strokeStyle = `rgba(120,160,90,${a2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(frame);
  }

  // Boost velocity on scroll for the reactive feel
  window.addEventListener('scroll', () => {
    vel = Math.min(vel + 3, 60);
  }, { passive: true });

  window.addEventListener('resize', setup);
  setup();
  frame(); // start immediately
}
