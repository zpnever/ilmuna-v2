import { describe, expect, it } from "vitest";
import { resolveSurfaceTone, themeTokens } from "@/shared/styles/theme";

describe("theme tokens", () => {
  it("exposes primary color tokens", () => {
    expect(themeTokens.colors.gold).toBe("#c9a84c");
    expect(themeTokens.fonts.display).toBe("Fraunces");
  });

  it("resolves soft surfaces", () => {
    expect(resolveSurfaceTone("soft")).toBe("var(--color-surface-soft)");
  });
});

