import { VerificationLevel } from '../hooks/useVerification';

/**
 * Mapping of verification levels to their priority
 */
export const VERIFICATION_LEVELS = {
  DEVICE: 'device' as VerificationLevel,
  PHONE: 'phone' as VerificationLevel,
  ORB: 'orb' as VerificationLevel,
};

/**
 * Priority of verification levels (higher number = higher verification)
 */
export const VERIFICATION_LEVEL_PRIORITY = {
  [VERIFICATION_LEVELS.DEVICE]: 1,
  [VERIFICATION_LEVELS.PHONE]: 2,
  [VERIFICATION_LEVELS.ORB]: 3,
};

/**
 * Display names for verification levels
 */
export const VERIFICATION_LEVEL_NAMES = {
  [VERIFICATION_LEVELS.DEVICE]: 'Device',
  [VERIFICATION_LEVELS.PHONE]: 'Phone',
  [VERIFICATION_LEVELS.ORB]: 'Orb',
};

/**
 * Check if a verification level meets a required level
 * @param currentLevel The user's current verification level
 * @param requiredLevel The required verification level
 * @returns True if the current level meets or exceeds the required level
 */
export function hasRequiredVerificationLevel(
  currentLevel: VerificationLevel | null | undefined,
  requiredLevel: VerificationLevel = VERIFICATION_LEVELS.DEVICE
): boolean {
  if (!currentLevel) return false;
  
  return VERIFICATION_LEVEL_PRIORITY[currentLevel] >= VERIFICATION_LEVEL_PRIORITY[requiredLevel];
}

/**
 * Get a display name for a verification level
 * @param level The verification level
 * @returns Display name for the level
 */
export function getVerificationLevelName(
  level: VerificationLevel | null | undefined
): string {
  if (!level) return 'None';
  return VERIFICATION_LEVEL_NAMES[level] || 'Unknown';
}

/**
 * Get the next higher verification level
 * @param currentLevel The current verification level
 * @returns The next higher level, or null if already at the highest level
 */
export function getNextVerificationLevel(
  currentLevel: VerificationLevel | null | undefined
): VerificationLevel | null {
  if (!currentLevel) return VERIFICATION_LEVELS.DEVICE;
  
  const currentPriority = VERIFICATION_LEVEL_PRIORITY[currentLevel];
  
  // Find the next level with higher priority
  const nextLevel = Object.entries(VERIFICATION_LEVEL_PRIORITY)
    .find(([_, priority]) => priority === currentPriority + 1);
  
  return nextLevel ? nextLevel[0] as VerificationLevel : null;
}