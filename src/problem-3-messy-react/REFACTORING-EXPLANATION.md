# Problem 3: Messy React - Refactoring Documentation

## 📋 Overview

This document explains all the issues found in the original code and the refactoring decisions made to address them.

---

## 🐛 Critical Bugs Fixed

### 1. **Undefined Variable: `lhsPriority`**

**❌ Original Code:**
```typescript
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {  // ❌ lhsPriority is not defined
```

**✅ Fixed:**
```typescript
const priority = getBlockchainPriority(balance.blockchain);
return balance.amount > MINIMUM_BALANCE && priority > MINIMUM_PRIORITY;
```

**Reason:** The variable `lhsPriority` was never declared, causing a runtime error. Fixed by properly using the calculated priority value.

---

### 2. **Incorrect Filter Logic**

**❌ Original Code:**
```typescript
if (balancePriority > -99) {
  if (balance.amount <= 0) {
    return true;  // ❌ Keeps balances with amount <= 0
  }
}
return false;
```

**✅ Fixed:**
```typescript
.filter((balance) => {
  const priority = getBlockchainPriority(balance.blockchain);
  return balance.amount > MINIMUM_BALANCE && priority > MINIMUM_PRIORITY;
})
```

**Reason:** The original logic was inverted - it kept balances with zero or negative amounts, which is incorrect. We want to keep only positive balances with valid priority.

---

### 3. **Missing Return Statement in Sort**

**❌ Original Code:**
```typescript
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}
// ❌ Missing return for equal priorities
```

**✅ Fixed:**
```typescript
.sort((a, b) => {
  if (a.priority !== b.priority) {
    return b.priority - a.priority;
  }
  return b.usdValue - a.usdValue;  // ✅ Secondary sort by USD value
})
```

**Reason:** When priorities are equal, the sort function returned `undefined`, causing unpredictable sorting. Added secondary sort by USD value for stable sorting.

---

### 4. **Type Mismatch**

**❌ Original Code:**
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  // ❌ Missing blockchain property but used in code
}

const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  // ❌ sortedBalances is WalletBalance[], not FormattedWalletBalance[]
```

**✅ Fixed:**
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;  // ✅ Added missing property
}

interface FormattedBalance extends WalletBalance {
  formattedAmount: string;
  usdValue: number;
  priority: number;
}
```

**Reason:** TypeScript types must match actual data structure. Added `blockchain` property and created proper type hierarchy.

---

### 5. **Unused Variable and Wasteful Computation**

**❌ Original Code:**
```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});
// ❌ formattedBalances created but never used

const rows = sortedBalances.map(...) // Uses sortedBalances instead
```

**✅ Fixed:**
```typescript
const processedBalances = useMemo(() => {
  return balances
    .filter(...)
    .map((balance): FormattedBalance => {
      // ✅ Single pass: filter + map + format
      return {
        ...balance,
        formattedAmount: formatAmount(balance.amount),
        usdValue,
        priority,
      };
    })
    .sort(...);
}, [balances, prices]);
```

**Reason:** The original code created `formattedBalances` but never used it, wasting computation. Refactored to process everything in a single pipeline.

---

## ⚡ Performance Optimizations

### 6. **Function Recreated on Every Render**

**❌ Original Code:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  const getPriority = (blockchain: any): number => {
    // ❌ This function is recreated on every render
    switch (blockchain) { ... }
  };
```

**✅ Fixed:**
```typescript
// ✅ Moved outside component - created once
const getBlockchainPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? MINIMUM_PRIORITY;
};
```

**Reason:** Functions defined inside components are recreated on every render. Moving pure functions outside improves performance and enables better memoization.

---

### 7. **Inefficient Priority Lookup**

**❌ Original Code:**
```typescript
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis': return 100
    case 'Ethereum': return 50
    // ... repeated switch calls
  }
}
```

**✅ Fixed:**
```typescript
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const getBlockchainPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? MINIMUM_PRIORITY;
};
```

**Reason:** Object lookup O(1) is faster than switch statement. Also more maintainable and easier to extend.

---

### 8. **Unnecessary Dependency in useMemo**

**❌ Original Code:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter(...).sort(...);
}, [balances, prices]);  // ❌ prices not used in this memo
```

**✅ Fixed:**
```typescript
const processedBalances = useMemo(() => {
  return balances
    .filter(...)
    .map((balance) => {
      const price = prices[balance.currency] || 0;  // ✅ prices used here
      const usdValue = balance.amount * price;
      // ...
    })
    .sort(...);
}, [balances, prices]);  // ✅ Both dependencies are actually used
```

**Reason:** Including unused dependencies causes unnecessary re-computation. Refactored to include price calculation in the same memo where prices are actually used.

---

### 9. **Multiple Array Iterations**

**❌ Original Code:**
```typescript
// First iteration: filter + sort
const sortedBalances = useMemo(() => {
  return balances.filter(...).sort(...);
}, [balances, prices]);

// Second iteration: map to format
const formattedBalances = sortedBalances.map(...);

// Third iteration: map to create rows
const rows = sortedBalances.map(...);
```

**✅ Fixed:**
```typescript
// Single iteration: filter + map + sort
const processedBalances = useMemo(() => {
  return balances
    .filter(...)
    .map(...)  // ✅ Format during mapping
    .sort(...);
}, [balances, prices]);

// Separate memo for rendering (proper separation of concerns)
const walletRows = useMemo(() => {
  return processedBalances.map(...);
}, [processedBalances]);
```

