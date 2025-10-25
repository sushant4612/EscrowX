# Freighter Wallet Setup Guide

## Step 1: Install Freighter

1. Visit https://www.freighter.app/
2. Click "Add to Chrome" (or your browser)
3. Click "Add Extension"
4. Wait for installation to complete

## Step 2: Create or Import Account

### Option A: Create New Account

1. Click the Freighter extension icon in your browser
2. Click "Create New Wallet"
3. **IMPORTANT**: Write down your 12-word recovery phrase
4. Store it somewhere safe (NOT on your computer)
5. Confirm your recovery phrase
6. Set a password for Freighter
7. Click "Confirm"

### Option B: Import Existing Account

1. Click the Freighter extension icon
2. Click "Import Wallet"
3. Enter your 12-word recovery phrase
4. Set a password
5. Click "Import"

## Step 3: Switch to Testnet

**CRITICAL**: You must use Testnet for this application!

1. Open Freighter extension
2. Click the Settings icon (⚙️) at the bottom
3. Click "Network"
4. Select "Testnet"
5. Close settings

## Step 4: Fund Your Testnet Account

### Method 1: Stellar Laboratory (Easiest)

1. Copy your public key from Freighter (starts with G)
2. Visit https://laboratory.stellar.org/#account-creator?network=test
3. Paste your public key
4. Click "Get test network lumens"
5. Wait 5 seconds
6. Your account now has 10,000 XLM (testnet)

### Method 2: Friendbot API

```bash
curl "https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY_HERE"
```

### Method 3: Freighter Built-in

1. Open Freighter
2. Click "Fund with Friendbot" (if available)
3. Wait for confirmation

## Step 5: Verify Setup

1. Open Freighter extension
2. You should see:
   - ✅ Your account address (G...)
   - ✅ Balance: ~10,000 XLM
   - ✅ Network: Testnet
   - ✅ Unlocked (not asking for password)

## Step 6: Connect to Application

1. Open the Stellar Escrow app (http://localhost:3000)
2. Click "Connect Wallet"
3. Freighter popup will appear
4. Click "Connect" in the popup
5. Your address should appear in the app

## Troubleshooting

### Issue: "No address returned from wallet"

**Solution:**
1. Open Freighter extension
2. Make sure you see an account (not "No accounts")
3. If no account, create one (Step 2)
4. Make sure Freighter is unlocked (enter password if needed)
5. Try connecting again

### Issue: Freighter popup doesn't appear

**Solution:**
1. Check if popup blocker is enabled
2. Allow popups for localhost:3000
3. Click Freighter extension icon manually
4. Look for pending connection request

### Issue: "Please install Freighter Wallet"

**Solution:**
1. Make sure Freighter is installed
2. Refresh the application page
3. Check browser extensions list
4. Restart browser if needed

### Issue: Wrong network

**Solution:**
1. Open Freighter
2. Settings → Network
3. Select "Testnet" (NOT Mainnet)
4. Refresh application

### Issue: Insufficient balance

**Solution:**
1. Fund your account with Friendbot (Step 4)
2. Wait 5-10 seconds
3. Check balance in Freighter
4. Should show ~10,000 XLM

## Security Tips

✅ **DO:**
- Write down your recovery phrase on paper
- Store it in a safe place
- Use a strong password for Freighter
- Only use testnet for development
- Keep Freighter updated

❌ **DON'T:**
- Share your recovery phrase with anyone
- Store recovery phrase digitally
- Use same password as other accounts
- Use mainnet for testing
- Ignore security warnings

## Quick Reference

### Freighter Shortcuts
- Open Freighter: Click extension icon
- Copy Address: Click address in Freighter
- Switch Network: Settings → Network
- Lock Wallet: Settings → Lock
- View Recovery Phrase: Settings → Show Recovery Phrase

### Testnet Resources
- Friendbot: https://friendbot.stellar.org
- Laboratory: https://laboratory.stellar.org
- Explorer: https://stellar.expert/explorer/testnet
- Horizon: https://horizon-testnet.stellar.org

### Account Format
- Public Key: Starts with `G`, 56 characters
- Example: `GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Secret Key: Starts with `S`, 56 characters (NEVER SHARE!)

## Next Steps

After setup:
1. ✅ Freighter installed
2. ✅ Account created
3. ✅ Switched to Testnet
4. ✅ Account funded
5. ✅ Connected to app

Now you can:
- Create escrow jobs
- Accept freelance work
- Approve payments
- Participate in disputes

## Getting Help

If you're still having issues:

1. **Check Freighter Status**
   - Visit https://status.freighter.app/

2. **Freighter Documentation**
   - Visit https://docs.freighter.app/

3. **Stellar Discord**
   - Join https://discord.gg/stellar
   - Ask in #freighter channel

4. **Browser Console**
   - Press F12
   - Check Console tab for errors
   - Share error messages for help

## Video Tutorial

For visual learners, watch:
- Freighter Setup: https://www.youtube.com/watch?v=... (search "Freighter Wallet Setup")
- Stellar Testnet: https://www.youtube.com/watch?v=... (search "Stellar Testnet Tutorial")

---

**Ready to go?** Head back to the application and click "Connect Wallet"!
