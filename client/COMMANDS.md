# Useful Commands Reference

## Development Commands

### Start Development Server
```bash
npm run dev
```
Access at: http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## Stellar Network Commands

### Check Account Balance
```bash
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY"
```

### Fund Testnet Account
```bash
curl "https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY"
```

### View Transaction History
```bash
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY/transactions?limit=10&order=desc"
```

### View Account Operations
```bash
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY/operations?limit=10&order=desc"
```

### Check Transaction Status
```bash
curl "https://horizon-testnet.stellar.org/transactions/TRANSACTION_HASH"
```

## Stellar CLI Commands (Soroban)

### Install Stellar CLI
```bash
cargo install --locked soroban-cli
```

### Configure Testnet
```bash
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Generate Identity
```bash
soroban keys generate deployer
```

### Get Public Key
```bash
soroban keys address deployer
```

### Fund Account
```bash
soroban keys fund deployer --network testnet
```

### Build Contract
```bash
cd contracts
soroban contract build
```

### Deploy Contract
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/escrow.wasm \
  --source deployer \
  --network testnet
```

### Invoke Contract Function
```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- function_name \
  --arg1 value1 \
  --arg2 value2
```

## Git Commands

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: Stellar Escrow dApp"
```

### Create GitHub Repository
```bash
gh repo create stellar-escrow --public --source=. --remote=origin
git push -u origin main
```

### Commit Changes
```bash
git add .
git commit -m "feat: add new feature"
git push
```

## Deployment Commands

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Database Commands (Future)

### PostgreSQL Setup
```bash
# Create database
createdb stellar_escrow

# Run migrations
npm run migrate

# Seed database
npm run seed
```

## Docker Commands (Future)

### Build Image
```bash
docker build -t stellar-escrow .
```

### Run Container
```bash
docker run -p 3000:3000 stellar-escrow
```

### Docker Compose
```bash
docker-compose up -d
```

## Testing Commands

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- src/lib/stellar.test.ts
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

## Debugging Commands

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Remove node_modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check for Outdated Packages
```bash
npm outdated
```

### Update Packages
```bash
npm update
```

### Audit Dependencies
```bash
npm audit
npm audit fix
```

## Browser Commands

### Clear LocalStorage (Console)
```javascript
localStorage.clear()
```

### View Jobs in LocalStorage (Console)
```javascript
JSON.parse(localStorage.getItem('jobs'))
```

### Check Wallet Connection (Console)
```javascript
await window.freighter.isConnected()
```

## Stellar Laboratory URLs

### Account Creator
```
https://laboratory.stellar.org/#account-creator?network=test
```

### Transaction Builder
```
https://laboratory.stellar.org/#txbuilder?network=test
```

### XDR Viewer
```
https://laboratory.stellar.org/#xdr-viewer
```

### Explore Endpoints
```
https://laboratory.stellar.org/#explorer?network=test
```

## Stellar Expert URLs

### View Account
```
https://stellar.expert/explorer/testnet/account/YOUR_PUBLIC_KEY
```

### View Transaction
```
https://stellar.expert/explorer/testnet/tx/TRANSACTION_HASH
```

## Environment Setup

### Create .env.local
```bash
cat > .env.local << EOF
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
EOF
```

### Load Environment Variables
```bash
source .env.local
```

## Performance Commands

### Analyze Bundle Size
```bash
npm run build
npx @next/bundle-analyzer
```

### Lighthouse Audit
```bash
npx lighthouse http://localhost:3000 --view
```

### Check Build Size
```bash
npm run build
du -sh .next
```

## Maintenance Commands

### Update Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

### Update Stellar SDK
```bash
npm install @stellar/stellar-sdk@latest
```

### Update All Dependencies
```bash
npx npm-check-updates -u
npm install
```

## Backup Commands

### Backup LocalStorage Data
```javascript
// In browser console
const backup = localStorage.getItem('jobs');
console.log(backup);
// Copy and save to file
```

### Restore LocalStorage Data
```javascript
// In browser console
const data = 'YOUR_BACKUP_DATA';
localStorage.setItem('jobs', data);
```

## Monitoring Commands

### Check Application Logs (Vercel)
```bash
vercel logs
```

### Monitor Network Requests
```bash
# In browser DevTools
# Network tab → Filter by XHR
```

### Check Stellar Network Status
```bash
curl https://horizon-testnet.stellar.org/
```

## Quick Setup Script

```bash
#!/bin/bash
# setup.sh - Quick setup script

echo "Installing dependencies..."
npm install

echo "Creating .env.local..."
cat > .env.local << EOF
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
EOF

echo "Starting development server..."
npm run dev
```

Make executable:
```bash
chmod +x setup.sh
./setup.sh
```

## Troubleshooting Commands

### Fix Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev
```

### Fix TypeScript Errors
```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild
rm -rf .next
npm run build
```

### Fix Wallet Connection Issues
```javascript
// In browser console
// Check if Freighter is installed
console.log(window.freighter);

// Check connection
await window.freighter.isConnected();

// Get address
await window.freighter.getAddress();
```

## Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
# Stellar Escrow aliases
alias escrow-dev='cd ~/stellar-escrow && npm run dev'
alias escrow-build='cd ~/stellar-escrow && npm run build'
alias escrow-deploy='cd ~/stellar-escrow && vercel --prod'
alias stellar-fund='curl "https://friendbot.stellar.org?addr=$1"'
alias stellar-balance='curl "https://horizon-testnet.stellar.org/accounts/$1"'
```

## Documentation Commands

### Generate API Docs
```bash
npx typedoc --out docs src
```

### Serve Documentation
```bash
npx serve docs
```

## CI/CD Commands

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## Quick Reference

### Most Used Commands
```bash
npm run dev          # Start development
npm run build        # Build for production
npm run lint         # Check code quality
git add . && git commit -m "message" && git push  # Commit changes
vercel --prod        # Deploy to production
```

### Emergency Commands
```bash
rm -rf node_modules .next && npm install  # Nuclear option
npm cache clean --force                    # Clear cache
git reset --hard HEAD                      # Discard changes
```

## Help Commands

### Get Help
```bash
npm run --help       # npm scripts help
next --help          # Next.js help
soroban --help       # Soroban CLI help
vercel --help        # Vercel CLI help
```

### Check Documentation
```bash
# Open documentation in browser
open https://nextjs.org/docs
open https://developers.stellar.org
open https://docs.freighter.app
```
