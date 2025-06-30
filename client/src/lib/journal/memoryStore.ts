// /lib/journal/memoryStore.ts

type Memory = Record<string, { emotion: string; pattern: string[] }>;

export function updateMemory(
  memory: Memory,
  date: string,
  emotion: string,
  pattern: string
): Memory {
  const prev = memory[date] || { emotion, pattern: [] };
  return {
    ...memory,
    [date]: {
      emotion,
      pattern: [...new Set([...prev.pattern, pattern])],
    },
  };
} 