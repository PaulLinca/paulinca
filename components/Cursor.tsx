"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export function Cursor() {
    const mx = useMotionValue(-100);
    const my = useMotionValue(-100);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mx.set(e.clientX);
            my.set(e.clientY);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [mx, my]);

    return (
        <motion.div
            style={{
                position: "fixed",
                left: mx,
                top: my,
                x: "-50%",
                y: "-50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1a1a1a",
                pointerEvents: "none",
                zIndex: 10000,
            }}
        />
    );
}
