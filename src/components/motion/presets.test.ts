import { describe, expect, it } from "vitest";
import { THEMES } from "@/themes/registry";
import { MOTION_PRESETS, motionPreset, staggerDelay } from "./presets";

describe("theme motion presets", () => {
  it("keeps Classic still: it must behave exactly like the original storefront", () => {
    expect(THEMES.classic.motion).toBe("none");
    expect(motionPreset(THEMES.classic.motion)).toBeNull();
    expect(motionPreset(undefined)).toBeNull();
  });

  it("gives every other theme a preset that ends visible", () => {
    for (const theme of Object.values(THEMES)) {
      if (theme.key === "classic") continue;
      const preset = motionPreset(theme.motion);
      expect(preset, theme.key).not.toBeNull();
      expect(preset!.from.opacity).toBeLessThan(1);
    }
  });

  it("cascades neighbours in a row and restarts on each new row", () => {
    const lift = MOTION_PRESETS.lift;
    expect(staggerDelay(lift, 0, 4)).toBe(0);
    expect(staggerDelay(lift, 3, 4)).toBeCloseTo(3 * lift.stagger);
    expect(staggerDelay(lift, 4, 4)).toBe(0);
    expect(staggerDelay(lift, 5, 0)).toBe(0);
  });
});
