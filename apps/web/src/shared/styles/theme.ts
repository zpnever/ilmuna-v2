export const themeTokens = {
  colors: {
    canvas: "#f7f4ee",
    surface: "#ffffff",
    ink: "#111111",
    inkMuted: "#5f5a53",
    line: "#ded6c8",
    gold: "#c9a84c",
    danger: "#b42318",
    success: "#13795b",
  },
  fonts: {
    body: "Manrope",
    display: "Fraunces",
    arabic: "Scheherazade New",
  },
} as const;

export type SurfaceTone = "default" | "soft" | "accent";

export function resolveSurfaceTone(tone: SurfaceTone) {
  switch (tone) {
    case "soft":
      return "var(--color-surface-soft)";
    case "accent":
      return "var(--color-surface-accent)";
    default:
      return "var(--color-surface)";
  }
}

