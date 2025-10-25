import { Job } from './stellar';

/**
 * Simple API simulation using a public backend
 * In production, replace this with your actual backend API
 */

const API_BASE = 'https://api.jsonbin.io/v3/b'; // Free JSON storage service
const BIN_ID = '6789abcd1234567890'; // You'll need to create your own bin

// For demo purposes, we'll use localStorage with a special key that simulates sharing
const SHARED_JOBS_KEY = 'stellar_escrow_shared_jobs';

/**
 * Save job to shared storage
 * In production, this would POST to your backend
 */
export async function saveJobToBackend(job: Job): Promise<void> {
    try {
        console.log('Saving job to shared storage:', job);

        // Get existing jobs
        const jobs = await getAllJobsFromBackend();

        // Add new job
        jobs.push(job);

        // Save back
        localStorage.setItem(SHARED_JOBS_KEY, JSON.stringify(jobs));

        console.log('Job saved successfully');

        // In production, you would do:
        // await fetch(`${API_BASE}/${BIN_ID}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(jobs)
        // });
    } catch (error) {
        console.error('Error saving job:', error);
        throw error;
    }
}

/**
 * Get all jobs from shared storage
 */
export async function getAllJobsFromBackend(): Promise<Job[]> {
    try {
        const stored = localStorage.getItem(SHARED_JOBS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return [];

        // In production:
        // const response = await fetch(`${API_BASE}/${BIN_ID}/latest`);
        // const data = await response.json();
        // return data.record || [];
    } catch (error) {
        console.error('Error loading jobs:', error);
        return [];
    }
}

/**
 * Update job status in shared storage
 */
export async function updateJobInBackend(jobId: string, updates: Partial<Job>): Promise<void> {
    try {
        console.log('Updating job in shared storage:', jobId, updates);

        const jobs = await getAllJobsFromBackend();
        const updatedJobs = jobs.map((job) =>
            job.id === jobId ? { ...job, ...updates } : job
        );

        localStorage.setItem(SHARED_JOBS_KEY, JSON.stringify(updatedJobs));

        console.log('Job updated successfully');
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
}

/**
 * Get jobs for a specific user (client or freelancer)
 */
export async function getJobsForUser(publicKey: string): Promise<Job[]> {
    try {
        const allJobs = await getAllJobsFromBackend();
        return allJobs.filter(
            (job) => job.client === publicKey || job.freelancer === publicKey
        );
    } catch (error) {
        console.error('Error getting user jobs:', error);
        return [];
    }
}

/**
 * Setup instructions for production backend
 */
export const BACKEND_SETUP_INSTRUCTIONS = `
To enable real multi-user support, you need a backend API.

Option 1: Use JSONBin.io (Free, Quick Setup)
1. Go to https://jsonbin.io/
2. Create a free account
3. Create a new bin
4. Copy the bin ID
5. Update API_BASE and BIN_ID in src/lib/api.ts
6. Get your API key
7. Add it to the fetch headers

Option 2: Build Your Own Backend
1. Create a Node.js/Express server
2. Add endpoints:
   - POST /jobs - Create job
   - GET /jobs - Get all jobs
   - GET /jobs/:id - Get specific job
   - PUT /jobs/:id - Update job
   - GET /jobs/user/:publicKey - Get user's jobs
3. Use MongoDB/PostgreSQL for storage
4. Deploy to Vercel/Heroku/Railway
5. Update API_BASE in this file

Option 3: Use Supabase (Recommended)
1. Go to https://supabase.com/
2. Create a new project
3. Create a 'jobs' table
4. Use Supabase client library
5. Real-time updates included!

For now, the app uses localStorage with a shared key to simulate
multi-user functionality within the same browser.
`;
