# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. ❌ Workflow Not Triggering

**Problem:** Workflow runs don't appear in Actions tab

**Solutions:**

a) **Check if Actions are enabled**
   - Go to Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected
   - Click "Save"

b) **Verify workflow syntax**
   ```bash
   # Use online validator
   # https://rhysd.github.io/actionlint/
   ```

c) **Check file location**
   - Workflow must be at: `.github/workflows/automation.yml`
   - File must be in default branch (main/master)

d) **Wait for GitHub's scheduler**
   - First run may take up to 15 minutes
   - Check "All workflows" to see all scheduled runs

e) **Re-enable the workflow**
   - Go to Actions tab
   - Click "Web Automation - Linkvertise Task"
   - If disabled, click the "Enable workflow" button

### 2. 🚫 Browser Won't Launch

**Problem:** `Failed to launch Chrome` or Chromium not found

**Solutions:**

a) **Add Chrome dependencies**
   ```yaml
   - name: Install Chrome dependencies
     run: |
       sudo apt-get update
       sudo apt-get install -y wget gnupg ca-certificates procps libxss1 libnss3 libgconf-2-4
   ```

b) **Use pre-built Puppeteer**
   ```yaml
   - name: Install dependencies
     run: npm ci
     env:
       PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'false'
   ```

c) **Run with sandbox disabled (already configured)**
   - Check `automation.js` has `--no-sandbox` flag

### 3. ⏱️ Timeout Errors

**Problem:** `TimeoutError: Navigation timeout of 60000 ms exceeded`

**Solutions:**

a) **Increase navigation timeout**
   ```javascript
   // In automation.js
   const CONFIG = {
     TIMEOUT: 300000, // 5 minutes instead of 3
   };
   ```

b) **Add retry logic**
   ```javascript
   for (let i = 0; i < 3; i++) {
     try {
       await page.goto(url, { waitUntil: 'networkidle2' });
       break;
     } catch (err) {
       if (i === 2) throw err;
       await page.waitForTimeout(2000);
     }
   }
   ```

c) **Use faster wait strategy**
   ```javascript
   // Instead of networkidle2
   await page.goto(url, { waitUntil: 'domcontentloaded' });
   ```

d) **Check target URL**
   - Verify URL is accessible and not blocked
   - Test in browser manually

### 4. 🔍 Element Not Found

**Problem:** `Error: Element not found with any selector`

**Solutions:**

a) **Update selectors**
   - Website structure may have changed
   - Use browser DevTools to find current selectors:
   ```javascript
   // Open DevTools console
   document.querySelector('button[aria-label="CONFIRM"]')
   ```

b) **Add fallback selectors**
   ```javascript
   const selectors = [
     'button[aria-label="CONFIRM"]',
     'button.css-1nnj36',
     'button[data-testid="confirm"]',  // New fallback
     '[aria-label="CONFIRM"]',
   ];
   ```

c) **Check element visibility**
   ```javascript
   const element = document.querySelector(selector);
   const rect = element.getBoundingClientRect();
   console.log('Visible:', rect.width > 0 && rect.height > 0);
   ```

d) **Wait for element to appear**
   ```javascript
   // In automation.js
   await page.waitForSelector('button[aria-label="CONFIRM"]', { timeout: 10000 });
   ```

### 5. 💾 Out of Disk Space

**Problem:** `Error: ENOSPC: no space left on device`

**Solutions:**

a) **Clean up before installation**
   ```yaml
   - name: Free up disk space
     run: |
       sudo rm -rf /opt/hostedtoolcache
       sudo rm -rf /usr/share/dotnet
       sudo rm -rf /usr/local/lib/android
       sudo apt-get clean
   ```

b) **Remove unnecessary Puppeteer files**
   ```yaml
   - name: Trim Puppeteer
     run: |
       npm list puppeteer
       rm -rf node_modules/puppeteer/.local-chromium
   ```

### 6. 🌐 Network Issues

**Problem:** `Error: net::ERR_CONNECTION_REFUSED`

**Solutions:**

a) **Check URL is accessible**
   ```bash
   curl -v https://your-url.com
   ```

b) **Add retry with backoff**
   ```javascript
   async function fetchWithRetry(url, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await page.goto(url);
       } catch (err) {
         const delay = Math.pow(2, i) * 1000;
         await page.waitForTimeout(delay);
       }
     }
   }
   ```

c) **Configure DNS if needed**
   ```yaml
   - name: Configure network
     run: |
       echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
       echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
   ```

### 7. 📊 Logs Not Saving

**Problem:** Log artifacts aren't appearing

**Solutions:**

