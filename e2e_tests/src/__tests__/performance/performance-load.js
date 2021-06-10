const { chromium } = require('playwright');
const logger = require('../../_utils/logger');


describe('Time to chart ready in desktop', () => {

    test("[performance]-time-to-chart-ready", async () => {

        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:8080/');

        let chart_ready_time = Date.now()
        let performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())));
        const local_load_time = (chart_ready_time - performanceTiming.timing.connectStart)/1000;


        chart_ready_time = Date.now()
        performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON())));
        await page.goto('https://charts.binary.com/');
        const prod_load_time = (chart_ready_time - performanceTiming.timing.connectStart)/1000;


        console.log('local:', local_load_time);
        console.log('prod:', prod_load_time);

        logger.save(expect.getState().testPath, 'Chart ready for desktop:', {
            'local load time:': local_load_time,
            'production load time:': prod_load_time,
            'difference:': `${parseFloat(prod_load_time - local_load_time).toFixed(3)} (s)`,
        });

        await page.close();
    });
})