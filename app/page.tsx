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

// ─── Scatter data ─────────────────────────────────────────────────────────────

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
        desc: "share your music",
        href: "https://play.google.com/store/apps/details?id=com.linca.vybes",
        imageSrc: "/images/headphones.png",
        w: 100,
        h: 100,
        dx: "-47vw",
        dy: "-0vh",
        rotate: -2,
        freq: 523.25,
    },
    {
        id: "kayla",
        name: "Kayla",
        year: "2019",
        desc: "this is Kayla",
        href: "#",
        imageSrc: "/images/kayla.png",
        w: 200,
        h: 200,
        dx: "40vw",
        dy: "35vh",
        rotate: -2,
        freq: 329.63,
    },
    {
        id: "tapsleep",
        name: "TapSleep",
        year: "2026",
        desc: "sleep tight",
        href: "https://play.google.com/store/apps/details?id=com.linca.tapsleep.android",
        imageSrc: "/images/moon.png",
        w: 250,
        h: 250,
        dx: "-45vw",
        dy: "-40vh",
        rotate: -1,
        freq: 261.63,
    },
    {
        id: "rubberduck",
        name: "explainyourbugtotherubberduck.com",
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
        id: "me-3",
        name: "me",
        year: "2026",
        desc: "vitamin C",
        href: "#",
        imageSrc: "/images/photo3.png",
        w: 135,
        h: 300,
        dx: "32vw",
        dy: "-5vh",
        rotate: 1,
        freq: 523.25,
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
        dx: "25vw",
        dy: "-20vh",
        rotate: 1,
        freq: 392.0,
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
        dx: "35vw",
        dy: "-30vh",
        rotate: 1,
        freq: 587.33,
    },
    {
        id: "plant",
        name: "plant",
        year: "2025",
        desc: "take care of your plants",
        href: "https://chromewebstore.google.com/detail/plant-focus-buddy/jaeepnifniockiaomhgnbldfeoilmigc?authuser=0&hl=en-GB",
        imageSrc: "/images/monstera.png",
        w: 250,
        h: 250,
        dx: "-42vw",
        dy: "30vh",
        rotate: 1,
        freq: 349.23,
    },
    {
        id: "courtscore",
        name: "Court Score",
        year: "2026",
        desc: "track your score",
        href: "https://play.google.com/store/apps/details?id=com.linca.courtscorewear",
        imageSrc: "/images/padel.webp",
        w: 50,
        h: 110,
        dx: "-30vw",
        dy: "44vh",
        rotate: 1.5,
        freq: 659.25,
    },
];

// ─── App projects data ─────────────────────────────────────────────────────────

type LinkType = "github" | "playstore" | "appstore" | "chrome" | "web";

interface ProjectLink {
    type: LinkType;
    url: string;
}

// Panel block types — add more kinds here as needed
type PanelBlock =
    | { kind: "text"; value: string; variant?: "heading" | "subheading" | "body" | "caption" | "label" }
    | { kind: "image"; src: string; alt?: string; width?: number; borderRadius?: number }
    | { kind: "phone-screenshots"; images: { src: string; alt?: string; rounded?: boolean; circle?: boolean }[]; layout?: "fan" | "ladder" | "phone-fan" | "scatter" }
    | { kind: "quack-scatter" }
    | { kind: "plant-newtab" };

interface AppProject {
    id: string;
    name: string;
    year: string;
    tagline: string;
    icon: string;
    links: ProjectLink[];
    leftPanel?: PanelBlock[];
    rightPanel?: PanelBlock[];
}

const LINK_ICONS: Record<LinkType, string> = {
    github: "/images/web_site.png",
    playstore: "/images/play_store.png",
    appstore: "/images/app_store.png",
    chrome: "/images/web_store.png",
    web: "/images/web_site.png",
};

const LINK_LABELS: Record<LinkType, string> = {
    github: "GitHub",
    playstore: "Play Store",
    appstore: "App Store",
    chrome: "Chrome Web Store",
    web: "Web",
};

