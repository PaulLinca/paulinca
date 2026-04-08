"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import type { Project } from "@/types";

export function CursorTooltip({ project }: { project: Project | null }) {
    const mx = useMotionValue(-200);
    const my = useMotionValue(-200);
    const sx = useSpring(mx, { damping: 28, stiffness: 350, mass: 0.4 });
    const sy = useSpring(my, { damping: 28, stiffness: 350, mass: 0.4 });

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
                left: sx,
                top: sy,
                x: 18,
                y: 14,
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <AnimatePresence>
                {project && (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        <span style={{
                            display: "block",
                            fontFamily: "var(--font-sans)",
                            fontSize: "10px",
                            fontWeight: 300,
                            color: "#fa742d",
                            letterSpacing: "0.12em",
                        }}>
                            {project.desc}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
