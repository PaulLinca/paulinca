import type React from "react";
import type { LinkType, PanelBlock } from "@/types";

export const LINK_ICONS: Record<LinkType, string> = {
    github: "/images/web_site.png",
    playstore: "/images/play_store.png",
    appstore: "/images/app_store.png",
    chrome: "/images/web_store.png",
    web: "/images/web_site.png",
};

export const LINK_LABELS: Record<LinkType, string> = {
    github: "GitHub",
    playstore: "Play Store",
    appstore: "App Store",
    chrome: "Chrome Web Store",
    web: "Web",
};

export const PANEL_TEXT_STYLES: Record<
    NonNullable<Extract<PanelBlock, { kind: "text" }>["variant"]>,
    React.CSSProperties
> = {
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
        fontSize: "20px",
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
