// Application constants

export const APP_NAME = 'Stellar Escrow';
export const APP_DESCRIPTION = 'Decentralized freelance marketplace on Stellar';

// Minimum XLM required for operations
export const MIN_BALANCE = 2.5;
export const BASE_RESERVE = 0.5;

// Transaction timeouts (seconds)
export const TX_TIMEOUT = 180;

// Job limits
export const MAX_JOB_DESCRIPTION_LENGTH = 500;
export const MIN_JOB_AMOUNT = 1;
export const MAX_JOB_AMOUNT = 1000000;

// Dispute resolution
export const REQUIRED_ARBITRATOR_VOTES = 2;
export const TOTAL_ARBITRATORS = 3;

// Status colors
export const STATUS_COLORS = {
    PENDING: 'yellow',
    COMPLETED: 'blue',
    APPROVED: 'green',
    DISPUTED: 'red',
    RESOLVED: 'purple',
} as const;

// Network endpoints
export const STELLAR_EXPERT_URL = 'https://stellar.expert/explorer/testnet';
export const STELLAR_LABORATORY_URL = 'https://laboratory.stellar.org';

// Wallet
export const FREIGHTER_DOWNLOAD_URL = 'https://www.freighter.app/';

// Error messages
export const ERROR_MESSAGES = {
    WALLET_NOT_INSTALLED: 'Please install Freighter Wallet to continue',
    WALLET_NOT_CONNECTED: 'Please connect your wallet first',
    INSUFFICIENT_BALANCE: 'Insufficient XLM balance',
    INVALID_ADDRESS: 'Invalid Stellar address',
    TRANSACTION_FAILED: 'Transaction failed. Please try again',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    JOB_NOT_FOUND: 'Job not found',
    INVALID_STATUS: 'Invalid job status for this action',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
    JOB_CREATED: 'Job created successfully! Funds locked in escrow.',
    JOB_COMPLETED: 'Job marked as completed. Waiting for client approval.',
    JOB_APPROVED: 'Job approved! Funds released to freelancer.',
    DISPUTE_RAISED: 'Dispute raised. Waiting for arbitrator decision.',
    DISPUTE_RESOLVED: 'Dispute resolved. Funds have been distributed.',
} as const;
