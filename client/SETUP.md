# Quick Setup Guide

## 1. Install Freighter Wallet

1. Go to [freighter.app](https://www.freighter.app/)
2. Install browser extension (Chrome/Firefox/Brave)
3. Create new wallet or import existing
4. **IMPORTANT**: Switch to Testnet in settings

## 2. Fund Your Testnet Account

### Option A: Stellar Laboratory (Recommended)
1. Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
2. Click "Generate keypair"
3. Copy your public key
4. Click "Fund account with Friendbot"
5. Import secret key into Freighter

### Option B: Friendbot API
```bash
curl "https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY"
```

## 3. Create Multiple Test Accounts

For demo purposes, create 5 accounts:
- 1 Client account
- 1 Freelancer account  
- 3 Arbitrator accounts

Repeat the funding process for each account.

## 4. Run the Application

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Demo Walkthrough

### Scenario 1: Successful Job Completion

**As Client:**
1. Connect wallet (Client account)
2. Go to "Create Job" tab
3. Enter:
   - Freelancer address: `[Your freelancer public key]`
   - Amount: `100`
   - Description: "Build landing page"
4. Click "Create Job & Lock Funds"
5. Job appears in "My Jobs" with status PENDING

**As Freelancer:**
1. Disconnect client wallet
2. Connect freelancer wallet
3. Go to "My Jobs" tab
4. See the job assigned to you
5. Click "Mark Completed"
6. Status changes to COMPLETED

**As Client (again):**
1. Switch back to client wallet
2. Go to "My Jobs"
3. See job status is COMPLETED
4. Click "Approve & Release Funds"
5. Status changes to APPROVED
6. Funds released to freelancer

### Scenario 2: Dispute Resolution

**As Client:**
1. Create another job (same process)
2. Wait for freelancer to mark complete

**As Freelancer:**
1. Mark job as completed

**As Client:**
1. Instead of approving, click "Raise Dispute"
2. Status changes to DISPUTED

**As Arbitrators:**
1. Go to "Disputes" tab
2. See disputed job
3. Each arbitrator votes (Client or Freelancer)
4. After 2 votes for same party, dispute resolves
5. Funds released to winner

## 6. Verify Transactions

### Check Balance
```bash
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY"
```

### View Transaction History
```bash
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY/transactions"
```

### Using Stellar Laboratory
1. Visit [Stellar Laboratory](https://laboratory.stellar.org/)
2. Go to "Explore Endpoints"
3. Select "Accounts" → "Single Account"
4. Enter your public key
5. View balance and transaction history

## 7. Common Issues

### "Wallet not installed"
- Install Freighter extension
- Refresh page
- Check extension is enabled

### "Insufficient balance"
- Fund account with Friendbot
- Minimum 2.5 XLM needed for account creation
- Check you're on Testnet

### "Transaction failed"
- Verify network is Testnet in Freighter
- Check account has sufficient balance
- Ensure correct addresses (56 characters, starts with G)

### Jobs not appearing
- Check localStorage is enabled
- Verify wallet address matches job participant
- Try clearing browser cache

## 8. Testing Checklist

- [ ] Wallet connects successfully
- [ ] Create job locks funds
- [ ] Freelancer can mark completed
- [ ] Client can approve and release funds
- [ ] Dispute can be raised
- [ ] Arbitrators can vote
- [ ] Transaction history displays correctly
- [ ] Status badges show correct colors
- [ ] Multiple jobs can be managed simultaneously

## 9. Production Deployment

### Switch to Mainnet
Update `src/lib/stellar.ts`:
```typescript
export const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;
export const HORIZON_URL = 'https://horizon.stellar.org';
```

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables
No environment variables needed for basic functionality.

## 10. Next Steps

- Deploy Soroban smart contract (see `contracts/README.md`)
- Integrate real escrow accounts
- Add email notifications
- Implement reputation system
- Add milestone payments
- Create mobile app

## Support

For issues or questions:
- Check [Stellar Documentation](https://developers.stellar.org/)
- Visit [Stellar Discord](https://discord.gg/stellar)
- Review [Freighter Docs](https://docs.freighter.app/)
