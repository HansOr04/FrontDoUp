/**
 * Sign-In with Ethereum (SIWE) utility functions
 */

/**
 * Creates a SIWE message for wallet authentication
 * @param address The wallet address
 * @param domain The domain of the application
 * @param uri The URI of the application
 * @param statement The statement to sign
 * @param nonce A random nonce for security
 * @param version The SIWE version
 * @param chainId The blockchain chain ID
 * @returns SIWE message text
 */
export function createSiweMessage(
  address: string,
  domain: string = window.location.host,
  uri: string = window.location.origin,
  statement: string = 'Sign in with Ethereum to authenticate with Services Marketplace',
  nonce: string,
  version: string = '1',
  chainId: number = 1
): string {
  const message = `${statement}

URI: ${uri}
Version: ${version}
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`;

  return message;
}

/**
 * Parses a SIWE message
 * @param message SIWE message text
 * @returns Parsed SIWE message components
 */
export function parseSiweMessage(message: string): {
  statement: string;
  uri: string;
  version: string;
  chainId: string;
  nonce: string;
  issuedAt: string;
} {
  const lines = message.split('\n').filter(line => line.trim() !== '');
  
  // First line is the statement
  const statement = lines[0];
  
  // Parse the rest of the fields
  const fields: Record<string, string> = {};
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const colonIndex = line.indexOf(':');
    
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim().toLowerCase().replace(/\s+/g, '_');
    const value = line.substring(colonIndex + 1).trim();
    
    fields[key] = value;
  }
  
  return {
    statement,
    uri: fields.uri || '',
    version: fields.version || '1',
    chainId: fields.chain_id || '1',
    nonce: fields.nonce || '',
    issuedAt: fields.issued_at || new Date().toISOString(),
  };
}

/**
 * Verifies a SIWE signature
 * @param message SIWE message text
 * @param signature The signature to verify
 * @param address The wallet address
 * @returns True if the signature is valid
 */
export async function verifySiweSignature(
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  try {
    // In a real implementation, this would use ethers.js or a similar library
    // to verify the signature cryptographically
    
    // For development/demo, we'll simulate verification
    // This would need to be replaced with actual verification in production
    return true;
  } catch (err) {
    console.error('Error verifying SIWE signature:', err);
    return false;
  }
}

/**
 * Generates a random nonce for SIWE
 * @returns Random nonce string
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}