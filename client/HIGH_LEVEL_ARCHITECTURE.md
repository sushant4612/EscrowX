# 🏗️ Stellar Escrow DAO - High-Level Architecture

## 📋 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    STELLAR ESCROW DAO PLATFORM                   │
│                  Decentralized Freelance Marketplace             │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Core Components

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Stellar    │────▶│   Supabase   │
│   (Next.js)  │     │   Network    │     │  (Database)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │                     │
       │                     │                     │
   ┌───▼────┐           ┌───▼────┐           ┌───▼────┐
   │Freighter│          │ Escrow │           │ Dispute│
   │ Wallet  │          │Accounts│           │  Data  │
   └─────────┘          └────────┘           └────────┘
```

## 🏛️ Three-Layer Architecture

### 1️⃣ **Presentation Layer** (Frontend)
```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15 App                        │
├─────────────────────────────────────────────────────────┤
│  Components:                                             │
│  ├─ FreelancerDashboard  (Manage gigs)                  │
│  ├─ ClientDashboard      (Post jobs)                    │
│  ├─ ArbitratorDashboard  (Vote on disputes)             │
│  └─ DisputeResolution    (DAO voting)                   │
├─────────────────────────────────────────────────────────┤
│  UI/UX:                                                  │
│  ├─ Framer Motion        (Animations)                   │
│  ├─ Shadcn UI            (Components)                   │
│  ├─ Tailwind CSS         (Styling)                      │
│  └─ Dark Purple Theme    (Design)                       │
└─────────────────────────────────────────────────────────┘
```

### 2️⃣ **Business Logic Layer** (Client-Side)
```
┌─────────────────────────────────────────────────────────┐
│                   Core Libraries                         │
├─────────────────────────────────────────────────────────┤
│  src/lib/                                                │
│  ├─ stellar.ts      → Stellar SDK integration           │
│  ├─ escrow.ts       → Escrow account management         │
│  ├─ wallet.ts       → Freighter wallet connection       │
│  ├─ dao.ts          → DAO voting logic                  │
│  ├─ storage.ts      → Job data management               │
│  ├─ disputeStorage.ts → Dispute management              │
│  └─ supabase.ts     → Database client                   │
├─────────────────────────────────────────────────────────┤
│  Contexts:                                               │
│  ├─ WalletContext   → Wallet state management           │
│  ├─ JobContext      → Job state management              │
│  └─ DisputeContext  → Dispute state management          │
└─────────────────────────────────────────────────────────┘
```

### 3️⃣ **Data & Blockchain Layer**
```
┌─────────────────────────────────────────────────────────┐
│              Stellar Network (Testnet)                   │
├─────────────────────────────────────────────────────────┤
│  ├─ User Accounts     (Client, Freelancer, Arbitrator)  │
│  ├─ Escrow Accounts   (Temporary accounts holding XLM)  │
│  └─ Transactions      (Payments, account creation)      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Supabase Database                       │
├─────────────────────────────────────────────────────────┤
│  Tables:                                                 │
│  ├─ disputes         (Dispute records & votes)           │
│  └─ escrow_keys      (Escrow secrets for cross-browser) │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Browser Storage                         │
├─────────────────────────────────────────────────────────┤
│  localStorage:                                           │
│  ├─ jobs             (Job listings)                      │
│  ├─ disputes         (Fallback if no Supabase)          │
│  └─ escrow_keys      (Backup escrow secrets)            │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Complete User Flow Diagrams

### 📝 Flow 1: Create Job (Client)

