'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';
import { useDisputes } from '@/contexts/DisputeContext';
import { stakeAsArbitrator, submitVoteWithStake, getArbitratorStats } from '@/lib/dao';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function ArbitratorDashboard() {
    const { publicKey } = useWallet();
    const { disputes, addVote } = useDisputes();
    const [stakeAmount, setStakeAmount] = useState('10');
    const [voteStakes, setVoteStakes] = useState<Record<string, string>>({});
    const [stats, setStats] = useState({ balance: '0', stakedAmount: '0', votingPower: 0 });
    const [loading, setLoading] = useState(false);

    // Filter out disputes where current user is client or freelancer
    const activeDisputes = disputes.filter((d) => {
        const isActive = d.status === 'ACTIVE';
        const isNotInvolved = d.client !== publicKey && d.freelancer !== publicKey;
        return isActive && isNotInvolved;
    });

    const myVotes = disputes.flatMap((d) => d.votes.filter((v) => v.arbitratorAddress === publicKey));

    useEffect(() => {
        if (publicKey) {
            loadStats();
        }
    }, [publicKey]);

    const loadStats = async () => {
        if (!publicKey) return;
        try {
            const arbitratorStats = await getArbitratorStats(publicKey);
            setStats(arbitratorStats);
        } catch (error) {
            console.error('Failed to load stats:', error);
            // Set defaults on error
            setStats({ balance: '0', stakedAmount: '0', votingPower: 0 });
        }
    };

    const handleStake = async () => {
        console.log('🔒 Staking attempt:', { publicKey, stakeAmount });

        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }

        if (parseFloat(stakeAmount) < 10) {
            alert('Minimum stake is 10 XLM');
            return;
        }

        setLoading(true);
        try {
            const result = await stakeAsArbitrator(publicKey, stakeAmount);

            // Store stake info
            const currentStake = parseFloat(localStorage.getItem(`arbitrator_stake_${publicKey}`) || '0');
            const newStake = currentStake + parseFloat(stakeAmount);
            localStorage.setItem(`arbitrator_stake_${publicKey}`, newStake.toString());

            alert(`✅ Staked ${stakeAmount} XLM successfully!\n\nTransaction: ${result.txHash}\n\nYou can now vote on disputes!`);
            await loadStats();
        } catch (error: any) {
            alert(`❌ Staking failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (disputeId: string, decision: 'client' | 'freelancer') => {
        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }

        const voteStake = voteStakes[disputeId] || '10';
        if (parseFloat(voteStake) < 10) {
            alert('Minimum vote stake is 10 XLM');
            return;
        }

        if (!confirm(`Vote for ${decision} with ${voteStake} XLM stake?\n\nYou'll earn rewards if you vote with the majority!`)) {
            return;
        }

        setLoading(true);
        try {
            const txHash = await submitVoteWithStake(publicKey, disputeId, decision, voteStake);

            addVote(disputeId, {
                arbitratorAddress: publicKey,
                decision,
                stake: voteStake,
                timestamp: Date.now(),
                txHash,
            });

            alert(`✅ Vote submitted!\n\nTransaction: ${txHash}\n\nYour ${voteStake} XLM stake is locked until dispute resolves.`);
            await loadStats();
        } catch (error: any) {
            alert(`❌ Vote failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-full p-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div variants={itemVariants} className="dark-card rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <span>⚖️</span>
                                Arbitrator DAO
                            </h1>
                            <p className="text-gray-300">Vote on disputes and earn rewards</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Voting Power</p>
                            <p className="text-4xl font-bold text-purple-400">{stats.votingPower}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="dark-card rounded-xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Wallet Balance</p>
                                <p className="text-3xl font-bold text-blue-400">{parseFloat(stats.balance).toFixed(2)} XLM</p>
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="dark-card rounded-xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Staked</p>
                                <p className="text-3xl font-bold text-purple-400">{stats.stakedAmount} XLM</p>
                            </div>
                            <div className="text-4xl">🔒</div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="dark-card rounded-xl shadow-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Votes</p>
                                <p className="text-3xl font-bold text-green-400">{myVotes.length}</p>
                            </div>
                            <div className="text-4xl">🗳️</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Active Disputes */}
                <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span>⚖️</span>
                            Active Disputes ({activeDisputes.length})
                        </h2>
                        {disputes.length > 0 && activeDisputes.length === 0 && (
                            <span className="text-sm text-gray-400">
                                {disputes.length} dispute(s) exist but you're involved in them
                            </span>
                        )}
                    </div>
                    <div className="grid gap-6">on
                        {activeDisputes.map((dispute) => {
                            const hasVoted = dispute.votes.some((v) => v.arbitratorAddress === publicKey);
                            const clientVotes = dispute.votes.filter((v) => v.decision === 'client').length;
                            const freelancerVotes = dispute.votes.filter((v) => v.decision === 'freelancer').length;

                            return (
                                <div key={dispute.id} className="dark-card rounded-xl shadow-xl p-6 border-2 border-purple-700/50">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Dispute #{dispute.id.slice(-8)}
                                            </h3>
                                            <p className="text-gray-300 mb-1">
                                                <strong>Job:</strong> {dispute.jobDescription}
                                            </p>
                                            <p className="text-gray-300">
                                                <strong>Amount:</strong> {dispute.jobAmount} XLM
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                                                {dispute.votes.length}/3 VOTES
                                            </span>
                                        </div>
                                    </div>

                                    {/* Evidence */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                                            <p className="font-semibold text-blue-300 mb-2">👔 Client Evidence:</p>
                                            <p className="text-sm text-gray-300">
                                                {dispute.clientEvidence || 'No evidence provided'}
                                            </p>
                                        </div>
                                        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
                                            <p className="font-semibold text-green-300 mb-2">💼 Freelancer Evidence:</p>
                                            <p className="text-sm text-gray-300">
                                                {dispute.freelancerEvidence || 'No evidence provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Vote Progress */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                                            <span>Client: {clientVotes} votes</span>
                                            <span>Freelancer: {freelancerVotes} votes</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div className="flex h-full">
                                                <div
                                                    className="bg-blue-600"
                                                    style={{ width: `${(clientVotes / 3) * 100}%` }}
                                                />
                                                <div
                                                    className="bg-green-600"
                                                    style={{ width: `${(freelancerVotes / 3) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Voting */}
                                    {!hasVoted ? (
                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-300 mb-3">Your vote stake (min 10 XLM):</p>
                                            <input
                                                type="number"
                                                value={voteStakes[dispute.id] || '10'}
                                                onChange={(e) =>
                                                    setVoteStakes((prev) => ({ ...prev, [dispute.id]: e.target.value }))
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                                                min="10"
                                                step="5"
                                            />
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleVote(dispute.id, 'client')}
                                                    disabled={loading}
                                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold text-lg disabled:opacity-50 shadow-lg"
                                                >
                                                    👔 Vote Client
                                                </button>
                                                <button
                                                    onClick={() => handleVote(dispute.id, 'freelancer')}
                                                    disabled={loading}
                                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold text-lg disabled:opacity-50 shadow-lg"
                                                >
                                                    💼 Vote Freelancer
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-purple-900/30 border-2 border-purple-700/50 rounded-lg p-4">
                                            <p className="text-purple-300 font-semibold text-center">
                                                ✅ You've already voted on this dispute
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {activeDisputes.length === 0 && (
                            <div className="dark-card rounded-xl shadow-xl p-12 text-center">
                                <div className="text-6xl mb-4">🕐</div>
                                <p className="text-gray-300 text-lg font-semibold mb-2">No disputes available for voting</p>
                                <p className="text-gray-400 text-sm">
                                    You can only vote on disputes where you're not the client or freelancer
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
