"use client";

import { useEffect, useRef } from "react";

export function BottomScribble() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const W = window.innerWidth;
        const H = 160;
        canvas.width = W;
        canvas.height = H;

        const ctx = canvas.getContext("2d")!;
        const r = Math.random;

        const STEPS = 280;
        const pts: { x: number; y: number }[] = [];

        let jitterY = 0;

        for (let i = 0; i <= STEPS; i++) {
            const t = i / STEPS;
            const x = t * W;

            const base = Math.sin(t * Math.PI) * (H * 0.82);

            if (r() < 0.08) {
                jitterY += (r() - 0.5) * 48;
            } else {
                jitterY += (r() - 0.5) * 10;
            }
            jitterY *= 0.82;

            const y = H * 0.05 + base + jitterY;

            pts.push({ x, y });
        }

        pts[0] = { x: 0, y: 0 };
        pts[STEPS] = { x: W, y: 0 };

        ctx.strokeStyle = "rgba(0,255,255,0.55)";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        let i = 1;
        let rafId: number;
        const draw = () => {
            const end = Math.min(i + 2, pts.length - 1);
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
                display: "block",
                width: "100%",
                height: "160px",
                pointerEvents: "none",
            }}
        />
    );
}
