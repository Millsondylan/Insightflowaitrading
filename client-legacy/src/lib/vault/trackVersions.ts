// /lib/vault/trackVersions.ts

type Version = { timestamp: string; rules: string[]; checklist: string[] };

export function trackVersions(
  prev: Version[],
  current: Version
): Version[] {
  return [...prev, current].slice(-5); // Keep last 5
} 