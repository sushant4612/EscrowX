# 🗄️ Supabase Disputes Setup

## ✅ What Changed

Disputes are now stored in **Supabase** instead of localStorage!

### Benefits:
- ✅ **Cross-browser sync** - All browsers see the same disputes
- ✅ **Real-time updates** - Changes appear instantly
- ✅ **Persistent storage** - Disputes don't disappear
- ✅ **Multi-user support** - True decentralized platform

---

## 🚀 Setup Instructions

### Step 1: Run the Migration

**Option A: Using Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Copy and paste the contents of `supabase/migrations/003_create_disputes_table.sql`
5. Click "Run"

**Option B: Using Supabase CLI**
```bash
supabase db push
```

### Step 2: Verify Table Created

1. Go to Supabase Dashboard → Table Editor
2. You should see a new table called `disputes`
3. Columns:
   - id (UUID)
   - job_id (TEXT)
   - job_description (TEXT)
   - job_amount (TEXT)
   - client (TEXT)
   - freelancer (TEXT)
   - client_evidence (TEXT)
   - freelancer_evidence (TEXT)
   - votes (JSONB)
   - status (TEXT)
   - winner (TEXT)
   - created_at (TIMESTAMP)
   - resolved_at (TIMESTAMP)

### Step 3: Test It!

1. **Browser 1 (Client):**
   - Create job
   - Reject work → Create dispute
   - Dispute saved to Supabase ✅

2. **Browser 2 (Freelancer):**
   - Refresh page
   - Dispute automatically loads ✅
   - Can see dispute in Freelancer dashboard

3. **Browser 3 (Arbitrator):**
   - Connect different wallet
   - Go to Arbitrator DAO
   - Dispute is visible! ✅
   - Can vote on it!

---

## 🔄 How It Works

### Creating a Dispute:
```typescript
// Old (localStorage):
localStorage.setItem('disputes', JSON.stringify(disputes));

// New (Supabase):
await supabase.from('disputes').insert({
    job_id: dispute.jobId,
    client: dispute.client,
    freelancer: dispute.freelancer,
    // ... other fields
});
```

### Loading Disputes:
```typescript
// Old (localStorage):
const disputes = JSON.parse(localStorage.getItem('disputes') || '[]');

// New (Supabase):
const { data } = await supabase
    .from('disputes')
    .select('*')
    .order('created_at', { ascending: false });
```

### Real-time Updates:
```typescript
// Automatically syncs across all browsers!
supabase
    .channel('disputes_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'disputes' }, () => {
        loadDisputes(); // Refresh when changes occur
    })
    .subscribe();
```

---

## 🧪 Testing

### Test 1: Cross-Browser Sync

**Browser 1 (Chrome):**
```
1. Connect Wallet A
2. Create job for Wallet B
3. Reject work → Create dispute
4. Check Supabase Dashboard → Dispute appears in table
```

**Browser 2 (Firefox):**
```
1. Connect Wallet C (Arbitrator)
2. Go to Arbitrator DAO
3. Dispute is visible! ✅
4. No need to copy localStorage!
```

### Test 2: Real-time Updates

**Browser 1:**
```
1. Create dispute
```

**Browser 2 (already open):**
```
1. Dispute appears automatically! ✅
2. No page refresh needed!
```

### Test 3: Voting

**Browser 1 (Arbitrator 1):**
```
1. Vote for Client
2. Vote saved to Supabase
```

**Browser 2 (Arbitrator 2):**
```
1. See vote count updated: 1/3
2. Vote for Freelancer
3. Vote count: 2/3
```

**Browser 3 (Arbitrator 3):**
```
1. See vote count: 2/3
2. Vote for Freelancer
3. Dispute auto-resolves! ✅
4. All browsers see "RESOLVED" status
```

---

## 📊 Database Schema

```sql
CREATE TABLE disputes (
    id UUID PRIMARY KEY,
    job_id TEXT NOT NULL,
    job_description TEXT NOT NULL,
    job_amount TEXT NOT NULL,
    client TEXT NOT NULL,
    freelancer TEXT NOT NULL,
    client_evidence TEXT,
    freelancer_evidence TEXT,
    votes JSONB DEFAULT '[]',
    status TEXT DEFAULT 'ACTIVE',
    winner TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);
```

### Votes Structure (JSONB):
```json
[
    {
        "arbitratorAddress": "GXXX...",
        "decision": "client",
        "stake": "10",
        "timestamp": 1234567890,
        "txHash": "abc123..."
    }
]
```

---

## 🔍 Verification

### Check Supabase Dashboard:

1. Go to Table Editor → disputes
2. You should see your disputes
3. Click on a row to see details
4. Check the `votes` column (JSONB array)

### Check in Browser Console:

```javascript
// This will now fetch from Supabase, not localStorage!
// The DisputeContext handles it automatically
```

---

## 🐛 Troubleshooting

### Issue: "relation disputes does not exist"
**Solution:** Run the migration (Step 1 above)

### Issue: Disputes not appearing
**Check:**
1. Supabase connection in `.env.local`
2. Table created in Supabase Dashboard
3. Browser console for errors

### Issue: Real-time not working
**Check:**
1. Supabase Realtime is enabled (Project Settings → API)
2. No console errors
3. Try refreshing the page

---

## 🎯 Benefits Over localStorage

| Feature | localStorage | Supabase |
|---------|-------------|----------|
| Cross-browser | ❌ No | ✅ Yes |
| Real-time sync | ❌ No | ✅ Yes |
| Persistent | ⚠️ Can be cleared | ✅ Always persists |
| Multi-user | ❌ No | ✅ Yes |
| Scalable | ❌ Limited | ✅ Unlimited |
| Production-ready | ❌ No | ✅ Yes |

---

## 🚀 Next Steps

After setting up:

1. ✅ Run the migration
2. ✅ Test with 3 different browsers
3. ✅ Verify disputes sync across browsers
4. ✅ Test voting and resolution
5. ✅ Check Supabase Dashboard to see data

**Now your DAO platform is truly decentralized and production-ready!** 🎉
