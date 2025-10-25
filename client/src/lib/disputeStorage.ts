import { Dispute, Vote } from './dao';
import { supabase, isSupabaseConfigured } from './supabase';
import { getAllJobs, updateJob } from './storage';
import { JobStatus } from './stellar';

const STORAGE_KEY = 'disputes';
const PENDING_RELEASES_KEY = 'pending_releases';

// Store pending fund release for client to execute later
function storePendingRelease(jobId: string, winner: 'client' | 'freelancer', recipient: string, amount: string): void {
    const pending = {
        jobId,
        winner,
        recipient,
        amount,
        timestamp: Date.now(),
    };

    const existing = JSON.parse(localStorage.getItem(PENDING_RELEASES_KEY) || '[]');
    existing.push(pending);
    localStorage.setItem(PENDING_RELEASES_KEY, JSON.stringify(existing));

    console.log('📝 Stored pending release for job:', jobId);
}

// Get all pending releases
export function getPendingReleases(): any[] {
    try {
        return JSON.parse(localStorage.getItem(PENDING_RELEASES_KEY) || '[]');
    } catch {
        return [];
    }
}

// Remove pending release
export function removePendingRelease(jobId: string): void {
    const existing = getPendingReleases();
    const filtered = existing.filter((p: any) => p.jobId !== jobId);
    localStorage.setItem(PENDING_RELEASES_KEY, JSON.stringify(filtered));
}

// Helper function to release funds to winner
async function releaseFundsToWinner(jobId: string, winner: 'client' | 'freelancer'): Promise<void> {
    try {
        console.log('💰 === STARTING FUND RELEASE ===');
        console.log('Job ID:', jobId);
        console.log('Winner:', winner);

        // Get the job
        const jobs = await getAllJobs();
        console.log('Total jobs found:', jobs.length);

        const job = jobs.find(j => j.id === jobId);

        if (!job) {
            console.error('❌ Job not found:', jobId);
            console.log('Available job IDs:', jobs.map(j => j.id));
            return;
        }

        console.log('✅ Job found:', job);

        // Determine recipient
        const recipient = winner === 'client' ? job.client : job.freelancer;

        console.log('Recipient address:', recipient);
        console.log('Job escrow account:', job.escrowAccount);
        console.log('Job amount:', job.amount);

        // Release funds from escrow if escrow account exists
        if (job.escrowAccount) {
            console.log('🔑 Attempting to retrieve escrow key...');
            console.log('Supabase configured:', isSupabaseConfigured());

            // Try to get escrow secret from Supabase first (for cross-browser support)
            let escrowSecret = null;

            if (isSupabaseConfigured() && supabase) {
                console.log('📡 Trying Supabase for escrow key...');
                try {
                    const { data, error } = await supabase
                        .from('escrow_keys')
                        .select('escrow_secret')
                        .eq('job_id', jobId);

                    console.log('Supabase response:', { data, error });

                    if (data && Array.isArray(data) && data.length > 0 && data[0].escrow_secret) {
                        escrowSecret = data[0].escrow_secret;
                        console.log('✅ Escrow key retrieved from Supabase');
                    } else {
                        console.log('⚠️ No escrow key found in Supabase');
                    }
                } catch (error) {
                    console.log('❌ Error fetching escrow key from Supabase:', error);
                }
            } else {
                console.log('⚠️ Supabase not configured, skipping...');
            }

            // Fallback to localStorage if not found in Supabase
            if (!escrowSecret) {
                console.log('🔍 Trying localStorage for escrow key...');
                escrowSecret = localStorage.getItem(`escrow_${jobId}`);
                if (escrowSecret) {
                    console.log('✅ Escrow key retrieved from localStorage');
                } else {
                    console.log('❌ No escrow key found in localStorage');
                }
            }

            console.log('Final escrow secret status:', !!escrowSecret);

            if (escrowSecret) {
                try {
                    const { releaseEscrowFunds } = await import('./escrow');
                    const txHash = await releaseEscrowFunds(
                        job.escrowAccount,
                        escrowSecret,
                        recipient
                    );
                    console.log('✅ Funds released! Transaction:', txHash);
                    // Silent success - just log
                } catch (error: any) {
                    console.error('Error releasing funds:', error);
                    // Silent failure - just log the error
                }
            } else {
                console.log('⚠️ Escrow secret not found - dispute resolved but funds not released');
                // Dispute is marked as resolved, funds remain in escrow
            }
        }

        // Update job status to RESOLVED
        await updateJob(jobId, { status: JobStatus.RESOLVED });

    } catch (error) {
        console.error('Error in releaseFundsToWinner:', error);
    }
}

