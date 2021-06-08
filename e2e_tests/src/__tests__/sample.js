const { chromium } = require('playwright');


describe('Time to chart ready in desktop', () => {
    test("[performance]-time-to-chart-ready", async () => {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('https://deriv.com/');

        expect(await page.title()).toBe('Example Domain');

        // await page.screenshot({ path: `example.png` });
        // await browser.close();
    });
})