"use client";

import { useEffect, useRef } from "react";

export function BackgroundScribble() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d")!;

        const W = canvas.width;
        const H = canvas.height;
        const r = Math.random;

        let x = W * (0.25 + r() * 0.5);
        let y = H * (0.25 + r() * 0.5);
        let angle = r() * Math.PI * 2;
        let speed = 18 + r() * 25;
        const pts: { x: number; y: number }[] = [{ x, y }];
        const steps = 120 + Math.floor(r() * 80);

        for (let i = 0; i < steps; i++) {
            if (r() < 0.05) {
                angle += (r() - 0.5) * Math.PI * 2;
            } else {
                angle += (r() - 0.5) * 0.5;
            }
            speed = Math.max(10, Math.min(45, speed + (r() - 0.5) * 12));
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;
            x = Math.max(W * 0.05, Math.min(W * 0.95, x));
            y = Math.max(H * 0.05, Math.min(H * 0.95, y));
            pts.push({ x, y });
        }

        ctx.strokeStyle = "rgba(0,255,255,0.55)";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        let i = 1;
        const POINTS_PER_FRAME = 1;

        let rafId: number;
        const draw = () => {
            const end = Math.min(i + POINTS_PER_FRAME, pts.length - 1);
            for (; i < end; i++) {
                const prev = pts[i - 1];
                const curr = pts[i];
                const next = pts[i + 1] ?? curr;
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
                ctx.stroke();
            }
            if (i < pts.length - 1) rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
