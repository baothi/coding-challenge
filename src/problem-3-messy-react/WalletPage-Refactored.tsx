import React, { useMemo, useCallback } from 'react';

// Type declarations
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;

type BoxProps = React.HTMLAttributes<HTMLDivElement>;

// Interfaces
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedBalance extends WalletBalance {
  formattedAmount: string;
  usdValue: number;
  priority: number;
}

interface Props extends BoxProps {}

// Components
declare const WalletRow: React.FC<{
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}>;

declare const classes: { row?: string };

// Constants - Priority mapping for different blockchains
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const;

const MINIMUM_PRIORITY = -99;
const MINIMUM_BALANCE = 0;

/**
 * Get priority score for a blockchain
 * @param blockchain - The blockchain name
 * @returns Priority score (higher is better)
 */
const getBlockchainPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? MINIMUM_PRIORITY;
};

/**
 * Format number with proper decimal places
 * @param value - Number to format
 * @returns Formatted string
 */
const formatAmount = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};

/**
 * WalletPage Component
 * Displays user's wallet balances sorted by blockchain priority
 */
export const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoized filtering, sorting, and formatting logic
  const processedBalances = useMemo(() => {
    // Early return for empty balances
    if (!balances?.length) {
      return [];
    }

    return (
      balances
        // Filter: Keep only positive balances with valid priority
        .filter((balance) => {
          const priority = getBlockchainPriority(balance.blockchain);
          return balance.amount > MINIMUM_BALANCE && priority > MINIMUM_PRIORITY;
        })
        // Map: Add formatted amount, USD value, and priority
        .map((balance): FormattedBalance => {
          const price = prices[balance.currency] || 0;
          const usdValue = balance.amount * price;
          const priority = getBlockchainPriority(balance.blockchain);

          return {
            ...balance,
            formattedAmount: formatAmount(balance.amount),
            usdValue,
            priority,
          };
        })
        // Sort: By priority (descending), then by USD value (descending)
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          return b.usdValue - a.usdValue;
        })
    );
  }, [balances, prices]);

  // Memoized row rendering
  const walletRows = useMemo(() => {
    return processedBalances.map((balance) => (
      <WalletRow
        key={`${balance.blockchain}-${balance.currency}`}
        className={classes.row}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formattedAmount}
      />
    ));
  }, [processedBalances]);

  return <div {...rest}>{walletRows}</div>;
};

export default WalletPage;
