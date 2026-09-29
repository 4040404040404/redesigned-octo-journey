const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  TARGET_URL: process.env.TARGET_URL || 'https://zealous-river-220556.puter.site',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  HEADLESS: true,
  TIMEOUT: 180000, // 3 minutes timeout
  VIEWPORT: {
    width: 1920,
    height: 1080
  }
};

// Logging setup
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `automation-${new Date().toISOString().replace(/:/g, '-')}.log`);

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  
  console.log(logMessage, data ? data : '');
  
  const fileEntry = data 
    ? `${logMessage} ${JSON.stringify(data, null, 2)}\n`
    : `${logMessage}\n`;
  
  fs.appendFileSync(logFile, fileEntry);
}

/**
 * Main automation function
 */
async function runAutomation() {
  let browser = null;
  let page = null;

  try {
    log('INFO', '🚀 Starting web automation...');
    log('INFO', `Target URL: ${CONFIG.TARGET_URL}`);

    // Launch browser
    browser = await puppeteer.launch({
      headless: CONFIG.HEADLESS,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Overcome limited resource problems
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check'
      ]
    });

    log('INFO', '✅ Browser launched');

    // Create page
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport(CONFIG.VIEWPORT);
    
    // Set timeout
    page.setDefaultTimeout(CONFIG.TIMEOUT);
    page.setDefaultNavigationTimeout(CONFIG.TIMEOUT);

    log('INFO', '📄 New page created');

    // Setup page event listeners
    page.on('error', (err) => {
      log('ERROR', 'Page error:', err);
    });

    page.on('console', msg => {
      if (CONFIG.DEBUG_MODE) {
        log('PAGE_LOG', msg.text());
      }
    });

    // Navigate to target URL
    log('INFO', `🌐 Navigating to ${CONFIG.TARGET_URL}`);
    try {
      await page.goto(CONFIG.TARGET_URL, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
      log('INFO', '✅ Page loaded successfully');
    } catch (err) {
      log('WARN', 'Navigation timeout or error:', err.message);
      // Continue anyway - page might be partially loaded
    }

    // Wait for DOM to be ready
    await page.waitForTimeout(2000);

    // Execute automation functions
    log('INFO', '🔄 Starting automation sequence...');

    // 1. Execute finale function
    log('INFO', '📍 Step 1: Executing finale() - Click confirmation button');
    await page.evaluate(finaleFunction);
    
    // Wait for follow-up actions
    await page.waitForTimeout(3000);

    // 2. Execute next function
    log('INFO', '📍 Step 2: Executing next() - Linkvertise initialization');
    await page.evaluate(nextFunction);
    
    // Wait for links to convert
    await page.waitForTimeout(3000);

    // 3. Execute link function
    log('INFO', '📍 Step 3: Executing link() - Click body link');
    await page.evaluate(linkFunction);
    
    // Wait for navigation
    await page.waitForTimeout(3000);

    // 4. Execute follow function
    log('INFO', '📍 Step 4: Executing follow() - Profile suggestions');
    await page.evaluate(followFunction);
    
    // Wait for follow actions
    await page.waitForTimeout(3000);

    // 5. Execute skip and final actions
    log('INFO', '📍 Step 5: Executing skip and final navigation');
    await page.evaluate(skipAndFinalFunction);

    log('INFO', '✅ All automation steps completed');

    // Take a screenshot for verification
    const screenshot = path.join(logsDir, `screenshot-${Date.now()}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    log('INFO', `📸 Screenshot saved: ${screenshot}`);

    // Get page title and URL for verification
    const title = await page.title();
    const url = page.url();
    log('INFO', `Final page title: ${title}`);
    log('INFO', `Final URL: ${url}`);

    log('INFO', '✨ Automation completed successfully!');

  } catch (error) {
    log('ERROR', 'Automation failed with error:', error);
    throw error;

  } finally {
    // Cleanup
    if (page) {
      try {
        await page.close();
        log('INFO', 'Page closed');
      } catch (err) {
        log('WARN', 'Error closing page:', err);
      }
    }

    if (browser) {
      try {
        await browser.close();
        log('INFO', 'Browser closed');
      } catch (err) {
        log('WARN', 'Error closing browser:', err);
      }
    }

    log('INFO', `📋 Log file saved: ${logFile}`);
  }
}

// ============================================
// AUTOMATION FUNCTIONS (converted for page.evaluate)
// ============================================

async function finaleFunction() {
  return new Promise((resolve) => {
    (function() {
      const logContainer = document.createElement('div');
      logContainer.id = 'console-log-overlay';
      logContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 450px;
        height: 350px;
        background: rgba(20, 20, 20, 0.95);
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 12px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #00ff00;
        overflow-y: auto;
        z-index: 99999;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      `;
      
      const header = document.createElement('div');
      header.style.cssText = `
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid #00ff00;
        padding-bottom: 5px;
        color: #00ff00;
      `;
      header.textContent = '📡 Console Logs & Coordinate Click';
      logContainer.appendChild(header);
      
      const logsDiv = document.createElement('div');
      logsDiv.id = 'console-logs-content';
      logsDiv.style.cssText = `
        max-height: 300px;
        overflow-y: auto;
      `;
      logContainer.appendChild(logsDiv);
      
      document.body.appendChild(logContainer);
      
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;
      
      function addLogToDisplay(message, type = 'log') {
        const logEntry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
          'log': '#00ff00',
          'error': '#ff0000',
          'warn': '#ffaa00',
          'info': '#00aaff'
        };
        
        logEntry.style.cssText = `
          color: ${colors[type]};
          margin-bottom: 4px;
          word-wrap: break-word;
          white-space: pre-wrap;
          padding: 2px 0;
          border-left: 2px solid ${colors[type]};
          padding-left: 6px;
        `;
        logEntry.textContent = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        logsDiv.appendChild(logEntry);
        logsDiv.scrollTop = logsDiv.scrollHeight;
      }
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'log');
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'error');
      };
      
      console.warn = function(...args) {
        originalWarn.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'warn');
      };
      
      console.info = function(...args) {
        originalInfo.apply(console, args);
        addLogToDisplay(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '), 'info');
      };
      
      const selectors = [
        'button[aria-label="CONFIRM"]',
        'button.css-1nnj36',
        '[aria-label="CONFIRM"]',
      ];
      
      function clickByCoordinates(attempt = 1) {
        console.log(`🔄 Click attempt #${attempt} (coordinate-based)`);
        
        let element = null;
        let foundBy = '';
        
        for (let selector of selectors) {
          element = document.querySelector(selector);
          if (element) {
            foundBy = selector;
            break;
          }
        }
        
        if (!element) {
          console.error(`❌ Element not found with any selector`);
          return false;
        }
        
        console.log(`✓ Element found using: "${foundBy}"`);
        
        const rect = element.getBoundingClientRect();
        console.log(`  Position: top=${Math.round(rect.top)}, left=${Math.round(rect.left)}`);
        console.log(`  Size: width=${Math.round(rect.width)}, height=${Math.round(rect.height)}`);
        
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        console.log(`  🎯 Click coordinates: X=${Math.round(x)}, Y=${Math.round(y)}`);
        
        if (rect.width === 0 || rect.height === 0) {
          console.error('❌ Element has no dimensions - might be hidden');
          return false;
        }
        
        if (rect.top < 0 || rect.left < 0 || rect.bottom > window.innerHeight || rect.right > window.innerWidth) {
          console.warn('⚠️  Element may be partially off-screen');
        }
        
        try {
          element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: x, clientY: y }));
          element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }));
          
          element.dispatchEvent(new MouseEvent('mousedown', { 
            bubbles: true, 
            cancelable: true,
            clientX: x, 
            clientY: y,
            buttons: 1
          }));
          
          element.dispatchEvent(new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true,
            clientX: x, 
            clientY: y
          }));
          
          element.dispatchEvent(new MouseEvent('mouseup', { 
            bubbles: true, 
            clientX: x, 
            clientY: y
          }));
          
          console.log('✅ Coordinate-based mouse events dispatched successfully');
        } catch (e) {
          console.error('❌ Error dispatching events: ' + e.message);
          return false;
        }
        
        const elementAtPoint = document.elementFromPoint(x, y);
        if (elementAtPoint) {
          console.log(`  Verified: element at coordinates is: ${elementAtPoint.tagName}.${elementAtPoint.className}`);
        }
        
        return true;
      }

      console.log('🚀 Script started - coordinate-based click handler initialized');
      console.log('🎯 Target: button with aria-label="CONFIRM"');
      console.log('📍 Will calculate button center and simulate mouse click');
      
      clickByCoordinates(1);
      setTimeout(() => clickByCoordinates(2), 2000);
      setTimeout(() => clickByCoordinates(3), 4000);
      setTimeout(() => {
        console.log('⏱️ 6 second mark reached - final attempt');
        clickByCoordinates(4);
        resolve();
      }, 6000);
    })();
  });
}

