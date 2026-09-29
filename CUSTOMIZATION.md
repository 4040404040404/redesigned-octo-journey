# 🎨 Customization Guide

Quick reference for customizing the automation to fit your needs.

## 📅 Schedule Changes

### Change Run Frequency

Edit `.github/workflows/automation.yml`:

```yaml
on:
  schedule:
    # Every 5 minutes
    - cron: '*/5 * * * *'
    
    # Every 15 minutes
    # - cron: '*/15 * * * *'
    
    # Every hour
    # - cron: '0 * * * *'
    
    # Twice daily (6 AM & 6 PM)
    # - cron: '0 6,18 * * *'
    
    # Weekdays only (Mon-Fri at 9 AM)
    # - cron: '0 9 * * 1-5'
    
    # Multiple times per hour
    # - cron: '0,15,30,45 * * * *'
```

### Disable/Enable Manually

```yaml
on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:  # Allows manual trigger
```

---

## 🌐 Target URL Management

### Via GitHub Secrets (Recommended)

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add: `TARGET_URL` = `https://your-url.com`

Then in workflow:
```yaml
env:
  TARGET_URL: ${{ secrets.TARGET_URL }}
```

### Via Environment Variables

```yaml
jobs:
  web-automation:
    env:
      TARGET_URL: https://your-url.com
      DEBUG_MODE: 'false'
```

### Multiple URLs (Parallel Runs)

```yaml
strategy:
  matrix:
    url:
      - https://url1.com
      - https://url2.com
      - https://url3.com

steps:
  - name: Run automation
    run: |
      export TARGET_URL=${{ matrix.url }}
      node automation.js
```

---

## 🎯 Selector Customization

### Update Button Selectors

In `automation.js`, modify the `finaleFunction`:

```javascript
const selectors = [
  'button[aria-label="CONFIRM"]',          // Current
  'button.css-1nnj36',                     // Current
  '.confirm-button',                        // Add yours
  'button[data-testid="confirm"]',        // Add yours
  '#my-button',                             // Add yours
];
```

### Find New Selectors Using DevTools

```javascript
// In browser console
// Find by text
document.evaluate(
  "//button[contains(text(), 'CONFIRM')]",
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null
).singleNodeValue

// Find by aria-label
document.querySelector('[aria-label*="CONFIRM"]')

// Find by class
document.querySelector('.button-primary')
```

### Click Elements by Text Content

```javascript
function clickByText(text) {
  const buttons = document.querySelectorAll('button');
  for (let btn of buttons) {
    if (btn.textContent.includes(text)) {
      btn.click();
      return true;
    }
  }
  return false;
}

// Usage in automation
await page.evaluate(() => clickByText('CONFIRM'));
```

### Advanced Selector Strategies

```javascript
// Wait for element then click
await page.waitForSelector('.dynamic-button', { timeout: 10000 });
await page.click('.dynamic-button');

// Click with JavaScript
await page.evaluate(() => {
  document.querySelector('button').click();
});

// Use XPath
const element = await page.$x("//button[contains(text(), 'CONFIRM')]");
if (element.length > 0) {
  await element[0].click();
}

// Retry mechanism
async function clickWithRetry(selector, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await page.click(selector);
      return true;
    } catch (err) {
      if (i === maxAttempts - 1) throw err;
      await page.waitForTimeout(1000);
    }
  }
}
```

---

## ⏱️ Timing Adjustments

### Change Step Delays

In `skipAndFinalFunction` in `automation.js`:

```javascript
// Current: 15 seconds
setTimeout(() => {
  // Action
}, 15000);

// Change to 10 seconds
setTimeout(() => {
  // Action
}, 10000);

// Add new delay
setTimeout(() => {
  // New action
}, 25000);
```

### Wait for Dynamic Content

```javascript
// Wait for element to appear
await page.waitForSelector('.dynamic-element', { timeout: 30000 });

// Wait for navigation
await page.waitForNavigation({ waitUntil: 'networkidle2' });

// Wait for specific function
await page.waitForFunction(() => {
  return window.someData !== undefined;
}, { timeout: 10000 });

// Custom wait
await page.evaluate(() => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
  });
});
```

---

## 🔐 Authentication

### Handle Login

```javascript
async function loginIfNeeded(page) {
  // Check if already logged in
  const isLoggedIn = await page.evaluate(() => {
    return document.querySelector('.user-profile') !== null;
  });

  if (!isLoggedIn) {
    // Fill login form
    await page.type('#username', 'your-username');
    await page.type('#password', process.env.PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }
}

// In main automation
await loginIfNeeded(page);
```

### Use Cookies

```javascript
// Save cookies
const cookies = await page.cookies();
fs.writeFileSync('cookies.json', JSON.stringify(cookies));

// Load cookies on next run
const savedCookies = JSON.parse(fs.readFileSync('cookies.json'));
await page.setCookie(...savedCookies);
```

### Set Custom Headers

```javascript
await page.setExtraHTTPHeaders({
  'User-Agent': 'Mozilla/5.0 (Custom User Agent)',
  'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
  'X-Custom-Header': 'value'
});
```

---

## 📊 Data Capture

### Extract Data

