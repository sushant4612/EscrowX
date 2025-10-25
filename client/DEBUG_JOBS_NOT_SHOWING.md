# Debug: Jobs Not Showing in Freelancer Dashboard

## 🔍 Step-by-Step Debugging

### Step 1: Check the Troubleshooting Panel

The app now has a **red troubleshooting panel** at the top. Look at it and check:

```
Current Status:
• Total jobs: X
• Your wallet: GXXXXX...
• Storage key: stellar_escrow_shared_jobs
```

**What to look for:**
- If "Total jobs: 0" → No jobs created yet
- If "Total jobs: 1+" → Jobs exist, but address might not match

### Step 2: Open Browser Console

Press **F12** (or Cmd+Option+I on Mac) and look for these messages:

```
=== FREELANCER DASHBOARD DEBUG ===
Total jobs in system: X
Your wallet address: GXXXXX...
All jobs: [...]
Jobs assigned to you: X
```

**What to check:**
1. Does "Total jobs in system" show your job?
2. Does "Your wallet address" match the freelancer address you used?
3. Look at "All jobs" - find your job and check the freelancer field

### Step 3: Check Address Match

In the console, you'll see lines like:
```
Job job-123: freelancer=GXXXXX..., matches=true/false
```

**If matches=false:**
- The freelancer address in the job doesn't match your wallet
- You need to use the EXACT address

### Step 4: Verify Job Creation

**As Client:**
1. Switch to Client role
2. Check if job appears in Client dashboard
3. If YES → Job was created
4. If NO → Job creation failed

### Step 5: Check Shared Storage

Click the **"🔍 Check Storage"** button in troubleshooting panel.

It will show: `Shared storage has X jobs`

**If 0 jobs:**
- Jobs aren't being saved
- Check browser console for errors

**If 1+ jobs:**
- Jobs are saved
- Address mismatch is the issue

### Step 6: Manual Check

Open browser console and run:
```javascript
// Check shared storage
const jobs = JSON.parse(localStorage.getItem('stellar_escrow_shared_jobs'));
console.log('All jobs:', jobs);

// Check your wallet
const wallet = localStorage.getItem('walletPublicKey');
console.log('Your wallet:', wallet);

// Find matching jobs
const myJobs = jobs.filter(j => j.freelancer === wallet);
console.log('Your jobs:', myJobs);
```

## 🎯 Common Issues & Solutions

### Issue 1: Address Mismatch

**Symptom:**
- Total jobs: 1+
- Jobs assigned to you: 0
- Console shows: `matches=false`

**Solution:**
```
1. Copy your wallet address (click green box)
2. Switch to Client role
3. Create NEW job
4. Paste your EXACT address
5. Switch back to Freelancer
6. Job should appear!
```

### Issue 2: No Jobs Created

**Symptom:**
- Total jobs: 0
- Empty storage

**Solution:**
```
1. Switch to Client role
2. Click "+ Create New Job"
3. Fill all fields
4. Click "Create Job & Lock Funds"
5. Wait for success message
6. Switch to Freelancer role
7. Click "🔄 Refresh Jobs"
```

### Issue 3: Different Browser/Computer

**Symptom:**
- Created job in Chrome
- Checking in Firefox
- Job doesn't appear

**Solution:**
```
localStorage is browser-specific!

Option A: Use same browser
- Create and view in same browser

Option B: Use browser profiles
- Chrome Profile 1: Client
- Chrome Profile 2: Freelancer

Option C: Add backend
- See BACKEND_SETUP.md
```

### Issue 4: Whitespace in Address

**Symptom:**
- Address looks correct
- Still doesn't match

**Solution:**
```
Addresses might have extra spaces!

1. When creating job, the address is trimmed
2. But if you manually typed it, check for:
   - Leading spaces
   - Trailing spaces
   - Line breaks

Use "Use My Address as Freelancer" button to avoid this!
```

