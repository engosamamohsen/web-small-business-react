// PrimeReact's theme for components that are loaded on demand (the sign-in dialog in the header):
// the stylesheet is added only when the dialog is opened, instead of with every page's first paint.
// Pages that show PrimeReact straight away import "@/styles/primereact-theme" instead.
import themeHref from "primereact/resources/themes/lara-light-cyan/theme.css?url";

let loading: Promise<void> | null = null;

/** Adds the theme stylesheet once; resolves when it has loaded (or failed), so the dialog opens styled. */
export function loadPrimeTheme(): Promise<void> {
    if (typeof document === "undefined") return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = themeHref;
        link.onload = () => resolve();
        link.onerror = () => resolve();
        document.head.appendChild(link);
    });
    return loading;
}
