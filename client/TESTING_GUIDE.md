# Testing Guide - How to See Jobs in Both Dashboards

## Method 1: Single Wallet Testing (Quick & Easy)

This method lets you test with just one wallet by using your own address as the freelancer.

### Steps:

1. **Connect Your Wallet**
   - Click "Connect Wallet"
   - Approve in Freighter
   - Your address appears in green box

2. **Copy Your Address**
   - Click on your address to copy it
   - Or manually copy from Freighter wallet

3. **Switch to Client Role**
   - Click "Client" in the role selector
   - You'll see the Client Dashboard

4. **Create a Job**
   - Click "+ Create New Job"
   - **Freelancer Address**: Paste YOUR OWN address
   - **Amount**: Enter any amount (e.g., 100)
   - **Description**: "Test job"
   - Click "Create Job & Lock Funds"

5. **Switch to Freelancer Role**
   - Click "Freelancer" in the role selector
   - **You'll now see the job!** 🎉
   - It appears in "Active Jobs" section

6. **Complete the Workflow**
   - As Freelancer: Click "Mark Completed"
   - Switch to Client role
   - Click "Approve & Release Funds"

### Why This Works:
- You're both the client AND the freelancer
- Same wallet address for both roles
- Perfect for testing the full workflow

## Method 2: Two Wallet Testing (Real Scenario)

This simulates a real client-freelancer relationship.

### Setup:

**Wallet A (Client)**
- Your main wallet
- Will create jobs

**Wallet B (Freelancer)**
- Second wallet (create new in Freighter)
- Will receive jobs

### Steps:

#### Part 1: Create Job as Client

1. **Connect Wallet A**
   - Click "Connect Wallet"
   - Connect your main wallet

2. **Get Wallet B Address**
   - Open Freighter
   - Switch to your second account
   - Copy the address (starts with G)

3. **Create Job**
   - Switch to Client role
   - Click "+ Create New Job"
   - **Freelancer Address**: Paste Wallet B address
   - **Amount**: 100
   - **Description**: "Build landing page"
   - Submit

#### Part 2: View as Freelancer

1. **Disconnect Wallet A**
   - Click "Disconnect"

2. **Connect Wallet B**
   - Click "Connect Wallet"
   - Switch to second account in Freighter
   - Connect

3. **Switch to Freelancer Role**
   - Click "Freelancer"
   - **You'll see the job!** 🎉

4. **Mark Completed**
   - Click "Mark Completed"

#### Part 3: Approve as Client

1. **Disconnect Wallet B**
   - Click "Disconnect"

2. **Reconnect Wallet A**
   - Click "Connect Wallet"
   - Connect your main wallet

3. **Switch to Client Role**
   - Click "Client"
   - See job in "Awaiting Your Approval"

4. **Approve**
   - Click "Approve & Release Funds"

## Quick Test Checklist

### ✅ Single Wallet Test:
- [ ] Connect wallet
- [ ] Copy your address
- [ ] Switch to Client
- [ ] Create job with your own address
- [ ] Switch to Freelancer
- [ ] See job appear
- [ ] Mark completed
- [ ] Switch to Client
- [ ] Approve job

### ✅ Two Wallet Test:
- [ ] Create second wallet in Freighter
- [ ] Fund second wallet with testnet XLM
- [ ] Connect Wallet A (Client)
- [ ] Create job with Wallet B address
- [ ] Disconnect Wallet A
- [ ] Connect Wallet B (Freelancer)
- [ ] See job appear
- [ ] Mark completed
- [ ] Switch back to Wallet A
- [ ] Approve job

## Common Issues

### "I don't see the job in Freelancer dashboard"

**Check:**
1. ✅ Did you use the correct freelancer address?
2. ✅ Are you connected with the freelancer wallet?
3. ✅ Did you switch to "Freelancer" role?
4. ✅ Is the job created? (Check Client dashboard)

**Debug:**
- Open browser console (F12)
- Look for: "JobList - Total jobs: X"
- Check if your wallet address matches

### "Job appears in Client but not Freelancer"

**Reason:** You're probably still connected with the client wallet.

**Solution:**
- If using same wallet: Just switch to Freelancer role
- If using two wallets: Disconnect and connect the freelancer wallet

### "I created a job but it disappeared"

**Check:**
- Browser console for errors
- LocalStorage: `localStorage.getItem('jobs')`
- Make sure you didn't clear browser data

## Pro Tips

### 💡 Tip 1: Use Your Own Address for Quick Tests
```
Client creates job → Use your own address as freelancer
Switch to Freelancer role → See the job immediately
No need to switch wallets!
```

### 💡 Tip 2: Create Multiple Test Accounts
```
In Freighter:
- Account 1: "Client Test"
- Account 2: "Freelancer Test"
- Account 3: "Arbitrator Test"
```

### 💡 Tip 3: Keep Addresses Handy
```
Save your test addresses in a text file:
Client: GXXXXX...
Freelancer: GYYYY...
Arbitrator: GZZZZ...
```

### 💡 Tip 4: Use Browser Profiles
```
Chrome Profile 1: Client wallet
Chrome Profile 2: Freelancer wallet
No need to disconnect/reconnect!
```

## Visual Flow

### Single Wallet:
```
You (Wallet A)
    ↓
[Client Role] → Create Job → Freelancer: Wallet A
    ↓
[Freelancer Role] → See Job → Mark Complete
    ↓
[Client Role] → Approve → Done!
```

### Two Wallets:
```
Wallet A (Client)
    ↓
Create Job → Freelancer: Wallet B
    ↓
Disconnect Wallet A
    ↓
Connect Wallet B (Freelancer)
    ↓
See Job → Mark Complete
    ↓
Disconnect Wallet B
    ↓
Connect Wallet A (Client)
    ↓
Approve → Done!
```

## Example Addresses

### Your Wallet:
```
GABC123...XYZ789 (56 characters)
```

### When Creating Job:
```
Freelancer Address: GABC123...XYZ789 (same as yours)
```

### Result:
```
✅ Job appears in both Client and Freelancer dashboards
✅ You can test the full workflow
✅ No need for second wallet
```

## Testing Scenarios

### Scenario 1: Happy Path
1. Create job
2. Mark completed
3. Approve
4. ✅ Success!

### Scenario 2: Dispute
1. Create job
2. Mark completed
3. Raise dispute (instead of approve)
4. Go to Disputes tab
5. Vote as arbitrator

### Scenario 3: Multiple Jobs
1. Create 3 jobs
2. Switch to Freelancer
3. See all 3 jobs
4. Complete them one by one

## Need Help?

### Check Console Logs:
```javascript
// In browser console (F12)
JSON.parse(localStorage.getItem('jobs'))
```

### Check Your Address:
```javascript
// In browser console
localStorage.getItem('walletPublicKey')
```

### Clear Everything:
```javascript
// In browser console
localStorage.clear()
// Then refresh page
```

## Summary

**Easiest Way:**
1. Connect wallet
2. Copy your address
3. Create job with your own address as freelancer
4. Switch to Freelancer role
5. See the job! 🎉

**That's it!** No need for multiple wallets for basic testing.