async function nextFunction() {
  return new Promise((resolve) => {
    (function() {
      function initLinkvertise(LINKVERTISE_ID) {
        try {
          const script = document.createElement('script');
          script.src = 'https://publisher.linkvertise.com/cdn/linkvertise.js';
          script.async = true;
          script.onerror = () => console.error('Failed to load Linkvertise script');

          script.onload = () => {
            console.log('Linkvertise loaded successfully');
            
            try {
              linkvertise(LINKVERTISE_ID, { whitelist: [], blacklist: [] });
            } catch (e) {
              console.error('Linkvertise initialization failed:', e);
              return;
            }

            convertExternalLinks(LINKVERTISE_ID);
          };

          document.head.appendChild(script);
        } catch (e) {
          console.error('Failed to initialize Linkvertise:', e);
        }
      }

      function convertExternalLinks(LINKVERTISE_ID) {
        try {
          const links = document.querySelectorAll('a[href]');
          const myDomain = window.location.hostname;
          let convertedCount = 0;

          links.forEach(link => {
            try {
              const href = link.href;
              
              const isExternal = href.startsWith('http') && !href.includes(myDomain);
              const notSpecial = !href.includes('mailto:') && !href.includes('tel:') && !href.startsWith('#');
              const notAlreadyConverted = !link.classList.contains('linkvertise');

              if (isExternal && notSpecial && notAlreadyConverted) {
                const encoded = btoa(encodeURI(href));
                link.href = `https://link-to.net/${LINKVERTISE_ID}/${Math.random() * 1000}/dynamic/?r=${encoded}`;
                link.target = '_self';
                link.classList.add('linkvertise');
                convertedCount++;
              }
            } catch (e) {
              console.warn('Failed to convert link:', link, e);
            }
          });

          console.log(`Converted ${convertedCount} external links`);
          resolve();
        } catch (e) {
          console.error('Link conversion failed:', e);
          resolve();
        }
      }

      const DOMAIN_CONFIG = {
        'zealous-river-220556.puter.site': '9578664',
      };

      function getLinkvertiseId() {
        const hostname = window.location.hostname;
        return DOMAIN_CONFIG[hostname] || null;
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          const linkvertiseId = getLinkvertiseId();
          if (linkvertiseId) {
            initLinkvertise(linkvertiseId);
          }
        });
      } else {
        const linkvertiseId = getLinkvertiseId();
        if (linkvertiseId) {
          initLinkvertise(linkvertiseId);
        }
      }
    })();

    setTimeout(() => resolve(), 3000);
  });
}

