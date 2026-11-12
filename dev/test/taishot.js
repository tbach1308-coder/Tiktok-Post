const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const r = {};
  for (const w of [1280, 400]) {
    const p = await b.newPage({ viewport: { width: w, height: 760 } });
    await p.goto('http://poly-thu.example/tai'); await p.waitForTimeout(500);
    await p.screenshot({ path: `shots/tai-${w}.png` }); r[w] = await p.evaluate(() => document.documentElement.scrollWidth); await p.close();
  }
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://127.0.0.1:8790/'); await p.waitForTimeout(1500); await p.click('#bChung'); await p.waitForSelector('#chChepTai');
  await (await p.$('#chBox')).screenshot({ path: 'shots/chung-chu2.png' });
  console.log(JSON.stringify(r)); await b.close();
})();