const appProjects: AppProject[] = [
    {
        id: "vybes",
        name: "vybes",
        year: "2025",
        tagline: "share your music",
        icon: "/images/vybes_icon.png",
        links: [
            {type: "playstore", url: "https://play.google.com/store/apps/details?id=com.linca.vybes"},
        ],
        leftPanel: [
            {
                kind: "phone-screenshots", images: [
                    {src: "/images/vybes_profile.png", alt: "vybes profile"},
                    {src: "/images/vybes_albums.png", alt: "vybes albums"},
                    {src: "/images/vybes_songs.png", alt: "vybes songs"},
                ]
            },
        ],
        rightPanel: [
            {kind: "text", value: "vybes", variant: "heading"},
            {kind: "text", value: "2025", variant: "label"},
            {kind: "text", value: "A social music sharing app. Share songs, review albums, participate in polls, and discover music through the people you know.", variant: "body"},
        ],
    },
    {
        id: "courtscore",
        name: "Court Score",
        year: "2026",
        tagline: "track your score",
        icon: "/images/courtscore_icon.png",
        links: [
            {type: "playstore", url: "https://play.google.com/store/apps/details?id=com.linca.courtscorewear"},
            {type: "appstore", url: "https://apps.apple.com/us/app/court-score-padel-scoreboard/id6759218272"},
        ],
        rightPanel: [
            {kind: "phone-screenshots", layout: "scatter", images: [
                {src: "/images/courtscore_android_match.png", alt: "android match", circle: true},
                    {src: "/images/courtscore_android_settings.png", alt: "android settings", circle: true},
                    {src: "/images/courtscore_android_scheme.png", alt: "android scheme", circle: true},
                {src: "/images/courtscore_apple_match.png", alt: "apple match", rounded: true},
                {src: "/images/courtscore_apple_new.png", alt: "apple new", rounded: true},
                {src: "/images/courtscore_apple_set.png", alt: "apple set", rounded: true},
            ]},
        ],
        leftPanel: [
            {kind: "text", value: "Court Score", variant: "heading"},
            {kind: "text", value: "2026", variant: "label"},
            {kind: "text", value: "A smartwatch app for tracking padel scores right from your wrist. No phone needed.", variant: "body"},
        ],
    },
    {
        id: "tapsleep",
        name: "TapSleep",
        year: "2026",
        tagline: "sleep tight",
        icon: "/images/tapsleep_icon.png",
        links: [
            {type: "playstore", url: "https://play.google.com/store/apps/details?id=com.linca.tapsleep.android"},
            {type: "appstore", url: "https://apps.apple.com/us/app/tapsleep/id6760365138"},
        ],
        leftPanel: [
            {kind: "phone-screenshots", layout: "phone-fan", images: [
                {src: "/images/tapsleep_blending.png", alt: "blending"},
                {src: "/images/tapsleep_main.png", alt: "main"},
                {src: "/images/tapsleep_player.png", alt: "player"},
            ]},
        ],
        rightPanel: [
            {kind: "text", value: "TapSleep", variant: "heading"},
            {kind: "text", value: "2026", variant: "label"},
            {kind: "text", value: "A gentle sleep companion. Pick one or blend up to three to help you sleep.", variant: "body"},
        ],
    },
    {
        id: "plant",
        name: "Plant Focus Buddy",
        year: "2025",
        tagline: "take care of your plants",
        icon: "/images/plantfocusbuddy_icon.png",
        links: [
            {type: "chrome", url: "https://chromewebstore.google.com/detail/plant-focus-buddy/jaeepnifniockiaomhgnbldfeoilmigc?authuser=0&hl=en-GB"},
        ],
        rightPanel: [
            {kind: "plant-newtab"},
        ],
        leftPanel: [
            {kind: "text", value: "Plant Focus Buddy", variant: "heading"},
            {kind: "text", value: "2025", variant: "label"},
            {kind: "text", value: "A browser extension that gamifies focus time by letting you grow a digital plant. Stay focused, keep your plant alive.", variant: "body"},
        ],
    },
    {
        id: "rubberduck",
        name: "explainyourbugtotherubberduck.com",
        year: "2026",
        tagline: "talk to a duck",
        icon: "/images/rubberduck_icon.jpg",
        links: [
            {type: "web", url: "https://explainyourbugtotherubberduck.com/"},
        ],
        leftPanel: [
            {kind: "quack-scatter"},
        ],
        rightPanel: [
            {kind: "text", value: "Talk to a duck", variant: "heading"},
            {kind: "text", value: "2026", variant: "label"},
            {kind: "text", value: "Rubber duck debugging. Solve your problems yourself, the duck only listens", variant: "body"},
        ],
    },
];

