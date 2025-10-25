'use client';

import { useWallet } from '@/contexts/WalletContext';
import { useJobs } from '@/contexts/JobContext';
import { Job, JobStatus } from '@/lib/stellar';

export default function QuickTestButton() {
    const { publicKey } = useWallet();
    const { addJob, refreshJobs } = useJobs();

    const createTestJob = async () => {
        if (!publicKey) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            console.log('🧪 Creating test job...');
            console.log('🧪 Your wallet:', publicKey);

            const job: Job = {
                id: `test-job-${Date.now()}`,
                client: publicKey,
                freelancer: publicKey, // Use same address for testing
                amount: '10',
                description: 'Test job created by quick test button',
                status: JobStatus.PENDING,
                createdAt: Date.now(),
            };

            console.log('🧪 Test job object:', job);

            await addJob(job);

            console.log('✅ Test job added!');

            // Check storage
            const stored = localStorage.getItem('stellar_escrow_shared_jobs');
            const jobs = stored ? JSON.parse(stored) : [];
            console.log('📦 Storage now has:', jobs.length, 'jobs');
            console.log('📦 All jobs:', jobs);

            await refreshJobs();

            alert(`✅ Test job created!\n\nJob ID: ${job.id}\nFreelancer: ${job.freelancer}\n\nSwitch to Freelancer role to see it!`);
        } catch (error: any) {
            console.error('❌ Error creating test job:', error);
            alert(`❌ Failed to create test job:\n\n${error.message}`);
        }
    };

    if (!publicKey) {
        return null;
    }

    return (
        <button
            onClick={createTestJob}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
        >
            🧪 Quick Test Job
        </button>
    );
}
