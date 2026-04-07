"use client";

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";

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
    name: "Vybes",
    year: "2024",
    desc: "music for your mood",
    href: "#",
    imageSrc: "/images/headphones.png",
    w: 130,
    h: 130,
    dx: "-30vw",
    dy: "-16vh",
    rotate: -2,
    freq: 523.25,
  },
  {
    id: "courtscore",
    name: "Court Score",
    year: "2023",
    desc: "score any court sport",
    href: "#",
    imageSrc: "/images/padel.webp",
    w: 180,
    h: 124,
    dx: "26vw",
    dy: "-20vh",
    rotate: 1.5,
    freq: 659.25,
  },
  {
    id: "tapsleep",
    name: "TapSleep",
    year: "2024",
    desc: "tap your way to sleep",
    href: "#",
    imageSrc: "/images/moon.webp",
    w: 124,
    h: 124,
    dx: "-24vw",
    dy: "20vh",
    rotate: -1,
    freq: 392.0,
  },
  {
    id: "rubberduck",
    name: "Explain Your Bug",
    year: "2023",
    desc: "explain your bug, fix it",
    href: "https://explainyourbugtotherubberduck.com/",
    imageSrc: "/images/rubber_duck_larger.webp",
    w: 140,
    h: 158,
    dx: "24vw",
    dy: "18vh",
    rotate: 1,
    freq: 440.0,
  },
];

// ─── Custom cursor ─────────────────────────────────────────────────────────────

function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
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

// ─── Project node ──────────────────────────────────────────────────────────────

function ProjectNode({ p, index }: { p: Project; index: number }) {
  const [active, setActive] = useState(false);
  const throttle = useRef(false);
  const isExternal = p.href.startsWith("http");

  function onEnter() {
    setActive(true);
    if (!throttle.current) {
      throttle.current = true;
      softClick(p.freq);
      setTimeout(() => {
        throttle.current = false;
      }, 800);
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
      onHoverEnd={() => setActive(false)}
    >
      <a
        href={p.href}
        target={isExternal ? "_blank" : undefined}
        rel="noopener noreferrer"
        onClick={(e) => p.href === "#" && e.preventDefault()}
        style={{ display: "block" }}
      >
        {/* Image */}
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

        {/* Info — whisper, only on hover */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "calc(100% + 14px)",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 300,
                  color: "#1a1a1a",
                  letterSpacing: "0.12em",
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "9px",
                  fontWeight: 300,
                  color: "#999",
                  letterSpacing: "0.14em",
                }}
              >
                {p.year}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(28px, 3.2vw, 52px)",
          color: "#1a1a1a",
          letterSpacing: "0.01em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Paul Linca
      </h1>

      {/* Hairline */}
      <motion.div
        animate={{
          scaleX: hovered ? 1 : 0.15,
          opacity: hovered ? 0.25 : 0.12,
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: "1px",
          margin: "16px auto",
          width: "100%",
          background: "#1a1a1a",
          transformOrigin: "center",
        }}
      />

      {/* Tagline / email */}
      <AnimatePresence mode="wait">
        {hovered ? (
          <motion.a
            key="email"
            href="mailto:paultudorlinca@gmail.com"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 300,
              color: "#999",
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
  useEffect(() => {
    window.addEventListener("pointermove", () => getCtx(), { once: true });
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Cursor />
      <Identity />
      {projects.map((p, i) => (
        <ProjectNode key={p.id} p={p} index={i} />
      ))}
    </div>
  );
}
