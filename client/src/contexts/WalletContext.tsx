'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, isWalletInstalled } from '@/lib/wallet';

interface WalletContextType {
    publicKey: string | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    isInstalled: boolean;
    isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkWallet();
        // Try to restore previous connection
        const savedKey = localStorage.getItem('walletPublicKey');
        if (savedKey) {
            setPublicKey(savedKey);
        }
    }, []);

    const checkWallet = async () => {
        try {
            const installed = await isWalletInstalled();
            setIsInstalled(installed);
            console.log('Wallet check complete. Installed:', installed);
        } catch (error) {
            console.error('Error checking wallet:', error);
            setIsInstalled(false);
        }
    };

    const connect = async () => {
        setIsLoading(true);
        try {
            console.log('Connect button clicked');
            const key = await connectWallet();
            if (key) {
                console.log('Setting public key:', key);
                setPublicKey(key);
                localStorage.setItem('walletPublicKey', key);
            } else {
                console.error('No key returned from connectWallet');
            }
        } catch (error) {
            console.error('Error in connect function:', error);
            alert('Failed to connect wallet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const disconnect = () => {
        setPublicKey(null);
        localStorage.removeItem('walletPublicKey');
    };

    return (
        <WalletContext.Provider
            value={{
                publicKey,
                isConnected: !!publicKey,
                connect,
                disconnect,
                isInstalled,
                isLoading,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
}
