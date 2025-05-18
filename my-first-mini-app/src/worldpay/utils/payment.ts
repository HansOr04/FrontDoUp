/**
 * Payment-related utility functions
 */

/**
 * Transaction statuses from backend
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  MINED: 'mined',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

/**
 * Format a currency amount with proper decimal places
 * @param amount The amount to format
 * @param token The token symbol
 * @param decimals The number of decimal places to show
 * @returns Formatted amount string
 */
export function formatAmount(amount: number, token: string = 'WLD', decimals: number = 2): string {
  // Handle different tokens with different decimal place conventions
  let decimalPlaces = decimals;
  
  switch (token.toUpperCase()) {
    case 'WLD':
      decimalPlaces = 2;
      break;
    case 'USDC':
    case 'USDT':
    case 'USDC.E':
      decimalPlaces = 2;
      break;
    case 'ETH':
      decimalPlaces = 4;
      break;
    default:
      decimalPlaces = 2;
  }
  
  return `${amount.toFixed(decimalPlaces)} ${token}`;
}

/**
 * Calculate the time remaining until a date
 * @param expirationDate The date when something expires
 * @returns Object with days, hours, minutes remaining
 */
export function calculateTimeRemaining(expirationDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const now = new Date();
  const expiry = new Date(expirationDate);
  
  // Check if already expired
  if (expiry <= now) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      expired: true
    };
  }
  
  // Calculate difference in milliseconds
  const diffMs = expiry.getTime() - now.getTime();
  
  // Convert to days, hours, minutes
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    days,
    hours,
    minutes,
    expired: false
  };
}

/**
 * Format a date in a human-readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  // Format options
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString(undefined, options);
}

/**
 * Get CSS classes for a transaction status
 * @param status Transaction status
 * @returns CSS class string
 */
export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case TRANSACTION_STATUS.COMPLETED:
      return 'bg-green-100 text-green-800';
    case TRANSACTION_STATUS.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case TRANSACTION_STATUS.MINED:
      return 'bg-blue-100 text-blue-800';
    case TRANSACTION_STATUS.FAILED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}