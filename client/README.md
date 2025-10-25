# Stellar Escrow - Decentralized Freelance Marketplace

A blockchain-based escrow platform for freelance work built on Stellar network with smart contract integration.

## Features

### Core Functionality
- **Wallet Integration**: Connect via Freighter Wallet
- **Escrow Creation**: Clients create jobs and lock funds
- **Job Management**: Track job status (Pending → Completed → Approved)
- **Dispute Resolution**: DAO-style voting system with 3 arbitrators
- **Transaction History**: View all on-chain transactions
- **Multi-role Dashboard**: Separate views for clients and freelancers

### Job States
- `PENDING`: Job created, waiting for freelancer to complete
- `COMPLETED`: Freelancer marked as done, waiting for client approval
- `APPROVED`: Client approved, funds released to freelancer
- `DISPUTED`: Dispute raised, waiting for arbitrator decision
- `RESOLVED`: Dispute resolved, funds distributed

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Stellar SDK, Freighter Wallet API
- **Network**: Stellar Testnet

## Prerequisites

1. **Freighter Wallet**: Install from [freighter.app](https://www.freighter.app/)
2. **Testnet Account**: Create account and fund with testnet XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
3. **Node.js**: v18 or higher

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage Guide

### For Clients

1. **Connect Wallet**: Click "Connect Wallet" and approve in Freighter
2. **Create Job**: 
   - Navigate to "Create Job" tab
   - Enter freelancer's Stellar address
   - Set amount in XLM
   - Add job description
   - Click "Create Job & Lock Funds"
3. **Approve Work**: When freelancer marks job complete, review and approve to release funds
4. **Raise Dispute**: If work is unsatisfactory, raise a dispute for arbitrator review

### For Freelancers

1. **Connect Wallet**: Use your Stellar address provided by client
2. **View Jobs**: See all jobs assigned to you in "My Jobs"
3. **Mark Complete**: When work is done, click "Mark Completed"
4. **Receive Funds**: Funds automatically released when client approves
5. **Raise Dispute**: If client doesn't approve, raise dispute

### For Arbitrators

1. Navigate to "Disputes" tab
2. Review disputed jobs
3. Vote for client or freelancer
4. Majority (2/3) wins and receives funds

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── WalletConnect.tsx   # Wallet connection UI
│   ├── CreateJobForm.tsx   # Job creation form
│   ├── JobList.tsx         # Job listing dashboard
│   ├── JobCard.tsx         # Individual job card
│   ├── TransactionHistory.tsx  # Transaction log
│   └── DisputeResolution.tsx   # DAO voting interface
├── contexts/
│   ├── WalletContext.tsx   # Wallet state management
│   └── JobContext.tsx      # Job state management
└── lib/
    ├── stellar.ts          # Stellar SDK utilities
    └── wallet.ts           # Freighter integration
```

## Smart Contract Logic

The escrow system uses Stellar's native account system:

1. **Escrow Account Creation**: New account created for each job
2. **Fund Locking**: Client deposits XLM to escrow account
3. **Multi-signature**: Requires both parties or arbitrator to release
4. **Automatic Release**: On approval, funds transfer to freelancer

### Example Stellar Transaction Flow

```typescript
// 1. Create escrow account
const escrowKeypair = Keypair.random();
const transaction = new TransactionBuilder(sourceAccount)
  .addOperation(Operation.createAccount({
    destination: escrowKeypair.publicKey(),
    startingBalance: amount,
  }))
  .build();

// 2. Release funds on approval
const releaseTransaction = new TransactionBuilder(escrowAccount)
  .addOperation(Operation.payment({
    destination: freelancerPublicKey,
    asset: Asset.native(),
    amount: escrowBalance,
  }))
  .build();
```

## Security Considerations

- **Wallet Validation**: All addresses validated before transactions
- **State Transitions**: Only authorized roles can change job status
- **Double-spending Prevention**: Escrow accounts prevent duplicate withdrawals
- **Dispute Locking**: Funds locked until arbitrator resolution
- **No Private Keys**: Never expose or store private keys in frontend

## Demo Flow for Hackathon

1. **Setup**: 2 wallets (client + freelancer) + 3 arbitrator wallets
2. **Job Creation**: Client creates job with 100 XLM
3. **Work Completion**: Freelancer marks complete
4. **Approval**: Client approves, funds released
5. **Dispute Demo**: Create second job, raise dispute, show voting

## Network Configuration

Currently configured for **Stellar Testnet**:
- Horizon URL: `https://horizon-testnet.stellar.org`
- Network Passphrase: `Test SDF Network ; September 2015`

To switch to mainnet, update `src/lib/stellar.ts`:
```typescript
export const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;
export const HORIZON_URL = 'https://horizon.stellar.org';
```

## Troubleshooting

### Wallet Not Connecting
- Ensure Freighter is installed and unlocked
- Check you're on Stellar Testnet in Freighter settings
- Refresh page and try again

### Transaction Failures
- Verify sufficient XLM balance (minimum 2.5 XLM for account creation)
- Check network connection
- Ensure correct network (testnet vs mainnet)

### Jobs Not Appearing
- Check localStorage is enabled
- Verify wallet address matches job participant
- Clear browser cache and reconnect wallet

## Future Enhancements

- [ ] On-chain smart contract deployment (Soroban)
- [ ] NFT receipts for completed work
- [ ] Milestone-based payments
- [ ] Reputation system
- [ ] Multi-currency support
- [ ] Mobile app with WalletConnect
- [ ] Automated dispute resolution with AI
- [ ] Integration with freelance platforms

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)

## License

MIT License - Built for Stellar Hackathon
