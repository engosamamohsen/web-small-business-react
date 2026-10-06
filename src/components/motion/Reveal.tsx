"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  domMax,
  m,
  useInView,
  useReducedMotion,
} from "motion/react";
import { EASE_OUT, MOTION_PRESETS, type MotionPreset } from "./presets";

// Shared motion helpers for the storefront islands.
//
// Rules every animation here follows:
//   • Server HTML is always the final, visible state. Nothing waits for JavaScript to appear.
//   • Only elements that are still below the fold when the island hydrates are hidden (instantly,
//     off-screen) and revealed when scrolled into view. Content added later on the client
//     (a new category, another tab) animates in normally.
//   • prefers-reduced-motion: no reveals, and MotionConfig turns transforms into instant changes.

export { EASE_OUT };

/** Each island is its own React root, so each wraps its tree in this once. */
export function MotionProvider({
  children,
  layout = false,
}: {
  children: ReactNode;
  layout?: boolean;
}) {
  return (
    <LazyMotion features={layout ? domMax : domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** True only during the render pass that hydrates the server HTML (or the very first client render). */
export function useFirstRender(): boolean {
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);
  return first.current;
}

const tags = { div: m.div, section: m.section, article: m.article, li: m.li };

/**
 * Fades and lifts its content in when it scrolls into view (once), the way `preset` says
 * (default: a short lift). `preset={null}` renders a plain element: the theme stays still.
 * `fresh`: the element was added on the client after the page loaded, so it may start hidden.
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  fresh = false,
  preset = MOTION_PRESETS.lift,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
  delay?: number;
  fresh?: boolean;
  preset?: MotionPreset | null;
}) {
  if (!preset) return createElement(as, { className }, children);
  return (
    <Revealed
      as={as}
      className={className}
      delay={delay}
      fresh={fresh}
      preset={preset}
    >
      {children}
    </Revealed>
  );
}

function Revealed({
  children,
  as,
  className,
  delay,
  fresh,
  preset,
}: {
  children: ReactNode;
  as: keyof typeof tags;
  className?: string;
  delay: number;
  fresh: boolean;
  preset: MotionPreset;
}) {
  const Tag = tags[as];
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const [isFresh] = useState(fresh);
  const inView = useInView(ref, { once: true, margin: "0px 0px -6% 0px" });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduce || isFresh || !ref.current) return;
    // Hide only what the visitor can't see yet, so nothing on screen blinks.
    if (ref.current.getBoundingClientRect().top > window.innerHeight)
      setArmed(true);
  }, [reduce, isFresh]);

  const hidden = !reduce && (isFresh || armed) && !inView;
  const variants = {
    hidden: { ...preset.from, transition: { duration: 0 } },
    show: { opacity: 1, x: 0, y: 0, scale: 1 },
  };

  return (
    <Tag
      ref={ref as never}
      className={className}
      variants={variants}
      initial={isFresh && !reduce ? "hidden" : false}
      animate={hidden ? "hidden" : "show"}
      transition={{ ...preset.transition, delay: hidden ? 0 : delay }}
    >
      {children}
    </Tag>
  );
}
