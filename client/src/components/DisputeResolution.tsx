'use client';

import { useState } from 'react';
import { useJobs } from '@/contexts/JobContext';
import { JobStatus } from '@/lib/stellar';

const ARBITRATOR_ADDRESSES = [
    'ARBITRATOR1_PLACEHOLDER',
    'ARBITRATOR2_PLACEHOLDER',
    'ARBITRATOR3_PLACEHOLDER',
];

export default function DisputeResolution() {
    const { jobs, updateJobStatus } = useJobs();
    const [votes, setVotes] = useState<Record<string, string[]>>({});

    const disputedJobs = jobs.filter((job) => job.status === JobStatus.DISPUTED);

    const handleVote = (jobId: string, winner: 'client' | 'freelancer', arbitrator: string) => {
        const jobVotes = votes[jobId] || [];
        if (!jobVotes.includes(arbitrator)) {
            const newVotes = [...jobVotes, winner];
            setVotes({ ...votes, [jobId]: newVotes });

            if (newVotes.length >= 2) {
                const clientVotes = newVotes.filter((v) => v === 'client').length;
                const freelancerVotes = newVotes.filter((v) => v === 'freelancer').length;

                if (clientVotes >= 2 || freelancerVotes >= 2) {
                    updateJobStatus(jobId, JobStatus.RESOLVED);
                    alert(`Dispute resolved! Funds released to ${clientVotes >= 2 ? 'client' : 'freelancer'}`);
                }
            }
        }
    };

    if (disputedJobs.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">No disputed jobs at the moment</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dispute Resolution (DAO Voting)</h2>

            {disputedJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">Job #{job.id.slice(-8)}</h3>
                            <p className="text-sm text-gray-500">{job.description}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                            DISPUTED
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Client</p>
                            <p className="font-mono text-xs">{job.client.slice(0, 8)}...{job.client.slice(-8)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Freelancer</p>
                            <p className="font-mono text-xs">{job.freelancer.slice(0, 8)}...{job.freelancer.slice(-8)}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="font-medium mb-3">Arbitrator Votes ({votes[job.id]?.length || 0}/3)</p>
                        <div className="space-y-2">
                            {ARBITRATOR_ADDRESSES.map((arbitrator, index) => (
                                <div key={arbitrator} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-32">Arbitrator {index + 1}</span>
                                    <button
                                        onClick={() => handleVote(job.id, 'client', arbitrator)}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition text-sm"
                                    >
                                        Vote Client
                                    </button>
                                    <button
                                        onClick={() => handleVote(job.id, 'freelancer', arbitrator)}
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition text-sm"
                                    >
                                        Vote Freelancer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {votes[job.id] && votes[job.id].length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-sm text-blue-800">
                                Current votes: {votes[job.id].filter((v) => v === 'client').length} for Client,
                                {' '}{votes[job.id].filter((v) => v === 'freelancer').length} for Freelancer
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
