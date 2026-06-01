import { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  phase: number;
}

export default function NatureParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 35;

    const colors = isDark
      ? ['rgba(139, 195, 74, 0.3)', 'rgba(76, 175, 80, 0.2)', 'rgba(45, 122, 62, 0.15)', 'rgba(3, 169, 244, 0.15)']
      : ['rgba(45, 122, 62, 0.12)', 'rgba(76, 175, 80, 0.1)', 'rgba(139, 195, 74, 0.08)', 'rgba(3, 169, 244, 0.08)'];

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: 2 + Math.random() * 4,
      speedY: -0.3 - Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.1 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    if (!isMobile) canvas.addEventListener('mousemove', handleMouse);

    let time = 0;
    const animate = () => {
      time += 0.016;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        const sineOffset = Math.sin(time * 0.5 + p.phase) * 0.3;
        p.x += p.speedX + sineOffset;
        p.y += p.speedY;
        if (!isMobile) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }
        }
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 1 }} />;
}
