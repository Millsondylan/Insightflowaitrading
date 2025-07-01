export function syncState<T>(local: T, remote: T): T {
  // Merge local + remote state, prioritizing recent edits
  // For now, return remote as truth source
  return remote;
} 