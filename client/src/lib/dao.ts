import * as StellarSdk from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from './stellar';
import { signTransaction } from './wallet';

export interface Dispute {
    id: string;
    jobId: string;
    jobDescription: string;
    jobAmount: string;
    client: string;
    freelancer: string;
    clientEvidence: string;
    freelancerEvidence: string;
    votes: Vote[];
    status: 'ACTIVE' | 'RESOLVED';
    createdAt: number;
    resolvedAt?: number;
    winner?: 'client' | 'freelancer';
}

export interface Vote {
    arbitratorAddress: string;
    decision: 'client' | 'freelancer';
    stake: string;
    timestamp: number;
    txHash: string;
}

export interface Arbitrator {
    address: string;
    totalStaked: string;
    votesCount: number;
    reputation: number;
    joinedAt: number;
}

const MIN_STAKE_AMOUNT = '10'; // 10 XLM minimum to vote

/**
 * Stake XLM to become an arbitrator
 */
export async function stakeAsArbitrator(
    arbitratorPublicKey: string,
    amount: string
): Promise<{ txHash: string; stakeAccount: string }> {
    try {
        console.log('🏦 Staking', amount, 'XLM as arbitrator...');

        // Create stake account
        const stakeKeypair = StellarSdk.Keypair.random();
        const arbitratorAccount = await server.loadAccount(arbitratorPublicKey);

        const transaction = new StellarSdk.TransactionBuilder(arbitratorAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                StellarSdk.Operation.createAccount({
                    destination: stakeKeypair.publicKey(),
                    startingBalance: amount,
                })
            )
            .setTimeout(180)
            .build();

        const xdr = transaction.toXDR();
        const signedXdr = await signTransaction(xdr, NETWORK_PASSPHRASE);
        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
            signedXdr,
            NETWORK_PASSPHRASE
        );

        const result = await server.submitTransaction(signedTransaction as any);

        console.log('✅ Staked successfully!');
        return {
            txHash: result.hash,
            stakeAccount: stakeKeypair.publicKey(),
        };
    } catch (error) {
        console.error('Error staking:', error);
        throw error;
    }
}

/**
 * Submit vote with stake
 */
export async function submitVoteWithStake(
    arbitratorPublicKey: string,
    disputeId: string,
    decision: 'client' | 'freelancer',
    stakeAmount: string
): Promise<string> {
    try {
        if (parseFloat(stakeAmount) < parseFloat(MIN_STAKE_AMOUNT)) {
            throw new Error(`Minimum stake is ${MIN_STAKE_AMOUNT} XLM`);
        }

        console.log('🗳️ Submitting vote with', stakeAmount, 'XLM stake...');

        // Create vote stake account
        const voteStakeKeypair = StellarSdk.Keypair.random();
        const arbitratorAccount = await server.loadAccount(arbitratorPublicKey);

        const transaction = new StellarSdk.TransactionBuilder(arbitratorAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                StellarSdk.Operation.createAccount({
                    destination: voteStakeKeypair.publicKey(),
                    startingBalance: stakeAmount,
                })
            )
            .addMemo(StellarSdk.Memo.text(`VOTE:${disputeId}:${decision}`))
            .setTimeout(180)
            .build();

        const xdr = transaction.toXDR();
        const signedXdr = await signTransaction(xdr, NETWORK_PASSPHRASE);
        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
            signedXdr,
            NETWORK_PASSPHRASE
        );

        const result = await server.submitTransaction(signedTransaction as any);

        console.log('✅ Vote submitted!');
        return result.hash;
    } catch (error) {
        console.error('Error submitting vote:', error);
        throw error;
    }
}

/**
 * Get arbitrator stats
 */
export async function getArbitratorStats(address: string): Promise<{
    balance: string;
    stakedAmount: string;
    votingPower: number;
}> {
    try {
        const account = await server.loadAccount(address);
        const balance = account.balances.find((b) => b.asset_type === 'native');
        const balanceAmount = balance && balance.asset_type === 'native' ? balance.balance : '0';

        // Get staked amount from localStorage (in production, use database)
        const stakedAmount = localStorage.getItem(`arbitrator_stake_${address}`) || '0';
        const votingPower = Math.floor(parseFloat(stakedAmount) / 10);

        return {
            balance: balanceAmount,
            stakedAmount,
            votingPower,
        };
    } catch (error) {
        console.error('Error getting arbitrator stats:', error);
        return { balance: '0', stakedAmount: '0', votingPower: 0 };
    }
}
