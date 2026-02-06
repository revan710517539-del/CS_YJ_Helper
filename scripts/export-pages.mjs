import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.VITE_URL || 'http://localhost:5173/';
const outputDir = path.resolve('exports');

const pages = [
  { name: '支行每日早报', navText: '支行每日早报', file: 'branch-daily.png' },
  { name: '家金每日早报', navText: '家金每日早报', file: 'wealth-daily.png' },
  { name: '智能客户洞察', navText: '智能客户洞察', file: 'ai-customer-insight.png' },
];

const waitForPageStability = async (page) => {
  await page.waitForTimeout(1200);
};

const run = async () => {
  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = 'mac15-arm64';
  const { chromium } = await import('playwright');

  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await waitForPageStability(page);

  for (const entry of pages) {
    await page.getByText(entry.navText, { exact: true }).click();
    await waitForPageStability(page);

    if (entry.name === '智能客户洞察') {
      await page.waitForSelector('iframe[title="AI Customer Insight"]');
      const frame = page.frame({ url: /AI_customer_insight\.html/ });
      if (frame) {
        await frame.waitForLoadState('networkidle');
      }
      await page.waitForTimeout(800);
    }

    const filePath = path.join(outputDir, entry.file);
    await page.screenshot({ path: filePath, fullPage: true });
  }

  await browser.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