async function linkFunction() {
  if (document.querySelector("body > a")) {
    document.querySelector("body > a").click();
  }
}

async function followFunction() {
  return new Promise((resolve) => {
    const selectors = [
      "body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.widgets > div.widget__sticky > div > lv-profile-suggestions > lv-lib-card > div > div > div > div:nth-child(1) > lv-lib-button > button",
      "body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.widgets > div.widget__sticky > div > lv-profile-suggestions > lv-lib-card > div > div > div > div:nth-child(2) > lv-lib-button > button",
      "body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.widgets > div.widget__sticky > div > lv-profile-suggestions > lv-lib-card > div > div > div > div:nth-child(3) > lv-lib-button > button"
    ];

    let clicked = 0;
    selectors.forEach((selector, index) => {
      setTimeout(() => {
        if (document.querySelector(selector)) {
          document.querySelector(selector).click();
          clicked++;
        }
      }, index * 1000);
    });

    setTimeout(() => resolve(), 5000);
  });
}

async function skipAndFinalFunction() {
  return new Promise((resolve) => {
    // Click main button
    const mainBtn = document.querySelector("body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-link-detail-page > lv-main-content-layout > div > div.content > div > lv-link-content > div > div:nth-child(2) > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__footer > div.--button-container > div.button-desktop > a > lv-lib-button > button");
    if (mainBtn) mainBtn.click();

    setTimeout(() => {
      // Click membership
      const membershipBtn = document.querySelector("body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__plans > lv-membership-plan-option:nth-child(5) > div > div");
      if (membershipBtn) membershipBtn.click();
    }, 5000);

    setTimeout(() => {
      // Click access button
      const accessBtn = document.querySelector("body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-wait > lv-membership-selection-card > lv-lib-card > div > div > div > div.membership-plan-selection__button.membership-plan-selection__button--access.ng-star-inserted > lv-lib-button > button");
      if (accessBtn) accessBtn.click();
    }, 10000);

    // Skip buttons
    const skipSelector = "body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-access-page > lv-main-content-layout > div > div.content > div > lv-task-ad-experiment > lv-task-ad-stepper-line > lv-ad-step-nonskip > lv-fullsize-result-component > lv-lib-card > div > div > div > div.lv-card__body > lv-lib-carousel > div > div.skip-button.ng-star-inserted > lv-lib-chip > div";
    
    [15000, 40000, 55000].forEach(delay => {
      setTimeout(() => {
        const skipBtn = document.querySelector(skipSelector);
        if (skipBtn) skipBtn.click();
      }, delay);
    });

    setTimeout(() => {
      // Final window.open patch and click
      const originalOpen = window.open;
      window.open = function (url, target, features) {
        if (url) {
          window.location.href = url;
          return null;
        }
        return originalOpen.apply(window, arguments);
      };

      const originalAnchorClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (this.target === "_blank" && this.href) {
          window.location.href = this.href;
          return;
        }
        return originalAnchorClick.call(this);
      };

      const btn = document.querySelector("body > lv-root > div.layout.ng-star-inserted > div.main-container > div.content-wrapper > lv-success-page > lv-main-content-layout > div > div.content > div > lv-success-variant-a > div > lv-lib-card:nth-child(2) > div > div > div > div > lv-lib-button > button");
      if (btn) btn.click();

      setTimeout(() => {
        window.open = originalOpen;
        HTMLAnchorElement.prototype.click = originalAnchorClick;
      }, 1500);

      resolve();
    }, 70000);
  });
}

// ============================================
// RUN AUTOMATION
// ============================================

runAutomation().then(() => {
  log('INFO', '🎉 Automation run completed successfully');
  process.exit(0);
}).catch((error) => {
  log('ERROR', '💥 Automation failed:', error);
  process.exit(1);
});
