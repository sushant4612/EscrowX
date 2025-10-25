# 🔍 Quick Debug Checklist

## Issue: Can't see disputes or stake in Arbitrator dashboard

### ✅ Step-by-Step Debugging

#### 1. Check the Debug Info Panel (Yellow Box)
Look at the top of Arbitrator dashboard:
```
📊 Debug Info:
Total Disputes: X
Available to Vote: X
My Address: GXXX...
Balance: X XLM
```

**What to check:**
- Total Disputes > 0? (If 0, no disputes exist)
- Available to Vote > 0? (If 0, you're involved in all disputes)
- Balance > 10 XLM? (Need funds to stake)

---

#### 2. Open Browser Console (F12)
Press F12 and look for logs:

**Expected logs:**
```
🔍 Arbitrator Dashboard Debug: {
  myAddress: "GXXX...",
  totalDisputes: X,
  activeDisputesForMe: X,
  allDisputes: [...]
}
```

**Check each dispute:**
```
{
  id: "abc123",
  status: "ACTIVE",
  client: "GAAA...",
  freelancer: "GBBB...",
  canIVote: true/false  ← Should be true!
}
```

---

#### 3. Verify Dispute Creation

**In Browser Console, run:**
```javascript
// Check localStorage
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Stored disputes:', disputes);

// Check if any exist
console.log('Total:', disputes.length);
console.log('Active:', disputes.filter(d => d.status === 'ACTIVE').length);
```

---

#### 4. Check Wallet Addresses

**Make sure you're using 3 DIFFERENT wallets:**

**Browser 1 (Client):**
```
Address: GAAA...
Role: Creates job, raises dispute
```

**Browser 2 (Freelancer):**
```
Address: GBBB...
Role: Completes job
```

**Browser 3 (Arbitrator):**
```
Address: GCCC...
Role: Should see dispute and vote
```

**Verify addresses are different:**
```javascript
// In each browser console
console.log('My address:', window.freighterApi?.getPublicKey());
```

---

#### 5. Test Staking

**When you click "Stake Now":**

**Check console for:**
```
🔒 Staking attempt: { publicKey: "GXXX...", stakeAmount: "10" }
📤 Calling stakeAsArbitrator...
```

**If error appears:**
- Check Freighter is unlocked
- Check you have enough XLM
- Check network connection

---

### 🐛 Common Issues & Solutions

#### Issue 1: "Total Disputes: 0"
**Problem:** No disputes created yet
**Solution:**
1. Go to Client dashboard (Browser 1)
2. Create a job
3. Go to Freelancer dashboard (Browser 2)
4. Mark as completed
5. Go back to Client dashboard (Browser 1)
6. Reject with evidence

#### Issue 2: "Available to Vote: 0" but "Total Disputes: 1+"
**Problem:** You're involved in all disputes
**Solution:**
- Make sure you're using a THIRD wallet
- Check console: `canIVote` should be `true`
- Verify your address is different from client and freelancer

#### Issue 3: Staking doesn't work
**Problem:** Freighter not responding
**Solution:**
1. Check Freighter is installed and unlocked
2. Check you're on testnet
3. Check you have 10+ XLM
4. Try refreshing the page
5. Check console for errors

#### Issue 4: Same browser, different wallets
**Problem:** localStorage is shared
**Solution:**
- Use different browsers (Chrome, Firefox, Edge)
- Or use incognito windows
- Or use different browser profiles

---

### 🧪 Complete Test Flow

#### Step 1: Create Dispute (Browser 1 - Client)
```
1. Connect Wallet A (GAAA...)
2. Go to Client dashboard
3. Click "Create New Job"
4. Freelancer: GBBB... (Wallet B address)
5. Amount: 10 XLM
6. Description: Test job
7. Create job
```

#### Step 2: Complete Job (Browser 2 - Freelancer)
```
1. Connect Wallet B (GBBB...)
2. Go to Freelancer dashboard
3. Find the job
4. Click "Mark as Completed"
```

#### Step 3: Raise Dispute (Browser 1 - Client)
```
1. Still in Browser 1 (Wallet A)
2. Go to Client dashboard
3. Find job in "Pending Review"
4. Enter evidence: "Work incomplete"
5. Click "Reject & Raise Dispute"
6. Should see: "Dispute raised! DAO arbitrators will review your case."
```

#### Step 4: Check Console (Browser 1)
```
Press F12
Look for:
"Dispute created"
Check localStorage:
localStorage.getItem('disputes')
```

#### Step 5: Vote (Browser 3 - Arbitrator)
```
1. Connect Wallet C (GCCC...) - MUST BE DIFFERENT!
2. Go to Arbitrator dashboard
3. Check Debug Info panel:
   - Total Disputes: 1
   - Available to Vote: 1
4. Should see dispute below
5. If not, check console logs
```

---

### 🎯 Quick Verification Commands

**Run in Browser Console:**

```javascript
// 1. Check disputes exist
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Disputes:', disputes);

// 2. Check my address
console.log('My address:', 'PASTE_YOUR_ADDRESS_HERE');

// 3. Check if I can vote
disputes.forEach(d => {
  const myAddr = 'PASTE_YOUR_ADDRESS_HERE';
  const canVote = d.client !== myAddr && d.freelancer !== myAddr;
  console.log(`Dispute ${d.id}: canVote=${canVote}, client=${d.client.slice(0,8)}, freelancer=${d.freelancer.slice(0,8)}`);
});

// 4. Check balance
fetch('https://horizon-testnet.stellar.org/accounts/PASTE_YOUR_ADDRESS_HERE')
  .then(r => r.json())
  .then(d => console.log('Balance:', d.balances[0].balance, 'XLM'));
```

---

### 📊 Expected Console Output

**When everything works:**
```
🔍 Arbitrator Dashboard Debug: {
  myAddress: "GCCC...",
  totalDisputes: 1,
  activeDisputesForMe: 1,
  allDisputes: [{
    id: "abc123",
    status: "ACTIVE",
    client: "GAAA",
    freelancer: "GBBB",
    canIVote: true  ← This should be TRUE!
  }]
}
```

**When staking:**
```
🔒 Staking attempt: { publicKey: "GCCC...", stakeAmount: "10" }
📤 Calling stakeAsArbitrator...
✅ Stake result: { txHash: "...", stakeAccount: "..." }
```

---

### 🚨 If Still Not Working

1. **Take screenshot** of Debug Info panel
2. **Open console (F12)** and take screenshot
3. **Run verification commands** above
4. **Check:**
   - Are you using 3 different wallet addresses?
   - Is dispute status "ACTIVE"?
   - Is your address different from client and freelancer?
   - Do you have enough XLM?

The debug info panel and console logs will show exactly what's happening!
