"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { AppProject } from "@/types";
import { appProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { PanelRenderer } from "@/components/PanelRenderer";

export function ProjectsSection({ sectionRef, lockedProject, setLockedProject }: {
    sectionRef: React.RefObject<HTMLElement | null>;
    lockedProject: AppProject | null;
    setLockedProject: React.Dispatch<React.SetStateAction<AppProject | null>>;
}) {
    const [hoveredProject, setHoveredProject] = useState<AppProject | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const displayedProject = lockedProject ?? hoveredProject;

    useEffect(() => {
        if (!lockedProject) return;
        if (isMobile) {
            const el = document.querySelector(`[data-project-id="${lockedProject.id}"]`);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            sectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [lockedProject?.id]);

    function handleClick(p: AppProject) {
        setLockedProject(prev => prev?.id === p.id ? null : p);
    }

    if (isMobile) {
        return (
            <section ref={sectionRef} style={{
                padding: "60px 0 32px",
                background: "#ffffff",
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/personal_projects.png"
                    alt="Personal Projects"
                    style={{ display: "block", margin: "0 auto 28px", height: "auto", width: "140px" }}
                />

                <div style={{ padding: "0 16px" }}>
                    {appProjects.map(p => {
                        const isActive = lockedProject?.id === p.id;
                        return (
                            <div key={p.id} data-project-id={p.id}>
                                <ProjectCard
                                    project={p}
                                    isActive={isActive}
                                    isLocked={isActive}
                                    onHover={() => {}}
                                    onLeave={() => {}}
                                    onClick={() => handleClick(p)}
                                />
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            key="inline-panel"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ overflow: "hidden", marginBottom: "10px" }}
                                        >
                                            <div style={{ padding: "16px 12px 20px", display: "flex", flexDirection: "column", gap: "28px" }}>
                                                {p.leftPanel && (
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        <div style={{ zoom: 0.72, display: "inline-flex" }}>
                                                            <PanelRenderer blocks={p.leftPanel} align="left" mobile />
                                                        </div>
                                                    </div>
                                                )}
                                                {p.rightPanel && (
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        <div style={{ zoom: 0.72, display: "inline-flex" }}>
                                                            <PanelRenderer blocks={p.rightPanel} align="right" mobile />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} style={{
            position: "relative",
            padding: "100px 0 32px",
            background: "#ffffff",
        }}>
            {/* Left panel — absolutely fills section height, inner div sticky-centers in viewport */}
            <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                right: "calc(50% + 210px)",
                pointerEvents: "none",
            }}>
                <div style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "4vw",
                    pointerEvents: "auto",
                }}>
                    <AnimatePresence mode="wait">
                        {displayedProject?.leftPanel && (
                            <PanelRenderer
                                key={displayedProject.id + "-left"}
                                blocks={displayedProject.leftPanel}
                                align="left"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Center — cards, determines section height */}
            <div style={{
                width: "420px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/personal_projects.png"
                    alt="Personal Projects"
                    style={{ marginBottom: "28px", alignSelf: "center", height: "auto", width: "160px" }}
                />

                <div style={{ width: "100%" }}>
                    {appProjects.map(p => (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            isActive={displayedProject?.id === p.id}
                            isLocked={lockedProject?.id === p.id}
                            onHover={() => { if (!lockedProject) setHoveredProject(p); }}
                            onLeave={() => { if (!lockedProject) setHoveredProject(null); }}
                            onClick={() => handleClick(p)}
                        />
                    ))}
                </div>
            </div>

            {/* Right panel — absolutely fills section height, inner div sticky-centers in viewport */}
            <div style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                left: "calc(50% + 210px)",
                pointerEvents: "none",
            }}>
                <div style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: "4vw",
                    pointerEvents: "auto",
                }}>
                    <AnimatePresence mode="wait">
                        {displayedProject?.rightPanel && (
                            <PanelRenderer
                                key={displayedProject.id + "-right"}
                                blocks={displayedProject.rightPanel}
                                align="right"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
