# Hackathon Demo Script

## Preparation (Before Demo)

### Setup
- [ ] 2 browser profiles or incognito windows
- [ ] Client wallet connected in Window 1
- [ ] Freelancer wallet connected in Window 2
- [ ] Both accounts funded with testnet XLM
- [ ] Application running on localhost:3000
- [ ] Stellar Laboratory open in separate tab

### Test Accounts
```
Client: GXXXXXXX... (100 XLM)
Freelancer: GYYYYYY... (50 XLM)
Arbitrator 1: GZZZZZ... (10 XLM)
Arbitrator 2: GAAAAAA... (10 XLM)
Arbitrator 3: GBBBBBB... (10 XLM)
```

## Demo Flow (5-7 minutes)

### Introduction (30 seconds)
"Hi, I'm presenting Stellar Escrow - a decentralized freelance marketplace built on Stellar blockchain. It solves the trust problem between clients and freelancers by using smart contracts to hold funds in escrow until work is completed."

### Part 1: Platform Overview (1 minute)

**Show Dashboard**
- "Here's our main dashboard with 4 tabs"
- "My Jobs - view all your active jobs"
- "Create Job - clients create new escrow jobs"
- "History - transaction log"
- "Disputes - DAO voting for conflict resolution"

**Show Wallet Connection**
- "We use Freighter Wallet for Stellar integration"
- "Currently connected as the client"
- Show connected address

### Part 2: Create Job (1.5 minutes)

**Navigate to Create Job**
- "Let's create a new freelance job"
- Enter freelancer address: `[Copy from Window 2]`
- Amount: `50 XLM`
- Description: "Design and develop landing page with responsive layout"
- Click "Create Job & Lock Funds"

**Show Job Created**
- "Job created! Funds are now locked in escrow"
- Navigate to "My Jobs"
- Show job card with PENDING status
- Point out: Client address, Freelancer address, Amount, Status

**Show Transaction**
- Open Stellar Laboratory
- Show transaction on blockchain
- "This is immutable and transparent"

### Part 3: Freelancer Workflow (1.5 minutes)

**Switch to Window 2 (Freelancer)**
- "Now I'm the freelancer"
- Show connected wallet address
- Navigate to "My Jobs"
- "I can see the job assigned to me"

**Mark Completed**
- "Work is done, let me mark it complete"
- Click "Mark Completed"
- Status changes to COMPLETED
- "Now waiting for client approval"

### Part 4: Client Approval (1 minute)

**Switch back to Window 1 (Client)**
- Refresh "My Jobs"
- "Job status is now COMPLETED"
- "I can review the work and approve"
- Click "Approve & Release Funds"
- Status changes to APPROVED
- Alert: "Funds released to freelancer!"

**Show Transaction History**
- Navigate to "History" tab
- Show transaction log
- Point out: Date, Job ID, Type, Amount, Status

### Part 5: Dispute Resolution (1.5 minutes)

**Create Second Job**
- Quick create another job (30 XLM)
- Freelancer marks complete
- Client raises dispute instead of approving

**Show Dispute System**
- Navigate to "Disputes" tab
- "This is our DAO voting system"
- "3 arbitrators vote on who should receive funds"
- Click votes: Arbitrator 1 → Freelancer
- Click votes: Arbitrator 2 → Freelancer
- "Majority reached! Funds released to freelancer"
- Status changes to RESOLVED

### Closing (30 seconds)

**Key Features Recap**
- "To summarize, we have:"
  - ✅ Wallet integration with Freighter
  - ✅ Escrow creation with locked funds
  - ✅ Job status tracking
  - ✅ Client approval workflow
  - ✅ DAO-based dispute resolution
  - ✅ On-chain transaction history

**Technical Highlights**
- "Built with Next.js, TypeScript, Stellar SDK"
- "Smart contract ready (Soroban)"
- "Deployed on Stellar Testnet"
- "Production-ready architecture"

**Future Roadmap**
- "Next steps: Deploy Soroban contract, add milestone payments, reputation system, and mobile app"

## Q&A Preparation

### Expected Questions

**Q: How do you prevent double-spending?**
A: Each job creates a unique escrow account. Funds can only be released once through authorized transactions.

**Q: What if both parties disagree?**
A: Our DAO voting system with 3 arbitrators resolves disputes. Majority vote determines fund distribution.

**Q: Why Stellar over Ethereum?**
A: Lower fees (fraction of a cent), faster transactions (3-5 seconds), and built-in escrow features.

**Q: Is this production-ready?**
A: Core functionality yes. We're adding Soroban smart contracts for enhanced security and automation.

**Q: How do you handle gas fees?**
A: Stellar fees are minimal (~0.00001 XLM per transaction). We can sponsor fees for users in production.

**Q: What about privacy?**
A: All transactions are on public blockchain. We can add private channels for sensitive job details.

## Backup Demos

### If Live Demo Fails

**Option 1: Video Recording**
- Have pre-recorded demo ready
- Walk through while video plays

**Option 2: Screenshots**
- Prepared slides with screenshots
- Explain each step

**Option 3: Code Walkthrough**
- Show smart contract code
- Explain architecture
- Demo local version

## Technical Details (If Asked)

### Architecture
```
Frontend (Next.js) 
    ↓
Freighter Wallet API
    ↓
Stellar SDK
    ↓
Horizon API (Testnet)
    ↓
Stellar Blockchain
```

### Smart Contract States
```
PENDING → COMPLETED → APPROVED
    ↓
DISPUTED → RESOLVED
```

### Security Features
- Wallet authentication required
- State transition validation
- Multi-signature support
- Immutable transaction log
- No private key exposure

## Post-Demo

### Share Resources
- GitHub repository
- Live demo link
- Documentation
- Stellar testnet explorer links

### Collect Feedback
- Judge questions
- Technical suggestions
- Feature requests
- Partnership opportunities

## Time Management

- 0:00-0:30 - Introduction
- 0:30-1:30 - Platform overview
- 1:30-3:00 - Create job demo
- 3:00-4:30 - Freelancer workflow
- 4:30-5:30 - Client approval
- 5:30-7:00 - Dispute resolution
- 7:00+ - Q&A

**Total: 7 minutes + Q&A**

## Success Metrics

- [ ] All features demonstrated
- [ ] No technical errors
- [ ] Clear value proposition
- [ ] Judges understand workflow
- [ ] Questions answered confidently
- [ ] Contact information shared
