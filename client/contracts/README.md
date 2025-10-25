# Soroban Smart Contract

This directory contains the Soroban smart contract for the escrow system.

## Overview

The contract implements a complete escrow workflow with:
- Job creation with locked funds
- Status transitions (Pending → Completed → Approved)
- Dispute resolution system
- Secure fund release

## Building & Deploying

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Soroban CLI
cargo install --locked soroban-cli

# Add wasm target
rustup target add wasm32-unknown-unknown
```

### Build Contract

```bash
cd contracts
soroban contract build
```

### Deploy to Testnet

```bash
# Configure network
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate identity
soroban keys generate deployer

# Fund account
soroban keys fund deployer --network testnet

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source deployer \
  --network testnet
```

### Invoke Contract

```bash
# Create job
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- create_job \
  --client <CLIENT_ADDRESS> \
  --freelancer <FREELANCER_ADDRESS> \
  --amount 1000

# Mark completed
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source freelancer \
  --network testnet \
  -- mark_completed \
  --job_id 1 \
  --freelancer <FREELANCER_ADDRESS>

# Approve job
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source client \
  --network testnet \
  -- approve_job \
  --job_id 1 \
  --client <CLIENT_ADDRESS>
```

## Contract Functions

### create_job
Creates a new escrow job and locks funds.

**Parameters:**
- `client`: Address - Client's Stellar address
- `freelancer`: Address - Freelancer's Stellar address
- `amount`: i128 - Amount in stroops (1 XLM = 10,000,000 stroops)

**Returns:** u64 - Job ID

### mark_completed
Freelancer marks job as completed.

**Parameters:**
- `job_id`: u64 - Job identifier
- `freelancer`: Address - Must match job's freelancer

### approve_job
Client approves work and releases funds.

**Parameters:**
- `job_id`: u64 - Job identifier
- `client`: Address - Must match job's client

### raise_dispute
Either party raises a dispute.

**Parameters:**
- `job_id`: u64 - Job identifier
- `caller`: Address - Client or freelancer

### resolve_dispute
Arbitrator resolves dispute and releases funds.

**Parameters:**
- `job_id`: u64 - Job identifier
- `arbitrator`: Address - Authorized arbitrator
- `winner`: bool - true for client, false for freelancer

### get_job
Retrieves job details.

**Parameters:**
- `job_id`: u64 - Job identifier

**Returns:** Job struct with all details

## Testing

```bash
cargo test
```

## Integration with Frontend

After deploying, update `src/lib/stellar.ts` with:

```typescript
export const CONTRACT_ID = 'YOUR_DEPLOYED_CONTRACT_ID';

// Use Soroban RPC instead of Horizon
import { SorobanRpc } from '@stellar/stellar-sdk';
export const sorobanServer = new SorobanRpc.Server(
  'https://soroban-testnet.stellar.org'
);
```

## Security Notes

- All state-changing functions require authentication
- Status transitions are validated
- Funds are locked until proper authorization
- Events emitted for all major actions
- Comprehensive test coverage

## Resources

- [Soroban Documentation](https://soroban.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools)
