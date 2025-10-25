# Quick Supabase Setup (10 minutes)

## Why You Need This

localStorage is browser-specific. To see jobs across different wallets/computers, you need a backend database.

## Setup Steps

### 1. Create Supabase Account (2 min)
1. Go to https://supabase.com/
2. Click "Start your project"
3. Sign up with GitHub (easiest)

### 2. Create Project (1 min)
1. Click "New Project"
2. Name: `stellar-escrow`
3. Database Password: (save this!)
4. Region: Choose closest to you
5. Click "Create new project"
6. Wait 2 minutes for setup

### 3. Create Table (2 min)
1. Click "Table Editor" in sidebar
2. Click "Create a new table"
3. Name: `jobs`
4. Disable RLS (for now)
5. Add columns:

```
id          | text    | Primary Key
client      | text    | Required
freelancer  | text    | Required
amount      | text    | Required
description | text    | Required
status      | text    | Required
created_at  | int8    | Required
escrow_account | text | Optional
```

6. Click "Save"

### 4. Get API Keys (1 min)
1. Click "Settings" (gear icon)
2. Click "API"
3. Copy:
   - Project URL
   - anon/public key

### 5. Install Supabase (1 min)
```bash
npm install @supabase/supabase-js
```

### 6. Update Code (3 min)

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Update `src/lib/storage.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
import { Job } from './stellar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveJob(job: Job): Promise<void> {
  const { error } = await supabase.from('jobs').insert(job);
  if (error) throw error;
}

export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase.from('jobs').select('*');
  if (error) throw error;
  return data || [];
}

export async function updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId);
  if (error) throw error;
}
```

Update `src/contexts/JobContext.tsx` - make functions async:
```typescript
const addJob = async (job: Job) => {
  await saveJob(job);
  await loadJobs();
};
```

### 7. Test
1. Computer A: Create job with Wallet B address
2. Computer B: Connect Wallet B
3. Job appears! ✅

## Done!

Now jobs work across different computers and wallets!
