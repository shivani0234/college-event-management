/**
 * Generate a unique avatar URL based on a name
 * Uses DiceBear API for avatar generation
 */
export function generateAvatarUrl(name: string, size: number = 56): string {
  if (!name) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=default&size=${size}`;
  }

  // Create a seed from the name
  const seed = encodeURIComponent(name.toLowerCase().replace(/\s+/g, '_'));
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&size=${size}`;
}
