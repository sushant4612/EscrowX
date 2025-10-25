# 🔧 Troubleshooting Fund Release

## Problem: Funds not transferring when approved

### Check 1: Does the job have an escrow account?

Open browser console (F12) and when you click "Approve & Release Funds", look for:
```
🔍 Approve clicked - Job details: {
  jobId: "...",
  escrowAccount: "GXXX...",  ← Should have a value
  freelancer: "GXXX...",
  amount: "5"
}
```

**If `escrowAccount` is `undefined`:**
- This job was created before blockchain integration
- Funds were never locked on blockchain
- You can only update status, not release real funds

**Solution:** Create a new job with the updated code

---

### Check 2: Is the escrow secret in localStorage?

Look for this log:
```
🔑 Escrow secret found: true  ← Should be true
```

**If it shows `false`:**
- The escrow secret key is not in localStorage
- This happens if:
  - You're using a different browser than when you created the job
  - Browser data was cleared
  - Job was created in incognito mode

**Solution:** 
- Use the same browser where you created the job
- Or create a new job in the current browser

---

### Check 3: Transaction errors

Look for error messages like:
```
❌ Release error: Error: ...
```

**Common errors:**

1. **"tx_insufficient_balance"**
   - Escrow account doesn't have enough XLM
   - Check escrow balance on Stellar Explorer

2. **"tx_bad_auth"**
   - Wrong escrow secret key
   - Escrow account may have been compromised

3. **"op_no_destination"**
   - Freelancer account doesn't exist on Stellar
   - Freelancer needs to activate their account first

---

## ✅ How to Test Properly

### Step 1: Create Job (Client Browser)
1. Connect wallet with Freighter
2. Create job with 5+ XLM
3. Approve Freighter transaction
4. **Check console:** Should see escrow account created
5. **Check localStorage:** Key `escrow_JOBID` should exist

### Step 2: Complete Job (Freelancer Browser)
1. Open in **different browser** or **incognito**
2. Connect freelancer wallet
3. Click "Mark Completed"

### Step 3: Release Funds (Client Browser)
1. Go back to **original client browser**
2. Click "Approve & Release Funds"
3. **Check console logs**
4. Should see transaction hash
5. **Check Stellar Explorer** to verify

---

## 🔍 Debug Commands

### Check localStorage for escrow keys:
```javascript
// In browser console
Object.keys(localStorage).filter(k => k.startsWith('escrow_'))
```

### Check specific escrow key:
```javascript
localStorage.getItem('escrow_YOUR_JOB_ID')
```

### Check job data:
```javascript
// In browser console on the jobs page
console.log(jobs)
```

---

## 🚨 Known Issues

### Issue: "Escrow key not found"
**Cause:** Using different browser than where job was created
**Fix:** Use same browser, or implement server-side key storage

### Issue: Funds locked but can't release
**Cause:** Lost escrow secret key
**Fix:** Unfortunately, funds are permanently locked. This is why production systems use:
- Server-side key storage
- Multi-signature accounts
- Time-locked recovery mechanisms

### Issue: Transaction fails silently
**Cause:** Network error or insufficient balance
**Fix:** Check browser console for detailed error

---

## 💡 Production Recommendations

For a production system, you should:

1. **Store escrow keys server-side** (encrypted)
2. **Use multi-signature accounts** (client + platform)
3. **Implement time-locks** (auto-release after X days)
4. **Add balance checks** before creating jobs
5. **Verify freelancer account exists** before job creation
6. **Add transaction retry logic**
7. **Store transaction hashes** in database

---

## 🧪 Quick Test

Run this in browser console to verify everything:

```javascript
// Check if job has escrow account
console.log('Escrow account:', job.escrowAccount);

// Check if secret exists
const secret = localStorage.getItem(`escrow_${job.id}`);
console.log('Secret exists:', !!secret);

// If both exist, try manual release
if (job.escrowAccount && secret) {
  import('@/lib/escrow').then(({ releaseEscrowFunds }) => {
    releaseEscrowFunds(job.escrowAccount, secret, job.freelancer)
      .then(hash => console.log('Success!', hash))
      .catch(err => console.error('Failed:', err));
  });
}
```
