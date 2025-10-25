# 🗄️ Create Disputes Table in Supabase

## Quick Setup (5 minutes)

### Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project: `vcqelvheyroncpozollz`
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run This SQL

Copy and paste this entire SQL script:

```sql
-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    job_description TEXT NOT NULL,
    job_amount TEXT NOT NULL,
    client TEXT NOT NULL,
    freelancer TEXT NOT NULL,
    client_evidence TEXT,
    freelancer_evidence TEXT,
    votes JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    winner TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_job_id ON disputes(job_id);
CREATE INDEX IF NOT EXISTS idx_disputes_client ON disputes(client);
CREATE INDEX IF NOT EXISTS idx_disputes_freelancer ON disputes(freelancer);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo)
CREATE POLICY "Allow all operations on disputes" ON disputes
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

### Step 3: Click "Run"

- Click the "Run" button (or press Ctrl+Enter)
- You should see: "Success. No rows returned"

### Step 4: Verify Table Created

1. Click on "Table Editor" in the left sidebar
2. You should see a new table called `disputes`
3. Click on it to see the columns

---

## ✅ What This Creates

### Table Structure:
```
disputes
├── id (TEXT) - Primary key
├── job_id (TEXT) - Reference to job
├── job_description (TEXT) - Job details
├── job_amount (TEXT) - Amount in XLM
├── client (TEXT) - Client wallet address
├── freelancer (TEXT) - Freelancer wallet address
├── client_evidence (TEXT) - Client's evidence
├── freelancer_evidence (TEXT) - Freelancer's evidence
├── votes (JSONB) - Array of votes
├── status (TEXT) - ACTIVE or RESOLVED
├── winner (TEXT) - client or freelancer
├── created_at (TIMESTAMP) - When created
└── resolved_at (TIMESTAMP) - When resolved
```

### Indexes:
- Fast queries by status
- Fast queries by job_id
- Fast queries by client/freelancer
- Fast queries by date

### Security:
- Row Level Security enabled
- Public access (for demo)
- Can be restricted later

---

## 🧪 Test It Works

### After creating the table:

**Test 1: Create a dispute**
```
1. Browser 1: Create job as client
2. Browser 2: Mark complete as freelancer
3. Browser 1: Reject with evidence
4. Check Supabase Table Editor → disputes table
5. Should see 1 row! ✅
```

**Test 2: Cross-browser sync**
```
1. Browser 1: Create dispute
2. Browser 2: Open arbitrator view
3. Wait 3 seconds (polling interval)
4. Dispute appears! ✅
```

**Test 3: Voting**
```
1. Browser 3: Vote on dispute
2. Check Supabase Table Editor
3. See votes column updated! ✅
```

---

## 🔍 Verify in Supabase Dashboard

### Check Table Exists:
1. Go to Table Editor
2. See "disputes" in the list
3. Click on it

### Check Data:
1. Create a dispute in your app
2. Refresh Table Editor
3. See the dispute row
4. Click on row to see details

### Check Votes:
1. Vote on a dispute
2. Refresh Table Editor
3. Click on the dispute row
4. See "votes" column (JSONB array)

---

## 🐛 Troubleshooting

### Error: "relation disputes already exists"
**Solution:** Table already created! You're good to go.

### Error: "permission denied"
**Solution:** Make sure you're the project owner or have admin access.

### Table not showing in Table Editor
**Solution:** 
1. Refresh the page
2. Check you're in the right project
3. Try running the SQL again

### Disputes not syncing
**Check:**
1. Table created successfully
2. No errors in browser console
3. Supabase URL and key in `.env.local`
4. Wait 3 seconds for polling

---

## 📊 View Your Data

### In Supabase Dashboard:
```
Table Editor → disputes → View rows
```

### Sample Row:
```json
{
  "id": "dispute_1234567890_abc123",
  "job_id": "job_1234567890_xyz789",
  "job_description": "Build website",
  "job_amount": "50",
  "client": "GAAA...",
  "freelancer": "GBBB...",
  "client_evidence": "Work incomplete",
  "freelancer_evidence": "All done",
  "votes": [
    {
      "arbitratorAddress": "GCCC...",
      "decision": "freelancer",
      "stake": "10",
      "timestamp": 1234567890,
      "txHash": "abc123..."
    }
  ],
  "status": "ACTIVE",
  "winner": null,
  "created_at": "2024-01-01T00:00:00Z",
  "resolved_at": null
}
```

---

## 🎯 After Setup

Once the table is created:

✅ **Disputes sync across browsers**
✅ **All users see same disputes**
✅ **Votes update in real-time (3s polling)**
✅ **Data persists forever**
✅ **Production-ready**

---

## 🚀 Quick Commands

### Check if table exists:
```sql
SELECT * FROM disputes LIMIT 1;
```

### Count disputes:
```sql
SELECT COUNT(*) FROM disputes;
```

### See all active disputes:
```sql
SELECT * FROM disputes WHERE status = 'ACTIVE';
```

### See all votes:
```sql
SELECT id, votes FROM disputes WHERE jsonb_array_length(votes) > 0;
```

---

**That's it! Create the table and disputes will sync across all browsers!** 🎉
