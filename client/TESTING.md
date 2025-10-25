# Testing Guide

## Manual Testing Checklist

### Wallet Integration

- [ ] **Connect Wallet**
  - Click "Connect Wallet" button
  - Freighter popup appears
  - Approve connection
  - Wallet address displays correctly
  - Green status indicator shows

- [ ] **Disconnect Wallet**
  - Click "Disconnect" button
  - Wallet address disappears
  - UI shows "Connect Wallet" again

- [ ] **Wallet Not Installed**
  - Test in browser without Freighter
  - Warning message displays
  - Link to Freighter website works

- [ ] **Wrong Network**
  - Switch Freighter to mainnet
  - Transactions should fail gracefully
  - Error message guides user to testnet

### Job Creation

- [ ] **Valid Job Creation**
  - Fill all fields correctly
  - Click "Create Job & Lock Funds"
  - Success message appears
  - Job appears in "My Jobs"
  - Status is PENDING

- [ ] **Invalid Freelancer Address**
  - Enter invalid address (too short, wrong format)
  - Form validation prevents submission
  - Error message displays

- [ ] **Invalid Amount**
  - Enter negative amount
  - Enter zero
  - Enter non-numeric value
  - Form validation catches errors

- [ ] **Empty Description**
  - Leave description blank
  - Form requires description

- [ ] **Insufficient Balance**
  - Try to create job with amount > balance
  - Transaction fails
  - Error message explains issue

### Job Workflow

- [ ] **Freelancer Marks Complete**
  - Connect as freelancer
  - See assigned job
  - Click "Mark Completed"
  - Status changes to COMPLETED
  - Button disappears

- [ ] **Client Approves**
  - Connect as client
  - See completed job
  - Click "Approve & Release Funds"
  - Status changes to APPROVED
  - Success message shows

- [ ] **Unauthorized Actions**
  - Try to mark complete as client (should fail)
  - Try to approve as freelancer (should fail)
  - Buttons should not appear for wrong role

### Dispute System

- [ ] **Raise Dispute as Client**
  - Create job
  - Freelancer marks complete
  - Client clicks "Raise Dispute"
  - Status changes to DISPUTED
  - Job appears in Disputes tab

- [ ] **Raise Dispute as Freelancer**
  - Create job
  - Freelancer clicks "Raise Dispute"
  - Status changes to DISPUTED

- [ ] **Arbitrator Voting**
  - Go to Disputes tab
  - Click vote for client (Arbitrator 1)
  - Click vote for client (Arbitrator 2)
  - After 2 votes, dispute resolves
  - Status changes to RESOLVED

- [ ] **Cannot Dispute Approved Job**
  - Approved job should not show dispute button
  - Dispute button disabled or hidden

### Transaction History

- [ ] **View History**
  - Create multiple jobs
  - Go to History tab
  - All jobs display in table
  - Correct dates, amounts, statuses

- [ ] **Filter by Role**
  - Jobs show correct role (Client/Freelancer)
  - Amounts display correctly

- [ ] **Empty State**
  - New wallet with no jobs
  - "No transactions yet" message shows

### Dashboard

- [ ] **Job Statistics**
  - Create jobs in different states
  - Status counters update correctly
  - Colors match status types

- [ ] **Client Jobs Section**
  - Shows only jobs where user is client
  - Correct action buttons appear

- [ ] **Freelancer Jobs Section**
  - Shows only jobs where user is freelancer
  - Correct action buttons appear

- [ ] **Empty State**
  - No jobs message displays
  - Helpful text guides user

### UI/UX

- [ ] **Responsive Design**
  - Test on mobile (375px)
  - Test on tablet (768px)
  - Test on desktop (1920px)
  - All elements visible and usable

- [ ] **Status Colors**
  - PENDING: Yellow
  - COMPLETED: Blue
  - APPROVED: Green
  - DISPUTED: Red
  - RESOLVED: Purple

- [ ] **Loading States**
  - Buttons show loading during transactions
  - Disabled state prevents double-clicks

- [ ] **Error Messages**
  - Clear, helpful error messages
  - No technical jargon
  - Actionable guidance

### Data Persistence

- [ ] **LocalStorage**
  - Create jobs
  - Refresh page
  - Jobs still appear
  - Status preserved

- [ ] **Multiple Wallets**
  - Connect wallet A, create job
  - Disconnect, connect wallet B
  - Wallet B sees only their jobs
  - Wallet A jobs not visible

