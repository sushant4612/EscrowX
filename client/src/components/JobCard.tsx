'use client';

import { Job, JobStatus } from '@/lib/stellar';
import { useWallet } from '@/contexts/WalletContext';
import { useJobs } from '@/contexts/JobContext';

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    const { publicKey } = useWallet();
    const { updateJobStatus } = useJobs();

    const isClient = publicKey === job.client;
    const isFreelancer = publicKey === job.freelancer;

    const getStatusColor = (status: JobStatus) => {
        switch (status) {
            case JobStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case JobStatus.COMPLETED:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case JobStatus.APPROVED:
                return 'bg-green-100 text-green-800 border-green-200';
            case JobStatus.DISPUTED:
                return 'bg-red-100 text-red-800 border-red-200';
            case JobStatus.RESOLVED:
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleMarkCompleted = () => {
        if (isFreelancer && job.status === JobStatus.PENDING) {
            updateJobStatus(job.id, JobStatus.COMPLETED);
        }
    };

    const handleApprove = async () => {
        if (isClient && job.status === JobStatus.COMPLETED) {
            console.log('🔍 Approve clicked - Job details:', {
                jobId: job.id,
                escrowAccount: job.escrowAccount,
                freelancer: job.freelancer,
                amount: job.amount
            });

            if (!confirm(`Release ${job.amount} XLM to freelancer?`)) {
                return;
            }

            try {
                if (!job.escrowAccount) {
                    alert('⚠️ No escrow account found for this job. The job may have been created before blockchain integration.');
                    updateJobStatus(job.id, JobStatus.APPROVED);
                    return;
                }

                const escrowSecret = localStorage.getItem(`escrow_${job.id}`);
                console.log('🔑 Escrow secret found:', !!escrowSecret);

                if (!escrowSecret) {
                    alert('⚠️ Escrow key not found in localStorage. Cannot release funds.\n\nThis might happen if:\n- Browser data was cleared\n- Job was created in a different browser\n- Job was created before blockchain integration');
                    return;
                }

                console.log('💰 Releasing funds from escrow...');
                const { releaseEscrowFunds } = await import('@/lib/escrow');
                const txHash = await releaseEscrowFunds(
                    job.escrowAccount,
                    escrowSecret,
                    job.freelancer
                );

                console.log('✅ Funds released! Transaction:', txHash);
                alert(`✅ ${job.amount} XLM released to freelancer!\n\nTransaction: ${txHash}\n\nView on Stellar Explorer:\nhttps://stellar.expert/explorer/testnet/tx/${txHash}`);

                updateJobStatus(job.id, JobStatus.APPROVED);
            } catch (error: any) {
                console.error('❌ Release error:', error);
                alert(`❌ Failed to release funds: ${error.message}\n\nCheck browser console for details.`);
            }
        }
    };

    const handleDispute = () => {
        if ((isClient || isFreelancer) && job.status !== JobStatus.DISPUTED) {
            updateJobStatus(job.id, JobStatus.DISPUTED);
            alert('Dispute raised. Waiting for arbitrator decision.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">Job #{job.id.slice(-8)}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                    {job.status}
                </span>
            </div>

            <p className="text-gray-700">{job.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Client</p>
                    <p className="font-mono text-xs">
                        {job.client.slice(0, 8)}...{job.client.slice(-8)}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Freelancer</p>
                    <p className="font-mono text-xs">
                        {job.freelancer.slice(0, 8)}...{job.freelancer.slice(-8)}
                    </p>
                </div>
            </div>

            <div className="pt-2 border-t">
                <p className="text-2xl font-bold text-blue-600">{job.amount} XLM</p>
            </div>

            <div className="flex gap-2">
                {isFreelancer && job.status === JobStatus.PENDING && (
                    <button
                        onClick={handleMarkCompleted}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Mark Completed
                    </button>
                )}

                {isClient && job.status === JobStatus.COMPLETED && (
                    <button
                        onClick={handleApprove}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Approve & Release Funds
                    </button>
                )}

                {(isClient || isFreelancer) &&
                    job.status !== JobStatus.DISPUTED &&
                    job.status !== JobStatus.APPROVED && (
                        <button
                            onClick={handleDispute}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Raise Dispute
                        </button>
                    )}
            </div>

            {job.status === JobStatus.DISPUTED && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-800">
                        This job is under dispute. Waiting for arbitrator resolution.
                    </p>
                </div>
            )}
        </div>
    );
}
