# Quick Fix: Empty Address Issue

## The Problem

Freighter is returning `{address: ''}` - an empty address. This means Freighter is installed but not properly set up.

## The Solution (2 minutes)

### Step 1: Open Freighter
Click the Freighter extension icon in your browser toolbar (puzzle piece icon → Freighter)

### Step 2: Check Your Account
You should see:
- An account with a balance
- An address starting with "G"

**If you see "No accounts" or empty screen:**
1. Click "Create New Wallet" or "Import Wallet"
2. Follow the prompts to create an account
3. **Write down your recovery phrase!**

### Step 3: Unlock Freighter
If Freighter asks for a password:
1. Enter your password
2. Click "Unlock"

### Step 4: Switch to Testnet
1. Click Settings (⚙️) at bottom of Freighter
2. Click "Network"
3. Select "Testnet"
4. Close settings

### Step 5: Fund Your Account
1. Copy your address from Freighter (click to copy)
2. Visit: https://laboratory.stellar.org/#account-creator?network=test
3. Paste your address
4. Click "Get test network lumens"
5. Wait 5 seconds

### Step 6: Try Connecting Again
1. Go back to the app
2. Click "Connect Wallet"
3. Approve the connection in Freighter popup
4. Your address should now appear!

## Still Not Working?

### Check These:
- [ ] Freighter is unlocked (not asking for password)
- [ ] You have an account created (see address in Freighter)
- [ ] Network is set to "Testnet" (not Mainnet)
- [ ] Account is funded (see balance in Freighter)
- [ ] No popup blocker preventing Freighter popup

### Try This:
1. Close Freighter completely
2. Refresh the application page
3. Click "Connect Wallet" again
4. Look for Freighter popup (might be behind other windows)

## Expected Flow

When you click "Connect Wallet":
1. ✅ Console shows: "Requesting wallet access..."
2. ✅ Freighter popup appears
3. ✅ You click "Connect" in popup
4. ✅ Console shows: "Successfully connected to wallet: G..."
5. ✅ Your address appears in green box
6. ✅ "Disconnect" button appears

## What You're Seeing Now

❌ Console shows: "Wallet connection result: {address: ''}"
❌ Console shows: "No address returned from wallet"

This means Freighter is installed but has no account or account is locked.

## Quick Test

Open browser console (F12) and run:

```javascript
// Check if Freighter is available
console.log('Freighter:', window.freighter);

// Try to get address manually
import('@stellar/freighter-api').then(async (api) => {
  const result = await api.getAddress();
  console.log('Manual test result:', result);
});
```

If this also returns `{address: ''}`, you need to create/unlock an account in Freighter.

## Need More Help?

See the full guide: `FREIGHTER_SETUP.md`