```
┌─────────┐
│ Client  │
│ Wallet  │
└────┬────┘
     │ 1. Connect Wallet
     ▼
┌─────────────────┐
│ ClientDashboard │
└────┬────────────┘
     │ 2. Click "Create Job"
     │    - Enter freelancer address
     │    - Enter amount (XLM)
     │    - Enter description
     ▼
┌─────────────────┐
│ CreateJobSection│
└────┬────────────┘
     │ 3. Submit Form
     ▼
┌─────────────────┐
│ escrow.ts       │
│ createRealEscrow│
└────┬────────────┘
     │ 4. Generate escrow keypair
     │    escrowKeypair = Keypair.random()
     ▼
┌─────────────────┐
│ Build TX        │
│ - CreateAccount │
│ - Fund with XLM │
└────┬────────────┘
     │ 5. Request signature
     ▼
┌─────────────────┐
│ Freighter       │
│ Wallet Popup    │
└────┬────────────┘
     │ 6. User approves
     ▼
┌─────────────────┐
│ Stellar Network │
│ Submit TX       │
└────┬────────────┘
     │ 7. Escrow account created
     │    Funds locked on-chain
     ▼
┌─────────────────┐
│ Store Data      │
│ ├─ Supabase     │ escrow_keys table
│ └─ localStorage │ jobs array
└────┬────────────┘
     │ 8. Job created!
     ▼
┌─────────────────┐
│ Dashboard       │
│ Shows new job   │
└─────────────────┘
```

### ✅ Flow 2: Complete Job (Freelancer)

```
┌─────────────┐
│ Freelancer  │
│ Dashboard   │
└──────┬──────┘
       │ 1. View active job
       │ 2. Click "Mark as Completed"
       ▼
┌──────────────┐
│ Update Status│
│ PENDING →    │
│ COMPLETED    │
└──────┬───────┘
       │ 3. Notify client
       ▼
┌──────────────┐
│ Client       │
│ Dashboard    │
└──────┬───────┘
       │ 4. Review work
       │ 5. Click "Approve & Release Funds"
       ▼
┌──────────────┐
│ escrow.ts    │
│ releaseEscrow│
│ Funds        │
└──────┬───────┘
       │ 6. Retrieve escrow secret
       │    - Try Supabase first
       │    - Fallback to localStorage
       ▼
┌──────────────┐
│ Build Payment│
│ Transaction  │
│ - From: Escrow
│ - To: Freelancer
│ - Amount: Full
└──────┬───────┘
       │ 7. Sign with escrow secret
       │    (No wallet popup needed!)
       ▼
┌──────────────┐
│ Stellar      │
│ Network      │
└──────┬───────┘
       │ 8. Payment executed
       │    Funds transferred
       ▼
┌──────────────┐
│ Update Status│
│ COMPLETED →  │
│ APPROVED     │
└──────────────┘
```

### ⚖️ Flow 3: Dispute Resolution (DAO)

