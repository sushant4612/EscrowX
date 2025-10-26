# Freighter API Fix

## Issue
Error: `getAddress is not a function`

The Freighter API v2.0.0 changed the function name from `getAddress()` to `getPublicKey()`.

## Root Cause
The code was using the old API:
```typescript
import { getAddress } from '@stellar/freighter-api';
const result = await getAddress();
```

But Freighter API v2.0.0 uses:
```typescript
import { getPublicKey } from '@stellar/freighter-api';
const publicKey = await getPublicKey();
```

## Changes Made

### src/lib/wallet.ts

**Before:**
```typescript
import { getAddress } from '@stellar/freighter-api';

const result = await getAddress();
if (result.error) { ... }
if (!result.address) { ... }
return result.address;
```

**After:**
```typescript
import { getPublicKey } from '@stellar/freighter-api';

const publicKey = await getPublicKey();
if (!publicKey || publicKey === '') { ... }
return publicKey;
```

## Key Differences in API v2.0.0

1. **Function name changed:**
   - Old: `getAddress()`
   - New: `getPublicKey()`

2. **Return value changed:**
   - Old: Returns object `{ address: string, error?: string }`
   - New: Returns string directly (the public key)

3. **Error handling:**
   - Old: Check `result.error`
   - New: Throws exception or returns empty string

## Testing
After this fix, clicking "Connect Freighter Wallet" should:
1. ✅ Request permission from Freighter
2. ✅ Get the public key
3. ✅ Connect successfully
4. ✅ Display wallet address and balance

## Note
If you still get errors, make sure:
- Freighter extension is installed
- Freighter is unlocked
- You have at least one account created in Freighter
- You approve the connection request when prompted
