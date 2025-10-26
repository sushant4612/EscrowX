'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useJobs } from '@/contexts/JobContext';
import { JobStatus } from '@/lib/stellar';

export default function CreateJobSection() {
    const { publicKey } = useWallet();
    const { addJob } = useJobs();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        freelancer: '',
        amount: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }

        if (!formData.freelancer || !formData.amount || !formData.description) {
            alert('Please fill all fields');
            return;
        }

        if (parseFloat(formData.amount) < 3) {
            alert('Minimum amount is 3 XLM (Stellar account minimum)');
            return;
        }

        setLoading(true);
        try {
            // Validate freelancer account exists
            console.log('🔍 Validating freelancer account:', formData.freelancer);
            const { getAccountBalance } = await import('@/lib/stellar');

            try {
                await getAccountBalance(formData.freelancer);
                console.log('✅ Freelancer account exists');
            } catch (error) {
                setLoading(false);
                alert(`❌ Freelancer account not found!\n\nThe address "${formData.freelancer}" does not exist on Stellar testnet.\n\nMake sure:\n1. The address is correct\n2. The account has been activated (received XLM)\n3. You're using a testnet address`);
                return;
            }

            if (!confirm(`Lock ${formData.amount} XLM in blockchain escrow?`)) {
                setLoading(false);
                return;
            }

            const { createRealEscrow } = await import('@/lib/escrow');
            const { escrowPublicKey, escrowSecret } = await createRealEscrow(
                publicKey,
                formData.amount
            );

            const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Store escrow secret in Supabase for cross-browser access
            const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
            if (isSupabaseConfigured() && supabase) {
                try {
                    await supabase.from('escrow_keys').insert({
                        job_id: jobId,
                        escrow_account: escrowPublicKey,
                        escrow_secret: escrowSecret,
                        client_address: publicKey
                    });
                    console.log('✅ Escrow key stored in Supabase');
                } catch (error) {
                    console.error('Failed to store escrow key in Supabase:', error);
                }
            }

            // Also store in localStorage as backup
            localStorage.setItem(`escrow_${jobId}`, escrowSecret);

            addJob({
                id: jobId,
                client: publicKey,
                freelancer: formData.freelancer,
                amount: formData.amount,
                description: formData.description,
                status: JobStatus.PENDING,
                createdAt: Date.now(),
                escrowAccount: escrowPublicKey,
            });

            alert(`✅ Job created!\n\n${formData.amount} XLM locked in escrow\n\nEscrow: ${escrowPublicKey}`);

            setFormData({ freelancer: '', amount: '', description: '' });
            setIsOpen(false);
        } catch (error: any) {
            alert(`❌ Failed to create job: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-8">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold text-lg shadow-lg"
                >
                    ➕ Create New Job
                </button>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Create New Job</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Freelancer Address
                            </label>
                            <input
                                type="text"
                                value={formData.freelancer}
                                onChange={(e) => setFormData({ ...formData, freelancer: e.target.value })}
                                placeholder="GXXX..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (XLM)
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="10"
                                min="3"
                                step="0.1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the job..."
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                            >
                                {loading ? '⏳ Creating...' : '🔒 Create & Lock Funds'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