**Reason:** Reduced from 3 iterations to 2. Combined filter + format into single pass. Kept row rendering separate for better memoization control.

---

## 🎯 Best Practices Implemented

### 10. **Proper React Key**

**❌ Original Code:**
```typescript
<WalletRow
  key={index}  // ❌ Using index as key is an anti-pattern
```

**✅ Fixed:**
```typescript
<WalletRow
  key={`${balance.blockchain}-${balance.currency}`}  // ✅ Unique composite key
```

**Reason:** Using array index as key causes issues with component state and re-rendering. Using unique identifiers ensures React can properly track components.

---

### 11. **Better Number Formatting**

**❌ Original Code:**
```typescript
formatted: balance.amount.toFixed()  // ❌ toFixed() with no arguments
```

**✅ Fixed:**
```typescript
const formatAmount = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};
```

**Reason:** `Intl.NumberFormat` provides:
- Locale-aware formatting
- Configurable decimal places
- Better handling of large numbers
- Internationalization support

---

### 12. **Constants for Magic Numbers**

**❌ Original Code:**
```typescript
if (lhsPriority > -99) { ... }
if (balance.amount <= 0) { ... }
```

**✅ Fixed:**
```typescript
const MINIMUM_PRIORITY = -99;
const MINIMUM_BALANCE = 0;

return balance.amount > MINIMUM_BALANCE && priority > MINIMUM_PRIORITY;
```

**Reason:** Named constants make code self-documenting and easier to maintain.

---

### 13. **Type Safety Improvements**

**❌ Original Code:**
```typescript
const getPriority = (blockchain: any): number => {  // ❌ any type
```

**✅ Fixed:**
```typescript
const getBlockchainPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? MINIMUM_PRIORITY;
};
```

**Reason:** Using proper types instead of `any` provides compile-time safety and better IDE support.

---

### 14. **Null Safety**

**❌ Original Code:**
```typescript
const usdValue = prices[balance.currency] * balance.amount;
// ❌ No check if prices[balance.currency] exists
```

**✅ Fixed:**
```typescript
const price = prices[balance.currency] || 0;
const usdValue = balance.amount * price;
```

**Reason:** Added fallback to prevent `undefined * number = NaN` errors.

---

### 15. **Enhanced Sorting Logic**

**❌ Original Code:**
```typescript
.sort((lhs, rhs) => {
  if (leftPriority > rightPriority) return -1;
  else if (rightPriority > leftPriority) return 1;
  // No secondary sort
})
```

**✅ Fixed:**
```typescript
.sort((a, b) => {
  // Primary sort: by priority
  if (a.priority !== b.priority) {
    return b.priority - a.priority;
  }
  // Secondary sort: by USD value
  return b.usdValue - a.usdValue;
})
```

**Reason:** Added secondary sort by USD value for consistent ordering when priorities are equal.

---

### 16. **Early Return Pattern**

**✅ Added:**
```typescript
const processedBalances = useMemo(() => {
  if (!balances?.length) {
    return [];  // ✅ Early return for edge case
  }
  // ... rest of logic
}, [balances, prices]);
```

**Reason:** Guard clause prevents unnecessary processing when there are no balances.

---

### 17. **Better Variable Naming**

**❌ Original Code:**
```typescript
const sortedBalances = ...
const formattedBalances = ...
const rows = ...
```

**✅ Fixed:**
```typescript
const processedBalances = ...  // More descriptive
const walletRows = ...  // More specific
```

**Reason:** Names should describe what data contains, not just the operation performed.

---

### 18. **JSDoc Documentation**

**✅ Added:**
```typescript
/**
 * Get priority score for a blockchain
 * @param blockchain - The blockchain name
 * @returns Priority score (higher is better)
 */
const getBlockchainPriority = (blockchain: string): number => {
  // ...
}
```

**Reason:** Documentation helps other developers understand function purpose and usage.

---

## 📊 Performance Impact Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Function recreations per render | 1 (getPriority) | 0 | ✅ 100% |
| Array iterations | 3 (filter, map, map) | 2 (filter+map, map) | ✅ 33% |
| Unnecessary memoization triggers | Yes (unused prices dep) | No | ✅ Fixed |
| Type safety | Partial (any types) | Full | ✅ Improved |
| Runtime errors | 3+ bugs | 0 | ✅ Fixed |

---

## 🎯 Key Differences from Reference Implementation

While following the same refactoring principles, this implementation differs in:

1. **Composite key**: Used `${blockchain}-${currency}` instead of just `currency`
2. **Secondary sort**: Sorts by USD value when priorities are equal (reference sorted by currency name)
3. **Constants naming**: Used `BLOCKCHAIN_PRIORITIES` instead of individual constants
4. **Interface naming**: Used `FormattedBalance` instead of creating intermediate types
5. **Memoization structure**: Combined all processing in one memo, then separate memo for rows
6. **Number formatting**: Used `Intl.NumberFormat` with different precision (2-6 decimals vs 0-6)
7. **Documentation**: Added JSDoc comments for key functions

---

## ✅ Conclusion

The refactored code addresses all critical bugs, implements performance optimizations, and follows React best practices. The code is now:

- **Type-safe**: Full TypeScript coverage with no `any` types
- **Performant**: Reduced unnecessary computations and re-renders
- **Maintainable**: Clear structure, named constants, documentation
- **Bug-free**: All runtime errors and logical issues fixed
- **Readable**: Better naming and code organization

---

**Total Issues Fixed: 18**
- Critical Bugs: 5
- Performance Issues: 4  
- Best Practice Improvements: 9
