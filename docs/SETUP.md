# KICK Home Care — Setup & Development Guide (`docs/SETUP.md`)

This guide walks through configuring, seeding, and running the KICK Home Care production application locally and on Vercel.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **npm**: v9 or higher.
- **MongoDB**: MongoDB Atlas Cluster connection URI (or local MongoDB v6/v7 for development).
- **SMTP Provider**: Mailtrap, Resend, SendGrid, or Gmail SMTP for 6-digit OTP delivery.

---

## 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/kickhomecare?retryWrites=true&w=majority
MONGODB_DB_NAME=kickhomecare
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# SMTP / Email OTP Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=KICK Home Care <noreply@kickhomecare.com>

# Initial Admin Credentials
ADMIN_EMAIL=admin@kickhomecare.com
ADMIN_PASSWORD=KickAdmin2026Secure!
ADMIN_NOTIFY_EMAIL=orders@kickhomecare.com

# Session Secret (random 32+ char string)
AUTH_SECRET=super_secret_auth_key_kick_home_care_2026

# Optional: Upstash Redis for Distributed Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional: Cloudflare Turnstile
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

---

## 3. Installation
Install project dependencies:
```bash
npm install
```

---

## 4. Database Seeding
Seed the 6 canonical categories and all known storefront products into MongoDB:
```bash
npm run seed
```

This populates:
- 6 Categories (`Shoe Care`, `Laundry Care`, `Home Cleaning`, `Dish Care`, `Washroom Cleaning`, `Mosquito Protection`).
- Storefront products with accurate pricing (e.g. Kick Bleach Liquid at Rs. 425, Dishwash Liquid at Rs. 315, Sneaker Cleaner at Rs. 380, Liquid Shoe Polish at Rs. 520, etc.).

---

## 5. Admin Provisioning
Create a verified administrator account from your `.env` settings:
```bash
npm run create-admin
```

---

## 6. Running the Application
### Development Mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm start
```

---

## 7. Visual Baseline & Testing
To capture or re-verify visual baseline screenshots across viewports (1440px, 768px, 390px):
```bash
node scripts/capture-baseline.mjs
```
Baseline screenshots are stored in `docs/baseline/`.

To run Playwright automated smoke tests:
```bash
npx playwright test
```
