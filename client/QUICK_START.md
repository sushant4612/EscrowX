# Quick Start - See Jobs in Freelancer Dashboard

## 🚀 Fastest Way (30 seconds)

### Step 1: Connect Wallet
```
Click "Connect Wallet" → Approve in Freighter
```

### Step 2: Switch to Client
```
Click "Client" button in role selector
```

### Step 3: Create Job with Your Own Address
```
1. Click "+ Create New Job"
2. Click "Use My Address as Freelancer" button
3. Enter Amount: 100
4. Enter Description: "Test job"
5. Click "Create Job & Lock Funds"
```

### Step 4: Switch to Freelancer
```
Click "Freelancer" button in role selector
```

### Step 5: See Your Job! 🎉
```
The job appears in "Active Jobs" section!
```

## 📋 Complete Workflow Test

### 1. Create Job (as Client)
- Role: **Client**
- Action: Create job with your address
- Result: Job appears in Client dashboard

### 2. View Job (as Freelancer)
- Role: **Freelancer** ← Switch here
- Action: View the job
- Result: Job appears in "Active Jobs"

### 3. Complete Job (as Freelancer)
- Role: **Freelancer**
- Action: Click "Mark Completed"
- Result: Job moves to "Awaiting Client Approval"

### 4. Approve Job (as Client)
- Role: **Client** ← Switch back
- Action: Click "Approve & Release Funds"
- Result: Job moves to "Completed Jobs"

## 🎯 Visual Flow

```
┌─────────────────────────────────────────┐
│  1. Connect Wallet                      │
│     Your Address: GABC...XYZ            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. Switch to CLIENT Role               │
│     [Client] [Freelancer]               │
│      ^^^^                               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. Create Job                          │
│     Freelancer: GABC...XYZ (your own!)  │
│     Amount: 100 XLM                     │
│     Description: Test job               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  4. Switch to FREELANCER Role           │
│     [Client] [Freelancer]               │
│               ^^^^                      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  5. ✅ JOB APPEARS!                     │
│     Active Jobs (1)                     │
│     ┌─────────────────────────────┐    │
│     │ Job #12345                  │    │
│     │ Test job                    │    │
│     │ 100 XLM                     │    │
│     │ [Mark Completed]            │    │
│     └─────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## 💡 Key Points

### ✅ DO:
- Use your own address as freelancer for testing
- Switch roles to see different views
- Click "Use My Address as Freelancer" button for quick setup

### ❌ DON'T:
- Don't use a random address (you won't see it)
- Don't forget to switch to Freelancer role
- Don't disconnect wallet between steps

## 🔍 Troubleshooting

### "I don't see the job"

**Check these:**
1. Did you switch to Freelancer role?
   - Look at role selector: Should say "Freelancer"
   
2. Did you use the correct address?
   - Freelancer address should match your wallet
   
3. Is the job created?
   - Switch back to Client role
   - Check if job appears there

### "Button doesn't work"

**Try:**
1. Refresh the page
2. Reconnect wallet
3. Check browser console (F12) for errors

## 🎓 Understanding Roles

### Client Role (Blue)
- **Purpose**: Create and manage jobs
- **You see**: Jobs you created
- **Actions**: Create, Approve, Dispute

### Freelancer Role (Green)
- **Purpose**: Work on assigned jobs
- **You see**: Jobs assigned to you
- **Actions**: Mark Complete, Dispute

### Same Wallet, Different Views
```
Your Wallet: GABC...XYZ

As Client:
- See jobs where YOU are the client

As Freelancer:
- See jobs where YOU are the freelancer

If you create a job with your own address:
- ✅ Appears in BOTH views!
```

## 📱 Mobile Testing

Works the same on mobile:
1. Connect wallet
2. Switch to Client
3. Tap "Use My Address as Freelancer"
4. Create job
5. Switch to Freelancer
6. See job!

## ⚡ Speed Tips

### Fastest Test:
```
1. Connect → 2. Client → 3. Use My Address → 4. Create → 5. Freelancer → Done!
```

### Copy Address Manually:
```
1. Click your wallet address (green box)
2. It copies automatically
3. Paste in freelancer field
```

### Keyboard Flow:
```
1. Tab to navigate fields
2. Enter to submit
3. Click role selector to switch
```

## 🎯 Success Checklist

After following the steps, you should see:

- [ ] ✅ Job appears in Client dashboard
- [ ] ✅ Job appears in Freelancer dashboard (after switching)
- [ ] ✅ Can mark job as completed
- [ ] ✅ Can approve job (after switching back to Client)
- [ ] ✅ Statistics update correctly

## 🆘 Still Need Help?

### Check Console:
```javascript
// Open browser console (F12)
// Check these:
localStorage.getItem('jobs')
localStorage.getItem('walletPublicKey')
```

### Debug Info:
The Freelancer dashboard shows:
- Total jobs in system
- Your jobs count
- Your wallet address

If "Your jobs: 0" but "Total jobs: 1", the addresses don't match!

## 🎉 You're Ready!

Now you know how to:
- ✅ Create jobs
- ✅ View them in both roles
- ✅ Test the full workflow
- ✅ Switch between perspectives

**Happy testing!** 🚀
