import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
];

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'shop', path: '/shop' },
  { name: 'shop-shoe-care', path: '/shop/shoe-care' },
  { name: 'category-laundry-care', path: '/category/laundry-care' },
  { name: 'category-home-cleaning', path: '/category/home-cleaning' },
  { name: 'category-dish-care', path: '/category/dish-care' },
  { name: 'category-washroom-cleaning', path: '/category/washroom-cleaning' },
  { name: 'category-mosquito-protection', path: '/category/mosquito-protection' },
  { name: 'product-kick-bleach-liquid', path: '/product/kick-bleach-liquid' },
  { name: 'login', path: '/login' },
  { name: 'account', path: '/account' },
  { name: 'wishlist', path: '/wishlist' },
  { name: 'cart', path: '/cart' },
  { name: 'checkout', path: '/checkout' },
  { name: 'track-order', path: '/track-order' },
  { name: 'contact', path: '/contact' },
  { name: 'about', path: '/about' },
  { name: 'admin', path: '/admin' },
  { name: 'admin-products', path: '/admin/products' },
  { name: 'admin-categories', path: '/admin/categories' },
  { name: 'admin-orders', path: '/admin/orders' },
  { name: 'admin-inventory', path: '/admin/inventory' },
  { name: 'admin-customers', path: '/admin/customers' },
  { name: 'admin-reviews', path: '/admin/reviews' },
  { name: 'admin-coupons', path: '/admin/coupons' },
  { name: 'admin-messages', path: '/admin/messages' },
];

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('docs/baseline');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`Taking baseline screenshots for ${vp.name}px (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      const filename = `${route.name}-${vp.name}px.png`;
      const filepath = path.join(OUTPUT_DIR, filename);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`  ✓ ${filename}`);
      } catch (err) {
        console.warn(`  ✗ Failed ${url} at ${vp.name}px: ${err.message}`);
        try {
          await page.screenshot({ path: filepath, fullPage: true });
        } catch (_) {}
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('Baseline screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error running baseline capture:', err);
  process.exit(1);
});
