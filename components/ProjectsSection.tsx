"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
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

    const displayedProject = lockedProject ?? hoveredProject;

    function handleClick(p: AppProject) {
        setLockedProject(prev => prev?.id === p.id ? null : p);
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
