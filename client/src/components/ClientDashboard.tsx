'use client';

import { useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { useWallet } from '@/contexts/WalletContext';
import JobCard from './JobCard';
import CreateJobForm from './CreateJobForm';
import { JobStatus } from '@/lib/stellar';

export default function ClientDashboard() {
    const { jobs } = useJobs();
    const { publicKey } = useWallet();
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (!publicKey) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, Client!</h2>
                <p className="text-gray-600">Connect your wallet to start creating jobs</p>
            </div>
        );
    }

    const myJobs = jobs.filter((job) => job.client === publicKey);
    const pendingJobs = myJobs.filter((job) => job.status === JobStatus.PENDING);
    const completedJobs = myJobs.filter((job) => job.status === JobStatus.COMPLETED);
    const approvedJobs = myJobs.filter((job) => job.status === JobStatus.APPROVED);

    const totalSpent = approvedJobs.reduce((sum, job) => sum + parseFloat(job.amount), 0);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
                <p className="text-blue-100">Manage your freelance projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{myJobs.length}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-700 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-800">{pendingJobs.length}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-1">Awaiting Approval</p>
                    <p className="text-3xl font-bold text-blue-800">{completedJobs.length}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-green-800">{totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-green-600 mt-1">XLM</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Your Jobs</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {showCreateForm ? 'Cancel' : '+ Create New Job'}
                </button>
            </div>

            {showCreateForm && <CreateJobForm />}

            {completedJobs.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Awaiting Your Approval ({completedJobs.length})
                    </h3>
                    <div className="grid gap-4">
                        {completedJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {pendingJobs.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        In Progress ({pendingJobs.length})
                    </h3>
                    <div className="grid gap-4">
                        {pendingJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {myJobs.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Yet</h3>
                    <p className="text-gray-600 mb-6">
                        Create your first job to start working with freelancers
                    </p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Your First Job
                    </button>
                </div>
            )}
        </div>
    );
}
