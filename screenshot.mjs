import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [, , url, label, selector] = process.argv;

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label] [selector]');
  process.exit(1);
}

const dir = path.join(__dirname, 'temporary screenshots');
fs.mkdirSync(dir, { recursive: true });

function nextIndex() {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const nums = files
    .map((f) => f.match(/^screenshot-(\d+)/))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  return nums.length ? Math.max(...nums) + 1 : 1;
}

const index = nextIndex();
const filename = label ? `screenshot-${index}-${label}.png` : `screenshot-${index}.png`;
const filePath = path.join(dir, filename);

const browser = await puppeteer.launch({ headless: true });

try {
  const page = await browser.newPage();
  const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH, 10) || 1440;
  const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT, 10) || 900;
  await page.setViewport({ width: viewportWidth, height: viewportHeight });
  await page.goto(url, { waitUntil: 'networkidle0' });

  if (selector) {
    await page.waitForSelector(selector, { timeout: 10000 });
    const element = await page.$(selector);
    await element.scrollIntoView();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await element.screenshot({ path: filePath });
  } else {
    // Scroll through the full page first so scroll-triggered reveal
    // animations (IntersectionObserver) fire before the capture.
    // Scrolling is forced to 'auto' (instant) because 'scroll-behavior: smooth'
    // on <html> would otherwise fight the stepped programmatic scroll.
    await page.evaluate(async () => {
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';

      const distance = 400;
      const delay = 200;
      let position = 0;
      const maxScroll = document.body.scrollHeight;
      // Clamp the last step to maxScroll instead of following the loop with a
      // separate final scrollTo() to the same position — that redundant repeat
      // scroll was observed to desync scroll-spy IntersectionObservers when
      // jumping back to top right after.
      while (position < maxScroll) {
        position = Math.min(position + distance, maxScroll);
        window.scrollTo({ top: position, left: 0, behavior: 'auto' });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.style.scrollBehavior = previousBehavior;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    await page.screenshot({ path: filePath, fullPage: true });
  }

  console.log(`Screenshot enregistré : ${filePath}`);
} finally {
  await browser.close();
}
