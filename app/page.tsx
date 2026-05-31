"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProject, Project } from "@/types";
import { appProjects } from "@/data/projects";
import { getCtx } from "@/lib/sound";
import { ClickBurst } from "@/components/ClickBurst";
import { Cursor } from "@/components/Cursor";
import { CursorTooltip } from "@/components/CursorTooltip";
import { CursorTrail } from "@/components/CursorTrail";
import { AboutSection } from "@/components/AboutSection";
import { BottomScribble } from "@/components/BottomScribble";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";

export default function Home() {
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
    const [scribbleKey, setScribbleKey] = useState(0);
    const [lockedProject, setLockedProject] = useState<AppProject | null>(null);
    const projectsSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        window.addEventListener("pointerdown", () => getCtx(), { once: true });
    }, []);

    function handleScatterProjectClick(scatterProjectId: string) {
        const appProject = appProjects.find(p => p.id === scatterProjectId);
        if (appProject) {
            setLockedProject(appProject);
        } else {
            projectsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div style={{ width: "100%", background: "#ffffff" }}>
            <ClickBurst />
            <CursorTrail />
            <Cursor />
            <CursorTooltip project={hoveredProject} />

            <HeroSection
                scribbleKey={scribbleKey}
                onHoverIn={setHoveredProject}
                onHoverOut={() => setHoveredProject(null)}
                onAppClick={handleScatterProjectClick}
                onScribbleReload={() => setScribbleKey(k => k + 1)}
            />

            <ProjectsSection
                sectionRef={projectsSectionRef}
                lockedProject={lockedProject}
                setLockedProject={setLockedProject}
            />

            <AboutSection />
            <BottomScribble />
        </div>
    );
}
