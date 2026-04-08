"use client";

import { motion } from "framer-motion";
import type { PanelBlock } from "@/types";
import { PANEL_TEXT_STYLES } from "@/lib/constants";

// ─── Sub-renderers ─────────────────────────────────────────────────────────────

function PhoneFan({ images }: { images: { src: string; alt?: string }[] }) {
    const cW = 148, cH = 312;
    const sW = 132, sH = 278;
    const totalW = 370;
    const totalH = cH + 20;
    const phones = [
        { img: images[0], w: sW, h: sH, left: 0,               rotate: -7, z: 1 },
        { img: images[1], w: cW, h: cH, left: totalW/2 - cW/2, rotate: -1, z: 3 },
        { img: images[2], w: sW, h: sH, left: totalW - sW,      rotate:  6, z: 1 },
    ];
    return (
        <div style={{ position: "relative", width: `${totalW}px`, height: `${totalH}px`, flexShrink: 0 }}>
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
                        zIndex: p.z,
                    }}
                />
            ))}
        </div>
    );
}

const SCATTER_SLOTS = [
    { left: 106, top:  21, rotate: -4 },
    { left: 201, top:  76, rotate:  5 },
    { left: 201, top: 186, rotate: -6 },
    { left: 106, top: 241, rotate:  3 },
    { left:  11, top: 186, rotate: -8 },
    { left:  11, top:  76, rotate:  7 },
];

function PhoneScatter({ images }: { images: { src: string; alt?: string; rounded?: boolean; circle?: boolean }[] }) {
    const imgW = 88;
    return (
        <div style={{ position: "relative", width: "300px", height: "340px", flexShrink: 0 }}>
            {images.map((img, j) => {
                const s = SCATTER_SLOTS[j] ?? SCATTER_SLOTS[0];
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

function PhoneLadder({ images }: { images: { src: string; alt?: string; rounded?: boolean; circle?: boolean }[] }) {
    const imgW = 88;
    const step = 60;
    const groups = [images.slice(0, 3), images.slice(3)];
    const n = groups[0].length;
    const stackW = imgW + step * (n - 1);
    const stackH = imgW + step * (n - 1);
    const groupGap = 36;
    const totalH = stackH * 2 + groupGap;
    return (
        <div style={{ position: "relative", width: `${stackW}px`, height: `${totalH}px`, flexShrink: 0 }}>
            {groups.map((group, gi) =>
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
            )}
        </div>
    );
}

const DEFAULT_SCREENSHOT_ROTATIONS = [-22, -2, 18];
const DEFAULT_SCREENSHOT_OFFSETS = [{ x: -62, y: 18 }, { x: -20, y: -10 }, { x: 24, y: 16 }];

function PhoneFanDefault({ images }: { images: { src: string; alt?: string; rounded?: boolean }[] }) {
    return (
        <div style={{ position: "relative", width: "260px", height: "340px", flexShrink: 0 }}>
            {images.map((img, j) => (
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
                        transform: `rotate(${DEFAULT_SCREENSHOT_ROTATIONS[j]}deg) translate(${DEFAULT_SCREENSHOT_OFFSETS[j].x}px, ${DEFAULT_SCREENSHOT_OFFSETS[j].y}px)`,
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

const QUACK_ITEMS = [
    { text: "quack.",      x: 58,  y: 2,   size: 26, opacity: 0.85, rotate: -3 },
    { text: "quack!",      x: 4,   y: 32,  size: 16, opacity: 0.40, rotate:  2 },
    { text: "quack...",    x: 76,  y: 48,  size: 14, opacity: 0.28, rotate: -5 },
    { text: "quack quack", x: 12,  y: 66,  size: 32, opacity: 0.70, rotate:  1 },
    { text: "quack?",      x: 70,  y: 82,  size: 13, opacity: 0.22, rotate: -8 },
    { text: "quack.",      x: -2,  y: 10,  size: 19, opacity: 0.55, rotate:  4 },
    { text: "quack!",      x: 42,  y: 24,  size: 38, opacity: 0.15, rotate: -2 },
    { text: "quack...",    x: 22,  y: 90,  size: 15, opacity: 0.45, rotate:  6 },
    { text: "quack.",      x: 84,  y: 16,  size: 12, opacity: 0.30, rotate: -6 },
    { text: "QUACK.",      x: 46,  y: 57,  size: 22, opacity: 0.60, rotate:  3 },
    { text: "quack!",      x: 8,   y: 50,  size: 11, opacity: 0.20, rotate: -1 },
    { text: "quack...",    x: 68,  y: 36,  size: 17, opacity: 0.50, rotate:  7 },
    { text: "quack.",      x: 34,  y: 76,  size: 24, opacity: 0.35, rotate: -4 },
    { text: "quack?",      x: 90,  y: 64,  size: 13, opacity: 0.38, rotate:  5 },
    { text: "QUACK!",      x: -4,  y: 86,  size: 16, opacity: 0.25, rotate: -7 },
];

function QuackScatter() {
    return (
        <div style={{ position: "relative", width: "300px", height: "340px", flexShrink: 0 }}>
            {QUACK_ITEMS.map((q, j) => (
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

const PLANT_IMAGES = [
    { src: "/images/plant_lily.png",     h: 72 },
    { src: "/images/plant_pothos.png",   h: 88 },
    { src: "/images/plant_monstera.png", h: 96 },
    { src: "/images/plant_snake.png",    h: 80 },
];

const PLANT_STATS = [
    { label: "Focus Time", val: "1h 38m", color: "#4ade80" },
    { label: "Distracted", val: "11m",    color: "#fbbf24" },
];

function PlantNewTab() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flexShrink: 0, width: "400px" }}>
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
                <div style={{ fontSize: "38px", fontWeight: 200, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", lineHeight: 1, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>10:42</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>Wednesday, March 18</div>

                <div style={{ position: "relative", height: "80px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/plant_pothos.png" alt="plant" style={{ height: "76px", objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(74,222,128,0.3))" }} />
                </div>

                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80" }} />
                    Thriving
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "180px" }}>
                    <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: "88%", height: "100%", background: "linear-gradient(90deg, #16a34a, #4ade80)", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#4ade80", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>88%</span>
                </div>

                <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                    {PLANT_STATS.map(s => (
                        <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "7px 6px", textAlign: "center" }}>
                            <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{s.label}</div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: s.color, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>{s.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", paddingBottom: "4px" }}>
                {PLANT_IMAGES.map((p, j) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={j} src={p.src} alt="" style={{ height: `${p.h}px`, width: "auto", objectFit: "contain" }} />
                ))}
            </div>
        </div>
    );
}

// ─── PanelRenderer ─────────────────────────────────────────────────────────────

export function PanelRenderer({ blocks, align }: { blocks: PanelBlock[]; align: "left" | "right" }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: align === "left" ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: align === "left" ? -12 : 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                    if (block.layout === "phone-fan") return <PhoneFan key={i} images={block.images} />;
                    if (block.layout === "scatter")   return <PhoneScatter key={i} images={block.images} />;
                    if (block.layout === "ladder")    return <PhoneLadder key={i} images={block.images} />;
                    return <PhoneFanDefault key={i} images={block.images} />;
                }
                if (block.kind === "quack-scatter") return <QuackScatter key={i} />;
                if (block.kind === "plant-newtab")  return <PlantNewTab key={i} />;
                return null;
            })}
        </motion.div>
    );
}
