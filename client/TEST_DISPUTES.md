# 🧪 Testing Disputes - Quick Guide

## Issue: Disputes not visible in Arbitrator DAO

### ✅ Quick Test Commands

Open browser console (F12) and run these commands:

#### 1. Check if disputes exist:
```javascript
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Total disputes:', disputes.length);
console.log('Disputes:', disputes);
```

#### 2. Check your wallet address:
```javascript
// Your current address
console.log('My address:', 'PASTE_YOUR_ADDRESS_HERE');
```

#### 3. Check if you can vote:
```javascript
const myAddress = 'PASTE_YOUR_ADDRESS_HERE';
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');

disputes.forEach((d, i) => {
    const canVote = d.client !== myAddress && d.freelancer !== myAddress;
    console.log(`\nDispute ${i + 1}:`);
    console.log('  Can I vote?', canVote);
    console.log('  Client:', d.client.slice(0, 10) + '...');
    console.log('  Freelancer:', d.freelancer.slice(0, 10) + '...');
    console.log('  My address:', myAddress.slice(0, 10) + '...');
    console.log('  Status:', d.status);
});
```

---

## 🎯 Common Issues

### Issue 1: No disputes exist
**Check:**
```javascript
JSON.parse(localStorage.getItem('disputes') || '[]').length
// Should be > 0
```

**Solution:** Create a dispute first
1. Browser 1: Create job as client
2. Browser 2: Mark complete as freelancer
3. Browser 1: Reject with evidence

### Issue 2: You're involved in the dispute
**Check:**
```javascript
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
const myAddr = 'YOUR_ADDRESS';
disputes.forEach(d => {
    console.log('Am I client?', d.client === myAddr);
    console.log('Am I freelancer?', d.freelancer === myAddr);
});
```

**Solution:** Use a THIRD wallet that's not the client or freelancer

### Issue 3: Wrong browser
**Check:** Disputes are stored in localStorage (per browser)

**Solution:** Use the same browser where the dispute was created

### Issue 4: Dispute status not ACTIVE
**Check:**
```javascript
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
disputes.forEach(d => console.log('Status:', d.status));
// Should be "ACTIVE"
```

---

## 🔄 Complete Test Flow

### Step 1: Create Dispute (Browser 1 - Client)
```
1. Open Browser 1 (Chrome)
2. Connect Wallet A (GAAA...)
3. Go to Client dashboard
4. Create job for Wallet B (GBBB...)
5. Freelancer marks complete (Browser 2)
6. Reject with evidence
7. Alert: "Dispute raised!"
```

**Verify in console:**
```javascript
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('Dispute created:', disputes.length === 1);
console.log('Client:', disputes[0].client);
console.log('Freelancer:', disputes[0].freelancer);
```

### Step 2: Check as Client (Browser 1)
```
1. Still in Browser 1
2. Switch to Arbitrator DAO view
3. Should NOT see dispute (you're the client)
```

**Verify in console:**
```javascript
const myAddr = 'GAAA...'; // Your client address
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
const canVote = disputes[0].client !== myAddr && disputes[0].freelancer !== myAddr;
console.log('Can I vote?', canVote); // Should be false
console.log('Reason: I am the client');
```

### Step 3: Check as Freelancer (Browser 2)
```
1. Open Browser 2 (Firefox)
2. Connect Wallet B (GBBB...)
3. Go to Arbitrator DAO view
4. Should NOT see dispute (you're the freelancer)
```

**But wait!** Disputes are in Browser 1's localStorage, not Browser 2!

**Solution:** Copy disputes to Browser 2:
```javascript
// In Browser 1 console:
const disputes = localStorage.getItem('disputes');
console.log('Copy this:', disputes);

// In Browser 2 console:
localStorage.setItem('disputes', 'PASTE_HERE');
location.reload();
```

### Step 4: Check as Arbitrator (Browser 3)
```
1. Open Browser 3 (Edge or Incognito)
2. Connect Wallet C (GCCC...)
3. Copy disputes from Browser 1 (see above)
4. Go to Arbitrator DAO view
5. SHOULD see dispute (you're not involved)
```

**Verify in console:**
```javascript
const myAddr = 'GCCC...'; // Your arbitrator address
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
const canVote = disputes[0].client !== myAddr && disputes[0].freelancer !== myAddr;
console.log('Can I vote?', canVote); // Should be true
console.log('Reason: I am neither client nor freelancer');
```

---

## 💡 Key Points

### localStorage is Per-Browser
- Disputes created in Chrome stay in Chrome
- Other browsers won't see them
- Solution: Copy localStorage data between browsers

### You Can't Vote on Your Own Disputes
- If you're the client → Can't vote
- If you're the freelancer → Can't vote
- Only external arbitrators can vote

### Need 3 Different Wallets
- Wallet A: Client
- Wallet B: Freelancer
- Wallet C: Arbitrator (must be different!)

---

## 🚀 Quick Copy-Paste Test

### Browser 1 (Client):
```javascript
// After creating dispute, run:
const disputes = localStorage.getItem('disputes');
console.log('=== COPY THIS ===');
console.log(disputes);
console.log('=== END ===');
```

### Browser 2 & 3 (Freelancer & Arbitrator):
```javascript
// Paste the disputes data:
localStorage.setItem('disputes', 'PASTE_DISPUTES_JSON_HERE');
location.reload();

// Then check:
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
const myAddr = 'YOUR_ADDRESS';
console.log('Total disputes:', disputes.length);
console.log('Can I vote?', disputes[0].client !== myAddr && disputes[0].freelancer !== myAddr);
```

---

## 🎯 Expected Results

### Browser 1 (Client - GAAA...):
```
Arbitrator DAO view:
- Active Disputes: 0
- Message: "1 dispute(s) exist but you're involved in them"
```

### Browser 2 (Freelancer - GBBB...):
```
Arbitrator DAO view:
- Active Disputes: 0
- Message: "1 dispute(s) exist but you're involved in them"
```

### Browser 3 (Arbitrator - GCCC...):
```
Arbitrator DAO view:
- Active Disputes: 1
- Shows dispute card with:
  - Evidence from both sides
  - Vote buttons
  - Stake input
```

---

## 🔧 If Still Not Working

Run this complete diagnostic:

```javascript
console.log('=== DISPUTE DIAGNOSTIC ===');

// 1. Check disputes exist
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');
console.log('1. Total disputes:', disputes.length);

// 2. Check your address
const myAddr = 'PASTE_YOUR_ADDRESS';
console.log('2. My address:', myAddr);

// 3. Check each dispute
disputes.forEach((d, i) => {
    console.log(`\n3.${i + 1} Dispute ${d.id.slice(-8)}:`);
    console.log('   Status:', d.status);
    console.log('   Client:', d.client);
    console.log('   Freelancer:', d.freelancer);
    console.log('   Am I client?', d.client === myAddr);
    console.log('   Am I freelancer?', d.freelancer === myAddr);
    console.log('   Can I vote?', d.client !== myAddr && d.freelancer !== myAddr);
});

console.log('\n=== END DIAGNOSTIC ===');
```

This will show you exactly why disputes are or aren't visible!
