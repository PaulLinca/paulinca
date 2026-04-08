"use client";

import { motion } from "framer-motion";
import type { AppProject } from "@/types";
import { LINK_ICONS, LINK_LABELS } from "@/lib/constants";

export function ProjectCard({ project, isActive, isLocked, onHover, onLeave, onClick }: {
    project: AppProject;
    isActive: boolean;
    isLocked: boolean;
    onHover: () => void;
    onLeave: () => void;
    onClick: () => void;
}) {
    return (
        <motion.div
            onHoverStart={onHover}
            onHoverEnd={onLeave}
            onClick={onClick}
            animate={{
                backgroundColor: isActive ? "rgba(26,26,26,0.04)" : "rgba(26,26,26,0)",
                borderColor: isLocked ? "#fa742d" : isActive ? "rgba(26,26,26,0.18)" : "rgba(26,26,26,0.12)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px",
                marginBottom: "10px",
                border: "1px solid rgba(26,26,26,0.12)",
                borderRadius: "14px",
                cursor: "none",
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={project.icon}
                alt={project.name}
                style={{
                    width: "52px",
                    height: "52px",
                    objectFit: "cover",
                    flexShrink: 0,
                    borderRadius: "12px",
                    filter: isActive
                        ? "grayscale(0%) brightness(1)"
                        : "grayscale(20%) brightness(0.95)",
                    transition: "filter 0.4s ease",
                }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    marginBottom: "4px",
                }}>
                    <span style={{
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#111",
                        letterSpacing: "0.01em",
                    }}>
                        {project.name}
                    </span>
                </div>

                <div style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#444",
                    letterSpacing: "0.01em",
                    marginBottom: "14px",
                }}>
                    {project.tagline}
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {project.links.map(link => (
                        <a
                            key={link.type}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            title={LINK_LABELS[link.type]}
                            style={{ display: "inline-flex", cursor: "none" }}
                            onMouseEnter={e => {
                                const img = e.currentTarget.querySelector("img") as HTMLElement;
                                img.style.filter = "brightness(0) saturate(100%) invert(52%) sepia(90%) saturate(600%) hue-rotate(344deg) brightness(1.05)";
                            }}
                            onMouseLeave={e => {
                                const img = e.currentTarget.querySelector("img") as HTMLElement;
                                img.style.filter = "none";
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={LINK_ICONS[link.type]}
                                alt={LINK_LABELS[link.type]}
                                style={{ width: "24px", height: "24px", objectFit: "contain", transition: "filter 0.2s ease" }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
