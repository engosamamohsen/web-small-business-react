# Settings & UI Updates Complete

I have successfully updated the application per your request.

### Key Changes:

1.  **API Integration**: Updated `fetchSettings` to use `https://admin-emend.cashierthru.com/api` and handle the new response structure (`SettingsData` type).
2.  **Cookies**: Implemented `SettingsCookieSync` to save critical settings (vat, tax, service) and full app settings to client-side cookies.
3.  **UI Updates**:
    *   **Header**: Now accepts server-side settings directly for faster load. Displays shop name beside logo.
    *   **Footer**: Parses phone numbers (space-separated) and displays them as clickable links. Shows logo, name, and social links.
    *   **WhatsApp**: Added a global floating WhatsApp button (bottom-left) using the settings phone number.
    *   **Product**: Handles default product image fallback using `product_default_image` from settings.
4.  **Performance**: Removed unused scripts and cleaned up `index.astro`.

### Verify:
Run `npm run dev` and check the Homepage footer, header, and floating button.
