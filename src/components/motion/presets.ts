import type { Transition } from "motion/react";
import type { ThemeMotion } from "@/themes/registry";

// What each theme's motion name (src/themes/registry.ts → ThemeDefinition.motion) means on
// screen. Pure data, so it is shared by every island and tested without a browser.

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export interface MotionPreset {
  /** Where an element starts before it is revealed. Always reached instantly (off-screen). */
  from: { opacity: number; x?: number; y?: number; scale?: number };
  /** How it travels to its final, server-rendered state. */
  transition: Transition;
  /** Delay between neighbours (cards in a row, category tiles), in seconds. */
  stagger: number;
}

export const MOTION_PRESETS: Record<
  Exclude<ThemeMotion, "none">,
  MotionPreset
> = {
  lift: {
    from: { opacity: 0, y: 24 },
    transition: { duration: 0.5, ease: EASE_OUT },
    stagger: 0.06,
  },
  rise: {
    from: { opacity: 0, y: 44 },
    transition: { duration: 0.85, ease: EASE_OUT },
    stagger: 0.09,
  },
  fade: {
    from: { opacity: 0 },
    transition: { duration: 0.9, ease: "easeOut" },
    stagger: 0.08,
  },
  pop: {
    from: { opacity: 0, y: 14, scale: 0.9 },
    transition: { type: "spring", stiffness: 420, damping: 22, mass: 0.8 },
    stagger: 0.05,
  },
};

/** The preset for a theme, or null when the theme stays still. */
export function motionPreset(
  motion: ThemeMotion | undefined,
): MotionPreset | null {
  return motion && motion !== "none" ? MOTION_PRESETS[motion] : null;
}

/**
 * Stagger delay for the item at `index` in a list that wraps into rows of `perRow`:
 * neighbours in a row cascade, every new row starts again from zero.
 */
export function staggerDelay(
  preset: MotionPreset,
  index: number,
  perRow = 4,
): number {
  return (index % Math.max(1, perRow)) * preset.stagger;
}
