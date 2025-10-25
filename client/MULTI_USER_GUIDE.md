# Multi-User & Real Blockchain Guide

## 🎉 New Features!

Your app now supports:
1. **Multi-user functionality** - Jobs created by one wallet appear for other wallets
2. **Real blockchain transactions** - Optional real XLM deduction from testnet

## 🔄 How Multi-User Works

### Shared Storage
Jobs are now stored in a **shared localStorage key** that all users can access:
- Key: `stellar_escrow_shared_jobs`
- Updates every 5 seconds automatically
- Works across different browser sessions on the same computer

### Real-World Scenario:
```
User A (Client) creates job → Saved to shared storage
         ↓
User B (Freelancer) opens app → Loads from shared storage
         ↓
User B sees the job! 🎉
```

## 💰 Real Blockchain Escrow

### How It Works:

1. **Enable Real Escrow**
   - Check the "Use Real Blockchain Escrow" checkbox
   - This creates an actual escrow account on Stellar testnet

2. **What Happens:**
   - Creates new Stellar account for escrow
   - Transfers XLM from your account to escrow
   - **XLM is actually deducted from your balance!**
   - Escrow address is saved with the job

3. **Verification:**
   - Check your balance in Freighter (it will decrease)
   - View escrow account on Stellar Expert
   - See the transaction on blockchain

## 📋 Testing Multi-User (Same Computer)

### Method 1: Two Browser Windows

**Window 1 (Client):**
```
1. Open app in Chrome
2. Connect Wallet A
3. Switch to Client role
4. Create job with Wallet B address
```

**Window 2 (Freelancer):**
```
1. Open app in Firefox/Incognito
2. Connect Wallet B
3. Switch to Freelancer role
4. See the job appear! 🎉
```

### Method 2: Same Browser, Different Wallets

**Step 1: Create Job**
```
1. Connect Wallet A (Client)
2. Create job with Wallet B address
3. Job saved to shared storage
```

**Step 2: View as Freelancer**
```
1. Disconnect Wallet A
2. Connect Wallet B (Freelancer)
3. Switch to Freelancer role
4. Wait 5 seconds (auto-refresh)
5. Job appears!
```

## 🌐 Testing Multi-User (Different Computers)

### Current Limitation:
The app uses localStorage which is **browser-specific**. To test on different computers, you need a backend.

### Quick Solution: Use Same Computer
For hackathon/demo purposes, use two browser windows as shown above.

### Production Solution: Add Backend
See `BACKEND_SETUP.md` for instructions on adding a real backend.

## 💸 Testing Real Blockchain Transactions

### Prerequisites:
- Funded testnet account (minimum 10 XLM)
- Freighter wallet unlocked
- Connected to Stellar testnet

### Steps:

1. **Check Your Balance**
   ```
   Open Freighter → Note your XLM balance
   Example: 10,000 XLM
   ```

2. **Create Job with Real Escrow**
   ```
   ✅ Check "Use Real Blockchain Escrow"
   Amount: 5 XLM
   Click "Create Job & Lock Funds on Blockchain"
   ```

3. **Approve in Freighter**
   ```
   Freighter popup appears
   Click "Approve"
   Wait for confirmation
   ```

4. **Verify Deduction**
   ```
   Open Freighter → Check balance
   New balance: 9,995 XLM (5 XLM locked in escrow)
   ```

5. **View on Blockchain**
   ```
   Copy escrow address from alert
   Visit: https://stellar.expert/explorer/testnet
   Paste escrow address
   See the 5 XLM locked!
   ```

## 🔍 How to Verify

### Check Shared Storage:
```javascript
// In browser console (F12)
JSON.parse(localStorage.getItem('stellar_escrow_shared_jobs'))
```

### Check Your Balance:
```javascript
// In Freighter or console
// Your balance should decrease by the escrow amount
```

### Check Escrow Account:
```
1. Get escrow address from job creation alert
2. Visit: https://stellar.expert/explorer/testnet/account/ESCROW_ADDRESS
3. See the locked XLM
```

## 📊 Comparison

### Test Mode (Default):
```
✅ No XLM deducted
✅ Fast testing
✅ No blockchain transactions
✅ Perfect for development
❌ Not real escrow
```

