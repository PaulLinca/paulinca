"use client";

import { useEffect, useRef } from "react";

const CHAIN_LEN = 12;

export function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -300, y: -300 });
    const chain = useRef(Array.from({ length: CHAIN_LEN }, () => ({ x: -300, y: -300 })));
    const rafRef = useRef<number>(0);
    const held = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
        const onDown = (e: MouseEvent) => {
            chain.current.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
            mouse.current = { x: e.clientX, y: e.clientY };
            held.current = true;
        };
        const onUp = () => {
            held.current = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);

        const tick = () => {
            if (!held.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const pts = chain.current;
            const ease = 0.45;
            pts[0].x += (mouse.current.x - pts[0].x) * ease;
            pts[0].y += (mouse.current.y - pts[0].y) * ease;
            for (let i = 1; i < CHAIN_LEN; i++) {
                pts[i].x += (pts[i - 1].x - pts[i].x) * ease;
                pts[i].y += (pts[i - 1].y - pts[i].y) * ease;
            }

            ctx.save();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < CHAIN_LEN - 1; i++) {
                const mx = (pts[i].x + pts[i + 1].x) / 2;
                const my = (pts[i].y + pts[i + 1].y) / 2;
                ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
            }

            try {
                const grad = ctx.createLinearGradient(
                    pts[0].x, pts[0].y,
                    pts[CHAIN_LEN - 1].x, pts[CHAIN_LEN - 1].y,
                );
                grad.addColorStop(0, "rgba(255,120,0,0.6)");
                grad.addColorStop(1, "rgba(255,120,0,0)");
                ctx.strokeStyle = grad;
            } catch {
                ctx.strokeStyle = "rgba(255,120,0,0.4)";
            }
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9998,
            }}
        />
    );
}
