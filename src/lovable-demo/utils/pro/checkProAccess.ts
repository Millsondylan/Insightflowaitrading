export async function checkProAccess(code: string): Promise<boolean> {
  const valid = ["ALPHA2025", "FLOWVIP", "TRADERX"];
  return valid.includes(code.toUpperCase());
} 