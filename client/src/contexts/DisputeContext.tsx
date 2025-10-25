'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dispute, Vote } from '@/lib/dao';

interface DisputeContextType {
    disputes: Dispute[];
    addDispute: (dispute: Omit<Dispute, 'id' | 'votes' | 'status' | 'createdAt'>) => void;
    addVote: (disputeId: string, vote: Vote) => void;
    resolveDispute: (disputeId: string, winner: 'client' | 'freelancer') => void;
    getDisputeByJobId: (jobId: string) => Dispute | undefined;
}

const DisputeContext = createContext<DisputeContextType | undefined>(undefined);

export function DisputeProvider({ children }: { children: ReactNode }) {
    const [disputes, setDisputes] = useState<Dispute[]>([]);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('disputes');
        if (stored) {
            setDisputes(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('disputes', JSON.stringify(disputes));
    }, [disputes]);

    const addDispute = (dispute: Omit<Dispute, 'id' | 'votes' | 'status' | 'createdAt'>) => {
        const newDispute: Dispute = {
            ...dispute,
            id: `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            votes: [],
            status: 'ACTIVE',
            createdAt: Date.now(),
        };
        setDisputes((prev) => [...prev, newDispute]);
    };

    const addVote = (disputeId: string, vote: Vote) => {
        setDisputes((prev) =>
            prev.map((dispute) => {
                if (dispute.id === disputeId) {
                    const newVotes = [...dispute.votes, vote];

                    // Check if dispute should be resolved (3 votes)
                    if (newVotes.length >= 3) {
                        const clientVotes = newVotes.filter((v) => v.decision === 'client').length;
                        const freelancerVotes = newVotes.filter((v) => v.decision === 'freelancer').length;

                        const winner = clientVotes > freelancerVotes ? 'client' : 'freelancer';

                        return {
                            ...dispute,
                            votes: newVotes,
                            status: 'RESOLVED' as const,
                            winner,
                            resolvedAt: Date.now(),
                        };
                    }

                    return { ...dispute, votes: newVotes };
                }
                return dispute;
            })
        );
    };

    const resolveDispute = (disputeId: string, winner: 'client' | 'freelancer') => {
        setDisputes((prev) =>
            prev.map((dispute) =>
                dispute.id === disputeId
                    ? { ...dispute, status: 'RESOLVED' as const, winner, resolvedAt: Date.now() }
                    : dispute
            )
        );
    };

    const getDisputeByJobId = (jobId: string) => {
        return disputes.find((d) => d.jobId === jobId);
    };

    return (
        <DisputeContext.Provider
            value={{ disputes, addDispute, addVote, resolveDispute, getDisputeByJobId }}
        >
            {children}
        </DisputeContext.Provider>
    );
}

export function useDisputes() {
    const context = useContext(DisputeContext);
    if (!context) {
        throw new Error('useDisputes must be used within DisputeProvider');
    }
    return context;
}
