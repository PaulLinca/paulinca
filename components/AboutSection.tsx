"use client";

import { motion } from "framer-motion";

const SOCIALS = [
    { icon: "/images/linkedin.png",  alt: "LinkedIn",  href: "https://www.linkedin.com/in/lincapaul/" },
    { icon: "/images/github.png",    alt: "GitHub",    href: "https://github.com/PaulLinca" },
    { icon: "/images/instagram.png", alt: "Instagram", href: "https://www.instagram.com/appsbypaul/" },
];

export function AboutSection() {
    return (
        <section style={{
            minHeight: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 4vw 40px",
            background: "#ffffff",
        }}>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "24px",
                    maxWidth: "420px",
                    textAlign: "center",
                }}
            >
                {/* Title image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/about_me.png"
                    alt="About me"
                    style={{ width: "140px", height: "auto" }}
                />

                {/* Description */}
                <p style={{
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: "18px",
                    fontWeight: 300,
                    color: "#444",
                    letterSpacing: "0.02em",
                    lineHeight: 1.75,
                    margin: 0,
                }}>
                    I&apos;m Paul, a software engineer based in Barcelona.
                    I like building mobile apps.
                </p>

                {/* Email */}
                <a
                    href="mailto:paultudorlinca@gmail.com"
                    style={{
                        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: "15px",
                        fontWeight: 300,
                        color: "#fa742d",
                        letterSpacing: "0.14em",
                        textDecoration: "none",
                        cursor: "none",
                    }}
                >
                    paultudorlinca@gmail.com
                </a>

                {/* Socials */}
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    {SOCIALS.map(s => (
                        <a
                            key={s.alt}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
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
                            <img src={s.icon} alt={s.alt} style={{ width: "35px", height: "35px", objectFit: "contain", transition: "filter 0.2s ease" }} />
                        </a>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