- [ ] **Clear Data**
  - Clear browser data
  - Jobs disappear
  - No errors on empty state

## Automated Testing

### Unit Tests (Future)

```bash
npm test
```

Test files to create:
- `src/lib/stellar.test.ts` - Stellar SDK functions
- `src/lib/wallet.test.ts` - Wallet integration
- `src/lib/utils.test.ts` - Utility functions
- `src/contexts/JobContext.test.tsx` - Job state management

### Integration Tests (Future)

```bash
npm run test:integration
```

Test scenarios:
- Complete job workflow (create → complete → approve)
- Dispute workflow (create → dispute → resolve)
- Multi-user scenarios
- Error handling

### E2E Tests (Future)

```bash
npm run test:e2e
```

Using Playwright or Cypress:
- Full user journey
- Wallet connection flow
- Transaction signing
- Multi-wallet scenarios

## Performance Testing

### Load Testing

- [ ] **Multiple Jobs**
  - Create 50+ jobs
  - Check rendering performance
  - Verify no lag in UI

- [ ] **Large Amounts**
  - Test with large XLM amounts
  - Verify number formatting
  - Check calculation accuracy

### Network Testing

- [ ] **Slow Connection**
  - Throttle network to 3G
  - Verify loading states
  - Check timeout handling

- [ ] **Offline Mode**
  - Disconnect internet
  - Verify error messages
  - Check graceful degradation

## Security Testing

### Input Validation

- [ ] **XSS Prevention**
  - Try entering `<script>alert('xss')</script>` in description
  - Should be escaped/sanitized

- [ ] **SQL Injection** (N/A - no SQL)
  - Not applicable for this app

- [ ] **Address Validation**
  - Try invalid Stellar addresses
  - Verify rejection

### Authorization

- [ ] **Role-based Actions**
  - Verify only client can approve
  - Verify only freelancer can mark complete
  - Verify both can dispute

- [ ] **Wallet Switching**
  - Switch wallets mid-session
  - Verify permissions update
  - No unauthorized access

### Transaction Security

- [ ] **Double-spending**
  - Try to approve same job twice
  - Should prevent duplicate transactions

- [ ] **Replay Attacks**
  - Transaction should have unique sequence
  - Cannot replay old transactions

## Browser Compatibility

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Brave (latest)
- [ ] Edge (latest)

## Stellar Network Testing

### Testnet Verification

```bash
# Check account exists
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY"

# Check transactions
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY/transactions"

# Check operations
curl "https://horizon-testnet.stellar.org/accounts/YOUR_PUBLIC_KEY/operations"
```

### Transaction Verification

- [ ] **Job Creation Transaction**
  - Verify on Stellar Expert
  - Check amount transferred
  - Verify memo/metadata

- [ ] **Fund Release Transaction**
  - Verify recipient received funds
  - Check correct amount
  - Verify transaction hash

## Regression Testing

After any code changes, verify:

- [ ] Existing jobs still load
- [ ] Wallet connection still works
- [ ] All buttons functional
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds

## Bug Reporting Template

```markdown
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: 
- Wallet: 
- Network: 
- Account Balance: 

**Screenshots:**
[If applicable]

**Console Errors:**
[Copy any errors from browser console]
```

## Test Data

### Sample Addresses (Testnet)

```
Client: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Freelancer: GYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
Arbitrator 1: GZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
Arbitrator 2: GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Arbitrator 3: GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
```

### Sample Job Data

```json
{
  "description": "Build responsive landing page with React",
  "amount": "100",
  "freelancer": "GYYYYYY..."
}
```

## Continuous Testing

### Pre-commit Checks

```bash
npm run lint
npm run type-check
npm run build
```

### Pre-deployment Checks

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build succeeds
- [ ] Manual smoke test completed

## Known Issues

Document any known issues here:

1. **Issue**: [Description]
   - **Workaround**: [Temporary solution]
   - **Status**: [In progress/Fixed/Won't fix]

## Testing Tools

- **Browser DevTools**: Inspect network, console, storage
- **Stellar Laboratory**: Verify transactions
- **Stellar Expert**: View account details
- **Freighter Wallet**: Test wallet integration
- **Postman**: Test Horizon API endpoints

## Success Criteria

All tests pass when:
- ✅ No console errors
- ✅ All features functional
- ✅ Responsive on all devices
- ✅ Transactions succeed on testnet
- ✅ Data persists correctly
- ✅ Error handling works
- ✅ Security checks pass
