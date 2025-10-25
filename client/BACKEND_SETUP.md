# Backend Setup for True Multi-User Support

## Current Limitation

The app currently uses **localStorage** which is browser-specific. Jobs are only shared within the same browser/computer.

**To enable true multi-user support across different computers/devices, you need a backend.**

## Quick Solutions (Ranked by Ease)

### 1. Supabase (Easiest - Recommended for Hackathon)

**Time: 10 minutes**

```bash
# Install Supabase
npm install @supabase/supabase-js
```

**Setup:**
1. Go to https://supabase.com/
2. Create free account
3. Create new project
4. Create `jobs` table:
   ```sql
   CREATE TABLE jobs (
     id TEXT PRIMARY KEY,
     client TEXT NOT NULL,
     freelancer TEXT NOT NULL,
     amount TEXT NOT NULL,
     description TEXT NOT NULL,
     status TEXT NOT NULL,
     created_at BIGINT NOT NULL,
     escrow_account TEXT
   );
   ```
5. Get API keys from Settings → API
6. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

**Update `src/lib/api.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveJobToBackend(job: Job): Promise<void> {
  const { error } = await supabase.from('jobs').insert(job);
  if (error) throw error;
}

export async function getAllJobsFromBackend(): Promise<Job[]> {
  const { data, error } = await supabase.from('jobs').select('*');
  if (error) throw error;
  return data || [];
}

export async function updateJobInBackend(jobId: string, updates: Partial<Job>): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId);
  if (error) throw error;
}
```

**Benefits:**
- ✅ Real-time updates
- ✅ Free tier (50,000 rows)
- ✅ No server management
- ✅ Built-in auth (if needed)

---

### 2. JSONBin.io (Simplest - No Code)

**Time: 5 minutes**

1. Go to https://jsonbin.io/
2. Create free account
3. Create new bin
4. Copy bin ID
5. Get API key

**Update `src/lib/api.ts`:**
```typescript
const API_KEY = 'your_api_key';
const BIN_ID = 'your_bin_id';

export async function saveJobToBackend(job: Job): Promise<void> {
  const jobs = await getAllJobsFromBackend();
  jobs.push(job);
  
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
    },
    body: JSON.stringify(jobs),
  });
}

export async function getAllJobsFromBackend(): Promise<Job[]> {
  const response = await fetch(
    `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
    {
      headers: { 'X-Master-Key': API_KEY },
    }
  );
  const data = await response.json();
  return data.record || [];
}
```

**Benefits:**
- ✅ No backend code
- ✅ Free tier
- ✅ Quick setup

**Limitations:**
- ❌ No real-time updates
- ❌ Limited requests

---

### 3. Firebase (Google)

**Time: 15 minutes**

```bash
npm install firebase
```

1. Go to https://firebase.google.com/
2. Create project
3. Enable Firestore
4. Get config

**Update `src/lib/api.ts`:**
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your_api_key",
  projectId: "your_project_id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveJobToBackend(job: Job): Promise<void> {
  await addDoc(collection(db, 'jobs'), job);
}

export async function getAllJobsFromBackend(): Promise<Job[]> {
  const snapshot = await getDocs(collection(db, 'jobs'));
  return snapshot.docs.map(doc => doc.data() as Job);
}
```

---

### 4. Custom Backend (Most Control)

**Time: 30-60 minutes**

#### Option A: Express + MongoDB

**Backend (`server.js`):**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/stellar-escrow');

const JobSchema = new mongoose.Schema({
  id: String,
  client: String,
  freelancer: String,
  amount: String,
  description: String,
  status: String,
  createdAt: Number,
  escrowAccount: String,
});

const Job = mongoose.model('Job', JobSchema);

app.post('/api/jobs', async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.json(job);
});

app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

app.put('/api/jobs/:id', async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );
  res.json(job);
});

app.listen(3001, () => console.log('Server running on port 3001'));
```

**Frontend (`src/lib/api.ts`):**
```typescript
const API_BASE = 'http://localhost:3001/api';

export async function saveJobToBackend(job: Job): Promise<void> {
  await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
}

export async function getAllJobsFromBackend(): Promise<Job[]> {
  const response = await fetch(`${API_BASE}/jobs`);
  return response.json();
}
```

**Deploy:**
```bash
# Railway
railway init
railway up

# Or Heroku
heroku create
git push heroku main
```

---

## Comparison

| Solution | Setup Time | Cost | Real-time | Scalability |
|----------|-----------|------|-----------|-------------|
| Supabase | 10 min | Free | ✅ Yes | High |
| JSONBin | 5 min | Free | ❌ No | Low |
| Firebase | 15 min | Free | ✅ Yes | High |
| Custom | 60 min | Varies | Optional | Full control |

## Recommendation

### For Hackathon/Demo:
**Use Supabase** - Quick setup, real-time updates, looks professional

### For Production:
**Custom Backend** - Full control, better security, scalable

### For Quick Test:
**JSONBin** - Simplest, no code changes needed

## Testing Multi-User with Backend

Once backend is set up:

**Computer 1 (Client):**
```
1. Open app
2. Connect Wallet A
3. Create job with Wallet B address
4. Job saved to backend
```

**Computer 2 (Freelancer):**
```
1. Open app (different computer!)
2. Connect Wallet B
3. Job appears automatically! 🎉
```

## Current Workaround (No Backend)

For demo purposes without backend:

**Use same computer, different browsers:**
```
Chrome: Client wallet
Firefox: Freelancer wallet
Both access same localStorage
```

**Or use browser profiles:**
```
Chrome Profile 1: Client
Chrome Profile 2: Freelancer
```

## Security Considerations

### With Backend:
- ✅ Validate all inputs
- ✅ Use HTTPS
- ✅ Implement rate limiting
- ✅ Add authentication
- ✅ Sanitize data

### Current (localStorage):
- ⚠️ Anyone can modify data
- ⚠️ No authentication
- ⚠️ Browser-specific
- ✅ Good for demo/testing

## Next Steps

1. **Choose a solution** (Supabase recommended)
2. **Follow setup guide** above
3. **Update `src/lib/api.ts`**
4. **Test with two devices**
5. **Deploy!**

## Support

Need help setting up?
- Supabase: https://supabase.com/docs
- Firebase: https://firebase.google.com/docs
- JSONBin: https://jsonbin.io/docs

---

**For hackathon: Supabase is your best bet - 10 minutes to full multi-user support!** 🚀
