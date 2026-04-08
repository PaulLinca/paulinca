export interface Project {
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

export type LinkType = "github" | "playstore" | "appstore" | "chrome" | "web";

export interface ProjectLink {
    type: LinkType;
    url: string;
}

export type PanelBlock =
    | { kind: "text"; value: string; variant?: "heading" | "subheading" | "body" | "caption" | "label" }
    | { kind: "image"; src: string; alt?: string; width?: number; borderRadius?: number }
    | { kind: "phone-screenshots"; images: { src: string; alt?: string; rounded?: boolean; circle?: boolean }[]; layout?: "fan" | "ladder" | "phone-fan" | "scatter" }
    | { kind: "quack-scatter" }
    | { kind: "plant-newtab" };

export interface AppProject {
    id: string;
    name: string;
    year: string;
    tagline: string;
    icon: string;
    links: ProjectLink[];
    leftPanel?: PanelBlock[];
    rightPanel?: PanelBlock[];
}