a) **Check logs directory exists**
   ```javascript
   // In automation.js
   if (!fs.existsSync(logsDir)) {
     fs.mkdirSync(logsDir, { recursive: true });
   }
   ```

b) **Verify artifact upload step**
   ```yaml
   - name: Upload logs
     if: always()  # Important: run even on failure
     uses: actions/upload-artifact@v4
     with:
       name: automation-logs-${{ github.run_number }}
       path: logs/
   ```

c) **Check file permissions**
   ```javascript
   fs.appendFileSync(logFile, entry, { mode: 0o666 });
   ```

### 8. 🔁 Workflow Loops/Infinite Runs

**Problem:** Workflow keeps triggering itself

**Solutions:**

a) **Use GITHUB_TOKEN properly**
   ```yaml
   jobs:
     web-automation:
       runs-on: ubuntu-latest
       permissions:
         contents: read
   ```

b) **Avoid self-triggering commits**
   ```yaml
   - name: Prevent self-trigger
     if: github.event_name == 'push'
     run: exit 0
   ```

### 9. 🔐 Authentication Issues

**Problem:** Access denied or credentials not working

**Solutions:**

a) **Use GitHub Secrets**
   ```yaml
   env:
     API_TOKEN: ${{ secrets.API_TOKEN }}
   ```

b) **Add headers/cookies**
   ```javascript
   await page.setExtraHTTPHeaders({
     'Authorization': `Bearer ${process.env.API_TOKEN}`,
     'User-Agent': 'Mozilla/5.0...'
   });
   ```

c) **Handle cookie-based auth**
   ```javascript
   const cookies = JSON.parse(process.env.COOKIES);
   await page.setCookie(...cookies);
   ```

### 10. 🐛 Strange Behavior / Race Conditions

**Problem:** Automation works sometimes but not consistently

**Solutions:**

a) **Add explicit waits**
   ```javascript
   // Instead of short timeouts
   await page.waitForSelector('.element', { timeout: 5000 });
   ```

b) **Wait for network idle**
   ```javascript
   await page.waitForNavigation({ waitUntil: 'networkidle2' });
   ```

c) **Add state verification**
   ```javascript
   const isReady = await page.evaluate(() => {
     return document.readyState === 'complete';
   });
   ```

d) **Increase inter-step delays**
   ```javascript
   await page.waitForTimeout(3000); // 3 seconds between steps
   ```

---

## Local Testing & Debugging

### Test Locally Before Deploying

```bash
# Install dependencies
npm install

# Run local test
node automation.js

# Or use interactive test
node test-local.js
```

### Debug Mode

Enable detailed logging:

```javascript
const CONFIG = {
  DEBUG_MODE: true,
};
```

### Inspect HTML Structure

```javascript
// In test-local.js interactive mode
document.documentElement.outerHTML
```

### Check Specific Elements

```javascript
// Interactive test
document.querySelector('button[aria-label="CONFIRM"]').getBoundingClientRect()
```

---

## GitHub Actions Specific Issues

### View Workflow Details

1. Go to Actions tab
2. Click workflow name
3. Click run number
4. Expand job steps
5. Check "Run web automation" section

### Raw Logs

```bash
# Use GitHub CLI
gh run view <run-id> --log
```

### Check Workflow Syntax

```bash
# Online validator
https://github.com/rhysd/actionlint
```

---

## Performance Optimization

### Reduce Resource Usage

```yaml
- name: Reduce memory usage
  run: |
    node --max-old-space-size=512 automation.js
```

### Parallel Jobs

```yaml
strategy:
  matrix:
    url: 
      - https://url1.com
      - https://url2.com
```

### Conditional Execution

```yaml
- name: Check prerequisites
  id: check
  run: |
    if [ condition ]; then
      echo "should_run=true" >> $GITHUB_OUTPUT
    fi
    
- name: Run automation
  if: steps.check.outputs.should_run == 'true'
  run: node automation.js
```

---

## Monitoring & Alerts

### Add Slack Notification

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Automation failed",
        "blocks": [{"type": "section", "text": {"type": "mrkdwn", "text": "*Automation Failed*\nRun: ${{ github.run_id }}"}}]
      }
```

### Email Notification

```yaml
- name: Send email
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Automation Failed
    to: admin@example.com
```

---

## Need More Help?

1. **Check GitHub Actions documentation**
   - https://docs.github.com/actions

2. **Puppeteer troubleshooting**
   - https://pptr.dev/troubleshooting

3. **Enable debug logging**
   - Add `DEBUG=* node automation.js`

4. **Check system requirements**
   - Ubuntu latest (automatically used by GitHub)
   - 7GB+ free disk space
   - Node.js 18+

---

**Last Updated:** January 2024
