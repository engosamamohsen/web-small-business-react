import Script from "next/script";
import { Fragment, type ReactNode } from "react";
import { domToReact, htmlToDOM, Element, type DOMNode } from "html-react-parser";

import type { TrackingItem } from "@/hooks/fetchSettings";
import { PROVIDERS, validId, type Probe } from "./providers";
import TrackingPageView from "./TrackingPageView";
import TrackingDebugPanel, { type DebugItem } from "./TrackingDebugPanel";

/**
 * Tracking & pixels the merchant added in the dashboard.
 *
 * - <TrackingHead />      inside <head>: verification tags, custom header code
 * - <TrackingBodyStart /> first in <body>: <noscript> fallbacks
 * - <TrackingBodyEnd />   last in <body>: loaders, custom footer code, the manifest
 *                         the dashboard's "Check my store" reads, and the test panel
 */

type Props = { items?: TrackingItem[] };

const known = (items: TrackingItem[] = []) =>
  items.filter((i) => i.type === "custom" || validId(i.type, i.id));

// ===== Custom code (pasted HTML) =====

// Elements allowed in <head>; anything else pasted for the header goes to the body.
const HEAD_TAGS = new Set(["meta", "link", "style", "script", "noscript", "base", "title"]);

function textOf(node: Element): string {
  return node.children.map((c: any) => (c.type === "text" ? c.data : "")).join("");
}

/** React never runs a rendered <script>, so pasted scripts go through next/script. */
function renderScript(node: Element, key: string, ref: string): ReactNode {
  const { src, type, id, ...attribs } = node.attribs;
  const inline = textOf(node);

  // Structured data (JSON-LD) stays in the server HTML for search engines.
  if (type && type.includes("json")) {
    return <script key={key} id={id} type={type} data-ct-ref={ref} dangerouslySetInnerHTML={{ __html: inline }} />;
  }
  return (
    <Script
      key={key}
      id={id || key}
      strategy="afterInteractive"
      data-ct-ref={ref}
      {...(type ? { type } : {})}
      {...attribs}
      {...(src ? { src } : { dangerouslySetInnerHTML: { __html: inline } })}
    />
  );
}

function renderNodes(nodes: DOMNode[], ref: string, prefix: string): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `ct-${ref}-${prefix}${i}`;
    if (node instanceof Element) {
      if (node.name === "script") return renderScript(node, key, ref);
      node.attribs["data-ct-ref"] = ref; // lets the test panel find it
    }
    return <Fragment key={key}>{domToReact([node])}</Fragment>;
  });
}

/** Pasted HTML split into what belongs in <head> and what must live in <body>. */
function parseCustom(html?: string) {
  const head: DOMNode[] = [];
  const body: DOMNode[] = [];
  if (!html?.trim()) return { head, body };
  try {
    for (const node of htmlToDOM(html) as DOMNode[]) {
      // Loose text and comments are dropped: they would show as visible text.
      if (node instanceof Element) (HEAD_TAGS.has(node.name) ? head : body).push(node);
    }
  } catch (error) {
    console.error("[tracking] could not parse custom code", error);
  }
  return { head, body };
}

// ===== Components =====

export function TrackingHead({ items }: Props) {
  return (
    <>
      {known(items).map((item) => {
        if (item.type === "custom") {
          return item.placement === "head" ? renderNodes(parseCustom(item.code).head, item.ref, "h") : null;
        }
        const render = PROVIDERS[item.type].head;
        return render ? <Fragment key={item.ref}>{render(validId(item.type, item.id)!)}</Fragment> : null;
      })}
    </>
  );
}

export function TrackingBodyStart({ items }: Props) {
  return (
    <>
      {known(items).map((item) => {
        const render = item.type !== "custom" && PROVIDERS[item.type].bodyStart;
        return render ? <Fragment key={item.ref}>{render(validId(item.type, item.id)!)}</Fragment> : null;
      })}
    </>
  );
}

export function TrackingBodyEnd({ items, debug = false }: Props & { debug?: boolean }) {
  const list = known(items);
  const types = new Set(list.map((i) => i.type));

  const manifest = list.map((i) => ({ ref: i.ref, type: i.type }));
  const debugItems: DebugItem[] = list.map((i) => ({
    ref: i.ref,
    type: i.type,
    label: i.type === "custom" ? i.name || "كود مخصص" : PROVIDERS[i.type].label,
    probe: i.type === "custom" ? ({ selector: `[data-ct-ref="${i.ref}"]` } as Probe) : PROVIDERS[i.type].probe(validId(i.type, i.id)!),
  }));

  return (
    <>
      {list.map((item) => {
        if (item.type === "custom") {
          const { head, body } = parseCustom(item.code);
          // Header code: its <head> tags render in TrackingHead; anything else lands here.
          return (
            <Fragment key={item.ref}>
              {item.placement === "head" ? renderNodes(body, item.ref, "b") : renderNodes([...head, ...body], item.ref, "b")}
            </Fragment>
          );
        }
        const render = PROVIDERS[item.type].bodyEnd;
        return render ? <Fragment key={item.ref}>{render(validId(item.type, item.id)!, item.ref)}</Fragment> : null;
      })}

      {(types.has("meta_pixel") || types.has("tiktok_pixel")) && <TrackingPageView />}

      {/* Read by the dashboard's "Check my store" to confirm what is live. */}
      <script
        type="application/json"
        id="ct-tracking-manifest"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(manifest).replace(/</g, "\\u003c") }}
      />

      {debug && <TrackingDebugPanel items={debugItems} />}
    </>
  );
}
