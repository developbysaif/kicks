# KICK Home Care — Codebase Audit (Phase 0)

## 1. Overview
KICK Home Care is an e-commerce platform built for Pakistani home cleaning, laundry care, shoe care, dish care, washroom cleaning, and pest control products. The current repository contains a functioning Next.js frontend with mixed mock data, mock state handlers, initial REST API route templates, and legacy Express/Vite folders.

## 2. Technical Stack & Framework
- **Framework**: Next.js 14.2.35 (App Router with `app/` directory).
- **Language**: JavaScript (ES Modules, `jsconfig.json` path mapping `@/*` -> `./*`).
- **React**: React 18.3.1 / React DOM 18.3.1.
- **Styling**: Tailwind CSS 3.4.4, PostCSS 8.4.38, Autoprefixer 10.4.19, custom CSS micro-animations in `app/globals.css`.
- **Icons & Motion**: `lucide-react` (0.395.0), `framer-motion` (11.2.10).
- **Package Manager**: `npm` (Node v24.14.0, npm 11.20.0).
- **Database / ODM**: MongoDB Atlas with `mongoose` (v8.4.1).
- **Deployment Target**: Vercel (`vercel.json` configured for Next.js).

## 3. Project Structure
- `app/`: Next.js App Router routes & API endpoints.
  - Public routes: `/` (Home), `/shop`, `/shop/shoe-care`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/checkout`, `/track-order`, `/contact`, `/about`, `/login`, `/account`, `/wishlist`.
  - Admin routes: `/admin` (Dashboard), `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/inventory`, `/admin/customers`, `/admin/reviews`, `/admin/coupons`, `/admin/messages`.
  - API routes: `/api/auth/*`, `/api/products/*`, `/api/categories/*`, `/api/orders/*`, `/api/admin/*`, `/api/contact/*`, `/api/newsletter/*`, `/api/coupons/*`, `/api/seed/*`.
- `components/`: UI components (`Header.jsx`, `Footer.jsx`, `ProductCard.jsx`, `AdminLayout.jsx`, `CartDrawer.jsx`, `QuickViewModal.jsx`, `CompareModal.jsx`, `Providers.jsx`).
- `context/`: React context providers (`AuthContext.jsx`, `CartContext.jsx`, `WishlistContext.jsx`, `CompareContext.jsx`).
- `lib/`: Utilities (`db.js`, `jwt.js`, `seedData.js`).
- `models/`: Mongoose schemas.
- `public/`: Product assets, banners, brand assets (`kick logo.png`, `whitner bleach.png`, `dish wash liquid.png`, `Shoe Care.png`, etc.).
- `server/` & `client/`: Legacy Express/Vite artifacts from early prototyping; Next.js `app/` is the active production codebase.

## 4. Current Authentication & Security Assessment
- **Existing Flow**: Uses `jsonwebtoken` with bearer tokens stored in client `localStorage` (`userInfo`).
- **Security Deficit in Prior Code**: In local development, `lib/jwt.js` and `context/AuthContext.jsx` fall back to an automatic synthetic admin user (`admin_dev`). This must be eliminated in favor of real, secure server-side HTTP-only session cookies.
- **Email Verification**: Previously absent; needs 6-digit cryptographic OTP generation, secure hashing (never stored plain), 10-minute expiry, and attempt limits.
- **Admin Protection**: Admin routes previously relied largely on client-side state checks (`user?.role === 'admin'`). Needs server-side session and role validation at page, API, and middleware layers.

## 5. Mock Data Audit
- Hardcoded product and category arrays existed in `app/page.jsx`, `app/category/[slug]/page.jsx`, `app/shop/shoe-care/ShoeCareClient.jsx`, `app/admin/products/page.jsx`, etc.
- These will be migrated to and dynamically served exclusively from MongoDB Atlas.

## 6. Image Handling
- Images currently resolve to local `/public/*.png` and `/public/*.jpg` static assets alongside Unsplash fallback URLs.
- Admin product uploads will be validated (min 1, max 3, WebP, max 5MB) and saved to cloud image storage (Cloudinary / Vercel compatible object storage).

## 7. Baseline Visual Capture
- Captured 78 baseline screenshots across 26 routes at 1440px, 768px, and 390px viewports under `docs/baseline/`.
- Every subsequent phase will maintain 100% visual fidelity against this baseline.
