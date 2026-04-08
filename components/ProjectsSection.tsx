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
            minHeight: "auto",
            display: "flex",
            alignItems: "flex-start",
            padding: "100px 4vw 32px",
            background: "#ffffff",
        }}>
            {/* Left panel */}
            <div style={{
                flex: 1,
                position: "sticky",
                top: 0,
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
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

            {/* Center — cards */}
            <div style={{
                flex: "0 0 auto",
                width: "420px",
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

            {/* Right panel */}
            <div style={{
                flex: 1,
                position: "sticky",
                top: 0,
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
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
        </section>
    );
}