// Transform camelCase to snake_case for Supabase
function toSnakeCase(dispute: Dispute) {
    return {
        id: dispute.id,
        job_id: dispute.jobId,
        job_description: dispute.jobDescription,
        job_amount: dispute.jobAmount,
        client: dispute.client,
        freelancer: dispute.freelancer,
        client_evidence: dispute.clientEvidence,
        freelancer_evidence: dispute.freelancerEvidence,
        votes: dispute.votes,
        status: dispute.status,
        winner: dispute.winner || null,
        created_at: new Date(dispute.createdAt).toISOString(),
        resolved_at: dispute.resolvedAt ? new Date(dispute.resolvedAt).toISOString() : null,
    };
}

// Transform snake_case to camelCase from Supabase
function toCamelCase(data: any): Dispute {
    return {
        id: data.id,
        jobId: data.job_id,
        jobDescription: data.job_description,
        jobAmount: data.job_amount,
        client: data.client,
        freelancer: data.freelancer,
        clientEvidence: data.client_evidence,
        freelancerEvidence: data.freelancer_evidence,
        votes: data.votes || [],
        status: data.status,
        winner: data.winner,
        createdAt: new Date(data.created_at).getTime(),
        resolvedAt: data.resolved_at ? new Date(data.resolved_at).getTime() : undefined,
    };
}

// Save dispute to Supabase or localStorage
export async function saveDispute(dispute: Omit<Dispute, 'id' | 'votes' | 'status' | 'createdAt'>): Promise<void> {
    const newDispute: Dispute = {
        ...dispute,
        id: `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        votes: [],
        status: 'ACTIVE',
        createdAt: Date.now(),
    };

    if (isSupabaseConfigured() && supabase) {
        const dbDispute = toSnakeCase(newDispute);
        const { error } = await supabase.from('disputes').insert(dbDispute);
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
    } else {
        const disputes = await getAllDisputes();
        disputes.push(newDispute);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(disputes));
    }
}

// Get all disputes from Supabase or localStorage
export async function getAllDisputes(): Promise<Dispute[]> {
    if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
            .from('disputes')
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

// Add vote to dispute
export async function addVoteToDispute(disputeId: string, vote: Vote): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
        // Get current dispute
        const { data, error: fetchError } = await supabase
            .from('disputes')
            .select('*')
            .eq('id', disputeId);

        if (fetchError || !data || data.length === 0) {
            console.error('Error fetching dispute:', fetchError);
            throw fetchError || new Error('Dispute not found');
        }

        const currentDispute = data[0];

        const newVotes = [...(currentDispute.votes || []), vote];

        // Check if dispute should be resolved (3 votes)
        let updateData: any = { votes: newVotes };

        if (newVotes.length >= 3) {
            console.log('🎯 3 votes reached! Resolving dispute...');
            const clientVotes = newVotes.filter((v: Vote) => v.decision === 'client').length;
            const freelancerVotes = newVotes.filter((v: Vote) => v.decision === 'freelancer').length;
            const winner = clientVotes > freelancerVotes ? 'client' : 'freelancer';

            console.log(`📊 Vote results: Client=${clientVotes}, Freelancer=${freelancerVotes}, Winner=${winner}`);

            updateData = {
                ...updateData,
                status: 'RESOLVED',
                winner,
                resolved_at: new Date().toISOString(),
            };

            // Release funds to winner
            console.log('💰 Calling releaseFundsToWinner...');
            await releaseFundsToWinner(currentDispute.job_id, winner);
            console.log('✅ releaseFundsToWinner completed');
        }

        const { error: updateError } = await supabase
            .from('disputes')
            .update(updateData)
            .eq('id', disputeId);

        if (updateError) {
            console.error('Error updating dispute:', updateError);
            throw updateError;
        }
    } else {
        const disputes = await getAllDisputes();
        const updated = disputes.map((dispute) => {
            if (dispute.id === disputeId) {
                const newVotes = [...dispute.votes, vote];

                // Check if dispute should be resolved (3 votes)
                if (newVotes.length >= 3) {
                    const clientVotes = newVotes.filter((v) => v.decision === 'client').length;
                    const freelancerVotes = newVotes.filter((v) => v.decision === 'freelancer').length;
                    const winner = clientVotes > freelancerVotes ? 'client' : 'freelancer';

                    // Release funds to winner
                    releaseFundsToWinner(dispute.jobId, winner);

                    return {
                        ...dispute,
                        votes: newVotes,
                        status: 'RESOLVED' as const,
                        winner,
                        resolvedAt: Date.now(),
                    };
                }

                return { ...dispute, votes: newVotes };
            }
            return dispute;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
}

// Resolve dispute
export async function resolveDispute(disputeId: string, winner: 'client' | 'freelancer'): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
            .from('disputes')
            .update({
                status: 'RESOLVED',
                winner,
                resolved_at: new Date().toISOString(),
            })
            .eq('id', disputeId);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
    } else {
        const disputes = await getAllDisputes();
        const updated = disputes.map((dispute) =>
            dispute.id === disputeId
                ? { ...dispute, status: 'RESOLVED' as const, winner, resolvedAt: Date.now() }
                : dispute
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
}

export function clearAllDisputes(): void {
    localStorage.removeItem(STORAGE_KEY);
}