```javascript
const data = await page.evaluate(() => {
  return {
    title: document.title,
    url: window.location.href,
    elements: document.querySelectorAll('button').length,
    text: document.body.innerText
  };
});

console.log('Captured data:', data);
```

### Save to File

```javascript
const fs = require('fs');

const data = {
  timestamp: new Date().toISOString(),
  url: page.url(),
  title: await page.title(),
  content: await page.content()
};

fs.writeFileSync(
  `data-${Date.now()}.json`,
  JSON.stringify(data, null, 2)
);
```

### Send to External Service

```javascript
// Send to webhook
await page.evaluate(async (webhookUrl) => {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date(),
      pageTitle: document.title,
      url: window.location.href
    })
  });
}, process.env.WEBHOOK_URL);
```

---

## 🖼️ Browser Configuration

### Change Viewport Size

```javascript
const CONFIG = {
  VIEWPORT: {
    width: 1366,   // Tablet
    height: 768
  }
};

// Or mobile
const CONFIG = {
  VIEWPORT: {
    width: 375,    // iPhone
    height: 667
  }
};
```

### Set User Agent

```javascript
await page.setUserAgent(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
);
```

### Disable Images (Faster)

```javascript
await page.setRequestInterception(true);
page.on('request', request => {
  if (request.resourceType() === 'image') {
    request.abort();
  } else {
    request.continue();
  }
});
```

### Block Tracking/Analytics

```javascript
await page.setRequestInterception(true);
page.on('request', request => {
  const url = request.url();
  if (url.includes('google-analytics') || 
      url.includes('tracking') ||
      url.includes('ads')) {
    request.abort();
  } else {
    request.continue();
  }
});
```

---

## 🔍 Debug & Logging

### Enhanced Logging

```javascript
// Replace console methods
console.log = function(...args) {
  const log = `[${new Date().toISOString()}] ${args.join(' ')}`;
  console.error(log); // Use error to ensure output
  fs.appendFileSync('debug.log', log + '\n');
};
```

### Page Performance Metrics

```javascript
const metrics = await page.metrics();
console.log('Performance metrics:');
console.log(`  JSHeapUsedSize: ${Math.round(metrics.JSHeapUsedSize / 1048576)} MB`);
console.log(`  JSHeapTotalSize: ${Math.round(metrics.JSHeapTotalSize / 1048576)} MB`);
console.log(`  TaskDuration: ${metrics.TaskDuration}`);
```

### Network Activity

```javascript
const responses = [];

page.on('response', response => {
  responses.push({
    url: response.url(),
    status: response.status(),
    size: response.buffer().then(b => b.length)
  });
});

// Later...
console.log('Network activity:', responses);
```

---

## 🎭 Advanced Scenarios

### Handle Multiple Pages

```javascript
// Open new page in background
const page2 = await browser.newPage();
await page2.goto('https://another-url.com');

// Interact with both
await page.click('button'); // First page
await page2.evaluate(() => doSomething()); // Second page

await page.close();
await page2.close();
```

### Keyboard Input

```javascript
// Type with delays
await page.keyboard.type('Hello World', { delay: 100 });

// Keyboard shortcuts
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');
await page.keyboard.down('Shift');
await page.type('text');
await page.keyboard.up('Shift');
```

### Mouse Interactions

```javascript
// Move mouse
await page.mouse.move(100, 100);

// Click
await page.mouse.click(100, 100);

// Drag
await page.mouse.move(100, 100);
await page.mouse.down();
await page.mouse.move(200, 200);
await page.mouse.up();
```

### File Upload

```javascript
const uploadInput = await page.$('input[type="file"]');
await uploadInput.uploadFile('/path/to/file.pdf');
await page.click('button[type="submit"]');
```

---

## 📤 Notifications & Alerts

### Slack Notifications

```yaml
- name: Notify Slack on success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Automation completed successfully",
        "blocks": [{"type": "section", "text": {"type": "mrkdwn", "text": "*Success*"}}]
      }
```

### Send Email Report

```yaml
- name: Send Report Email
  if: always()
  run: |
    echo "Automation completed" | mail -s "Run Report" admin@example.com
```

---

## 🚀 Performance Optimization

### Faster Execution

```javascript
// Disable images
await page.setRequestInterception(true);

// Reduce navigation timeout
page.setDefaultTimeout(30000); // 30 seconds

// Minimize delays
await page.waitForTimeout(500); // instead of 2000
```

### Parallel Execution

```yaml
strategy:
  matrix:
    url:
      - url1
      - url2
      - url3
  max-parallel: 3
```

---

## 📋 Complete Example: Custom Task

```javascript
// Add to automation.js

async function customTask() {
  // 1. Wait for element
  await page.waitForSelector('.my-element', { timeout: 10000 });
  
  // 2. Extract data
  const data = await page.evaluate(() => {
    return {
      text: document.querySelector('.my-element').innerText,
      href: document.querySelector('a').href
    };
  });
  
  // 3. Log data
  console.log('Extracted:', data);
  
  // 4. Click element
  await page.click('.my-element');
  
  // 5. Wait for change
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  // 6. Take screenshot
  await page.screenshot({ path: 'result.png' });
  
  return data;
}

// Then call it
await customTask();
```

---

**Last Updated:** January 2024
