import React from 'react';

type Strategy = {
  title: string;
  version: number;
  summary: string;
  tags: string[];
};

type Props = {
  strategy: Strategy;
  onPublish: () => void;
};

export default function VaultPublisher({ strategy, onPublish }: Props) {
  return (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 text-white space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">📢 Publish Strategy</h3>
        <p className="text-sm text-white/60">Ready to share your strategy with the community?</p>
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-white">{strategy.title}</p>
          <span className="text-xs bg-cyan-800 text-cyan-200 px-2 py-0.5 rounded-full">v{strategy.version}</span>
        </div>
        
        <p className="text-white/70 italic text-sm">"{strategy.summary}"</p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {strategy.tags.map((t, i) => (
            <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-xs text-white/60">
              {t}
            </span>
          ))}
        </div>
      </div>
      
      <Button onClick={onPublish}
        className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white font-bold transition-colors duration-200"
     >
        🚀 Publish to Vault
      </button>
    </div>
  );
} 