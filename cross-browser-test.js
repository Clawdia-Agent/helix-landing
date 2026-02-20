const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotsDir = './docs/screenshots';

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureScreenshots(browserType, browserName) {
  console.log(`\n📸 Testing ${browserName}...`);
  
  try {
    const browser = await browserType.launch();
    
    const viewports = [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'tablet', width: 900, height: 1024 },
      { name: 'mobile', width: 375, height: 667 },
    ];
    
    for (const viewport of viewports) {
      console.log(`  - ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      
      const page = await context.newPage();
      
      try {
        await page.goto('http://localhost:3002', { waitUntil: 'networkidle', timeout: 30000 });
        
        // Full page screenshot
        await page.screenshot({
          path: `${screenshotsDir}/${browserName}-${viewport.name}-full.png`,
          fullPage: true,
        });
        
        // Hero section screenshot
        const hero = page.locator('.hero');
        if (await hero.isVisible()) {
          await hero.screenshot({
            path: `${screenshotsDir}/${browserName}-${viewport.name}-hero.png`,
          });
        }
        
        console.log(`    ✅ Screenshots captured`);
      } catch (e) {
        console.log(`    ❌ Error: ${e.message}`);
      }
      
      await context.close();
    }
    
    await browser.close();
    console.log(`  ✅ ${browserName} tests complete`);
    return true;
  } catch (e) {
    console.log(`  ❌ ${browserName} failed: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Cross-Browser Validation Script');
  console.log('==================================\n');
  
  await ensureDir(screenshotsDir);
  
  const results = {
    chromium: false,
    firefox: false,
    webkit: false,
  };
  
  // Test each browser
  results.chromium = await captureScreenshots(chromium, 'chromium');
  results.firefox = await captureScreenshots(firefox, 'firefox');
  results.webkit = await captureScreenshots(webkit, 'webkit');
  
  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Chromium (Chrome/Edge): ${results.chromium ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Firefox: ${results.firefox ? '✅ Pass' : '❌ Fail'}`);
  console.log(`WebKit (Safari): ${results.webkit ? '✅ Pass' : '❌ Fail'}`);
  
  // Write JSON results
  fs.writeFileSync(
    `${screenshotsDir}/results.json`,
    JSON.stringify(results, null, 2)
  );
  
  console.log(`\n📁 Screenshots saved to ${screenshotsDir}/`);
}

main().catch(console.error);
