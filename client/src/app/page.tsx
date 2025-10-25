'use client';

import { useState } from 'react';
import WalletConnect from '@/components/WalletConnect';
import ClientDashboard from '@/components/ClientDashboard';
import FreelancerDashboard from '@/components/FreelancerDashboard';
import TransactionHistory from '@/components/TransactionHistory';
import DisputeResolution from '@/components/DisputeResolution';
import RoleSelector from '@/components/RoleSelector';

type Role = 'client' | 'freelancer';
type Tab = 'dashboard' | 'history' | 'disputes';

export default function Home() {
  const [role, setRole] = useState<Role>('client');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stellar Escrow</h1>
              <p className="text-gray-600 mt-1">Decentralized freelance marketplace</p>
            </div>
            <div className="flex items-center gap-4">
              <RoleSelector onRoleChange={setRole} />
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-medium transition ${activeTab === 'dashboard'
                ? `${role === 'client'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-green-600 border-b-2 border-green-600'
                }`
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {role === 'client' ? '💼 Client Dashboard' : '🎯 Freelancer Dashboard'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium transition ${activeTab === 'history'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              📊 History
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-6 py-3 font-medium transition ${activeTab === 'disputes'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              ⚖️ Disputes
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <>
            {role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />}
          </>
        )}
        {activeTab === 'history' && <TransactionHistory />}
        {activeTab === 'disputes' && <DisputeResolution />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Built on Stellar Testnet • Powered by Freighter Wallet</p>
        </div>
      </footer>
    </div>
  );
}
