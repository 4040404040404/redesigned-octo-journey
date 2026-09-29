# GitHub Actions Web Automation

Automated web browser tasks running every 5 minutes using GitHub Actions and Puppeteer.

## 📋 Overview

This automation suite:
- ✅ Runs every 5 minutes via GitHub Actions schedule
- 🤖 Uses headless Puppeteer browser for automation
- 📊 Logs all actions with timestamps
- 📸 Captures screenshots for verification
- 🔧 Handles errors gracefully with fallback mechanisms
- 📤 Uploads logs as artifacts

## 🚀 Setup Instructions

### Step 1: Add Files to Your Repository

```bash
# Copy these files to your repository root
- .github/workflows/automation.yml  # Main workflow
- automation.js                      # Automation script
- package.json                       # Dependencies
```

### Step 2: Create Directory Structure

```bash
mkdir -p .github/workflows
mkdir -p logs
```

### Step 3: Move Workflow File

```bash
# Move the workflow file to the correct location
mv github-actions-workflow.yml .github/workflows/automation.yml
```

### Step 4: Add Secrets (Optional but Recommended)

Go to your repository Settings → Secrets and variables → Actions:

```
TARGET_URL = https://zealous-river-220556.puter.site
DEBUG_MODE = true
```

### Step 5: Commit and Push

```bash
git add .github/workflows/automation.yml
git add automation.js
git add package.json
git add .gitignore
git commit -m "Add GitHub Actions web automation"
git push
```

### Step 6: Enable Actions

1. Go to **Actions** tab in your repository
2. Click **"I understand my workflows, go ahead and enable them"**
3. The workflow should be enabled automatically

## 📅 Schedule Configuration

The workflow runs on this cron schedule:

```yaml
schedule:
  - cron: '*/5 * * * *'  # Every 5 minutes
```

**Cron Format:** `minute hour day month weekday`

### Common Schedule Examples

```yaml
'*/5 * * * *'       # Every 5 minutes
'*/15 * * * *'      # Every 15 minutes
'0 * * * *'         # Every hour
'0 0 * * *'         # Daily at midnight
'0 */6 * * *'       # Every 6 hours
'0 9-17 * * 1-5'    # Weekdays 9 AM to 5 PM
'0 0 * * 0'         # Weekly on Sunday
```

## 🔍 Monitoring & Logs

### View Runs

1. Go to **Actions** tab
2. Click on **"Web Automation - Linkvertise Task"**
3. Click on a specific run to see details

### Download Logs

1. Click on the failed/completed run
2. Scroll down to **Artifacts** section
3. Download `automation-logs-*` zip file

### Log File Format

Logs are saved with timestamp: `automation-2024-01-15T10-30-45.123Z.log`

Format:
```
[2024-01-15T10:30:45.123Z] [INFO] 🚀 Starting web automation...
[2024-01-15T10:30:46.456Z] [PAGE_LOG] 🔄 Click attempt #1
[2024-01-15T10:30:47.789Z] [ERROR] ❌ Element not found
```

## 🛠️ Customization

### Change Target URL

Edit `automation.js` or set via GitHub Secrets:

```javascript
const CONFIG = {
  TARGET_URL: process.env.TARGET_URL || 'https://your-url-here.com',
  // ... other config
};
```

### Modify Automation Flow

Edit the automation functions in `automation.js`:

```javascript
async function finaleFunction() {
  // Your custom logic here
}

async function nextFunction() {
  // Your custom logic here
}
```

### Adjust Timeouts

```javascript
const CONFIG = {
  TIMEOUT: 180000, // 3 minutes (in milliseconds)
  // ... other config
};
```

### Change Browser Viewport

```javascript
const CONFIG = {
  VIEWPORT: {
    width: 1920,   // Custom width
    height: 1080   // Custom height
  }
};
```

## 🔧 Troubleshooting

### Workflow Not Running

1. Check if Actions are enabled in repository settings
2. Verify the workflow YAML syntax
3. Check the `.github/workflows/` path is correct
4. Wait up to 15 minutes for first run

### Browser Launch Fails

If you see `Failed to load Chromium`, it's likely GitHub Actions ran out of disk space:

```yaml
# Add this to workflow before npm install
- name: Clean up
  run: |
    rm -rf /opt/hostedtoolcache
    apt-get clean
```

### Timeout Issues

Increase timeout in `automation.js`:

```javascript
const CONFIG = {
  TIMEOUT: 300000, // 5 minutes
};
```

### Element Not Found

Check selectors in `automation.js` - they may have changed:

```javascript
const selectors = [
  'button[aria-label="CONFIRM"]',
  'button.css-1nnj36',
  '[aria-label="CONFIRM"]',
];
```

Update with your current selectors using browser DevTools.

## 📊 Performance Tips

1. **Reduce frequency if hitting rate limits**
   ```yaml
   - cron: '0 */6 * * *'  # Run every 6 hours instead
   ```

2. **Add delays between actions** to avoid detection
   ```javascript
   await page.waitForTimeout(5000); // 5 second delay
   ```

3. **Rotate user agents** if needed
   ```javascript
   await page.setUserAgent('Mozilla/5.0...');
   ```

## 🔒 Security Best Practices

1. **Use GitHub Secrets** for sensitive data:
   ```yaml
   env:
     TARGET_URL: ${{ secrets.TARGET_URL }}
     API_KEY: ${{ secrets.API_KEY }}
   ```

2. **Never commit credentials**
   ```bash
   echo "*.env" >> .gitignore
   ```

3. **Limit artifact retention**
   ```yaml
   retention-days: 7  # Automatically delete after 7 days
   ```

## 📝 Automation Functions Overview

### `finale()`
- Displays console log overlay
- Finds and clicks CONFIRM button
- Simulates mouse events
- Retries with exponential backoff

### `next()`
- Initializes Linkvertise
- Converts external links
- Handles domain configuration

### `link()`
- Clicks body links
- Navigates to next page

### `follow()`
- Clicks profile suggestions
- Follows multiple profiles
- Handles async delays

### `skipAndFinal()`
- Clicks skip buttons
- Handles membership selection
- Patches window.open
- Navigates to success page

## 🚨 Error Handling

The workflow includes:
- ✅ Automatic retries
- ✅ Graceful error logging
- ✅ Browser cleanup on failure
- ✅ Artifact preservation for debugging
- ✅ Failure notifications

## 📦 Dependencies

- **puppeteer**: ^21.6.1 - Headless browser automation
- **Node.js**: >=18.0.0

## 🤝 Contributing

To modify the automation:

1. Test locally:
   ```bash
   npm install
   node automation.js
   ```

2. Update workflow if needed
3. Push to GitHub
4. Monitor Actions tab

## 📄 License

MIT

## 💬 Support

For issues:
1. Check logs in Actions artifacts
2. Review troubleshooting section
3. Check selector validity with DevTools
4. Verify GitHub Actions are enabled

---

**Last Updated:** January 2024
**Version:** 1.0.0
