// /lib/vault/compareVersions.ts

type Version = { timestamp: string; rules: string[]; checklist: string[] };

export function compareVersions(oldVersion: Version, newVersion: Version): string {
  const ruleDiff = newVersion.rules.filter((r) => !oldVersion.rules.includes(r));
  const checkDiff = newVersion.checklist.filter((c) => !oldVersion.checklist.includes(c));

  return [
    ruleDiff.length ? `➕ Rules added: ${ruleDiff.join(", ")}` : "",
    checkDiff.length ? `✅ Checklist changes: ${checkDiff.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
} 