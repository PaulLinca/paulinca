"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BURST_PARTICLE_COUNT = 8;

export function ClickBurst() {
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const idRef = useRef(0);

    useEffect(() => {
        let downAt = 0;
        let curPos = { x: 0, y: 0 };

        const onDown = () => { downAt = Date.now(); };
        const onMove = (e: MouseEvent) => { curPos = { x: e.clientX, y: e.clientY }; };
        const onUp = () => {
            if (downAt && Date.now() - downAt >= 400) {
                const id = idRef.current++;
                const { x, y } = curPos;
                setBursts(prev => [...prev, { id, x, y }]);
                setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 700);
            }
            downAt = 0;
        };

        window.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    return (
        <>
            {bursts.flatMap(burst =>
                Array.from({ length: BURST_PARTICLE_COUNT }, (_, i) => {
                    const angle = (i / BURST_PARTICLE_COUNT) * Math.PI * 2;
                    return (
                        <motion.div
                            key={`${burst.id}-${i}`}
                            style={{
                                position: "fixed",
                                left: burst.x,
                                top: burst.y,
                                width: 12,
                                height: 1.5,
                                background: "#1a1a1a",
                                pointerEvents: "none",
                                zIndex: 9999,
                                rotate: `${angle * (180 / Math.PI)}deg`,
                            }}
                            initial={{ x: 0, y: 0, opacity: 0.55, scaleX: 0.3 }}
                            animate={{
                                x: Math.cos(angle) * 30,
                                y: Math.sin(angle) * 30,
                                opacity: 0,
                                scaleX: 1,
                            }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                        />
                    );
                })
            )}
        </>
    );
}
