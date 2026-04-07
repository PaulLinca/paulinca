"use client";

import {AnimatePresence, motion, useMotionValue, useSpring} from "framer-motion";
import {useEffect, useRef, useState} from "react";

// ─── Sound ────────────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
}

function softClick(freq: number) {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.006, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Project {
    id: string;
    name: string;
    year: string;
    desc: string;
    href: string;
    imageSrc: string;
    w: number;
    h: number;
    dx: string;
    dy: string;
    rotate: number;
    freq: number;
}

const projects: Project[] = [
    {
        id: "vybes",
        name: "vybes",
        year: "2025",
        desc: "share your feelings through music",
        href: "#",
        imageSrc: "/images/headphones.png",
        w: 150,
        h: 150,
        dx: "-30vw",
        dy: "-0vh",
        rotate: -2,
        freq: 523.25,
    },
    {
        id: "kayla",
        name: "Kayla",
        year: "2019",
        desc: "this is my dog",
        href: "#",
        imageSrc: "/images/kayla.png",
        w: 200,
        h: 200,
        dx: "40vw",
        dy: "35vh",
        rotate: -2,
        freq: 524.25,
    },
    {
        id: "tapsleep",
        name: "TapSleep",
        year: "2026",
        desc: "sleep tight",
        href: "#",
        imageSrc: "/images/moon.png",
        w: 250,
        h: 250,
        dx: "-45vw",
        dy: "-40vh",
        rotate: -1,
        freq: 392.0,
    },
    {
        id: "rubberduck",
        name: "Explain Your Bug",
        year: "2026",
        desc: "talk to a duck",
        href: "https://explainyourbugtotherubberduck.com/",
        imageSrc: "/images/rubber_duck_larger.webp",
        w: 135,
        h: 135,
        dx: "-10vw",
        dy: "40vh",
        rotate: 1,
        freq: 440.0,
    },
    {
        id: "me-2",
        name: "me",
        year: "2023",
        desc: "monkeys are neat",
        href: "#",
        imageSrc: "/images/photo2.jpg",
        w: 300,
        h: 135,
        dx: "20vw",
        dy: "-20vh",
        rotate: 1,
        freq: 440.0,
    },
    {
        id: "me-1",
        name: "me",
        year: "2025",
        desc: "i can swim",
        href: "#",
        imageSrc: "/images/photo.jpg",
        w: 300,
        h: 135,
        dx: "30vw",
        dy: "-30vh",
        rotate: 1,
        freq: 440.0,
    },
    {
        id: "plants",
        name: "plant",
        year: "2025",
        desc: "take care of your plants",
        href: "#",
        imageSrc: "/images/monstera.png",
        w: 250,
        h: 250,
        dx: "-42vw",
        dy: "30vh",
        rotate: 1,
        freq: 440.0,
    },
    {
        id: "courtscore",
        name: "Court Score",
        year: "2026",
        desc: "keep track of your score",
        href: "#",
        imageSrc: "/images/padel.webp",
        w: 50,
        h: 110,
        dx: "-30vw",
        dy: "44vh",
        rotate: 1.5,
        freq: 659.25,
    },
];

// ─── Click burst ───────────────────────────────────────────────────────────────

function ClickBurst() {
    const [bursts, setBursts] = useState<{id: number; x: number; y: number}[]>([]);
    const idRef = useRef(0);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const id = idRef.current++;
            setBursts(prev => [...prev, {id, x: e.clientX, y: e.clientY}]);
            setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 700);
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, []);

    return (
        <>
            {bursts.flatMap(burst =>
                Array.from({length: 8}, (_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
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
                            initial={{x: 0, y: 0, opacity: 0.55, scaleX: 0.3}}
                            animate={{
                                x: Math.cos(angle) * 30,
                                y: Math.sin(angle) * 30,
                                opacity: 0,
                                scaleX: 1,
                            }}
                            transition={{duration: 0.55, ease: "easeOut"}}
                        />
                    );
                })
            )}
        </>
    );
}

// ─── Cursor trail ──────────────────────────────────────────────────────────────

const CHAIN_LEN = 12;

