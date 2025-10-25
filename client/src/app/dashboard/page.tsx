'use client';

import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import FreelancerDashboard from '@/components/FreelancerDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import ArbitratorDashboard from '@/components/ArbitratorDashboard';

export default function DashboardPage() {
    const wallet = useWallet();
    const { publicKey, connect, disconnect } = wallet;
    const [activeView, setActiveView] = useState<'client' | 'freelancer' | 'arbitrator'>('freelancer');
    const [balance, setBalance] = useState('0');

    const handleDisconnect = () => {
        if (disconnect) {
            disconnect();
        }
    };

    // Load balance when wallet connects
    React.useEffect(() => {
        if (publicKey) {
            loadBalance();
        }
    }, [publicKey]);

    const loadBalance = async () => {
        if (!publicKey) return;
        try {
            const { getAccountBalance } = await import('@/lib/stellar');
            const bal = await getAccountBalance(publicKey);
            setBalance(parseFloat(bal).toFixed(2));
        } catch (error) {
            console.error('Error loading balance:', error);
        }
    };

    if (!publicKey) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
                    <div className="text-6xl mb-6">🔐</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Connect Your Wallet
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Connect your Stellar wallet to access the dashboard
                    </p>
                    <button
                        onClick={connect}
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-bold text-lg"
                    >
                        Connect Freighter Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-72 bg-white shadow-xl flex flex-col">
                {/* Logo/Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">⚡ Stellar Escrow</h1>
                    <p className="text-sm text-gray-600 mt-1">DAO Platform</p>
                </div>

                {/* Wallet Info */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Wallet</span>
                        <button
                            onClick={handleDisconnect}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Disconnect
                        </button>
                    </div>
                    <p className="text-xs font-mono text-gray-600 mb-3 break-all">
                        {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
                    </p>
                    <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Balance</p>
                        <p className="text-2xl font-bold text-blue-600">{balance} XLM</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                        Dashboards
                    </p>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveView('freelancer')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeView === 'freelancer'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-2xl">💼</span>
                            <div className="text-left">
                                <p className="font-semibold">Freelancer</p>
                                <p className="text-xs opacity-80">Manage gigs</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveView('client')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeView === 'client'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-2xl">👔</span>
                            <div className="text-left">
                                <p className="font-semibold">Client</p>
                                <p className="text-xs opacity-80">Post projects</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveView('arbitrator')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeView === 'arbitrator'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-2xl">⚖️</span>
                            <div className="text-left">
                                <p className="font-semibold">Arbitrator DAO</p>
                                <p className="text-xs opacity-80">Vote & earn</p>
                            </div>
                        </button>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <a
                        href="/"
                        className="block w-full text-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {activeView === 'freelancer' && <FreelancerDashboard />}
                {activeView === 'client' && <ClientDashboard />}
                {activeView === 'arbitrator' && <ArbitratorDashboard />}
            </div>
        </div>
    );
}