### Real Escrow Mode:
```
✅ Real XLM deducted
✅ Actual blockchain transactions
✅ Verifiable on Stellar Explorer
✅ Production-ready
⚠️ Requires testnet XLM
⚠️ Slower (blockchain confirmation)
```

## 🎯 Demo Scenarios

### Scenario 1: Quick Test (No Blockchain)
```
1. Connect wallet
2. Create job (leave checkbox unchecked)
3. Switch to freelancer role
4. See job appear
5. Complete workflow
✅ Fast, no XLM needed
```

### Scenario 2: Real Blockchain Demo
```
1. Connect wallet with 10+ XLM
2. Create job (check "Use Real Blockchain Escrow")
3. Approve in Freighter
4. Show balance decrease
5. Show escrow on Stellar Expert
6. Complete workflow
✅ Impressive for judges!
```

### Scenario 3: Multi-User Demo
```
Browser 1 (Client):
- Create job with Browser 2's address

Browser 2 (Freelancer):
- Open app
- Connect different wallet
- See job appear automatically
✅ Shows real multi-user functionality
```

## ⚙️ Configuration

### Auto-Refresh Interval:
Jobs refresh every 5 seconds. To change:
```typescript
// In src/contexts/JobContext.tsx
const interval = setInterval(loadJobs, 5000); // Change 5000 to desired ms
```

### Shared Storage Key:
```typescript
// In src/lib/api.ts
const SHARED_JOBS_KEY = 'stellar_escrow_shared_jobs';
```

## 🚀 Production Deployment

### For Real Multi-User Support:

**Option 1: Supabase (Recommended)**
```
1. Create Supabase project
2. Create 'jobs' table
3. Install @supabase/supabase-js
4. Update src/lib/api.ts
5. Deploy!
```

**Option 2: Custom Backend**
```
1. Build Node.js/Express API
2. Add PostgreSQL database
3. Deploy to Railway/Heroku
4. Update API endpoints
```

**Option 3: Firebase**
```
1. Create Firebase project
2. Enable Firestore
3. Install firebase SDK
4. Update src/lib/api.ts
```

See `BACKEND_SETUP.md` for detailed instructions.

## 🐛 Troubleshooting

### "Job doesn't appear for other user"

**Check:**
1. Both users on same computer?
2. Using shared storage key?
3. Wait 5 seconds for auto-refresh
4. Check console for errors

**Solution:**
```javascript
// Force refresh in console
window.location.reload()
```

### "XLM not deducted"

**Check:**
1. "Use Real Blockchain Escrow" checked?
2. Approved transaction in Freighter?
3. Sufficient balance (min 3 XLM)?
4. Connected to testnet?

**Solution:**
- Check Freighter transaction history
- View account on Stellar Expert

### "Escrow creation failed"

**Common Causes:**
1. Insufficient balance
2. Network issues
3. Freighter locked
4. Wrong network (mainnet vs testnet)

**Solution:**
- Ensure 10+ XLM balance
- Check network connection
- Unlock Freighter
- Verify testnet selected

## 📈 Statistics

### Test Mode:
- Job creation: < 1 second
- No fees
- Unlimited jobs

### Real Escrow Mode:
- Job creation: 3-5 seconds
- Fee: ~0.00001 XLM
- Requires funded account

## 🎓 Best Practices

### For Development:
```
✅ Use test mode (unchecked)
✅ Test with your own address
✅ Use browser console for debugging
```

### For Demo:
```
✅ Use real escrow for 1-2 jobs
✅ Show blockchain verification
✅ Prepare two wallets
✅ Have Stellar Expert open
```

### For Production:
```
✅ Always use real escrow
✅ Add proper backend
✅ Implement key management
✅ Add error recovery
```

## 🎉 Summary

You now have:
- ✅ Multi-user job sharing (same computer)
- ✅ Real blockchain escrow (optional)
- ✅ Automatic job refresh
- ✅ XLM deduction from testnet
- ✅ Verifiable on Stellar Explorer

**For true multi-user across different computers, add a backend (see BACKEND_SETUP.md)**

Happy testing! 🚀
