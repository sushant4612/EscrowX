'use client';

import { useState, useEffect } from 'react';
import { getPendingReleases, removePendingRelease } from '@/lib/disputeStorage';
import { getAllJobs } from '@/lib/storage';

export default function PendingReleases() {
    const [pendingReleases, setPendingReleases] = useState<any[]>([]);
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadPendingReleases();
        const interval = setInterval(loadPendingReleases, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadPendingReleases = () => {
        const pending = getPendingReleases();
        setPendingReleases(pending);
    };

    const handleRelease = async (pending: any) => {
        setLoading({ ...loading, [pending.jobId]: true });

        try {
            // Get the job
            const jobs = await getAllJobs();
            const job = jobs.find((j: any) => j.id === pending.jobId);

            if (!job) {
                alert('Job not found');
                return;
            }

            // Get escrow secret
            const escrowSecret = localStorage.getItem(`escrow_${pending.jobId}`);

            if (!escrowSecret) {
                // Check if any escrow keys exist in this browser
                const allKeys = Object.keys(localStorage).filter(k => k.startsWith('escrow_'));

                if (allKeys.length === 0) {
                    alert(`❌ No escrow keys found in this browser.\n\nThis means you didn't create any jobs in this browser.\n\nPlease:\n1. Open the browser where you created this job\n2. Go to Client dashboard\n3. Click "Release Funds" there\n\nOr copy the escrow key from the original browser.`);
                } else {
                    alert(`❌ Escrow key for this job not found.\n\nYou have ${allKeys.length} other escrow key(s) in this browser, but not for this job.\n\nThis job was created in a different browser.\n\nPlease:\n1. Open the browser where you created THIS specific job\n2. Go to Client dashboard\n3. Click "Release Funds" there`);
                }
                return;
            }

            if (!job.escrowAccount) {
                alert('No escrow account found for this job');
                return;
            }

            // Release funds
            const { releaseEscrowFunds } = await import('@/lib/escrow');
            const txHash = await releaseEscrowFunds(
                job.escrowAccount,
                escrowSecret,
                pending.recipient
            );

            alert(`✅ Funds released!\n\n${pending.amount} XLM sent to ${pending.winner}\n\nTransaction: ${txHash}`);

            // Remove from pending
            removePendingRelease(pending.jobId);
            loadPendingReleases();
        } catch (error: any) {
            alert(`❌ Failed to release funds: ${error.message}`);
        } finally {
            setLoading({ ...loading, [pending.jobId]: false });
        }
    };

    if (pendingReleases.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-4">
                    ⚠️ Pending Fund Releases ({pendingReleases.length})
                </h3>
                <p className="text-sm text-orange-800 mb-4">
                    These disputes have been resolved by DAO voting. Click below to release funds to the winner.
                </p>

                <div className="space-y-3">
                    {pendingReleases.map((pending) => {
                        const hasKey = !!localStorage.getItem(`escrow_${pending.jobId}`);

                        return (
                            <div key={pending.jobId} className={`bg-white rounded-lg p-4 border-2 ${hasKey ? 'border-green-300' : 'border-orange-200'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-gray-900">
                                                Job #{pending.jobId.slice(-8)}
                                            </p>
                                            {hasKey ? (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                                    🔑 Key Available
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">
                                                    ⚠️ Wrong Browser
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Winner: <span className="font-medium text-orange-700">{pending.winner}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Amount: <span className="font-medium">{pending.amount} XLM</span>
                                        </p>
                                        {!hasKey && (
                                            <p className="text-xs text-red-600 mt-1">
                                                Open the browser where you created this job
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRelease(pending)}
                                        disabled={loading[pending.jobId] || !hasKey}
                                        className={`px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 ${hasKey
                                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        {loading[pending.jobId] ? '⏳ Releasing...' : hasKey ? '💰 Release Funds' : '🔒 Key Not Found'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Resolved: {new Date(pending.timestamp).toLocaleString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
