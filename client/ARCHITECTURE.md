# Architecture Documentation

## System Overview

Stellar Escrow is a decentralized application (dApp) that facilitates trustless freelance transactions using the Stellar blockchain network. The system eliminates the need for centralized intermediaries by using smart contracts and blockchain-based escrow accounts.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Job Manager │  │   Disputes   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Context Providers (State Management)        │   │
│  │  - WalletContext  - JobContext                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Freighter Wallet API                      │
│  - Wallet Connection  - Transaction Signing                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Stellar SDK                             │
│  - Transaction Building  - Account Management                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Horizon API (Testnet)                      │
│  - Submit Transactions  - Query Accounts                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Stellar Blockchain                         │
│  - Immutable Ledger  - Consensus Protocol                    │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer

#### 1. Pages (`src/app/`)
- **page.tsx**: Main dashboard with tab navigation
- **layout.tsx**: Root layout with context providers

#### 2. Components (`src/components/`)
- **WalletConnect**: Handles Freighter wallet connection
- **CreateJobForm**: Form for creating new escrow jobs
- **JobList**: Displays all jobs for current user
- **JobCard**: Individual job display with actions
- **TransactionHistory**: Transaction log viewer
- **DisputeResolution**: DAO voting interface

#### 3. Contexts (`src/contexts/`)
- **WalletContext**: Manages wallet connection state
- **JobContext**: Manages job data and operations

#### 4. Libraries (`src/lib/`)
- **stellar.ts**: Stellar SDK utilities and blockchain operations
- **wallet.ts**: Freighter wallet integration
- **utils.ts**: Helper functions
- **constants.ts**: Application constants

## Data Flow

### Job Creation Flow

```
User Input → CreateJobForm
    ↓
Validate Input (utils.ts)
    ↓
Create Job Object (JobContext)
    ↓
Store in LocalStorage
    ↓
[Future] Create Escrow Account (stellar.ts)
    ↓
[Future] Submit Transaction (Horizon API)
    ↓
[Future] Update Job with Escrow Address
    ↓
Display in JobList
```

### Job Completion Flow

```
Freelancer Clicks "Mark Completed"
    ↓
Verify Authorization (JobCard)
    ↓
Update Job Status (JobContext)
    ↓
Persist to LocalStorage
    ↓
Notify Client (UI Update)
```

### Approval Flow

```
Client Clicks "Approve"
    ↓
Verify Authorization (JobCard)
    ↓
[Future] Build Payment Transaction (stellar.ts)
    ↓
[Future] Sign with Freighter (wallet.ts)
    ↓
[Future] Submit to Horizon
    ↓
Update Job Status to APPROVED
    ↓
Display Success Message
```

## State Management

### Wallet State
```typescript
{
  publicKey: string | null,
  isConnected: boolean,
  isInstalled: boolean
}
```

### Job State
```typescript
{
  jobs: Job[],
  // Job = {
  //   id: string,
  //   client: string,
  //   freelancer: string,
  //   amount: string,
  //   description: string,
  //   status: JobStatus,
  //   createdAt: number,
  //   escrowAccount?: string
  // }
}
```

## Storage Strategy

### LocalStorage
- **Key**: `jobs`
- **Value**: JSON array of Job objects
- **Purpose**: Persist job data across sessions
- **Limitation**: Client-side only, not shared across devices

### Future: On-chain Storage
- Store job metadata in Stellar account data entries
- Use Soroban contract storage for complex state
- Enable cross-device synchronization

## Security Architecture

### Authentication
- Wallet-based authentication (no passwords)
- Public key as user identifier
- Transaction signing proves ownership

### Authorization
- Role-based access control
- Client can: Create jobs, Approve, Dispute
- Freelancer can: Mark complete, Dispute
- Arbitrator can: Vote on disputes

### Transaction Security
- All transactions signed by user's private key
- Private keys never leave Freighter wallet
- Transactions validated by Stellar network
- Immutable transaction history

## Smart Contract Architecture (Future)

### Soroban Contract Structure

```rust
Contract State:
- jobs: Map<u64, Job>
- job_count: u64
- disputes: Map<u64, Dispute>

Functions:
- create_job(client, freelancer, amount) → job_id
- mark_completed(job_id, freelancer)
- approve_job(job_id, client)
- raise_dispute(job_id, caller)
- resolve_dispute(job_id, arbitrator, winner)
- get_job(job_id) → Job
```

### State Transitions

