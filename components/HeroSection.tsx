"use client";

import { motion } from "framer-motion";
import type { Project } from "@/types";
import { projects } from "@/data/projects";
import { BackgroundScribble } from "@/components/BackgroundScribble";
import { Identity } from "@/components/Identity";
import { ProjectNode } from "@/components/ProjectNode";

const SUNSET_LAMP_STYLE: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -60%)",
    width: "55vmin",
    height: "55vmin",
    borderRadius: "50%",
    background: `radial-gradient(circle,
        rgba(210,50,20,0.55) 0%,
        rgba(240,90,10,0.45) 25%,
        rgba(255,150,0,0.35) 50%,
        rgba(255,210,0,0.2) 70%,
        transparent 85%
    )`,
    pointerEvents: "none",
    zIndex: 0,
};

export function HeroSection({
    scribbleKey,
    onHoverIn,
    onHoverOut,
    onAppClick,
    onScribbleReload,
}: {
    scribbleKey: number;
    onHoverIn: (p: Project) => void;
    onHoverOut: () => void;
    onAppClick: (id: string) => void;
    onScribbleReload: () => void;
}) {
    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
            <BackgroundScribble key={scribbleKey} />

            {/* Reload scribble button */}
            <div
                style={{ position: "absolute", top: 20, right: 20, zIndex: 10001, display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => {
                    (e.currentTarget.querySelector("button") as HTMLElement).style.opacity = "0.8";
                    (e.currentTarget.querySelector("span") as HTMLElement).style.opacity = "1";
                }}
                onMouseLeave={e => {
                    (e.currentTarget.querySelector("button") as HTMLElement).style.opacity = "0.35";
                    (e.currentTarget.querySelector("span") as HTMLElement).style.opacity = "0";
                }}
            >
                <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "9px",
                    fontWeight: 300,
                    letterSpacing: "0.14em",
                    color: "#1a1a1a",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                }}>
                    scribble
                </span>
                <button
                    onClick={onScribbleReload}
                    style={{
                        width: 32,
                        height: 32,
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "none",
                        opacity: 0.35,
                        transition: "opacity 0.2s ease",
                        flexShrink: 0,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/reload.png"
                        alt="Reload scribble"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            filter: "invert(45%) sepia(80%) saturate(600%) hue-rotate(340deg) brightness(1.1)",
                        }}
                    />
                </button>
            </div>

            {/* Sunset lamp */}
            <div style={SUNSET_LAMP_STYLE} />

            <Identity />

            {projects.map((p, i) => (
                <ProjectNode
                    key={p.id}
                    p={p}
                    index={i}
                    onHoverIn={() => onHoverIn(p)}
                    onHoverOut={onHoverOut}
                    onAppClick={() => onAppClick(p.id)}
                />
            ))}

            {/* Scroll hint */}
            <motion.div
                style={{
                    position: "absolute",
                    bottom: 28,
                    left: "50%",
                    x: "-50%",
                    zIndex: 5,
                    pointerEvents: "none",
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 0.35, y: [0, 6, 0] }}
                transition={{
                    opacity: { delay: 3, duration: 1.5, ease: "easeOut" },
                    y: { delay: 3, duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/scroll.png" alt="scroll" style={{ width: 28, height: "auto", display: "block" }} />
            </motion.div>
        </div>
    );
}
