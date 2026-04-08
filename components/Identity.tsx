"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const taglineStyle: React.CSSProperties = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: "12px",
    fontWeight: 300,
    color: "#1a1a1a",
    letterSpacing: "0.16em",
    display: "block",
};

export function Identity() {
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={taglineStyle}
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
                        style={taglineStyle}
                    >
                        i make apps
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