```
PENDING ──mark_completed──> COMPLETED ──approve_job──> APPROVED
   │                            │
   └──raise_dispute──> DISPUTED │
                          │     │
                          └─────┘
                          │
                    resolve_dispute
                          │
                          ▼
                      RESOLVED
```

## Network Architecture

### Testnet Configuration
- **Network**: Stellar Testnet
- **Horizon URL**: https://horizon-testnet.stellar.org
- **Network Passphrase**: "Test SDF Network ; September 2015"
- **Friendbot**: https://friendbot.stellar.org

### Mainnet Configuration (Production)
- **Network**: Stellar Public Network
- **Horizon URL**: https://horizon.stellar.org
- **Network Passphrase**: "Public Global Stellar Network ; September 2015"

## Scalability Considerations

### Current Limitations
- LocalStorage limited to ~5-10MB
- Client-side state management
- No real-time updates
- Single-device data

### Future Improvements
1. **Backend API**
   - Centralized job indexing
   - Real-time notifications
   - Cross-device sync

2. **IPFS Integration**
   - Store job descriptions off-chain
   - Reduce blockchain storage costs
   - Enable file attachments

3. **Subgraph/Indexer**
   - Index blockchain events
   - Fast job queries
   - Historical data analysis

4. **WebSocket Updates**
   - Real-time job status changes
   - Live dispute voting
   - Instant notifications

## Performance Optimization

### Current Optimizations
- React Context for efficient state updates
- LocalStorage for instant data access
- Lazy loading of components
- Optimized bundle size

### Future Optimizations
- Implement pagination for job lists
- Virtual scrolling for large datasets
- Caching strategy for blockchain queries
- Service worker for offline support

## Error Handling

### Levels of Error Handling

1. **Input Validation**
   - Form validation before submission
   - Address format checking
   - Amount range validation

2. **Wallet Errors**
   - Connection failures
   - User rejection
   - Network mismatch

3. **Transaction Errors**
   - Insufficient balance
   - Invalid sequence number
   - Network timeouts

4. **Application Errors**
   - State inconsistencies
   - LocalStorage failures
   - Unexpected exceptions

### Error Recovery Strategies
- Graceful degradation
- User-friendly error messages
- Retry mechanisms
- Fallback options

## Monitoring & Logging

### Client-side Logging
- Console errors for development
- Error boundaries for React components
- Transaction hash logging

### Future: Analytics
- User behavior tracking
- Transaction success rates
- Error frequency monitoring
- Performance metrics

## Deployment Architecture

### Development
```
Local Machine → npm run dev → localhost:3000
```

### Production
```
GitHub → Vercel CI/CD → CDN → Users
```

### Infrastructure
- **Hosting**: Vercel (serverless)
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS
- **Domain**: Custom domain support

## API Integration

### Stellar Horizon API

**Endpoints Used:**
- `GET /accounts/{account_id}` - Get account details
- `POST /transactions` - Submit transactions
- `GET /accounts/{account_id}/transactions` - Transaction history
- `GET /accounts/{account_id}/operations` - Operation history

**Rate Limits:**
- Testnet: Unlimited
- Mainnet: 3600 requests/hour

### Freighter API

**Methods Used:**
- `isConnected()` - Check wallet installation
- `getAddress()` - Get user's public key
- `signTransaction()` - Sign transactions

## Testing Architecture

### Unit Tests
- Component logic testing
- Utility function testing
- State management testing

### Integration Tests
- Wallet connection flow
- Job creation workflow
- Transaction submission

### E2E Tests
- Complete user journeys
- Multi-wallet scenarios
- Error handling paths

## Future Architecture Enhancements

### Phase 1: Smart Contract Deployment
- Deploy Soroban contract to testnet
- Integrate contract calls in frontend
- Migrate from LocalStorage to on-chain storage

### Phase 2: Backend API
- Node.js/Express API server
- PostgreSQL database
- Job indexing and search

### Phase 3: Advanced Features
- Milestone-based payments
- Reputation system
- Dispute arbitration marketplace
- Multi-currency support

### Phase 4: Mobile App
- React Native application
- WalletConnect integration
- Push notifications
- Biometric authentication

## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context API

### Blockchain
- **Network**: Stellar
- **SDK**: @stellar/stellar-sdk
- **Wallet**: Freighter (@stellar/freighter-api)

### Development Tools
- **Package Manager**: npm
- **Linter**: ESLint
- **Type Checker**: TypeScript
- **Build Tool**: Webpack (via Next.js)

## Conclusion

This architecture provides a solid foundation for a decentralized escrow platform. The modular design allows for easy extension and integration of new features. The use of Stellar blockchain ensures security, transparency, and low transaction costs.
