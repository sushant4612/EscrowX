'use client';

import { useJobs } from '@/contexts/JobContext';
import { useWallet } from '@/contexts/WalletContext';

export default function TransactionHistory() {
    const { jobs } = useJobs();
    const { publicKey } = useWallet();

    if (!publicKey) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">Connect your wallet to view transaction history</p>
            </div>
        );
    }

    const myJobs = jobs.filter(
        (job) => job.client === publicKey || job.freelancer === publicKey
    );

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Transaction History</h2>

            {myJobs.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-600">No transactions yet</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Job ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {myJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono">
                                        {job.id.slice(-8)}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {job.client === publicKey ? 'Client' : 'Freelancer'}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                                        {job.amount} XLM
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
