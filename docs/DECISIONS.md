# KICK Home Care — Architectural Decisions (`docs/DECISIONS.md`)

This document records architectural, data model, and conflict resolution decisions made for the KICK Home Care production migration.

---

## 1. Storefront vs Admin Mock Data Conflicts (Section 6 & 31)

### Bleach Liquid
- **Storefront**: Price Rs. 425, Compare At Rs. 500, Volume 1 Litre.
- **Old Seed**: Price Rs. 250, Sale Price Rs. 220, Volume 500ml.
- **Decision**: Storefront values are authoritative (Price: Rs. 425, Compare At: Rs. 500, Size: 1 Litre).

### Dishwash Liquid
- **Storefront**: Price Rs. 315, Compare At Rs. 350, Volume 500ml (and 1L variant at Rs. 430, compare at Rs. 490).
- **Old Seed**: Price Rs. 280, Sale Price Rs. 250.
- **Decision**: Storefront values are authoritative (Price: Rs. 315, Compare At: Rs. 350).

### White Sneaker Cleaner
- **Storefront**: Price Rs. 380, Compare At Rs. 420, Volume 500ml.
- **Old Seed**: Price Rs. 250, Sale Price Rs. 220, Volume 100ml.
- **Decision**: Storefront values are authoritative (Price: Rs. 380, Compare At: Rs. 420, Size: 500ml).

### Liquid Shoe Polish
- **Storefront**: Price Rs. 520, Variants: Black, Brown, Neutral.
- **Old Seed**: Price Rs. 250, Sale Price Rs. 220.
- **Decision**: Storefront values are authoritative (Price: Rs. 520, Variants: Black, Brown, Neutral).

---

## 2. Database & ODM Selection (Section 7, 9, 62)
- **Engine**: MongoDB Atlas exclusively via Mongoose ODM.
- **No Supabase / Prisma**: All references or residual Supabase folders have been completely purged from the repository.
- **Connection Caching**: Implemented in `lib/mongodb.ts` / `lib/mongodb.js` / `lib/db.js` with global connection caching to prevent connection exhaustion in serverless Vercel function instances.

---

## 3. Data Schema Alignment & Dual Compatibility
To satisfy strict Section 9-21 schema requirements without breaking existing frontend component props:
1. **User**: Fields `fullName`, `email`, `phone`, `passwordHash`, `role`, `emailVerified`, `verificationCodeHash`, `verificationCodeExpiresAt`, `verificationAttempts`, `verificationResendCount`, `verificationResendWindowStart`, `resetCodeHash`, `resetCodeExpiresAt`, `resetAttempts`. Provides virtual/compatibility getter for `name` and `password`.
2. **Category**: Canonical fields `name`, `slug`, `description`, `imageUrl`, `bannerUrl`, `sortOrder`, `isActive`. Supports `image` alias.
3. **Product**: Canonical fields `name`, `slug`, `categoryId`, `shortDescription`, `description`, `price`, `compareAtPrice`, `sizeLabel`, `variants`, `stock`, `sku`, `isFeatured`, `isActive`, `ratingAvg`, `ratingCount`, `images`, `seoTitle`, `seoDescription`. Dual-property getters support `category`, `salePrice`, `rating`, `numReviews`.
4. **Favorites / Wishlist**: `Favorite` collection with `{ userId: 1, productId: 1 }` compound unique index.
5. **Cart**: `CartItem` collection with `{ userId: 1, productId: 1, variant: 1 }` compound unique index, alongside compatible Cart service.
6. **Orders & Order Items**: `Order` with `orderNumber` (`KICK-######`), pricing breakdown (`subtotal`, `discount`, `shippingFee`, `total`), payment status, and snapshot `orderItems`.
7. **Coupons**: Server-side validated percentage/fixed coupons with `code`, `type`, `value`, `minOrder`, `maxUses`, `usedCount`, `expiresAt`.

---

## 4. Authentication & Session Strategy (Section 22-26)
- **Token Storage**: Replace `localStorage` token storage with HTTP-only, secure, `SameSite=Lax` cookies.
- **Development Bypass**: Deprecate and remove fake `admin_dev` bypass. All requests require real MongoDB user validation.
- **Email Verification**: Cryptographic 6-digit OTP stored as a SHA-256 hash with 10-minute expiry, max 5 attempts, and 60s resend cooldown.

---

## 5. Image Storage Architecture (Section 29)
- Local `/public` assets preserved for baseline seeded products.
- New uploads will be processed through server-side validation (WebP conversion, max 1600px, max 5MB, strict MIME inspection) and stored in Cloudinary/Vercel Blob object storage.
