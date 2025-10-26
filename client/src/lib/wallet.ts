import {
    isConnected,
    getPublicKey,
    requestAccess,
    setAllowed,
    signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';

export async function connectWallet(): Promise<string | null> {
    try {
        console.log('Attempting to connect wallet...');

        // First, request access/permission
        try {
            console.log('Requesting wallet access...');
            await requestAccess();
            console.log('Access granted');
        } catch (accessError) {
            console.log('requestAccess not available or failed, trying setAllowed...');
            try {
                await setAllowed();
            } catch (setAllowedError) {
                console.log('setAllowed also failed, continuing anyway...');
            }
        }

        // Now get the public key
        const publicKey = await getPublicKey();
        console.log('Wallet connection result:', publicKey);

        if (!publicKey || publicKey === '') {
            console.error('No public key returned from wallet');
            alert('No address returned from wallet.\n\nPlease:\n1. Open Freighter extension\n2. Make sure you have an account created\n3. Make sure the account is unlocked\n4. Try connecting again');
            return null;
        }

        console.log('Successfully connected to wallet:', publicKey);
        return publicKey;
    } catch (error) {
        console.error('Wallet connection error:', error);
        alert(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure Freighter is installed and unlocked.`);
        return null;
    }
}

export async function signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    try {
        console.log('🔏 Signing transaction...');
        const result = await freighterSignTransaction(xdr, {
            networkPassphrase,
        });

        console.log('🔏 Sign result:', result);

        if (!result) {
            throw new Error('No result from Freighter');
        }

        // Result is the signed XDR string directly
        if (typeof result === 'string') {
            console.log('✅ Transaction signed successfully');
            return result;
        }

        throw new Error('Unexpected result format from Freighter');
    } catch (error) {
        console.error('❌ Transaction signing error:', error);
        throw error;
    }
}

export async function isWalletInstalled(): Promise<boolean> {
    try {
        console.log('Checking if wallet is installed...');
        const connected = await isConnected();
        console.log('Wallet installed:', connected);
        return connected;
    } catch (error) {
        console.error('Error checking wallet installation:', error);
        return false;
    }
}
