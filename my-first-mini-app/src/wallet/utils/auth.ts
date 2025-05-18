/**
 * Authentication-related utility functions
 */

/**
 * Checks if an authentication token is valid
 * @param token The token to verify
 * @returns True if the token is valid
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    // Send a request to the backend to verify the token
    const response = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    return response.ok;
  } catch (err) {
    console.error('Error verifying token:', err);
    return false;
  }
}

/**
 * Gets the current user from cookies or local storage
 * @returns User object or null if not authenticated
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') {
    return null; // Server-side
  }
  
  // Try to get user from local storage
  const userJson = localStorage.getItem('user');
  
  if (!userJson) {
    return null;
  }
  
  try {
    return JSON.parse(userJson);
  } catch (err) {
    console.error('Error parsing user from local storage:', err);
    return null;
  }
}

/**
 * Stores user data in local storage
 * @param user User data to store
 */
export function saveUserToStorage(user: any) {
  if (typeof window === 'undefined') {
    return; // Server-side
  }
  
  if (!user) {
    localStorage.removeItem('user');
    return;
  }
  
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clears all authentication data from storage
 */
export function clearAuthData() {
  if (typeof window === 'undefined') {
    return; // Server-side
  }
  
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Clear any additional auth-related data
  // ...
}

/**
 * Formats a wallet address for display
 * @param address Full wallet address
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatWalletAddress(
  address: string | null | undefined,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}