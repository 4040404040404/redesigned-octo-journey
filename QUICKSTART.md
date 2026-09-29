# ⚡ Quick Start Guide

Get your automation running in 5 minutes.

## Step 1: Create Directory Structure (30 seconds)

```bash
# Navigate to your repository
cd your-repo

# Create the workflow directory
mkdir -p .github/workflows

# Create logs directory
mkdir -p logs
```

## Step 2: Add Files (1 minute)

Copy these 4 files to your repository:

```
your-repo/
├── .github/
│   └── workflows/
│       └── automation.yml        ← Workflow file
├── automation.js                 ← Main script
├── package.json                  ← Dependencies
├── .gitignore                    ← Ignore rules
└── README.md                     ← Documentation
```

## Step 3: Configure URL (Optional - 1 minute)

### Option A: Using Secrets (Recommended)

```bash
# Go to GitHub website:
# 1. Repository → Settings → Secrets and variables → Actions
# 2. Click "New repository secret"
# 3. Name: TARGET_URL
# 4. Value: https://your-url-here.com
# 5. Click "Add secret"
```

### Option B: Hardcode in automation.js

```javascript
// In automation.js, line 11:
const CONFIG = {
  TARGET_URL: 'https://your-url-here.com', // Set your URL
  // ... rest of config
};
```

## Step 4: Commit & Push (1 minute)

```bash
# Add all files
git add .

# Commit
git commit -m "Add GitHub Actions web automation"

# Push to GitHub
git push origin main
```

## Step 5: Enable & Verify (1 minute)

```bash
# In GitHub website:
# 1. Go to Actions tab
# 2. Find "Web Automation - Linkvertise Task"
# 3. Workflow should be enabled automatically
# 4. Wait for first run (up to 15 minutes)
```

---

## 📊 View Results

### Check Run Status
1. Click **Actions** tab
2. Click **"Web Automation - Linkvertise Task"**
3. View the most recent run
4. Click on **"web-automation"** job
5. Expand **"Run web automation"** step

### Download Logs
1. Click the run
2. Scroll to **Artifacts**
3. Download **automation-logs-xxx**

### View Console Output
Click the **"Run web automation"** step to see live output with timestamps.

---

## 🔧 Verify It's Working

Look for these signs of success:

✅ **Actions tab shows green checkmark**
```
Web Automation - Linkvertise Task ✓
Completed successfully in 2m 15s
```

✅ **Console shows startup messages**
```
🚀 Starting web automation...
✅ Browser launched
📄 New page created
🌐 Navigating to https://...
```

✅ **Logs folder in artifacts**
```
automation-logs-12.zip
├── automation-2024-01-15T10-30-45.123Z.log
└── screenshot-1705331445789.png
```

---

## ⚠️ Common First-Time Issues

### Workflow Not Showing
- Wait 15 minutes for first run
- Check Actions tab for any errors
- Go to Settings → Actions → ensure enabled

### Browser Won't Launch
- Check artifact logs for error message
- Verify `.github/workflows/automation.yml` path is correct
- Ensure file is committed to default branch

### Element Not Found
- Check your selectors in `automation.js`
- Verify they exist on target website
- Use browser DevTools to find correct selectors
- Update selectors and push new commit

---

## 🔄 Your Automation is Now Running Every 5 Minutes!

The workflow will:
- ✅ Launch every 5 minutes automatically
- ✅ Log all actions with timestamps
- ✅ Save screenshots for verification
- ✅ Upload logs as GitHub artifacts
- ✅ Continue forever (until you disable it)

---

## 📚 Next Steps

1. **Monitor First Run**
   - Watch Actions tab
   - Check logs for errors
   - Fix any selector issues

2. **Customize Settings**
   - See `CUSTOMIZATION.md` for options
   - Change schedule timing
   - Update button selectors

3. **Add Notifications** (Optional)
   - Send Slack alerts
   - Email reports
   - Custom webhooks

4. **Optimize Performance**
   - Adjust timeouts
   - Add/remove delays
   - Monitor resource usage

---

## 🆘 Need Help?

### Quick Fixes

**Issue:** "Workflow is disabled"
```
→ Go to Actions tab → Enable workflow
```

**Issue:** "Element not found"
```
→ Open browser DevTools → Find element selector → Update automation.js
```

**Issue:** "Navigation timeout"
```
→ Increase TIMEOUT in automation.js from 180000 to 300000
```

### Detailed Help

- See **README.md** for full documentation
- See **TROUBLESHOOTING.md** for advanced issues
- See **CUSTOMIZATION.md** for customization options

---

## 📝 Template: Basic Setup Command

```bash
#!/bin/bash
# One-liner setup (if files already exist)

mkdir -p .github/workflows logs && \
git add . && \
git commit -m "Add GitHub Actions automation" && \
git push origin main && \
echo "✅ Setup complete! Check Actions tab in 15 minutes."
```

---

## 🎯 Success Checklist

- [ ] Created `.github/workflows/automation.yml`
- [ ] Copied `automation.js` to root
- [ ] Copied `package.json` to root
- [ ] Set `TARGET_URL` in GitHub Secrets (or in automation.js)
- [ ] Pushed all files to GitHub
- [ ] Enabled Actions in repository settings
- [ ] Waited 15 minutes for first run
- [ ] Checked Actions tab for green checkmark
- [ ] Downloaded and reviewed logs
- [ ] Verified automation completed successfully

✨ **All done! Your automation is live!**

---

## 📖 Full Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Complete guide, configuration options |
| **TROUBLESHOOTING.md** | Fix common issues, debug problems |
| **CUSTOMIZATION.md** | Modify timing, selectors, add features |
| **QUICKSTART.md** | This file - quick setup |

---

## 💡 Pro Tips

1. **Test Locally First**
   ```bash
   npm install
   node automation.js
   ```

2. **Enable Debug Mode**
   - Set `DEBUG_MODE: 'true'` in automation.js
   - Get more detailed logs

3. **Use GitHub Secrets**
   - Store sensitive URLs in secrets
   - Don't commit them to code

4. **Monitor Resource Usage**
   - Check Actions usage in Settings
   - Adjust frequency if needed

5. **Keep Logs**
   - Logs auto-delete after 7 days
   - Download important ones manually

---

**Time to deployment: ~5 minutes ⚡**

**Questions?** Check README.md or TROUBLESHOOTING.md

**Happy automating! 🚀**
