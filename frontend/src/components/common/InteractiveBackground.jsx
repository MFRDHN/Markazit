import { useEffect, useRef } from 'react';

// ponytail: was a rAF loop at 60fps running forever, even with the section
// off-screen (5+ instances on Home). Now: IntersectionObserver pauses the
// loop off-screen, rendering is throttled to 30fps, and prefers-reduced-motion
// users get a single static frame.

export default function InteractiveBackground({ className = '', particleCount = 8, color = 'rgba(1, 126, 183, 0.15)', lineColor = 'rgba(1, 126, 183, 0.06)' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = null;
    let visible = false;
    let frame = 0;
    let particles = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    const initParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = (1 - dist2 / 120) * 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    // 30fps: skip odd frames
    const loop = () => {
      if (!visible) return;
      if (frame++ % 2 === 0) draw();
      else animId = requestAnimationFrame(loop);
    };

    resize();
    initParticles();
    draw(); // static frame for reduced-motion / before visible

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduceMotion) animId = requestAnimationFrame(loop);
        else if (!visible && animId) cancelAnimationFrame(animId);
      },
      { rootMargin: '100px' }
    );
    io.observe(canvas);

    window.addEventListener('resize', resize);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [particleCount, color, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