function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({x: -300, y: -300});
    const chain = useRef(Array.from({length: CHAIN_LEN}, () => ({x: -300, y: -300})));
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e: MouseEvent) => {
            mouse.current = {x: e.clientX, y: e.clientY};
        };
        window.addEventListener("mousemove", onMove);

        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spring chain: each node chases the previous
            const pts = chain.current;
            const ease = 0.45;
            pts[0].x += (mouse.current.x - pts[0].x) * ease;
            pts[0].y += (mouse.current.y - pts[0].y) * ease;
            for (let i = 1; i < CHAIN_LEN; i++) {
                pts[i].x += (pts[i - 1].x - pts[i].x) * ease;
                pts[i].y += (pts[i - 1].y - pts[i].y) * ease;
            }

            // Smooth quadratic bezier through the chain
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < CHAIN_LEN - 1; i++) {
                const mx = (pts[i].x + pts[i + 1].x) / 2;
                const my = (pts[i].y + pts[i + 1].y) / 2;
                ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
            }

            // Gradient: opaque at head, transparent at tail
            try {
                const grad = ctx.createLinearGradient(
                    pts[0].x, pts[0].y,
                    pts[CHAIN_LEN - 1].x, pts[CHAIN_LEN - 1].y,
                );
                grad.addColorStop(0, "rgba(26,26,26,0.45)");
                grad.addColorStop(1, "rgba(26,26,26,0)");
                ctx.strokeStyle = grad;
            } catch {
                ctx.strokeStyle = "rgba(26,26,26,0.3)";
            }
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9998,
            }}
        />
    );
}

// ─── Custom cursor ─────────────────────────────────────────────────────────────

function Cursor() {
    const mx = useMotionValue(-100);
    const my = useMotionValue(-100);
    const sx = useSpring(mx, {damping: 28, stiffness: 350, mass: 0.4});
    const sy = useSpring(my, {damping: 28, stiffness: 350, mass: 0.4});

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

// ─── Cursor tooltip ────────────────────────────────────────────────────────────

function CursorTooltip({project}: { project: Project | null }) {
    const mx = useMotionValue(-200);
    const my = useMotionValue(-200);
    const sx = useSpring(mx, {damping: 28, stiffness: 350, mass: 0.4});
    const sy = useSpring(my, {damping: 28, stiffness: 350, mass: 0.4});

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
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.25, ease: "easeOut"}}
                        style={{whiteSpace: "nowrap"}}
                    >
                        <span style={{
                            display: "block",
                            fontFamily: "var(--font-sans)",
                            fontSize: "10px",
                            fontWeight: 300,
                            color: "#555",
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

// ─── Project node ──────────────────────────────────────────────────────────────

function ProjectNode({p, index, onHoverIn, onHoverOut}: {
    p: Project;
    index: number;
    onHoverIn: () => void;
    onHoverOut: () => void;
}) {
    const [active, setActive] = useState(false);
    const throttle = useRef(false);
    const isExternal = p.href.startsWith("http");

    function onEnter() {
        setActive(true);
        onHoverIn();
        if (!throttle.current) {
            throttle.current = true;
            softClick(p.freq);
            setTimeout(() => {
                throttle.current = false;
            }, 800);
        }
    }

    function onLeave() {
        setActive(false);
        onHoverOut();
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
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.6 + index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
            whileDrag={{zIndex: 20}}
            onHoverStart={onEnter}
            onHoverEnd={onLeave}
        >
            <a
                href={p.href}
                target={isExternal ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => p.href === "#" && e.preventDefault()}
                style={{display: "block"}}
            >
                <motion.div
                    animate={{rotate: active ? 0 : p.rotate}}
                    transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
                    style={{display: "inline-block"}}
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

// ─── Identity ──────────────────────────────────────────────────────────────────

function Identity() {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
                textAlign: "center",
                zIndex: 5,
            }}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.1, duration: 1.8, ease: [0.16, 1, 0.3, 1]}}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <h1
                style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontWeight: 500,
                    fontSize: "clamp(28px, 3.2vw, 52px)",
                    color: "#1a1a1a",
                    letterSpacing: "0.01em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                }}
            >
                PAUL LINCA
            </h1>

            {/* Tagline / email */}
            <AnimatePresence mode="wait">
                {hovered ? (
                    <motion.a
                        key="email"
                        href="mailto:paultudorlinca@gmail.com"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                        style={{
                            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                            fontSize: "12px",
                            fontWeight: 300,
                            color: "#1a1a1a",
                            letterSpacing: "0.16em",
                            display: "block",
                        }}
                    >
                        paultudorlinca@gmail.com
                    </motion.a>
                ) : (
                    <motion.span
                        key="tag"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                        style={{
                            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                            fontSize: "12px",
                            fontWeight: 300,
                            color: "#1a1a1a",
                            letterSpacing: "0.16em",
                            display: "block",
                        }}
                    >
                        i make apps
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

    useEffect(() => {
        window.addEventListener("pointermove", () => getCtx(), {once: true});
    }, []);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                background: "#efefe0",
            }}
        >
            <ClickBurst/>
            <CursorTrail/>
            <Cursor/>
            <CursorTooltip project={hoveredProject}/>
            <Identity/>
            {projects.map((p, i) => (
                <ProjectNode
                    key={p.id}
                    p={p}
                    index={i}
                    onHoverIn={() => setHoveredProject(p)}
                    onHoverOut={() => setHoveredProject(null)}
                />
            ))}
        </div>
    );
}
