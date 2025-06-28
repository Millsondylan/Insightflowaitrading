// /lib/collab/generateUserPresence.ts

type User = { id: string; name: string };

export function generateUserPresence(user: User): string {
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];
  const idx = user.id.charCodeAt(0) % colors.length;
  return colors[idx];
} 