// ─── Background scribble ───────────────────────────────────────────────────────

function BackgroundScribble() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d")!;

        const W = canvas.width;
        const H = canvas.height;
        const r = Math.random;

        let x = W * (0.25 + r() * 0.5);
        let y = H * (0.25 + r() * 0.5);
        let angle = r() * Math.PI * 2;
        let speed = 18 + r() * 25;
        const pts: { x: number; y: number }[] = [{x, y}];
        const steps = 120 + Math.floor(r() * 80);

        for (let i = 0; i < steps; i++) {
            if (r() < 0.05) {
                angle += (r() - 0.5) * Math.PI * 2;
            } else {
                angle += (r() - 0.5) * 0.5;
            }
            speed = Math.max(10, Math.min(45, speed + (r() - 0.5) * 12));
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;
            x = Math.max(W * 0.05, Math.min(W * 0.95, x));
            y = Math.max(H * 0.05, Math.min(H * 0.95, y));
            pts.push({x, y});
        }

        ctx.strokeStyle = "rgba(0,255,255,0.55)";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        let i = 1;
        const POINTS_PER_FRAME = 1;

        let rafId: number;
        const draw = () => {
            const end = Math.min(i + POINTS_PER_FRAME, pts.length - 1);
            for (; i < end; i++) {
                const prev = pts[i - 1];
                const curr = pts[i];
                const next = pts[i + 1] ?? curr;
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
                ctx.stroke();
            }
            if (i < pts.length - 1) rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}

// ─── Click burst ───────────────────────────────────────────────────────────────

