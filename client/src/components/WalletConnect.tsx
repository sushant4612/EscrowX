'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';

export default function WalletConnect() {
    const { publicKey, isConnected, connect, disconnect, isInstalled, isLoading } = useWallet();
    const [copied, setCopied] = useState(false);

    console.log('WalletConnect render:', { publicKey, isConnected, isInstalled, isLoading });

    const copyAddress = async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isInstalled) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                <p className="text-yellow-800 font-medium mb-2">Freighter Wallet Required</p>
                <p className="text-yellow-700 text-sm mb-3">
                    Please install Freighter Wallet to use this application.
                </p>
                <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
                >
                    Install Freighter
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
                {isConnected ? (
                    <>
                        <button
                            onClick={copyAddress}
                            className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 hover:bg-green-100 transition cursor-pointer group"
                            title="Click to copy full address"
                        >
                            <p className="text-sm text-green-800 font-mono">
                                {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
                            </p>
                            <p className="text-xs text-green-600 group-hover:text-green-700">
                                {copied ? '✓ Copied!' : 'Click to copy'}
                            </p>
                        </button>
                        <button
                            onClick={disconnect}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Disconnect
                        </button>
                    </>
                ) : (
                    <button
                        onClick={connect}
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                )}
            </div>
            {!isConnected && (
                <p className="text-xs text-gray-500 max-w-xs text-right">
                    Make sure Freighter is unlocked and you have an account created
                </p>
            )}
        </div>
    );
}