```
┌──────────────┐
│ Client/      │
│ Freelancer   │
└──────┬───────┘
       │ 1. Raise dispute
       │    - Provide evidence
       ▼
┌──────────────┐
│ disputeStorage│
│ .ts          │
│ saveDispute()│
└──────┬───────┘
       │ 2. Store in Supabase
       │    disputes table
       ▼
┌──────────────┐
│ Arbitrator   │
│ Dashboard    │
└──────┬───────┘
       │ 3. View dispute
       │    - Client evidence
       │    - Freelancer evidence
       │    - Job details
       ▼
┌──────────────┐
│ Vote         │
│ - Client     │
│ - Freelancer │
└──────┬───────┘
       │ 4. Submit vote
       ▼
┌──────────────┐
│ addVoteToDispute│
└──────┬───────┘
       │ 5. Store vote
       │    votes array
       ▼
┌──────────────┐
│ Check Votes  │
│ Count >= 3?  │
└──────┬───────┘
       │ 6. YES → Resolve
       ▼
┌──────────────┐
│ Calculate    │
│ Winner       │
│ - Client: 1  │
│ - Freelancer:2│
│ Winner: FL   │
└──────┬───────┘
       │ 7. Release funds to winner
       ▼
┌──────────────┐
│ releaseEscrow│
│ Funds()      │
└──────┬───────┘
       │ 8. Payment to winner
       ▼
┌──────────────┐
│ Update Status│
│ DISPUTED →   │
│ RESOLVED     │
└──────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Wallet Security (Freighter)                         │
│     ├─ Private keys never leave wallet                  │
│     ├─ User approves each transaction                   │
│     └─ Browser extension isolation                      │
│                                                          │
│  2. Escrow Security (Stellar Accounts)                  │
│     ├─ Funds locked in blockchain account               │
│     ├─ Secret key required to release                   │
│     ├─ Stored encrypted in Supabase                     │
│     └─ Backup in localStorage                           │
│                                                          │
│  3. DAO Security (Voting)                               │
│     ├─ 3 votes required to resolve                      │
│     ├─ Arbitrators can't vote on own disputes           │
│     ├─ Majority wins (2 out of 3)                       │
│     └─ Votes stored immutably in Supabase               │
│                                                          │
│  4. Data Security (Supabase)                            │
│     ├─ Row Level Security (RLS) policies                │
│     ├─ API keys in environment variables                │
│     ├─ HTTPS encryption in transit                      │
│     └─ Database encryption at rest                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 💾 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Data Sources                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Stellar Network (Source of Truth)                      │
│  ├─ Account balances                                    │
│  ├─ Transaction history                                 │
│  └─ Escrow account states                               │
│                                                          │
│  Supabase (Persistent Storage)                          │
│  ├─ Disputes & votes                                    │
│  ├─ Escrow secrets (encrypted)                          │
│  └─ Cross-browser sync                                  │
│                                                          │
│  localStorage (Local Cache)                             │
│  ├─ Jobs list                                           │
│  ├─ Escrow secrets (backup)                             │
│  └─ Disputes (fallback)                                 │
│                                                          │
│  React Context (Runtime State)                          │
│  ├─ Wallet connection                                   │
│  ├─ Current jobs                                        │
│  └─ Active disputes                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🌐 Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Network Topology                      │
└─────────────────────────────────────────────────────────┘

        ┌──────────────┐
        │   Browser    │
        │   (Client)   │
        └───────┬──────┘
                │
        ┌───────▼──────────────────────┐
        │   Next.js Frontend           │
        │   (Vercel/Netlify)           │
        └───────┬──────────────────────┘
                │
        ┌───────┴──────────────────────┐
        │                              │
        ▼                              ▼
┌───────────────┐            ┌─────────────────┐
│ Stellar       │            │   Supabase      │
│ Horizon API   │            │   PostgreSQL    │
│ (Testnet)     │            │   (Cloud)       │
└───────┬───────┘            └─────────┬───────┘
        │                              │
        ▼                              ▼
┌───────────────┐            ┌─────────────────┐
│ Stellar Core  │            │  Database       │
│ (Blockchain)  │            │  - disputes     │
│               │            │  - escrow_keys  │
└───────────────┘            └─────────────────┘
```

## 🎭 Actor Roles & Permissions

```
┌─────────────────────────────────────────────────────────┐
│                        Actors                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  👔 CLIENT                                               │
│  ├─ Create jobs                                         │
│  ├─ Fund escrow                                         │
│  ├─ Approve/reject work                                 │
│  ├─ Raise disputes                                      │
│  └─ Release funds to freelancer                         │
│                                                          │
│  💼 FREELANCER                                           │
│  ├─ View available jobs                                 │
│  ├─ Mark work as completed                              │
│  ├─ Raise disputes                                      │
│  └─ Receive payments                                    │
│                                                          │
│  ⚖️ ARBITRATOR (DAO Member)                             │
│  ├─ View disputes                                       │
│  ├─ Review evidence                                     │
│  ├─ Cast votes                                          │
│  ├─ Earn rewards (future)                               │
│  └─ Cannot vote on own disputes                         │
│                                                          │
│  🤖 SYSTEM (Automated)                                   │
│  ├─ Count votes                                         │
│  ├─ Determine winner                                    │
│  ├─ Trigger fund release                                │
│  └─ Update job statuses                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📊 State Machine (Job Lifecycle)

```
┌─────────────────────────────────────────────────────────┐
│                   Job State Machine                      │
└─────────────────────────────────────────────────────────┘

    [START]
       │
       ▼
  ┌─────────┐
  │ PENDING │ ← Job created, funds locked in escrow
  └────┬────┘
       │ Freelancer marks complete
       ▼
  ┌───────────┐
  │ COMPLETED │ ← Waiting for client review
  └─────┬─────┘
        │
    ┌───┴────┐
    │        │
    ▼        ▼
