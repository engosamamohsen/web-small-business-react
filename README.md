# Alelm V2 - Astro E-Commerce Platform

A production-ready, SEO-first e-commerce platform built with **Astro 5**, migrated from Next.js 15. This platform leverages Astro's static-first architecture with React Islands for optimal performance, featuring multi-tenant support, RTL Arabic interface, and comprehensive SEO capabilities.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Pages & Routes](#pages--routes)
6. [Components](#components)
7. [Data Fetching](#data-fetching)
8. [State Management](#state-management)
9. [SEO Implementation](#seo-implementation)
10. [Styling & Theming](#styling--theming)
11. [Performance Optimizations](#performance-optimizations)
12. [Environment Configuration](#environment-configuration)
13. [Getting Started](#getting-started)
14. [Development](#development)
15. [Deployment](#deployment)
16. [Migration Notes](#migration-notes)

---

## Overview

Alelm V2 is a multi-tenant e-commerce platform designed for Arabic-speaking markets. The Astro version prioritizes:

- **SEO Excellence**: Static HTML generation with proper meta tags, structured data, sitemap, and robots.txt
- **Performance**: Astro Islands architecture ships minimal JavaScript, achieving excellent Core Web Vitals
- **RTL Support**: Full right-to-left layout with Arabic typography
- **Multi-Tenancy**: Subdomain-based tenant isolation with dynamic theming
- **Modern UX**: Smooth interactions via React Islands for interactive components

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | 5.x | Static-first web framework with Islands architecture |
| **React** | 19.x | UI library for interactive components (Islands) |
| **TypeScript** | 5.x | Type safety and developer experience |

### Styling
| Technology | Purpose |
|------------|---------|
| **TailwindCSS** | Utility-first CSS framework |
| **CSS Variables** | Dynamic theming from API settings |
| **PostCSS** | CSS processing with Autoprefixer |

### State Management
| Technology | Purpose |
|------------|---------|
| **Jotai** | Atomic state for cart, settings, auth |
| **js-cookie** | Client-side cookie management for tokens |

### UI Components
| Technology | Purpose |
|------------|---------|
| **Swiper** | Banner/product carousels |
| **Lucide React** | Icon library |
| **React Toastify** | Toast notifications |
| **React Paginate** | Pagination component |
| **React Hook Form** | Form handling with validation |
| **Zod** | Schema validation |

### Integrations
| Technology | Purpose |
|------------|---------|
| **@astrojs/react** | React Islands support |
| **@astrojs/tailwind** | Tailwind integration |
| **@astrojs/sitemap** | Automatic sitemap generation |

---

## Architecture

### Astro Islands Pattern

The application uses Astro's Islands architecture to optimize JavaScript delivery:

```
┌─────────────────────────────────────────────────────────┐
│                    Astro Page (.astro)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Static HTML (Zero JS)                 │  │
│  │  - Header structure, Footer, SEO meta tags         │  │
│  │  - Product grids layout, Category lists           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ React Island│  │ React Island│  │  React Island   │  │
│  │ client:load │  │client:visible│  │  client:idle   │  │
│  │  (Header)   │  │  (Products) │  │ (ColorHandler) │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Hydration Strategies

| Directive | Usage | Components |
|-----------|-------|------------|
| `client:load` | Hydrate immediately | Header, LoginButton, Cart, Forms |
| `client:visible` | Hydrate when visible | Products, Categories, Hero |
| `client:idle` | Hydrate when idle | ColorHandler, ToastContainer |

### Rendering Modes

| Page Type | Mode | Reason |
|-----------|------|--------|
| Home (`/`) | SSR | Dynamic search params for filtering |
| Product Detail | SSR | Dynamic product data with SEO |
| Cart, Checkout | SSR | User-specific data |
| Auth Pages | Static | Forms handle auth client-side |
| 404, 500 | Static | Error pages pre-built |

---

## Project Structure

```
astro/
├── public/
│   ├── robots.txt              # SEO: Crawler directives
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Auth/               # Authentication forms
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── VerifyEmail.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── Cart/
│   │   │   └── Cart.tsx        # Shopping cart management
│   │   ├── Categories/
│   │   │   └── Categories.tsx  # Category filter buttons
│   │   ├── Checkout/
│   │   │   └── Checkout.tsx    # Multi-step checkout
│   │   ├── Footer/
│   │   │   └── Footer.astro    # Static footer (zero JS)
│   │   ├── Header/
│   │   │   ├── Header.tsx      # Navigation with cart icon
│   │   │   └── LoginButton.tsx # Auth state button
│   │   ├── Hero/
│   │   │   └── Hero.tsx        # Banner carousel (Swiper)
│   │   ├── OfferProducts/
│   │   │   └── OfferProducts.tsx
│   │   ├── Orders/
│   │   │   ├── OrderList.tsx
│   │   │   └── OrderDetail.tsx
│   │   ├── Products/
│   │   │   ├── Products.tsx    # Product grid with pagination
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductDetail.tsx
│   │   ├── Profile/
│   │   │   ├── Profile.tsx
│   │   │   └── EditProfile.tsx
│   │   ├── ColorHandler.tsx    # Dynamic theme CSS variables
│   │   └── ToastContainer.tsx  # Notifications
│   ├── config/
│   │   └── subdomain.ts.example # Multi-tenant config
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Main layout with SEO
│   │   └── AuthLayout.astro    # Simplified auth layout
│   ├── lib/
│   │   ├── fetch-hook.ts       # API fetching utility
│   │   └── fetchSettings.ts    # Settings with caching
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── cart.astro
│   │   ├── checkout.astro
│   │   ├── login.astro
│   │   ├── register.astro
│   │   ├── 404.astro
│   │   ├── 500.astro
│   │   ├── forgot-password/
│   │   │   └── index.astro
│   │   ├── order/
│   │   │   ├── index.astro
│   │   │   └── [order_id].astro
│   │   ├── products/
│   │   │   └── [product_id].astro
│   │   ├── profile/
│   │   │   ├── index.astro
│   │   │   └── edit.astro
│   │   └── verify/
│   │       └── [email].astro
│   ├── stores/
│   │   ├── cart.ts             # Jotai cart atoms
│   │   └── settings.ts         # Settings & auth atoms
│   ├── styles/
│   │   └── globals.css         # Global styles & Tailwind
│   ├── types/
│   │   └── types.ts            # TypeScript interfaces
│   └── utils/
│       └── utils.ts            # cn() utility
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
├── .env.example
└── .gitignore
```

---

## Pages & Routes

### Public Pages

| Route | File | Description | Rendering |
|-------|------|-------------|-----------|
| `/` | `index.astro` | Home with banners, categories, products | SSR |
| `/products/[id]` | `products/[product_id].astro` | Product detail with SEO | SSR |
| `/login` | `login.astro` | User login | Static |
| `/register` | `register.astro` | User registration | Static |
| `/forgot-password` | `forgot-password/index.astro` | Password reset | Static |
| `/verify/[email]` | `verify/[email].astro` | Email verification | SSR |

### Protected Pages (Require Auth)

| Route | File | Description |
|-------|------|-------------|
| `/cart` | `cart.astro` | Shopping cart |
| `/checkout` | `checkout.astro` | Order checkout |
| `/profile` | `profile/index.astro` | User profile |
| `/profile/edit` | `profile/edit.astro` | Edit profile |
| `/order` | `order/index.astro` | Order history |
| `/order/[id]` | `order/[order_id].astro` | Order details |

### Error Pages

| Route | File | Description |
|-------|------|-------------|
| `/404` | `404.astro` | Not found |
| `/500` | `500.astro` | Server error |

---

## Components

### Static Components (Zero JS)

| Component | File | Description |
|-----------|------|-------------|
| **Footer** | `Footer/Footer.astro` | Site footer with social links |

### React Islands (Interactive)

| Component | Hydration | Description |
|-----------|-----------|-------------|
| **Header** | `client:load` | Navigation, cart count, login button |
| **LoginButton** | `client:load` | Authentication state toggle |
| **Hero** | `client:load` | Banner carousel with Swiper |
| **Categories** | `client:visible` | Category filter buttons |
| **Products** | `client:visible` | Product grid with pagination |
| **ProductCard** | (child) | Individual product card |
| **ProductDetail** | `client:load` | Full product view with add to cart |
| **OfferProducts** | `client:visible` | Featured products section |
| **Cart** | `client:load` | Cart management |
| **Checkout** | `client:load` | Multi-step checkout form |
| **LoginForm** | `client:load` | Login form with validation |
| **RegisterForm** | `client:load` | Registration form |
| **VerifyEmail** | `client:load` | OTP verification |
| **ForgotPasswordForm** | `client:load` | Password reset request |
| **Profile** | `client:load` | User profile display |
| **EditProfile** | `client:load` | Profile edit form |
| **OrderList** | `client:load` | Order history list |
| **OrderDetail** | `client:load` | Single order view |
| **ColorHandler** | `client:idle` | Dynamic theme variables |
| **ToastContainer** | `client:idle` | Toast notifications |

---

## Data Fetching

### Server-Side (Astro Pages)

Data is fetched at build/request time in Astro page frontmatter:

```astro
---
import { fetchHook } from '@/lib/fetch-hook';

const productsRes = await fetchHook({ url: 'v1/products' });
const products = productsRes.ok ? productsRes.data : [];
---
```

### Client-Side (React Islands)

React components use the same `fetchHook` with token injection:

```typescript
import { fetchHook } from '@/lib/fetch-hook';
import Cookies from 'js-cookie';

const token = Cookies.get('app_token');
const response = await fetchHook({
  url: 'v1/basket',
  token,
  init: { method: 'POST', body: JSON.stringify(data) }
});
```

### fetchHook Features

- **Timeout handling**: 60-second timeout with abort controller
- **Error normalization**: Consistent error response format
- **Token injection**: Automatic Authorization header
- **Content-Type**: JSON by default
- **Multi-tenant**: Uses `PUBLIC_API_URL` environment variable

---

## State Management

### Jotai Atoms

```typescript
// Cart State
export const cartCountAtom = atom(0);
export const cartItemsAtom = atom<CartItem[]>([]);
export const cartTotalAtom = atom((get) => 
  get(cartItemsAtom).reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Settings State
export const settingsAtom = atom<Settings | null>(null);
export const isLoggedInAtom = atom(false);
```

### State Flow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│ ColorHandler│ ───► │  Jotai Store │ ◄─── │   Header    │
│  (init)     │      │              │      │ (read cart) │
└─────────────┘      └──────────────┘      └─────────────┘
                            ▲
                            │
                     ┌──────┴──────┐
                     │ ProductDetail│
                     │ (update cart)│
                     └─────────────┘
```

---

## SEO Implementation

### Meta Tags (BaseLayout.astro)

```astro
<meta name="description" content={description} />
<meta name="keywords" content={keywords} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content="website" />
<meta property="og:locale" content="ar_EG" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={image} />
```

### Product Schema (Product Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://...",
  "brand": { "@type": "Brand", "name": "Store Name" },
  "offers": {
    "@type": "Offer",
    "price": 100,
    "priceCurrency": "EGP",
    "availability": "https://schema.org/InStock"
  }
}
```

### Sitemap Configuration

```javascript
// astro.config.mjs
sitemap({
  filter: (page) => !page.includes('/cart') && !page.includes('/checkout'),
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: new Date(),
})
```

### robots.txt

```
User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /profile/
Disallow: /order/
Sitemap: https://example.com/sitemap-index.xml
```

---

## Styling & Theming

### Dynamic Theme via CSS Variables

Colors are set dynamically from API settings:

```typescript
// ColorHandler.tsx
useLayoutEffect(() => {
  document.documentElement.style.setProperty('--main-color', settings.main_color);
  document.documentElement.style.setProperty('--second-font-color', settings.second_color);
  document.documentElement.style.setProperty('--main-background', settings.main_background);
}, [settings]);
```

### Tailwind Configuration

```javascript
// tailwind.config.mjs
theme: {
  extend: {
    colors: {
      primary: 'var(--main-color)',
      secondary: 'var(--second-font-color)',
    },
    backgroundColor: {
      main: 'var(--main-background)',
      second: 'var(--second-background)',
    }
  }
}
```

### RTL Support

```astro
<html lang="ar" dir="rtl">
```

---

## Performance Optimizations

### Astro Benefits

| Optimization | Impact |
|--------------|--------|
| **Static HTML** | Zero JS for static content |
| **Islands** | JS only for interactive parts |
| **View Transitions** | Smooth page navigation |
| **Image Optimization** | Automatic via @astrojs/image |

### Hydration Strategies

| Strategy | Components | When |
|----------|------------|------|
| `client:load` | Critical interactive | Page load |
| `client:visible` | Below fold | In viewport |
| `client:idle` | Non-critical | Browser idle |

### Bundle Analysis

Expected JavaScript reduction vs Next.js:
- **Home Page**: ~70% less JS
- **Product Pages**: ~60% less JS
- **Static Pages (404, Auth)**: ~90% less JS

---

## Environment Configuration

### Required Variables

```env
# API Configuration
PUBLIC_API_URL=https://api.example.com

# Site Configuration  
PUBLIC_SITE_URL=https://example.com

# Firebase (Optional - for social login)
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=

# Multi-tenant (Optional)
PUBLIC_SUBDOMAIN=store-name
```

### Setup

```bash
cp .env.example .env
# Edit .env with your values
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm

### Installation

```bash
# Navigate to astro directory
cd astro

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 4321 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run astro` | Astro CLI commands |

---

## Development

### Adding New Pages

1. Create `.astro` file in `src/pages/`
2. Import layout and components
3. Fetch data in frontmatter
4. Set `export const prerender = false` for SSR

### Adding React Islands

1. Create `.tsx` file in `src/components/`
2. Export default function component
3. Import in Astro page
4. Add hydration directive: `<Component client:load />`

### Type Safety

All types are defined in `src/types/types.ts`:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  // ...
}
```

---

## Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory

### Hosting Options

| Platform | Config |
|----------|--------|
| **Vercel** | Zero config, auto-detects Astro |
| **Netlify** | Zero config with `@astrojs/netlify` |
| **Cloudflare Pages** | Use `@astrojs/cloudflare` |
| **Node.js** | Use `@astrojs/node` adapter |

### Vercel Deployment

```bash
npm i -g vercel
vercel
```

---

## Migration Notes

### From Next.js to Astro

| Next.js | Astro |
|---------|-------|
| `app/page.tsx` | `pages/index.astro` |
| `layout.tsx` | `layouts/BaseLayout.astro` |
| `"use client"` components | React Islands with `client:*` |
| `next/image` | Native `<img>` or `@astrojs/image` |
| `next/link` | Native `<a>` tags |
| `next/navigation` | `Astro.url`, `window.location` |
| `generateMetadata` | Astro frontmatter props |
| `sitemap.ts` | `@astrojs/sitemap` integration |

### Key Differences

1. **No Client Components by Default**: Everything is static unless using Islands
2. **No App Router**: File-based routing in `pages/`
3. **Props via Frontmatter**: Data fetching happens in `---` block
4. **Explicit Hydration**: Must specify when JS loads

### Preserved Features

- ✅ All UI components and styling
- ✅ Multi-tenant subdomain support
- ✅ Dynamic theming via CSS variables
- ✅ RTL Arabic support
- ✅ Authentication flow
- ✅ Cart and checkout functionality
- ✅ Order management
- ✅ SEO metadata and structured data

---

## License

Private - All rights reserved.

---

## Support

For issues or questions, contact the development team.
