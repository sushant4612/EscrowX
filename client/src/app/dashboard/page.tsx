'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useWallet } from '@/contexts/WalletContext';
import FreelancerDashboard from '@/components/FreelancerDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import ArbitratorDashboard from '@/components/ArbitratorDashboard';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen flex flex-col relative overflow-hidden">
                {/* Animated background elements */}
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                {/* Logo */}
                <motion.div
                    className="absolute top-8 left-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-36 h-20 rounded-xl flex items-center justify-center  overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="Stellar Escrow Logo"
                            width={280}
                            height={120}
                            className="object-cover rounded-xl"
                        />
                    </div>
                </motion.div>

                {/* Main content */}
                <div className="flex-1 flex items-center justify-center p-8 relative z-10">
                    <motion.div
                        className="max-w-md w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-700/50">
                            {/* Icon */}
                            <motion.div
                                className="flex justify-center mb-8"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.4
                                }}
                            >
                                <div className="w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/logo.png"
                                        alt="Stellar Escrow Logo"
                                        width={112}
                                        height={112}
                                        className="object-cover rounded-2xl"
                                    />
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                className="text-3xl font-bold text-white mb-3 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                Connect Your Wallet
                            </motion.h1>

                            <motion.p
                                className="text-gray-400 mb-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                Connect your Stellar wallet to access the decentralized escrow platform
                            </motion.p>

                            {/* Button */}
                            <motion.button
                                onClick={connect}
                                className="w-full px-8 py-4 bg-[#004e92] hover:bg-[#003d75] text-white rounded-xl transition font-semibold text-lg shadow-lg relative overflow-hidden group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" />
                                        <polyline points="15 10 20 10 20 14 15 14" />
                                        <line x1="20" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Connect Freighter Wallet
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-[#0066cc] to-[#004e92]"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>

                            {/* Features */}
                            <motion.div
                                className="mt-8 space-y-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <span className="text-green-400 text-xs">✓</span>
                                    </div>
                                    <span>Secure blockchain escrow</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <span className="text-green-400 text-xs">✓</span>
                                    </div>
                                    <span>DAO-powered dispute resolution</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <span className="text-green-400 text-xs">✓</span>
                                    </div>
                                    <span>Transparent & trustless</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer note */}
                        <motion.p
                            className="text-center text-gray-500 text-sm mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            Don't have Freighter?{' '}
                            <a
                                href="https://www.freighter.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#004e92] hover:text-[#0066cc] underline"
                            >
                                Install it here
                            </a>
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-black via-[#0f0520] to-black">
            {/* Sidebar */}
            <div className="w-72 bg-black/60 backdrop-blur-lg shadow-2xl flex flex-col border-r border-purple-900/50">
                {/* Logo/Header */}
                <motion.div
                    className="p-6 border-b border-purple-950/50 flex justify-center bg-gradient-to-b from-black/50 to-transparent"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-36 h-20 rounded-xl flex items-center justify-center  overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="Stellar Escrow Logo"
                            width={280}
                            height={120}
                            className="object-cover rounded-xl"
                        />
                    </div>
                </motion.div>

                {/* Wallet Info */}
                <motion.div
                    className="p-6 border-b border-purple-950/50 bg-gradient-to-br from-black/60 to-purple-950/20 backdrop-blur-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-300">Wallet</span>
                        <motion.button
                            onClick={handleDisconnect}
                            className="text-xs text-red-400 hover:text-red-300 font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Disconnect
                        </motion.button>
                    </div>
                    <p className="text-xs font-mono text-gray-400 mb-3 break-all">
                        {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
                    </p>
                    <motion.div
                        className="bg-black/70 rounded-lg p-3 border border-purple-950/70"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <p className="text-xs text-gray-400">Balance</p>
                        <p className="text-2xl font-bold text-purple-400">{balance} XLM</p>
                    </motion.div>
                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                        Dashboards
                    </p>
                    <div className="space-y-2">
                        <motion.button
                            onClick={() => setActiveView('freelancer')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeView === 'freelancer'
                                ? 'bg-gradient-to-r from-black/90 to-purple-950/60 border border-purple-700/50 text-white shadow-lg shadow-purple-950/50'
                                : 'text-gray-300 hover:bg-black/40'
                                }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">💼</span>
                            <div className="text-left">
                                <p className="font-semibold">Freelancer</p>
                                <p className="text-xs opacity-80">Manage gigs</p>
                            </div>
                        </motion.button>

                        <motion.button
                            onClick={() => setActiveView('client')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeView === 'client'
                                ? 'bg-gradient-to-r from-black/90 to-purple-950/60 border border-purple-700/50 text-white shadow-lg shadow-purple-950/50'
                                : 'text-gray-300 hover:bg-black/40'
                                }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">👔</span>
                            <div className="text-left">
                                <p className="font-semibold">Client</p>
                                <p className="text-xs opacity-80">Post projects</p>
                            </div>
                        </motion.button>

                        <motion.button
                            onClick={() => setActiveView('arbitrator')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeView === 'arbitrator'
                                ? 'bg-gradient-to-r from-black/90 to-purple-950/60 border border-purple-700/50 text-white shadow-lg shadow-purple-950/50'
                                : 'text-gray-300 hover:bg-black/40'
                                }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">⚖️</span>
                            <div className="text-left">
                                <p className="font-semibold">Arbitrator DAO</p>
                                <p className="text-xs opacity-80">Vote & earn</p>
                            </div>
                        </motion.button>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-purple-900/50">
                    <a
                        href="/"
                        className="block w-full text-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-purple-950/30 rounded-lg transition"
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
