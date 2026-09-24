import Script from "next/script";
import type { ReactNode } from "react";

/**
 * Tracking services the dashboard can add (Laravel: App\Support\Tracking\TrackingProviders).
 * To support a new one, add it here; until then the storefront simply skips it.
 */
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
  /** Re-checked here because the ID ends up inside inline JS */
  pattern: RegExp;
  head?: (id: string) => ReactNode;
  bodyStart?: (id: string) => ReactNode;
  bodyEnd?: (id: string, ref: string) => ReactNode;
  probe: (id: string) => Probe;
};

export const PROVIDERS: Record<string, Provider> = {
  meta_pixel: {
    label: "بكسل Meta",
    pattern: /^\d{6,20}$/,
    bodyStart: (id) => (
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`} />
      </noscript>
    ),
    bodyEnd: (id, ref) => (
      <Script id={`ct-${ref}`} strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
      </Script>
    ),
    probe: () => ({ load: ["connect.facebook.net"], send: ["facebook.com/tr"] }),
  },

  google_analytics: {
    label: "Google Analytics",
    pattern: /^G-[A-Z0-9]{4,20}$/,
    bodyEnd: (id, ref) => (
      <>
        <Script id={`ct-${ref}-src`} src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
        <Script id={`ct-${ref}`} strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
        </Script>
      </>
    ),
    probe: (id) => ({ load: [`gtag/js?id=${id}`], send: ["/g/collect"] }),
  },

  google_tag_manager: {
    label: "Google Tag Manager",
    pattern: /^GTM-[A-Z0-9]{4,12}$/,
    bodyStart: (id) => (
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
      </noscript>
    ),
    bodyEnd: (id, ref) => (
      <Script id={`ct-${ref}`} strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`}
      </Script>
    ),
    probe: (id) => ({ load: [`gtm.js?id=${id}`] }),
  },

  microsoft_clarity: {
    label: "Microsoft Clarity",
    pattern: /^[a-z0-9]{6,20}$/,
    bodyEnd: (id, ref) => (
      <Script id={`ct-${ref}`} strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
      </Script>
    ),
    probe: (id) => ({ load: [`clarity.ms/tag/${id}`], send: ["clarity.ms/collect"] }),
  },

  google_search_console: {
    label: "Google Search Console",
    pattern: /^[A-Za-z0-9_-]{20,100}$/,
    // Must be in the server HTML: Google reads the page without running JS.
    head: (id) => <meta name="google-site-verification" content={id} />,
    probe: (id) => ({ selector: `meta[name="google-site-verification"][content="${id}"]` }),
  },

  tiktok_pixel: {
    label: "بكسل TikTok",
    pattern: /^[A-Z0-9]{15,30}$/,
    bodyEnd: (id, ref) => (
      <Script id={`ct-${ref}`} strategy="afterInteractive">
        {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${id}');ttq.page();}(window,document,'ttq');`}
      </Script>
    ),
    probe: () => ({ load: ["analytics.tiktok.com/i18n/pixel"], send: ["analytics.tiktok.com/api"] }),
  },
};

export function validId(type: string, id?: string): string | null {
  const provider = PROVIDERS[type];
  const value = (id ?? "").trim();
  return provider && provider.pattern.test(value) ? value : null;
}
