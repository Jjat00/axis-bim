import { useRef, useEffect, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  originalY: number;
  vx: number;
  vy: number;
}

export default function WaveLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const lines = useRef<Point[][]>([]);
  const rafId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const LINE_COUNT = 30;
  const POINTS_PER_LINE = 120;
  const MOUSE_RADIUS = 150;
  const MOUSE_STRENGTH = 60;
  const DAMPING = 0.85;
  const SPRING = 0.08;

  const initLines = useCallback((width: number, height: number) => {
    const result: Point[][] = [];
    const spacing = height / (LINE_COUNT + 1);

    for (let i = 0; i < LINE_COUNT; i++) {
      const line: Point[] = [];
      const y = spacing * (i + 1);

      for (let j = 0; j <= POINTS_PER_LINE; j++) {
        const x = (j / POINTS_PER_LINE) * width;
        line.push({ x, y, originalY: y, vx: 0, vy: 0 });
      }
      result.push(line);
    }
    return result;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouse.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      lines.current = initLines(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Update physics
      for (const line of lines.current) {
        for (const point of line) {
          const dx = point.x - mx;
          const dy = point.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
            const angle = Math.atan2(dy, dx);
            point.vy += Math.sin(angle) * force * 0.15;
            point.vx += Math.cos(angle) * force * 0.05;
          }

          // Spring back to original position
          point.vy += (point.originalY - point.y) * SPRING;
          point.vx *= DAMPING;
          point.vy *= DAMPING;

          point.y += point.vy;
          // Don't move x, just use vx for slight horizontal wobble in rendering
        }
      }

      // Draw lines
      for (let i = 0; i < lines.current.length; i++) {
        const line = lines.current[i];
        const progress = i / (lines.current.length - 1);

        // Lines closer to center are brighter
        const centerDist = Math.abs(progress - 0.5) * 2;
        const alpha = 0.12 + (1 - centerDist) * 0.15;

        // Cyan tint
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();

        for (let j = 0; j <= POINTS_PER_LINE; j++) {
          const p = line[j];
          const wobbleX = p.x + p.vx * 0.3;

          if (j === 0) {
            ctx.moveTo(wobbleX, p.y);
          } else {
            // Smooth curve through points
            const prev = line[j - 1];
            const cpx = (prev.x + prev.vx * 0.3 + wobbleX) / 2;
            const cpy = (prev.y + p.y) / 2;
            ctx.quadraticCurveTo(prev.x + prev.vx * 0.3, prev.y, cpx, cpy);
          }
        }
        ctx.stroke();
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initLines, handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-40 md:h-56 bg-surface-lowest overflow-hidden cursor-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Gradient edges for seamless blending */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-surface-lowest via-transparent to-surface-lowest" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-surface/80 via-transparent to-surface-lowest/80" />
    </div>
  );
}
