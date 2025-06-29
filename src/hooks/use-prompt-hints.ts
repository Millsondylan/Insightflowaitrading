import { useEffect, useState } from 'react';

export function usePromptHints(prompt: string) {
  const [hints, setHints] = useState<string[]>([]);

  useEffect(() => {
    if (!prompt || prompt.length < 5) {
      setHints([]);
      return;
    }

    const handle = setTimeout(() => {
      // very naive suggestion logic; TODO: replace with GPT endpoint
      const lower = prompt.toLowerCase();
      const suggestions: string[] = [];
      if (!lower.includes('atr')) suggestions.push('Include ATR filter?');
      if (!lower.includes('ema')) suggestions.push('Add EMA crossover?');
      if (!lower.includes('volume')) suggestions.push('Use volume condition?');
      setHints(suggestions.slice(0, 3));
    }, 400);

    return () => clearTimeout(handle);
  }, [prompt]);

  return hints;
} 