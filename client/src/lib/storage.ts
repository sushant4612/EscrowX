import { Job } from './stellar';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'stellar_escrow_jobs';

// Transform camelCase to snake_case for Supabase
function toSnakeCase(job: Job) {
    return {
        id: job.id,
        client: job.client,
        freelancer: job.freelancer,
        amount: job.amount,
        description: job.description,
        status: job.status,
        created_at: job.createdAt,
        escrow_account: job.escrowAccount || null,
    };
}

// Transform snake_case to camelCase from Supabase
function toCamelCase(data: any): Job {
    return {
        id: data.id,
        client: data.client,
        freelancer: data.freelancer,
        amount: data.amount,
        description: data.description,
        status: data.status,
        createdAt: data.created_at,
        escrowAccount: data.escrow_account,
    };
}

// Save job to Supabase or localStorage
export async function saveJob(job: Job): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
        const dbJob = toSnakeCase(job);
        const { error } = await supabase.from('jobs').insert(dbJob);
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
    } else {
        const jobs = await getAllJobs();
        jobs.push(job);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }
}

// Get all jobs from Supabase or localStorage
export async function getAllJobs(): Promise<Job[]> {
    if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return [];
        }
        return data ? data.map(toCamelCase) : [];
    } else {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }
}

// Update job in Supabase or localStorage
export async function updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
        const dbUpdates: any = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.createdAt) dbUpdates.created_at = updates.createdAt;
        if (updates.escrowAccount) dbUpdates.escrow_account = updates.escrowAccount;

        const { error } = await supabase
            .from('jobs')
            .update(dbUpdates)
            .eq('id', jobId);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
    } else {
        const jobs = await getAllJobs();
        const updated = jobs.map((job) =>
            job.id === jobId ? { ...job, ...updates } : job
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
}

export function clearAllJobs(): void {
    localStorage.removeItem(STORAGE_KEY);
}
