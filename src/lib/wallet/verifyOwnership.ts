// Define Ethereum provider interface
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export async function verifyOwnership(address: string): Promise<boolean> {
  const message = `Verify ownership for Insight Flow at ${new Date().toISOString()}`
  
  try {
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found");
    }
    
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });

    // In production, validate via backend. For now, mock success:
    return signature.length > 0;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
} 