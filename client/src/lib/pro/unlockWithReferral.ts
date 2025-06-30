export async function unlockWithReferral(referralCode: string): Promise<boolean> {
  // Example: extract hash from referralCode and match last 4 chars
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(referralCode));
  const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hex.endsWith("b3f2"); // replace with actual logic
} 