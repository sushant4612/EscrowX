'use client';

import { useJobs } from '@/contexts/JobContext';
import { useWallet } from '@/contexts/WalletContext';
import JobCard from './JobCard';
import { JobStatus } from '@/lib/stellar';

export default function JobList() {
    const { jobs } = useJobs();
    const { publicKey } = useWallet();

    if (!publicKey) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">Connect your wallet to view jobs</p>
            </div>
        );
    }

    const myJobs = jobs.filter(
        (job) => job.client === publicKey || job.freelancer === publicKey
    );

    const clientJobs = myJobs.filter((job) => job.client === publicKey);
    const freelancerJobs = myJobs.filter((job) => job.freelancer === publicKey);

    const getJobsByStatus = (jobList: typeof jobs, status: JobStatus) => {
        return jobList.filter((job) => job.status === status);
    };

    return (
        <div className="space-y-8">
            {clientJobs.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">My Client Jobs</h2>
                    <div className="grid gap-4">
                        {clientJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {freelancerJobs.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">My Freelancer Jobs</h2>
                    <div className="grid gap-4">
                        {freelancerJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}

            {myJobs.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No jobs found. Create your first job to get started!</p>
                </div>
            )}

            <div className="grid grid-cols-5 gap-4 mt-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-yellow-800">
                        {getJobsByStatus(myJobs, JobStatus.PENDING).length}
                    </p>
                    <p className="text-sm text-yellow-600">Pending</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-blue-800">
                        {getJobsByStatus(myJobs, JobStatus.COMPLETED).length}
                    </p>
                    <p className="text-sm text-blue-600">Completed</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-green-800">
                        {getJobsByStatus(myJobs, JobStatus.APPROVED).length}
                    </p>
                    <p className="text-sm text-green-600">Approved</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-red-800">
                        {getJobsByStatus(myJobs, JobStatus.DISPUTED).length}
                    </p>
                    <p className="text-sm text-red-600">Disputed</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-purple-800">
                        {getJobsByStatus(myJobs, JobStatus.RESOLVED).length}
                    </p>
                    <p className="text-sm text-purple-600">Resolved</p>
                </div>
            </div>
        </div>
    );
}