### Issue 5: Auto-Refresh Not Working

**Symptom:**
- Job created
- Doesn't appear automatically
- Appears after manual refresh

**Solution:**
```
Auto-refresh runs every 5 seconds.

Quick fix:
1. Click "🔄 Refresh Jobs" button
2. Or wait 5 seconds
3. Or refresh page (Cmd+R / Ctrl+R)
```

## 🧪 Testing Procedure

### Test 1: Same Wallet (Easiest)

```
1. Connect wallet
2. Copy your address (click green box)
3. Switch to Client
4. Click "+ Create New Job"
5. Click "Use My Address as Freelancer"
6. Amount: 10
7. Description: "Test"
8. Submit
9. Switch to Freelancer
10. Click "🔄 Refresh Jobs"
11. ✅ Job should appear!
```

### Test 2: Two Wallets

```
Setup:
- Wallet A: GABC...123
- Wallet B: GXYZ...789

Step 1 (Client):
1. Connect Wallet A
2. Switch to Client
3. Create job
4. Freelancer: GXYZ...789 (Wallet B)
5. Submit

Step 2 (Freelancer):
1. Disconnect Wallet A
2. Connect Wallet B
3. Switch to Freelancer
4. Click "🔄 Refresh Jobs"
5. ✅ Job should appear!
```

## 📊 Debug Checklist

Use this checklist to debug:

- [ ] Troubleshooting panel shows total jobs > 0
- [ ] Browser console shows no errors
- [ ] Wallet is connected
- [ ] Switched to Freelancer role
- [ ] Freelancer address matches wallet address exactly
- [ ] Clicked "Refresh Jobs" button
- [ ] Waited 5 seconds for auto-refresh
- [ ] Using same browser/computer
- [ ] Job appears in Client dashboard
- [ ] Shared storage has jobs (check with button)

## 🔧 Advanced Debugging

### Check Job Object:

```javascript
// In console
const jobs = JSON.parse(localStorage.getItem('stellar_escrow_shared_jobs'));
const job = jobs[0]; // First job

console.log('Job ID:', job.id);
console.log('Client:', job.client);
console.log('Freelancer:', job.freelancer);
console.log('Amount:', job.amount);
console.log('Status:', job.status);

// Check if it matches your wallet
const wallet = localStorage.getItem('walletPublicKey');
console.log('Match:', job.freelancer === wallet);
```

### Force Refresh:

```javascript
// In console
window.location.reload();
```

### Clear and Start Fresh:

```javascript
// In console
localStorage.removeItem('stellar_escrow_shared_jobs');
window.location.reload();
// Then create job again
```

## 💡 Pro Tips

1. **Always use "Use My Address as Freelancer" button** for testing
2. **Check troubleshooting panel first** before debugging
3. **Use browser console** to see exact addresses
4. **Click "Refresh Jobs"** if job doesn't appear immediately
5. **Use same browser** for client and freelancer testing

## 🆘 Still Not Working?

If you've tried everything:

1. **Clear all storage:**
   ```javascript
   localStorage.clear();
   ```

2. **Refresh page**

3. **Create new job with "Use My Address as Freelancer"**

4. **Check console for errors**

5. **Share console output** for help

## 📸 What You Should See

### In Troubleshooting Panel:
```
Current Status:
• Total jobs: 1
• Your wallet: GABC...123
• Storage key: stellar_escrow_shared_jobs
```

### In Console:
```
=== FREELANCER DASHBOARD DEBUG ===
Total jobs in system: 1
Your wallet address: GABC...123
Job job-123: freelancer=GABC...123, matches=true
Jobs assigned to you: 1
```

### In Freelancer Dashboard:
```
Active Jobs (1)
┌─────────────────────┐
│ Job #123            │
│ Test job            │
│ 10 XLM              │
│ [Mark Completed]    │
└─────────────────────┘
```

---

**If you see all of the above, it's working! 🎉**
