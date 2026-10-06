// Scroll reveals for the themed storefront (no React, no library).
//
// How it fits together:
//   • Layout prints <html data-motion="lift|rise|fade|pop|none"> from the theme (registry.ts) and
//     a tiny inline snippet that adds `ct-motion` to <html> before first paint, unless the theme
//     stays still or the visitor prefers reduced motion.
//   • Components mark what should come in with `data-reveal` (and `--ct-i` for the cascade).
//   • CSS (src/styles/themes.css → Motion) hides marked elements while `ct-motion` is on and
//     gives each preset its look. This module flags each element as it scrolls into view:
//       data-revealed="in"   → it plays the entrance
//       data-revealed="done" → it settles, so hover effects get their own transitions back.
//   • Elements added later (another category, the next page) are picked up automatically.
//
// Server HTML stays complete: without JavaScript `ct-motion` is never set (and the inline
// snippet drops it after a few seconds if this module never starts), so nothing stays hidden.

export const REVEAL_ATTR = "data-reveal";
export const REVEALED_ATTR = "data-revealed";
/** On a container: its items come in together (with their cascade), e.g. a sideways-scrolling row. */
export const REVEAL_GROUP_ATTR = "data-reveal-group";
const SELECTOR = `[${REVEAL_ATTR}]:not([${REVEALED_ATTR}])`;

/** How long an element keeps its entrance transition before hover styles take over (ms). */
export const SETTLE_MS = 1600;

/** Astro drops `ssr` when hydration starts; React commits a moment later (ms). */
export const HYDRATION_SETTLE_MS = 150;

/** Reveal everything anyway if an island still hasn't hydrated after this long (ms). */
export const HYDRATION_WAIT_MS = 4000;

/**
 * Elements inside an Astro island are only flagged once React owns them (Astro drops the
 * island's `ssr` attribute after hydrating). Flagging the server HTML earlier would make React
 * report attribute mismatches, since it expects the DOM exactly as it was rendered.
 */
function isHydrated(el: Element): boolean {
  const island = el.closest("astro-island");
  return !island || !island.hasAttribute("ssr");
}

declare global {
  interface Window {
    __ctReveal?: boolean;
  }
}

export function installReveal(doc: Document = document): () => void {
  const win = doc.defaultView;
  if (!win || win.__ctReveal) return () => {};
  win.__ctReveal = true;

  const html = doc.documentElement;
  if (
    !html.classList.contains("ct-motion") ||
    !("IntersectionObserver" in win)
  ) {
    html.classList.remove("ct-motion");
    return () => {};
  }

  const reveal = (el: Element) => {
    if (el.hasAttribute(REVEALED_ATTR)) return;
    el.setAttribute(REVEALED_ATTR, "in");
    win.setTimeout(() => el.setAttribute(REVEALED_ATTR, "done"), SETTLE_MS);
    // Items scrolled out of a row sideways never cross the viewport on their own.
    el.closest(`[${REVEAL_GROUP_ATTR}]`)
      ?.querySelectorAll(SELECTOR)
      .forEach((item) => {
        io.unobserve(item);
        reveal(item);
      });
  };

  const io = new win.IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        reveal(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  let force = false;
  const watch = (root: ParentNode) =>
    root.querySelectorAll(SELECTOR).forEach((el) => {
      if (force || isHydrated(el)) io.observe(el);
    });
  watch(doc);

  // Islands hydrate (dropping `ssr`) and re-render their lists after load: watch the
  // elements they own as soon as they are theirs, including ones added later.
  const mo = new win.MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        const island = record.target as Element;
        win.setTimeout(() => watch(island), HYDRATION_SETTLE_MS);
        continue;
      }
      record.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        const el = node as Element;
        if (el.matches(SELECTOR) && (force || isHydrated(el))) io.observe(el);
        watch(el);
      });
    }
  });
  mo.observe(doc.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["ssr"],
  });

  // An island that never hydrates (script blocked, error) must not keep its content hidden.
  const failsafe = win.setTimeout(() => {
    force = true;
    watch(doc);
  }, HYDRATION_WAIT_MS);

  return () => {
    io.disconnect();
    mo.disconnect();
    win.clearTimeout(failsafe);
    win.__ctReveal = false;
  };
}

/**
 * Props that mark an element for the scroll reveal. `index` cascades neighbours: pass the
 * item's place in its row (e.g. i % 4) so each row starts again from the first item.
 */
export function revealProps(index = 0): {
  "data-reveal": "";
  style?: Record<string, number>;
} {
  return index > 0
    ? { "data-reveal": "", style: { "--ct-i": index } }
    : { "data-reveal": "" };
}
