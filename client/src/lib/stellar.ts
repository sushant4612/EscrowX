import * as StellarSdk from '@stellar/stellar-sdk';

export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export enum JobStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    APPROVED = 'APPROVED',
    DISPUTED = 'DISPUTED',
    RESOLVED = 'RESOLVED'
}

export interface Job {
    id: string;
    client: string;
    freelancer: string;
    amount: string;
    description: string;
    status: JobStatus;
    createdAt: number;
    escrowAccount?: string;
}

export async function createEscrowAccount(
    sourcePublicKey: string,
    sourceSecretKey: string,
    amount: string
): Promise<{ publicKey: string; secretKey: string }> {
    const escrowKeypair = StellarSdk.Keypair.random();
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);

    const sourceAccount = await server.loadAccount(sourcePublicKey);

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
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

    transaction.sign(sourceKeypair);
    await server.submitTransaction(transaction);

    return {
        publicKey: escrowKeypair.publicKey(),
        secretKey: escrowKeypair.secret(),
    };
}

export async function releaseEscrowFunds(
    escrowPublicKey: string,
    escrowSecretKey: string,
    destinationPublicKey: string
): Promise<void> {
    const escrowKeypair = StellarSdk.Keypair.fromSecret(escrowSecretKey);
    const escrowAccount = await server.loadAccount(escrowPublicKey);

    const balance = escrowAccount.balances.find(
        (b) => b.asset_type === 'native'
    );

    if (!balance || balance.asset_type !== 'native') {
        throw new Error('No XLM balance found');
    }

    const amount = (parseFloat(balance.balance) - 2.5).toFixed(7);

    const transaction = new StellarSdk.TransactionBuilder(escrowAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(
            StellarSdk.Operation.payment({
                destination: destinationPublicKey,
                asset: StellarSdk.Asset.native(),
                amount: amount,
            })
        )
        .setTimeout(180)
        .build();

    transaction.sign(escrowKeypair);
    await server.submitTransaction(transaction);
}

export async function getAccountBalance(publicKey: string): Promise<string> {
    try {
        const account = await server.loadAccount(publicKey);
        const balance = account.balances.find((b) => b.asset_type === 'native');
        return balance && balance.asset_type === 'native' ? balance.balance : '0';
    } catch (error) {
        return '0';
    }
}
