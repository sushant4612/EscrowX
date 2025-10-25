'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dispute, Vote } from '@/lib/dao';
import { saveDispute, getAllDisputes, addVoteToDispute, resolveDispute as resolveDisputeInStorage } from '@/lib/disputeStorage';

interface DisputeContextType {
    disputes: Dispute[];
    addDispute: (dispute: Omit<Dispute, 'id' | 'votes' | 'status' | 'createdAt'>) => Promise<void>;
    addVote: (disputeId: string, vote: Vote) => Promise<void>;
    resolveDispute: (disputeId: string, winner: 'client' | 'freelancer') => Promise<void>;
    getDisputeByJobId: (jobId: string) => Dispute | undefined;
    refreshDisputes: () => Promise<void>;
}

const DisputeContext = createContext<DisputeContextType | undefined>(undefined);

export function DisputeProvider({ children }: { children: ReactNode }) {
    const [disputes, setDisputes] = useState<Dispute[]>([]);

    const loadDisputes = async () => {
        const loadedDisputes = await getAllDisputes();
        setDisputes(loadedDisputes);
    };

    useEffect(() => {
        loadDisputes();
        // Poll for updates every 3 seconds (same as jobs)
        const interval = setInterval(loadDisputes, 3000);
        return () => clearInterval(interval);
    }, []);

    const addDispute = async (dispute: Omit<Dispute, 'id' | 'votes' | 'status' | 'createdAt'>) => {
        await saveDispute(dispute);
        await loadDisputes();
    };

    const addVote = async (disputeId: string, vote: Vote) => {
        await addVoteToDispute(disputeId, vote);
        await loadDisputes();
    };

    const resolveDispute = async (disputeId: string, winner: 'client' | 'freelancer') => {
        await resolveDisputeInStorage(disputeId, winner);
        await loadDisputes();
    };

    const getDisputeByJobId = (jobId: string) => {
        return disputes.find((d) => d.jobId === jobId);
    };

    return (
        <DisputeContext.Provider
            value={{ disputes, addDispute, addVote, resolveDispute, getDisputeByJobId, refreshDisputes: loadDisputes }}
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
