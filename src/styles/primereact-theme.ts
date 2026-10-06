// PrimeReact's theme (224 KB of CSS). Imported by the components that use PrimeReact, so a page only
// loads it when it shows one of them (checkout, dialogs, forms), not on every page from Layout.astro.
// The theme sits in @layer primereact, so it never overrides the storefront's own (Tailwind) styles.
import "primereact/resources/themes/lara-light-cyan/theme.css";
