import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '320px - Small Mobile', width: 320, height: 600 },
  { name: '375px - iPhone SE', width: 375, height: 667 },
  { name: '390px - iPhone 12/13/14', width: 390, height: 844 },
  { name: '430px - iPhone Pro Max', width: 430, height: 932 },
  { name: '768px - iPad Mini', width: 768, height: 1024 },
  { name: '1024px - iPad Pro / Small Laptop', width: 1024, height: 768 },
  { name: '1280px - Standard Desktop', width: 1280, height: 800 },
  { name: '1440px - Wide Laptop/Desktop', width: 1440, height: 900 },
  { name: '1920px - Full HD Desktop', width: 1920, height: 1080 }
];

const PAGES_TO_TEST = [
  '/',
  '/shop',
  '/cart',
  '/about',
  '/contact',
  '/track-order',
  '/category/laundry-care'
];

test.describe('Responsive Viewport & Overflow Tests (320px - 1920px)', () => {
  for (const vp of VIEWPORTS) {
    for (const pagePath of PAGES_TO_TEST) {
      test(`${pagePath} has no horizontal overflow at ${vp.name} (${vp.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

        // Wait for page hydration
        await page.waitForTimeout(400);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            scrollWidth,
            clientWidth,
            hasOverflow: scrollWidth > clientWidth + 1 // 1px threshold for subpixel antialiasing
          };
        });

        expect(overflow.hasOverflow).toBeFalsy();
      });
    }
  }
});
