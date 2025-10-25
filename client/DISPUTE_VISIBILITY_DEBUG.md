# 🔍 Dispute Visibility Debug Guide

## Issue: Dispute exists but not visible

### ✅ New Debug Tool Added

I've added a **Dispute Checker** panel (top-right corner) that shows:

```
🔍 Dispute Checker

From Context:
Total: X
Active: X

From localStorage:
Total: X  
Active: X

My Address:
GXXX...

Disputes:
[List of all disputes with details]

[📋 Log Full Details] button
[📋 Copy JSON] button
```

---

## 🎯 How to Use

### Step 1: Look at Dispute Checker Panel
- Top-right corner of screen
- Shows dispute counts from both sources
- Shows your current address

### Step 2: Check the Numbers
```
From Context: Total: 1, Active: 1
From localStorage: Total: 1, Active: 1
```

**If numbers match:** Disputes are loaded correctly
**If numbers differ:** Context not syncing with localStorage

### Step 3: Click "Log Full Details"
- Opens browser console (F12)
- Shows complete dispute information
- Shows which disputes you can vote on

### Step 4: Click "Copy JSON"
- Copies dispute data to clipboard
- Can paste into text editor to inspect
- Useful for debugging

---

## 🐛 Common Issues

### Issue 1: "Total: 0" in both
**Problem:** No disputes created
**Solution:** Create a dispute first

### Issue 2: "Total: 1" but not visible in dashboard
**Problem:** Filtering issue or wrong wallet
**Check:**
1. Are you the client or freelancer? (Can't see in Arbitrator view)
2. Is dispute status "ACTIVE"?
3. Are you in the right browser?

### Issue 3: Numbers don't match
**Problem:** Context not loading from localStorage
**Solution:** Refresh the page

---

## 🧪 Testing Checklist

### Before Testing:
- [ ] Have 3 different wallet addresses
- [ ] All wallets funded with 10+ XLM
- [ ] Using different browsers for each wallet

### Create Dispute:
- [ ] Browser 1: Create job as client
- [ ] Browser 2: Mark complete as freelancer
- [ ] Browser 1: Reject with evidence as client
- [ ] Check Dispute Checker shows "Total: 1"

### Check Visibility:
- [ ] Browser 1 (Client): Switch to Arbitrator view
  - Should NOT see dispute (you're the client)
- [ ] Browser 2 (Freelancer): Switch to Arbitrator view
  - Should NOT see dispute (you're the freelancer)
- [ ] Browser 3 (Arbitrator): Switch to Arbitrator view
  - SHOULD see dispute (you're not involved)

---

## 📊 Expected Behavior

### Client Dashboard:
```
Disputed Jobs section:
- Shows disputes where you're the client
- Can see your evidence
- Can see dispute status
```

### Freelancer Dashboard:
```
Disputed Jobs section:
- Shows disputes where you're the freelancer
- Can see your evidence
- Can see dispute status
```

### Arbitrator Dashboard:
```
Active Disputes section:
- Shows disputes where you're NOT client or freelancer
- Can see evidence from both sides
- Can vote on the dispute
```

---

## 🔍 Debug Commands

### Check localStorage:
```javascript
// In browser console (F12)
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Disputes:', disputes);
```

### Check if you can vote:
```javascript
const myAddress = 'YOUR_ADDRESS_HERE';
disputes.forEach(d => {
  const canVote = d.client !== myAddress && d.freelancer !== myAddress;
  console.log(`Dispute ${d.id.slice(-8)}: canVote=${canVote}`);
  console.log(`  Client: ${d.client.slice(0,8)}...`);
  console.log(`  Freelancer: ${d.freelancer.slice(0,8)}...`);
  console.log(`  My address: ${myAddress.slice(0,8)}...`);
});
```

### Verify dispute details:
```javascript
disputes.forEach((d, i) => {
  console.log(`\nDispute ${i+1}:`);
  console.log('  ID:', d.id);
  console.log('  Status:', d.status);
  console.log('  Job:', d.jobDescription);
  console.log('  Amount:', d.jobAmount, 'XLM');
  console.log('  Client evidence:', d.clientEvidence);
  console.log('  Freelancer evidence:', d.freelancerEvidence);
  console.log('  Votes:', d.votes.length);
});
```

---

## 🎯 Quick Test

### Test 1: Create Dispute
```
1. Browser 1 (Client): Create job for Browser 2
2. Browser 2 (Freelancer): Mark complete
3. Browser 1 (Client): Reject with evidence
4. Check Dispute Checker: Should show "Total: 1"
```

### Test 2: Check Visibility
```
Browser 1 (Client):
- Look at Dispute Checker
- Note your address
- Switch to Arbitrator view
- Should NOT see dispute
- Dispute Checker shows why

Browser 2 (Freelancer):
- Look at Dispute Checker
- Note your address
- Switch to Arbitrator view
- Should NOT see dispute
- Dispute Checker shows why

Browser 3 (Arbitrator):
- Look at Dispute Checker
- Note your address (different from above)
- Switch to Arbitrator view
- SHOULD see dispute
- Can vote on it
```

---

## 💡 Understanding the Filter

### Code Logic:
```typescript
const activeDisputes = disputes.filter((d) => {
    const isActive = d.status === 'ACTIVE';
    const isNotInvolved = d.client !== publicKey && d.freelancer !== publicKey;
    return isActive && isNotInvolved;
});
```

### What This Means:
- **isActive:** Only shows ACTIVE disputes (not RESOLVED)
- **isNotInvolved:** Only shows disputes where you're NOT the client or freelancer
- **Both must be true** to see the dispute

### Example:
```
Dispute:
- Client: GAAA...
- Freelancer: GBBB...
- Status: ACTIVE

Viewer: GAAA... (Client)
- isActive: true ✅
- isNotInvolved: false ❌ (you're the client)
- Result: NOT visible

Viewer: GBBB... (Freelancer)
- isActive: true ✅
- isNotInvolved: false ❌ (you're the freelancer)
- Result: NOT visible

Viewer: GCCC... (Arbitrator)
- isActive: true ✅
- isNotInvolved: true ✅ (you're neither)
- Result: VISIBLE ✅
```

---

## 🚨 If Still Not Working

### Step 1: Use Dispute Checker
1. Look at top-right panel
2. Check "Total" count
3. Click "Log Full Details"
4. Check console output

### Step 2: Verify Addresses
```javascript
// In each browser console
console.log('My address:', 'PASTE_YOUR_ADDRESS');

// Check dispute
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Dispute client:', disputes[0]?.client);
console.log('Dispute freelancer:', disputes[0]?.freelancer);
console.log('Match client?', disputes[0]?.client === 'PASTE_YOUR_ADDRESS');
console.log('Match freelancer?', disputes[0]?.freelancer === 'PASTE_YOUR_ADDRESS');
```

### Step 3: Check Browser
- Make sure you're in the RIGHT browser
- Disputes are stored per browser (localStorage)
- Use same browser where dispute was created

### Step 4: Check Status
```javascript
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Status:', disputes[0]?.status);
// Should be "ACTIVE"
```

---

## 📱 Dispute Checker Features

### Real-time Updates:
- Shows current dispute count
- Updates when disputes change
- Shows your current address

### Detailed Logging:
- Click "Log Full Details" for console output
- Shows all dispute properties
- Shows voting eligibility

### JSON Export:
- Click "Copy JSON" to export
- Paste into text editor
- Inspect raw data

---

**The Dispute Checker will show you exactly what's happening!** 🔍
