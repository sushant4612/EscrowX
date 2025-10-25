import {
    isConnected,
    getAddress,
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

        // Now get the address
        const result = await getAddress();
        console.log('Wallet connection result:', result);

        if (result.error) {
            console.error('Wallet connection error:', result.error);
            alert(`Wallet connection failed: ${result.error}\n\nPlease make sure:\n1. Freighter is unlocked\n2. You have an account created\n3. You approve the connection request`);
            return null;
        }

        if (!result.address || result.address === '') {
            console.error('No address returned from wallet');
            alert('No address returned from wallet.\n\nPlease:\n1. Open Freighter extension\n2. Make sure you have an account created\n3. Make sure the account is unlocked\n4. Try connecting again');
            return null;
        }

        console.log('Successfully connected to wallet:', result.address);
        return result.address;
    } catch (error) {
        console.error('Wallet connection error:', error);
        alert(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure Freighter is installed and unlocked.`);
        return null;
    }
}

export async function signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    try {
        const result = await freighterSignTransaction(xdr, {
            networkPassphrase,
        });
        if (result.error) {
            throw new Error(result.error);
        }
        return result.signedTxXdr;
    } catch (error) {
        console.error('Transaction signing error:', error);
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
