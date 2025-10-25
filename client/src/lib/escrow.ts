import * as StellarSdk from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from './stellar';
import { signTransaction } from './wallet';

/**
 * Create a real escrow account on Stellar testnet
 * This actually deducts XLM from the client's account
 */
export async function createRealEscrow(
    clientPublicKey: string,
    amount: string
): Promise<{ escrowPublicKey: string; escrowSecret: string }> {
    try {
        // Generate new keypair for escrow account
        const escrowKeypair = StellarSdk.Keypair.random();

        console.log('Creating escrow account...');
        console.log('Escrow address:', escrowKeypair.publicKey());

        // Load client account
        const clientAccount = await server.loadAccount(clientPublicKey);

        // Build transaction to create escrow account
        const transaction = new StellarSdk.TransactionBuilder(clientAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                StellarSdk.Operation.createAccount({
                    destination: escrowKeypair.publicKey(),
                    startingBalance: amount,
                })
            )
            .setTimeout(180)
            .build();

        // Get transaction XDR for signing
        const xdr = transaction.toXDR();

        console.log('📤 Requesting signature from Freighter...');
        // Sign with Freighter
        const signedXdr = await signTransaction(xdr, NETWORK_PASSPHRASE);

        if (!signedXdr) {
            throw new Error('Failed to sign transaction');
        }

        console.log('📥 Transaction signed, submitting to network...');
        // Submit to network
        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
            signedXdr,
            NETWORK_PASSPHRASE
        );

        const result = await server.submitTransaction(signedTransaction as any);

        console.log('✅ Escrow account created!');
        console.log('Transaction hash:', result.hash);
        console.log(`${amount} XLM deducted from client account`);

        return {
            escrowPublicKey: escrowKeypair.publicKey(),
            escrowSecret: escrowKeypair.secret(),
        };
    } catch (error: any) {
        console.error('❌ Error creating escrow:', error);
        const errorMsg = error?.message || error?.toString() || 'Unknown error';
        throw new Error(`Escrow creation failed: ${errorMsg}`);
    }
}

/**
 * Release funds from escrow to freelancer
 */
export async function releaseEscrowFunds(
    escrowPublicKey: string,
    escrowSecret: string,
    freelancerPublicKey: string
): Promise<string> {
    try {
        console.log('💰 Releasing funds from escrow...');
        console.log('Escrow:', escrowPublicKey);
        console.log('Freelancer:', freelancerPublicKey);

        // Validate freelancer account exists
        try {
            await server.loadAccount(freelancerPublicKey);
            console.log('✅ Freelancer account exists');
        } catch (error) {
            throw new Error(`Freelancer account not found: ${freelancerPublicKey}. The account must be activated on Stellar before receiving funds.`);
        }

        const escrowKeypair = StellarSdk.Keypair.fromSecret(escrowSecret);
        const escrowAccount = await server.loadAccount(escrowPublicKey);

        // Get balance
        const balance = escrowAccount.balances.find(
            (b) => b.asset_type === 'native'
        );

        if (!balance || balance.asset_type !== 'native') {
            throw new Error('No XLM balance found in escrow');
        }

        // Calculate amount to send (leave 1 XLM for fees and minimum balance)
        const amount = (parseFloat(balance.balance) - 1.5).toFixed(7);

        if (parseFloat(amount) <= 0) {
            throw new Error('Insufficient balance in escrow');
        }

        // Build payment transaction
        const transaction = new StellarSdk.TransactionBuilder(escrowAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                StellarSdk.Operation.payment({
                    destination: freelancerPublicKey,
                    asset: StellarSdk.Asset.native(),
                    amount: amount,
                })
            )
            .setTimeout(180)
            .build();

        // Sign with escrow key
        transaction.sign(escrowKeypair);

        // Submit
        console.log('📡 Submitting payment transaction...');
        const result = await server.submitTransaction(transaction);

        console.log('✅ Funds released!');
        console.log('Transaction hash:', result.hash);
        console.log(`${amount} XLM sent to freelancer`);

        return result.hash;
    } catch (error: any) {
        console.error('❌ Error releasing funds:', error);
        const errorMsg = error?.message || error?.toString() || 'Unknown error';
        throw new Error(`Fund release failed: ${errorMsg}`);
    }
}

/**
 * Check escrow account balance
 */
export async function getEscrowBalance(escrowPublicKey: string): Promise<string> {
    try {
        const account = await server.loadAccount(escrowPublicKey);
        const balance = account.balances.find((b) => b.asset_type === 'native');
        return balance && balance.asset_type === 'native' ? balance.balance : '0';
    } catch (error) {
        console.error('Error getting escrow balance:', error);
        return '0';
    }
}
