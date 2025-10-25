// Utility functions

import { JobStatus } from './stellar';

/**
 * Truncate Stellar address for display
 */
export function truncateAddress(address: string, chars = 8): string {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Validate Stellar address format
 */
export function isValidStellarAddress(address: string): boolean {
    return /^G[A-Z0-9]{55}$/.test(address);
}

/**
 * Format XLM amount with proper decimals
 */
export function formatXLM(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 7,
    });
}

/**
 * Convert stroops to XLM
 */
export function stroopsToXLM(stroops: number): number {
    return stroops / 10000000;
}

/**
 * Convert XLM to stroops
 */
export function xlmToStroops(xlm: number): number {
    return Math.floor(xlm * 10000000);
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: JobStatus): string {
    const colors = {
        [JobStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        [JobStatus.COMPLETED]: 'bg-blue-100 text-blue-800 border-blue-200',
        [JobStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
        [JobStatus.DISPUTED]: 'bg-red-100 text-red-800 border-red-200',
        [JobStatus.RESOLVED]: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

/**
 * Generate unique job ID
 */
export function generateJobId(): string {
    return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if user can perform action on job
 */
export function canPerformAction(
    userAddress: string,
    jobClientAddress: string,
    jobFreelancerAddress: string,
    action: 'complete' | 'approve' | 'dispute'
): boolean {
    switch (action) {
        case 'complete':
            return userAddress === jobFreelancerAddress;
        case 'approve':
            return userAddress === jobClientAddress;
        case 'dispute':
            return userAddress === jobClientAddress || userAddress === jobFreelancerAddress;
        default:
            return false;
    }
}

/**
 * Get Stellar Expert link for address
 */
export function getStellarExpertLink(address: string, network = 'testnet'): string {
    return `https://stellar.expert/explorer/${network}/account/${address}`;
}

/**
 * Get Stellar Expert link for transaction
 */
export function getStellarExpertTxLink(txHash: string, network = 'testnet'): string {
    return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
}

/**
 * Validate job amount
 */
export function isValidAmount(amount: string): boolean {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 1000000;
}

/**
 * Calculate escrow fee (example: 1% platform fee)
 */
export function calculateFee(amount: number, feePercent = 1): number {
    return (amount * feePercent) / 100;
}

/**
 * Get time ago string
 */
export function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}
