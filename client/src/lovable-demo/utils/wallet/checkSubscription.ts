export async function checkSubscription(address: string): Promise<boolean> {
  try {
    // Convert the address to a SHA-256 hash
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256", 
      new TextEncoder().encode(address)
    );
    
    // Convert the hash buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    
    // Mock check: In production, this would validate against a database
    // For now, consider addresses ending with "abc" as subscribed
    return hex.endsWith("abc");
  } catch (error) {
    console.error("Subscription check error:", error);
    return false;
  }
} 