┌─────────┐ ┌──────────┐
│APPROVED │ │ DISPUTED │ ← Client rejects OR Freelancer disputes
└────┬────┘ └─────┬────┘
     │            │
     │            │ DAO votes (3 votes)
     │            ▼
     │      ┌──────────┐
     │      │ RESOLVED │ ← Winner determined
     │      └─────┬────┘
     │            │
     └────────┬───┘
              ▼
         [FUNDS RELEASED]
              │
              ▼
            [END]
```

## 🔧 Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Tech Stack                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Framework                                      │
│  └─ Next.js 15 (React 19, App Router)                   │
│                                                          │
│  Blockchain Integration                                  │
│  ├─ @stellar/stellar-sdk (v12.3.0)                      │
│  ├─ @stellar/freighter-api (v2.0.0)                     │
│  └─ Stellar Testnet (horizon-testnet.stellar.org)       │
│                                                          │
│  UI/UX Libraries                                         │
│  ├─ Tailwind CSS (Styling)                              │
│  ├─ Framer Motion (Animations)                          │
│  ├─ Shadcn UI (Components)                              │
│  └─ Geist Font (Typography)                             │
│                                                          │
│  Database & Storage                                      │
│  ├─ Supabase (PostgreSQL)                               │
│  └─ localStorage (Browser cache)                        │
│                                                          │
│  State Management                                        │
│  ├─ React Context API                                   │
│  └─ React Hooks (useState, useEffect)                   │
│                                                          │
│  Development Tools                                       │
│  ├─ TypeScript                                          │
│  ├─ ESLint                                              │
│  └─ Git                                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Deployment Topology                     │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                    Vercel Edge Network                │
│                  (Global CDN - 70+ regions)           │
├──────────────────────────────────────────────────────┤
│  ├─ Static Assets (JS, CSS, Images)                  │
│  ├─ Server-Side Rendering (SSR)                      │
│  ├─ API Routes (if needed)                           │
│  └─ Automatic HTTPS                                  │
└────────────────┬─────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌───────────────┐  ┌──────────────┐
│ Stellar       │  │  Supabase    │
│ Horizon API   │  │  (US/EU)     │
│ (Global)      │  │              │
└───────────────┘  └──────────────┘
```

## 📈 Scalability Considerations

```
┌─────────────────────────────────────────────────────────┐
│                    Scalability                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Current Limits:                                         │
│  ├─ Stellar: 1000+ TPS (transactions per second)        │
│  ├─ Supabase Free: 500MB database, 2GB bandwidth        │
│  ├─ localStorage: ~5-10MB per domain                    │
│  └─ Vercel Free: 100GB bandwidth/month                  │
│                                                          │
│  Bottlenecks:                                            │
│  ├─ Supabase free tier limits                           │
│  ├─ localStorage size for large job lists               │
│  └─ Client-side state management                        │
│                                                          │
│  Solutions:                                              │
│  ├─ Upgrade Supabase plan ($25/month)                   │
│  ├─ Implement pagination for jobs                       │
│  ├─ Add caching layer (Redis)                           │
│  └─ Move to server-side state management                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Key Design Decisions

1. **No Smart Contract Deployment**
   - Uses Stellar's native account system
   - Simpler than Soroban contracts
   - Lower gas fees

2. **Hybrid Storage**
   - Supabase for cross-browser sync
   - localStorage for offline capability
   - Stellar for source of truth

3. **Client-Side Logic**
   - No backend server needed
   - Direct blockchain interaction
   - Faster user experience

4. **DAO Voting**
   - Simple majority (2/3 votes)
   - Prevents self-voting
   - Automated fund release

5. **Escrow Secret Storage**
   - Dual storage (Supabase + localStorage)
   - Enables cross-browser access
   - Backup redundancy

## 🔮 Future Enhancements

- [ ] Soroban smart contract integration
- [ ] IPFS for evidence storage
- [ ] Reputation system for arbitrators
- [ ] Staking mechanism for DAO
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard

---

**Architecture Version:** 1.0  
**Last Updated:** October 2024  
**Network:** Stellar Testnet  
**Status:** Production Ready ✅
