'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useJobs } from '@/contexts/JobContext';
import { useDisputes } from '@/contexts/DisputeContext';
import { JobStatus } from '@/lib/stellar';

export default function FreelancerDashboard() {
    const { publicKey } = useWallet();
    const { jobs, updateJobStatus } = useJobs();
    const { addDispute, disputes } = useDisputes();
    const [evidenceText, setEvidenceText] = useState<Record<string, string>>({});

    const myJobs = jobs.filter((job) => job.freelancer === publicKey);
    const activeJobs = myJobs.filter((j) => j.status === JobStatus.PENDING);
    const completedJobs = myJobs.filter((j) => j.status === JobStatus.COMPLETED);
    const approvedJobs = myJobs.filter((j) => j.status === JobStatus.APPROVED);
    const disputedJobs = myJobs.filter((j) => j.status === JobStatus.DISPUTED);

    const totalEarned = approvedJobs.reduce((sum, job) => sum + parseFloat(job.amount), 0);

    const handleComplete = (jobId: string) => {
        updateJobStatus(jobId, JobStatus.COMPLETED);
    };

    const handleRaiseDispute = (job: any) => {
        const evidence = evidenceText[job.id] || '';
        if (!evidence.trim()) {
            alert('Please provide evidence for the dispute');
            return;
        }

        updateJobStatus(job.id, JobStatus.DISPUTED);
        addDispute({
            jobId: job.id,
            jobDescription: job.description,
            jobAmount: job.amount,
            client: job.client,
            freelancer: job.freelancer,
            clientEvidence: '',
            freelancerEvidence: evidence,
        });

        alert('Dispute raised! DAO arbitrators will review your case.');
        setEvidenceText((prev) => ({ ...prev, [job.id]: '' }));
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-full p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                💼 Freelancer Dashboard
                            </h1>
                            <p className="text-gray-600">Manage your gigs and earnings</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Earned</p>
                            <p className="text-4xl font-bold text-green-600">{totalEarned.toFixed(2)} XLM</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Jobs</p>
                                <p className="text-3xl font-bold text-blue-600">{activeJobs.length}</p>
                            </div>
                            <div className="text-4xl">🚀</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600">{completedJobs.length}</p>
                            </div>
                            <div className="text-4xl">⏳</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Completed</p>
                                <p className="text-3xl font-bold text-green-600">{approvedJobs.length}</p>
                            </div>
                            <div className="text-4xl">✅</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Disputes</p>
                                <p className="text-3xl font-bold text-red-600">{disputedJobs.length}</p>
                            </div>
                            <div className="text-4xl">⚖️</div>
                        </div>
                    </div>
                </div>

                {/* Active Jobs */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Active Jobs</h2>
                    <div className="grid gap-4">
                        {activeJobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{job.description}</h3>
                                        <p className="text-sm text-gray-500">Job #{job.id.slice(-8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">{job.amount} XLM</p>
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            IN PROGRESS
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleComplete(job.id)}
                                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                    >
                                        ✅ Mark as Completed
                                    </button>
                                </div>
                            </div>
                        ))}
                        {activeJobs.length === 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <p className="text-gray-500 text-lg">No active jobs. Time to find new gigs! 🎯</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Review */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">⏳ Pending Client Review</h2>
                    <div className="grid gap-4">
                        {completedJobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{job.description}</h3>
                                        <p className="text-sm text-gray-500">Waiting for client approval...</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-yellow-600">{job.amount} XLM</p>
                                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                            UNDER REVIEW
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-600 mb-3">If client doesn't approve, raise a dispute:</p>
                                    <textarea
                                        value={evidenceText[job.id] || ''}
                                        onChange={(e) => setEvidenceText((prev) => ({ ...prev, [job.id]: e.target.value }))}
                                        placeholder="Provide evidence (screenshots, messages, work samples...)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        rows={3}
                                    />
                                    <button
                                        onClick={() => handleRaiseDispute(job)}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                                    >
                                        ⚖️ Raise Dispute
                                    </button>
                                </div>
                            </div>
                        ))}
                        {completedJobs.length === 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <p className="text-gray-500 text-lg">No jobs pending review 📋</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disputed Jobs */}
                {disputedJobs.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">⚖️ Disputed Jobs</h2>
                        <div className="grid gap-4">
                            {disputedJobs.map((job) => {
                                const dispute = disputes.find((d) => d.jobId === job.id);
                                return (
                                    <div key={job.id} className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{job.description}</h3>
                                                <p className="text-sm text-red-600">Under DAO arbitration</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-red-600">{job.amount} XLM</p>
                                                <span className="inline-block px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm font-medium">
                                                    DISPUTED
                                                </span>
                                            </div>
                                        </div>
                                        {dispute && (
                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <strong>Your Evidence:</strong> {dispute.freelancerEvidence}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Votes:</strong> {dispute.votes.length}/3 arbitrators voted
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
