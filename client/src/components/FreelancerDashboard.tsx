'use client';

import { useJobs } from '@/contexts/JobContext';
import { useWallet } from '@/contexts/WalletContext';
import JobCard from './JobCard';
import { JobStatus } from '@/lib/stellar';

export default function FreelancerDashboard() {
    const { jobs } = useJobs();
    const { publicKey } = useWallet();

    if (!publicKey) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, Freelancer!</h2>
                <p className="text-gray-600">Connect your wallet to view your jobs</p>
            </div>
        );
    }

    const myJobs = jobs.filter((job) => job.freelancer === publicKey);
    const pendingJobs = myJobs.filter((job) => job.status === JobStatus.PENDING);
    const completedJobs = myJobs.filter((job) => job.status === JobStatus.COMPLETED);
    const approvedJobs = myJobs.filter((job) => job.status === JobStatus.APPROVED);

    const totalEarned = approvedJobs.reduce((sum, job) => sum + parseFloat(job.amount), 0);
    const pendingEarnings = [...pendingJobs, ...completedJobs].reduce(
        (sum, job) => sum + parseFloat(job.amount),
        0
    );

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Freelancer Dashboard</h1>
                <p className="text-green-100">Track your work and earnings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{myJobs.length}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-700 mb-1">Active Jobs</p>
                    <p className="text-3xl font-bold text-yellow-800">{pendingJobs.length}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-1">Pending Earnings</p>
                    <p className="text-3xl font-bold text-blue-800">{pendingEarnings.toFixed(2)}</p>
                    <p className="text-xs text-blue-600 mt-1">XLM</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-1">Total Earned</p>
                    <p className="text-3xl font-bold text-green-800">{totalEarned.toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-1">XLM</p>
                </div>
            </div>

            {pendingJobs.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Active Jobs ({pendingJobs.length})
                    </h3>
                    <div className="grid gap-4">
                        {pendingJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {completedJobs.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Awaiting Client Approval ({completedJobs.length})
                    </h3>
                    <div className="grid gap-4">
                        {completedJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {myJobs.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Yet</h3>
                    <p className="text-gray-600 mb-4">
                        You don't have any jobs assigned to you yet.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-blue-800 mb-2 font-medium">Your Freelancer Address:</p>
                        <p className="text-xs font-mono text-blue-900 break-all bg-white p-2 rounded">
                            {publicKey}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                            Share this address with clients to receive job assignments
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
