# Wallet Connection Troubleshooting

## Issue: Connect Wallet Button Not Working

### Quick Checks

1. **Is Freighter Installed?**
   - Open browser extensions
   - Look for Freighter Wallet
   - If not installed: Visit https://www.freighter.app/

2. **Is Freighter Unlocked?**
   - Click Freighter extension icon
   - Enter your password if locked
   - Make sure you can see your account

3. **Check Browser Console**
   - Press F12 or Cmd+Option+I (Mac)
   - Go to Console tab
   - Look for error messages
   - Share any red errors for debugging

4. **Network Settings**
   - Open Freighter
   - Click Settings (gear icon)
   - Make sure "Testnet" is selected
   - NOT "Mainnet"

### Step-by-Step Connection

1. **Refresh the page** (Cmd+R or Ctrl+R)
2. **Click "Connect Wallet"**
3. **Freighter popup should appear**
4. **Click "Connect" in the popup**
5. **Your address should appear**

### Common Issues & Solutions

#### Issue: "Please install Freighter Wallet" message
**Solution:**
- Install Freighter from https://www.freighter.app/
- Restart browser after installation
- Refresh the application page

#### Issue: Button does nothing when clicked
**Solution:**
- Check browser console for errors
- Make sure Freighter is unlocked
- Try disabling other wallet extensions (MetaMask, etc.)
- Clear browser cache and reload

#### Issue: Popup appears but closes immediately
**Solution:**
- Check if popup blocker is enabled
- Allow popups for localhost:3000
- Try clicking the Freighter extension directly

#### Issue: "No address returned from wallet"
**Solution:**
- Make sure you have an account in Freighter
- If no account, create one in Freighter
- Make sure account is selected (not locked)

#### Issue: Connection works but address doesn't show
**Solution:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()` in console
- Refresh page and try again

### Testing Wallet Connection

Open browser console and run:

```javascript
// Check if Freighter is available
console.log('Freighter available:', window.freighter !== undefined);

// Try to connect manually
import('@stellar/freighter-api').then(async (freighter) => {
  const connected = await freighter.isConnected();
  console.log('Freighter connected:', connected);
  
  if (connected) {
    const result = await freighter.getAddress();
    console.log('Address result:', result);
  }
});
```

### Debug Mode

The application now includes console logging. Check for these messages:

1. "Wallet check complete. Installed: true/false"
2. "Connect button clicked"
3. "Attempting to connect wallet..."
4. "Wallet connection result: {...}"
5. "Successfully connected to wallet: G..."

If you don't see these messages, there's a JavaScript error preventing execution.

### Browser Compatibility

Freighter works on:
- ✅ Chrome/Chromium
- ✅ Brave
- ✅ Edge
- ✅ Firefox
- ❌ Safari (not supported)

### Alternative: Manual Testing

If wallet connection still doesn't work, you can test with a hardcoded address:

1. Open `src/contexts/WalletContext.tsx`
2. In the `connect` function, temporarily add:
```typescript
// Temporary for testing
setPublicKey('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
localStorage.setItem('walletPublicKey', 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
```

This will let you test the rest of the application while debugging wallet issues.

### Getting Help

If none of these solutions work:

1. **Check Freighter Status**
   - Visit https://status.freighter.app/
   - Check for known issues

2. **Check Stellar Network**
   - Visit https://status.stellar.org/
   - Make sure testnet is operational

3. **Report Issue**
   - Browser version
   - Freighter version
   - Console error messages
   - Steps to reproduce

### Verification Steps

After connecting successfully:

1. ✅ Green box shows your address
2. ✅ Address format: G + 55 characters
3. ✅ "Disconnect" button appears
4. ✅ Can navigate to other tabs
5. ✅ Address persists after page refresh

### Network Requests

Check Network tab in DevTools:
- Should NOT see requests to Horizon API yet
- Wallet connection is local only
- No blockchain transactions during connection

### Security Notes

- ✅ Private keys never leave Freighter
- ✅ Application only requests public key
- ✅ No sensitive data transmitted
- ✅ Connection is permission-based

### Still Not Working?

Try this nuclear option:

1. Close browser completely
2. Uninstall Freighter extension
3. Reinstall Freighter
4. Create/import account
5. Restart browser
6. Open application
7. Try connecting again

### Contact Support

- Freighter Discord: https://discord.gg/stellar
- Stellar Stack Exchange: https://stellar.stackexchange.com/
- GitHub Issues: [Your repo URL]
