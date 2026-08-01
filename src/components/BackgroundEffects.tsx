import React, { useEffect, useRef } from 'react';

export const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle class for drifting gold dust
    interface Particle {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speedY: number;
      speedX: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: Math.sin(Math.random() * Math.PI) * 0.2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft ambient radial glow in top center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.15,
        20,
        width / 2,
        height * 0.15,
        width * 0.6
      );
      gradient.addColorStop(0, 'rgba(201, 163, 93, 0.06)');
      gradient.addColorStop(0.5, 'rgba(13, 40, 24, 0.15)');
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw drifting particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.2;
        p.alpha += Math.sin(p.y * 0.05) * p.pulseSpeed;

        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.6) p.alpha = 0.6;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 163, 93, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(201, 163, 93, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
