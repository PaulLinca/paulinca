"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Project } from "@/types";
import { appProjects } from "@/data/projects";
import { softClick } from "@/lib/sound";

export function ProjectNode({ p, index, onHoverIn, onHoverOut, onAppClick }: {
    p: Project;
    index: number;
    onHoverIn: () => void;
    onHoverOut: () => void;
    onAppClick?: () => void;
}) {
    const [active, setActive] = useState(false);
    const throttle = useRef(false);
    const hasAppProject = appProjects.some(ap => ap.id === p.id);

    function onEnter() {
        setActive(true);
        onHoverIn();
        if (!throttle.current) {
            throttle.current = true;
            softClick(p.freq);
            setTimeout(() => { throttle.current = false; }, 800);
        }
    }

    function onLeave() {
        setActive(false);
        onHoverOut();
    }

    function handleClick(e: React.MouseEvent) {
        if (hasAppProject && onAppClick) {
            e.preventDefault();
            onAppClick();
        } else if (p.href === "#") {
            e.preventDefault();
        }
    }

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            style={{
                position: "absolute",
                left: `calc(50% + ${p.dx})`,
                top: `calc(50% + ${p.dy})`,
                x: "-50%",
                y: "-50%",
                zIndex: active ? 10 : 1,
                cursor: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            whileDrag={{ zIndex: 20 }}
            onHoverStart={onEnter}
            onHoverEnd={onLeave}
        >
            <a
                href={p.href}
                target={!hasAppProject && p.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={handleClick}
                style={{ display: "block" }}
            >
                <motion.div
                    animate={{ rotate: active ? 0 : p.rotate }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: "inline-block" }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={p.imageSrc}
                        alt={p.name}
                        style={{
                            width: `${p.w}px`,
                            height: `${p.h}px`,
                            objectFit: "contain",
                            display: "block",
                            filter: active
                                ? "grayscale(0%) brightness(1)"
                                : "grayscale(22%) brightness(0.96)",
                            transition: "filter 0.5s ease",
                        }}
                    />
                </motion.div>
            </a>
        </motion.div>
    );
}
