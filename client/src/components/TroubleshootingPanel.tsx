'use client';

import { useJobs } from '@/contexts/JobContext';
import { useWallet } from '@/contexts/WalletContext';
import QuickTestButton from './QuickTestButton';

export default function TroubleshootingPanel() {
    const { jobs, refreshJobs } = useJobs();
    const { publicKey } = useWallet();

    const checkStorage = () => {
        const stored = localStorage.getItem('stellar_escrow_shared_jobs');
        console.log('Shared storage:', stored);
        alert(`Shared storage has ${stored ? JSON.parse(stored).length : 0} jobs`);
    };

    const clearStorage = () => {
        if (confirm('Clear all jobs? This cannot be undone!')) {
            localStorage.removeItem('stellar_escrow_shared_jobs');
            refreshJobs();
            alert('Storage cleared!');
        }
    };

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-3">🔧 Troubleshooting</h3>

            <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded">
                    <p className="font-medium text-gray-900 mb-1">Current Status:</p>
                    <ul className="text-gray-700 space-y-1">
                        <li>• Total jobs: <strong>{jobs.length}</strong></li>
                        <li>• Your wallet: <code className="text-xs bg-gray-100 px-1">{publicKey?.slice(0, 16)}...</code></li>
                        <li>• Storage key: <code className="text-xs bg-gray-100 px-1">stellar_escrow_shared_jobs</code></li>
                    </ul>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={refreshJobs}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    >
                        🔄 Refresh Jobs
                    </button>
                    <button
                        onClick={checkStorage}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                    >
                        🔍 Check Storage
                    </button>
                    <button
                        onClick={clearStorage}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    >
                        🗑️ Clear All
                    </button>
                </div>

                <details className="bg-white p-3 rounded">
                    <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
                        Common Issues & Solutions
                    </summary>
                    <div className="mt-2 space-y-2 text-xs text-gray-600">
                        <div>
                            <p className="font-medium text-gray-800">Job not appearing?</p>
                            <ul className="ml-4 mt-1">
                                <li>1. Check freelancer address matches exactly</li>
                                <li>2. Click "Refresh Jobs" button</li>
                                <li>3. Wait 5 seconds for auto-refresh</li>
                                <li>4. Check browser console (F12) for errors</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Different computer?</p>
                            <ul className="ml-4 mt-1">
                                <li>• localStorage is browser-specific</li>
                                <li>• Use same browser/computer for testing</li>
                                <li>• Or add backend (see BACKEND_SETUP.md)</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Address mismatch?</p>
                            <ul className="ml-4 mt-1">
                                <li>• Copy address from wallet (green box)</li>
                                <li>• Paste exactly in freelancer field</li>
                                <li>• No extra spaces or characters</li>
                            </ul>
                        </div>
                    </div>
                </details>

                <div className="bg-yellow-100 p-2 rounded text-xs text-yellow-800">
                    <strong>💡 Tip:</strong> For testing, use the "Use My Address as Freelancer" button when creating jobs.
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                    <p className="text-xs text-purple-900 font-medium mb-2">🧪 Quick Test:</p>
                    <p className="text-xs text-purple-800 mb-2">
                        Click this button to create a test job instantly (no form needed):
                    </p>
                    <QuickTestButton />
                </div>
            </div>
        </div>
    );
}
