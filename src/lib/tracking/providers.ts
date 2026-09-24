/**
 * Tracking services the dashboard can add (Laravel: App\Support\Tracking\TrackingProviders).
 * To support a new one, add it here; until then the storefront simply skips it.
 *
 * Each renderer returns raw HTML for the server page. IDs are re-validated against
 * `pattern` first, because they end up inside inline JS.
 */

/** One tracking service the merchant added in the dashboard (Tracking & pixels). */
export type TrackingItem = {
  ref: string;
  type: string;
  id?: string;
  name?: string;
  placement?: "head" | "body";
  code?: string;
};

export type Probe = {
  /** URL parts that show the service's script loaded */
  load?: string[];
  /** URL parts that show it sent data to the service */
  send?: string[];
  /** CSS selector that must exist (for tags with no network request) */
  selector?: string;
};

type Provider = {
  label: string;
  pattern: RegExp;
  head?: (id: string) => string;
  bodyStart?: (id: string) => string;
  bodyEnd?: (id: string) => string;
  probe: (id: string) => Probe;
};

export const PROVIDERS: Record<string, Provider> = {
  meta_pixel: {
    label: "بكسل Meta",
    pattern: /^\d{6,20}$/,
    bodyStart: (id) =>
      `<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" /></noscript>`,
    bodyEnd: (id) =>
      `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');</script>`,
    probe: () => ({ load: ["connect.facebook.net"], send: ["facebook.com/tr"] }),
  },

  google_analytics: {
    label: "Google Analytics",
    pattern: /^G-[A-Z0-9]{4,20}$/,
    bodyEnd: (id) =>
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>` +
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');</script>`,
    probe: (id) => ({ load: [`gtag/js?id=${id}`], send: ["/g/collect"] }),
  },

  google_tag_manager: {
    label: "Google Tag Manager",
    pattern: /^GTM-[A-Z0-9]{4,12}$/,
    bodyStart: (id) =>
      `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
    bodyEnd: (id) =>
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');</script>`,
    probe: (id) => ({ load: [`gtm.js?id=${id}`] }),
  },

  microsoft_clarity: {
    label: "Microsoft Clarity",
    pattern: /^[a-z0-9]{6,20}$/,
    bodyEnd: (id) =>
      `<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");</script>`,
    probe: (id) => ({ load: [`clarity.ms/tag/${id}`], send: ["clarity.ms/collect"] }),
  },

  google_search_console: {
    label: "Google Search Console",
    pattern: /^[A-Za-z0-9_-]{20,100}$/,
    // Must be in the server HTML: Google reads the page without running JS.
    head: (id) => `<meta name="google-site-verification" content="${id}" />`,
    probe: (id) => ({ selector: `meta[name="google-site-verification"][content="${id}"]` }),
  },

  tiktok_pixel: {
    label: "بكسل TikTok",
    pattern: /^[A-Z0-9]{15,30}$/,
    bodyEnd: (id) =>
      `<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${id}');ttq.page();}(window,document,'ttq');</script>`,
    probe: () => ({ load: ["analytics.tiktok.com/i18n/pixel"], send: ["analytics.tiktok.com/api"] }),
  },
};

export function validId(type: string, id?: string): string | null {
  const provider = PROVIDERS[type];
  const value = (id ?? "").trim();
  return provider && provider.pattern.test(value) ? value : null;
}

// ===== Page parts =====

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Marker before pasted code, so the test panel can confirm it reached the page. */
const marker = (ref: string) => `<meta name="ct-custom-code" data-ct-ref="${escapeAttr(ref)}" />`;

/** Items the storefront can render: custom code, or a known service with a valid ID. */
export function knownItems(items: TrackingItem[] = [], skipGaId?: string): TrackingItem[] {
  return items.filter((i) => {
    if (!i || typeof i.ref !== "string") return false;
    if (i.type === "custom") return !!i.code?.trim();
    const id = validId(i.type, i.id);
    // The site-wide PUBLIC_GA_ID tag already loads this property: don't count views twice.
    return !!id && !(i.type === "google_analytics" && id === skipGaId);
  });
}

/** End of <head>: verification tags and the merchant's header code. */
export function headHtml(items: TrackingItem[]): string {
  return items
    .map((i) => {
      if (i.type === "custom") return i.placement === "head" ? marker(i.ref) + i.code : "";
      return PROVIDERS[i.type].head?.(validId(i.type, i.id)!) ?? "";
    })
    .join("");
}

/** Start of <body>: <noscript> fallbacks. */
export function bodyStartHtml(items: TrackingItem[]): string {
  return items
    .map((i) => (i.type === "custom" ? "" : PROVIDERS[i.type].bodyStart?.(validId(i.type, i.id)!) ?? ""))
    .join("");
}

/** End of <body>: loaders, the merchant's footer code and the manifest. */
export function bodyEndHtml(items: TrackingItem[]): string {
  const parts = items.map((i) => {
    if (i.type === "custom") return i.placement === "head" ? "" : marker(i.ref) + i.code;
    return PROVIDERS[i.type].bodyEnd?.(validId(i.type, i.id)!) ?? "";
  });
  // Read by the dashboard's "Check my store" to confirm what is live.
  const manifest = JSON.stringify(items.map((i) => ({ ref: i.ref, type: i.type }))).replace(/</g, "\\u003c");
  parts.push(`<script type="application/json" id="ct-tracking-manifest">${manifest}</script>`);
  return parts.join("");
}

/** What the ?ct_debug=1 test panel shows and watches for each item. */
export function debugItems(items: TrackingItem[]) {
  return items.map((i) => ({
    ref: i.ref,
    type: i.type,
    label: i.type === "custom" ? i.name || "كود مخصص" : PROVIDERS[i.type].label,
    probe: (i.type === "custom"
      ? { selector: `[data-ct-ref="${i.ref.replace(/["\\]/g, "\\$&")}"]` }
      : PROVIDERS[i.type].probe(validId(i.type, i.id)!)) as Probe,
  }));
}