function ClickBurst() {
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const idRef = useRef(0);

    useEffect(() => {
        let downAt = 0;
        let curPos = {x: 0, y: 0};

        const onDown = () => {
            downAt = Date.now();
        };
        const onMove = (e: MouseEvent) => {
            curPos = {x: e.clientX, y: e.clientY};
        };
        const onUp = () => {
            if (downAt && Date.now() - downAt >= 400) {
                const id = idRef.current++;
                const {x, y} = curPos;
                setBursts(prev => [...prev, {id, x, y}]);
                setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 700);
            }
            downAt = 0;
        };

        window.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
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
    const held = useRef(false);

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
        const onDown = (e: MouseEvent) => {
            chain.current.forEach(p => {
                p.x = e.clientX;
                p.y = e.clientY;
            });
            mouse.current = {x: e.clientX, y: e.clientY};
            held.current = true;
        };
        const onUp = () => {
            held.current = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);

        const tick = () => {
            if (!held.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const pts = chain.current;
            const ease = 0.45;
            pts[0].x += (mouse.current.x - pts[0].x) * ease;
            pts[0].y += (mouse.current.y - pts[0].y) * ease;
            for (let i = 1; i < CHAIN_LEN; i++) {
                pts[i].x += (pts[i - 1].x - pts[i].x) * ease;
                pts[i].y += (pts[i - 1].y - pts[i].y) * ease;
            }

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

            try {
                const grad = ctx.createLinearGradient(
                    pts[0].x, pts[0].y,
                    pts[CHAIN_LEN - 1].x, pts[CHAIN_LEN - 1].y,
                );
                grad.addColorStop(0, "rgba(255,120,0,0.6)");
                grad.addColorStop(1, "rgba(255,120,0,0)");
                ctx.strokeStyle = grad;
            } catch {
                ctx.strokeStyle = "rgba(255,120,0,0.4)";
            }
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
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

// ─── Project node (scatter) ────────────────────────────────────────────────────

function ProjectNode({p, index, onHoverIn, onHoverOut, onAppClick}: {
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
            setTimeout(() => {
                throttle.current = false;
            }, 800);
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
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.6 + index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
            whileDrag={{zIndex: 20}}
            onHoverStart={onEnter}
            onHoverEnd={onLeave}
        >
            <a
                href={p.href}
                target={!hasAppProject && p.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={handleClick}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/images/paullinca.png"
                alt="PAUL LINCA"
                style={{
                    height: "clamp(28px, 3.2vw, 52px)",
                    width: "auto",
                    display: "block",
                    margin: "0 auto 18px",
                }}
            />

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

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({project, isActive, isLocked, onHover, onLeave, onClick}: {
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
            transition={{duration: 0.3, ease: "easeOut"}}
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
            {/* Icon */}
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

            <div style={{flex: 1, minWidth: 0}}>
                {/* Name + year */}
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
                    {/*<span style={{*/}
                    {/*    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',*/}
                    {/*    fontSize: "10px",*/}
                    {/*    fontWeight: 400,*/}
                    {/*    color: "#fa742d",*/}
                    {/*    letterSpacing: "0.10em",*/}
                    {/*}}>*/}
                    {/*    {project.year}*/}
                    {/*</span>*/}
                </div>

                {/* Tagline */}
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

                {/* Links */}
                <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                    {project.links.map(link => (
                        <a
                            key={link.type}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            title={LINK_LABELS[link.type]}
                            style={{display: "inline-flex", cursor: "none"}}
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
                                style={{width: "24px", height: "24px", objectFit: "contain", transition: "filter 0.2s ease"}}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Panel renderer ────────────────────────────────────────────────────────────

const PANEL_TEXT_STYLES: Record<NonNullable<Extract<PanelBlock, { kind: "text" }>["variant"]>, React.CSSProperties> = {
    heading: {
        fontSize: "clamp(28px, 3.5vw, 48px)",
        fontWeight: 300,
        color: "#1a1a1a",
        letterSpacing: "-0.01em",
        lineHeight: 1,
        marginBottom: "6px",
    },
    subheading: {
        fontSize: "18px",
        fontWeight: 400,
        color: "#1a1a1a",
        letterSpacing: "0.01em",
        lineHeight: 1.2,
        marginBottom: "4px",
    },
    body: {
        fontSize: "13px",
        fontWeight: 300,
        color: "#444",
        letterSpacing: "0.02em",
        lineHeight: 1.75,
        maxWidth: "320px",
    },
    caption: {
        fontSize: "11px",
        fontWeight: 300,
        color: "#888",
        letterSpacing: "0.06em",
        lineHeight: 1.5,
    },
    label: {
        fontSize: "9px",
        fontWeight: 300,
        color: "#fa742d",
        letterSpacing: "0.22em",
        marginBottom: "20px",
    },
};

function PanelRenderer({blocks, align}: { blocks: PanelBlock[]; align: "left" | "right" }) {
    return (
        <motion.div
            initial={{opacity: 0, x: align === "left" ? -12 : 12}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: align === "left" ? -12 : 12}}
            transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: align === "left" ? "flex-end" : "flex-start",
                padding: align === "left" ? "0 4vw 0 0" : "0 0 0 4vw",
                maxWidth: "360px",
            }}
        >
            {blocks.map((block, i) => {
                if (block.kind === "text") {
                    const style = PANEL_TEXT_STYLES[block.variant ?? "body"];
                    return (
                        <div key={i} style={{
                            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                            textAlign: align === "left" ? "right" : "left",
                            ...style,
                        }}>
                            {block.value}
                        </div>
                    );
                }
                if (block.kind === "image") {
                    return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={i}
                            src={block.src}
                            alt={block.alt ?? ""}
                            style={{
                                width: block.width ?? 200,
                                height: "auto",
                                objectFit: "contain",
                                borderRadius: block.borderRadius ?? 0,
                                display: "block",
                            }}
                        />
                    );
                }
                if (block.kind === "phone-screenshots") {
                    if (block.layout === "phone-fan") {
                        // Center phone largest + upright, sides smaller + rotated + faded
                        const cW = 148, cH = 312; // center
                        const sW = 132, sH = 278; // sides
                        const totalW = 370;
                        const totalH = cH + 20;
                        const phones = [
                            { img: block.images[0], w: sW, h: sH, left: 0,               rotate: -7, opacity: 1, z: 1 },
                            { img: block.images[1], w: cW, h: cH, left: totalW/2 - cW/2, rotate: -1, opacity: 1, z: 3 },
                            { img: block.images[2], w: sW, h: sH, left: totalW - sW,      rotate:  6, opacity: 1, z: 1 },
                        ];
                        return (
                            <div key={i} style={{
                                position: "relative",
                                width: `${totalW}px`,
                                height: `${totalH}px`,
                                flexShrink: 0,
                            }}>
                                {phones.map((p, j) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={j}
                                        src={p.img.src}
                                        alt={p.img.alt ?? ""}
                                        style={{
                                            position: "absolute",
                                            width: `${p.w}px`,
                                            height: `${p.h}px`,
                                            objectFit: "cover",
                                            objectPosition: "top",
                                            borderRadius: "20px",
                                            border: "1.5px solid rgba(0,0,0,0.08)",
                                            boxShadow: "0 16px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)",
                                            transform: `rotate(${p.rotate}deg)`,
                                            transformOrigin: "bottom center",
                                            left: `${p.left}px`,
                                            top: `${(totalH - p.h) / 2}px`,
                                            opacity: p.opacity,
                                            zIndex: p.z,
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    }
                    if (block.layout === "scatter") {
                        const imgW = 88;
                        // Hexagonal layout: 6 vertices of a regular hexagon, r=110px
                        // centre at (150,175), adjacent centre-to-centre = 110px > imgW = 88px
                        const slots = [
                            { left: 106, top:  21, rotate: -4 }, // top
                            { left: 201, top:  76, rotate:  5 }, // top-right
                            { left: 201, top: 186, rotate: -6 }, // bottom-right
                            { left: 106, top: 241, rotate:  3 }, // bottom
                            { left:  11, top: 186, rotate: -8 }, // bottom-left
                            { left:  11, top:  76, rotate:  7 }, // top-left
                        ];
                        return (
                            <div key={i} style={{position: "relative", width: "300px", height: "340px", flexShrink: 0}}>
                                {block.images.map((img, j) => {
                                    const s = slots[j] ?? slots[0];
                                    return (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={j}
                                            src={img.src}
                                            alt={img.alt ?? ""}
                                            style={{
                                                position: "absolute",
                                                width: `${imgW}px`,
                                                height: img.circle ? `${imgW}px` : "auto",
                                                objectFit: "cover",
                                                borderRadius: img.circle ? "50%" : img.rounded ? "12px" : "0px",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.10)",
                                                transform: `rotate(${s.rotate}deg)`,
                                                left: `${s.left}px`,
                                                top: `${s.top}px`,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        );
                    }
                    if (block.layout === "ladder") {
                        // Two diagonal ladders stacked vertically: first 3 = top group, last 3 = bottom group
                        // Diagonal goes right→left so images anchor near the center cards with no dead left space
                        const imgW = 88;
                        const step = 60;
                        const groups = [block.images.slice(0, 3), block.images.slice(3)];
                        const n = groups[0].length;
                        const stackW = imgW + step * (n - 1);
                        const stackH = imgW + step * (n - 1);
                        const groupGap = 36;
                        const totalH = stackH * 2 + groupGap;
                        return (
                            <div key={i} style={{
                                position: "relative",
                                width: `${stackW}px`,
                                height: `${totalH}px`,
                                flexShrink: 0,
                            }}>
                                {groups.map((group, gi) => (
                                    group.map((img, j) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={`${gi}-${j}`}
                                            src={img.src}
                                            alt={img.alt ?? ""}
                                            style={{
                                                position: "absolute",
                                                width: `${imgW}px`,
                                                height: img.circle ? `${imgW}px` : "auto",
                                                objectFit: "cover",
                                                borderRadius: img.circle ? "50%" : img.rounded ? "12px" : "0px",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.10)",
                                                left: `${(n - 1 - j) * step}px`,
                                                top: `${gi * (stackH + groupGap) + j * step}px`,
                                                zIndex: j,
                                            }}
                                        />
                                    ))
                                ))}
                            </div>
                        );
                    }

                    const rotations = [-22, -2, 18];
                    const offsets = [
                        {x: -62, y: 18},
                        {x: -20, y: -10},
                        {x: 24, y: 16},
                    ];
                    return (
                        <div key={i} style={{
                            position: "relative",
                            width: "260px",
                            height: "340px",
                            flexShrink: 0,
                        }}>
                            {block.images.map((img, j) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={j}
                                    src={img.src}
                                    alt={img.alt ?? ""}
                                    style={{
                                        position: "absolute",
                                        width: "140px",
                                        height: "auto",
                                        objectFit: "cover",
                                        borderRadius: img.rounded !== false ? "22px" : "0px",
                                        boxShadow: "0 10px 36px rgba(0,0,0,0.20), 0 2px 10px rgba(0,0,0,0.10)",
                                        transform: `rotate(${rotations[j]}deg) translate(${offsets[j].x}px, ${offsets[j].y}px)`,
                                        transformOrigin: "bottom center",
                                        left: "50%",
                                        top: "50%",
                                        marginLeft: "-70px",
                                        marginTop: "-155px",
                                        zIndex: j,
                                    }}
                                />
                            ))}
                        </div>
                    );
                }
                if (block.kind === "quack-scatter") {
                    const quacks = [
                        { text: "quack.",      x: 58,  y: 2,   size: 26, opacity: 0.85, rotate: -3  },
                        { text: "quack!",      x: 4,   y: 32,  size: 16, opacity: 0.40, rotate:  2  },
                        { text: "quack...",    x: 76,  y: 48,  size: 14, opacity: 0.28, rotate: -5  },
                        { text: "quack quack", x: 12,  y: 66,  size: 32, opacity: 0.70, rotate:  1  },
                        { text: "quack?",      x: 70,  y: 82,  size: 13, opacity: 0.22, rotate: -8  },
                        { text: "quack.",      x: -2,  y: 10,  size: 19, opacity: 0.55, rotate:  4  },
                        { text: "quack!",      x: 42,  y: 24,  size: 38, opacity: 0.15, rotate: -2  },
                        { text: "quack...",    x: 22,  y: 90,  size: 15, opacity: 0.45, rotate:  6  },
                        { text: "quack.",      x: 84,  y: 16,  size: 12, opacity: 0.30, rotate: -6  },
                        { text: "QUACK.",      x: 46,  y: 57,  size: 22, opacity: 0.60, rotate:  3  },
                        { text: "quack!",      x: 8,   y: 50,  size: 11, opacity: 0.20, rotate: -1  },
                        { text: "quack...",    x: 68,  y: 36,  size: 17, opacity: 0.50, rotate:  7  },
                        { text: "quack.",      x: 34,  y: 76,  size: 24, opacity: 0.35, rotate: -4  },
                        { text: "quack?",      x: 90,  y: 64,  size: 13, opacity: 0.38, rotate:  5  },
                        { text: "QUACK!",      x: -4,  y: 86,  size: 16, opacity: 0.25, rotate: -7  },
                    ];
                    return (
                        <div key={i} style={{position: "relative", width: "300px", height: "340px", flexShrink: 0}}>
                            {quacks.map((q, j) => (
                                <span key={j} style={{
                                    position: "absolute",
                                    left: `${q.x}%`,
                                    top: `${q.y}%`,
                                    fontSize: `${q.size}px`,
                                    opacity: q.opacity,
                                    transform: `rotate(${q.rotate}deg)`,
                                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                    fontWeight: 300,
                                    color: "#1a1a1a",
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap",
                                    userSelect: "none",
                                }}>
                                    {q.text}
                                </span>
                            ))}
                        </div>
                    );
                }
                if (block.kind === "plant-newtab") {
                    const plants = [
                        {src: "/images/plant_lily.png",     h: 72},
                        {src: "/images/plant_pothos.png",   h: 88},
                        {src: "/images/plant_monstera.png", h: 96},
                        {src: "/images/plant_snake.png",    h: 80},
                    ];
                    return (
                        <div key={i} style={{display: "flex", flexDirection: "column", gap: "16px", flexShrink: 0, width: "400px"}}>
                            {/* Mini new-tab card */}
                            <div style={{
                                width: "100%",
                                background: "linear-gradient(160deg, #0f1e0f 0%, #0c170c 50%, #141208 100%)",
                                borderRadius: "14px",
                                padding: "18px 16px 14px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}>
                                {/* Time */}
                                <div style={{fontSize: "38px", fontWeight: 200, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", lineHeight: 1, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>10:42</div>
                                <div style={{fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>Wednesday, March 18</div>

                                {/* Plant */}
                                <div style={{position: "relative", height: "80px", display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/images/plant_pothos.png" alt="plant" style={{height: "76px", objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(74,222,128,0.3))"}}/>
                                </div>

                                {/* State pill */}
                                <div style={{display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                                    <div style={{width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80"}}/>
                                    Thriving
                                </div>

                                {/* Health bar */}
                                <div style={{display: "flex", alignItems: "center", gap: "8px", width: "180px"}}>
                                    <div style={{flex: 1, height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden"}}>
                                        <div style={{width: "88%", height: "100%", background: "linear-gradient(90deg, #16a34a, #4ade80)", borderRadius: "2px"}}/>
                                    </div>
                                    <span style={{fontSize: "11px", fontWeight: 700, color: "#4ade80", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>88%</span>
                                </div>

                                {/* Stats */}
                                <div style={{display: "flex", gap: "6px", width: "100%"}}>
                                    {[
                                        {label: "Focus Time", val: "1h 38m", color: "#4ade80"},
                                        {label: "Distracted", val: "11m",    color: "#fbbf24"}
                                    ].map(s => (
                                        <div key={s.label} style={{flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "7px 6px", textAlign: "center"}}>
                                            <div style={{fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>{s.label}</div>
                                            <div style={{fontSize: "11px", fontWeight: 700, color: s.color, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>{s.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Plants row */}
                            <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-around", paddingBottom: "4px"}}>
                                {plants.map((p, j) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img key={j} src={p.src} alt="" style={{height: `${p.h}px`, width: "auto", objectFit: "contain"}}/>
                                ))}
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </motion.div>
    );
}

// ─── Projects section ─────────────────────────────────────────────────────────

function ProjectsSection({sectionRef, lockedProject, setLockedProject}: {
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
            minHeight: "100vh",
            display: "flex",
            alignItems: "flex-start",
            padding: "100px 4vw 100px",
            background: "#ffffff",
        }}>
            {/* Left panel */}
            <div style={{
                flex: 1,
                position: "sticky",
                top: 0,
                height: "100vh",
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
                width: "360px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                {/* Section label */}
                <div style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    color: "#888",
                    marginBottom: "28px",
                    textTransform: "uppercase",
                    alignSelf: "flex-start",
                }}>
                    Personal Projects
                </div>

                <div style={{width: "100%"}}>
                    {appProjects.map(p => (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            isActive={displayedProject?.id === p.id}
                            isLocked={lockedProject?.id === p.id}
                            onHover={() => {
                                if (!lockedProject) setHoveredProject(p);
                            }}
                            onLeave={() => {
                                if (!lockedProject) setHoveredProject(null);
                            }}
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
                height: "100vh",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
    const [scribbleKey, setScribbleKey] = useState(0);
    const [lockedProject, setLockedProject] = useState<AppProject | null>(null);
    const projectsSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        window.addEventListener("pointerdown", () => getCtx(), {once: true});
    }, []);

    function handleScatterProjectClick(scatterProjectId: string) {
        const appProject = appProjects.find(p => p.id === scatterProjectId);
        projectsSectionRef.current?.scrollIntoView({behavior: "smooth"});
        if (appProject) {
            setLockedProject(prev => prev?.id === appProject.id ? null : appProject);
        }
    }

    return (
        <div style={{width: "100vw", background: "#ffffff"}}>
            <BackgroundScribble key={scribbleKey}/>

            {/* Reload scribble button */}
            <div
                style={{position: "absolute", top: 20, right: 20, zIndex: 10001, display: "flex", alignItems: "center", gap: 8}}
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
                    onClick={() => setScribbleKey(k => k + 1)}
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

            <ClickBurst/>
            <CursorTrail/>
            <Cursor/>
            <CursorTooltip project={hoveredProject}/>

            {/* ── Hero section ── */}
            <div style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Sunset lamp */}
                <div style={{
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
                }}/>

                <Identity/>
                {projects.map((p, i) => (
                    <ProjectNode
                        key={p.id}
                        p={p}
                        index={i}
                        onHoverIn={() => setHoveredProject(p)}
                        onHoverOut={() => setHoveredProject(null)}
                        onAppClick={() => handleScatterProjectClick(p.id)}
                    />
                ))}

                {/* Scroll hint */}
                <motion.div
                    style={{
                        position: "absolute",
                        bottom: 28,
                        left: "50%",
                        x: "-50%",
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: "8px",
                        fontWeight: 300,
                        letterSpacing: "0.24em",
                        color: "#1a1a1a",
                        zIndex: 5,
                        pointerEvents: "none",
                        textTransform: "uppercase",
                    }}
                    initial={{opacity: 0}}
                    animate={{opacity: 0.28}}
                    transition={{delay: 3, duration: 1.5, ease: "easeOut"}}
                >
                    scroll
                </motion.div>
            </div>

            {/* ── Projects section ── */}
            <ProjectsSection
                sectionRef={projectsSectionRef}
                lockedProject={lockedProject}
                setLockedProject={setLockedProject}
            />
        </div>
    );
}
