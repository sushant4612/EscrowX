'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useJobs } from '@/contexts/JobContext';
import { Job, JobStatus } from '@/lib/stellar';

export default function CreateJobForm() {
    const { publicKey } = useWallet();
    const { addJob } = useJobs();
    const [freelancer, setFreelancer] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) {
            alert('Please connect your wallet first');
            return;
        }

        if (!confirm(`Lock ${amount} XLM in blockchain escrow?\n\nThis will deduct XLM from your account.`)) {
            return;
        }

        setLoading(true);
        try {
            const { createRealEscrow } = await import('@/lib/escrow');

            const escrowData = await createRealEscrow(publicKey, amount);

            const job: Job = {
                id: `job-${Date.now()}`,
                client: publicKey,
                freelancer: freelancer.trim(),
                amount,
                description,
                status: JobStatus.PENDING,
                createdAt: Date.now(),
                escrowAccount: escrowData.escrowPublicKey,
            };

            localStorage.setItem(`escrow_${job.id}`, escrowData.escrowSecret);

            await addJob(job);

            setFreelancer('');
            setAmount('');
            setDescription('');

            alert(`✅ Job created!\n\n${amount} XLM locked in escrow\nEscrow: ${escrowData.escrowPublicKey.slice(0, 16)}...`);
        } catch (error: any) {
            alert(`❌ Failed: ${error.message || 'Transaction rejected or insufficient balance'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">Connect your wallet to create a job</p>
            </div>
        );
    }

    const copyMyAddress = () => {
        setFreelancer(publicKey);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create Escrow Job</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <button
                    type="button"
                    onClick={copyMyAddress}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Use My Address as Freelancer (for testing)
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Freelancer Address
                </label>
                <input
                    type="text"
                    value={freelancer}
                    onChange={(e) => setFreelancer(e.target.value)}
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (XLM)
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10"
                    min="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Minimum 3 XLM (will be locked in blockchain escrow)
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the work..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                <p className="text-yellow-800">
                    ⚠️ This will create a real escrow account and lock your XLM on the blockchain.
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Creating Escrow...' : 'Create Job & Lock Funds'}
            </button>
        </form>
    );
}
