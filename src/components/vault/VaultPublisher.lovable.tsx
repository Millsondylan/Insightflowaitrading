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
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}>
      <div>
        <h3 style={{ fontWeight: "700", color: "white" }}>📢 Publish Strategy</h3>
        <p >Ready to share your strategy with the community?</p>
      </div>

      <div style={{ padding: "16px", border: "1px solid #374151" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ color: "white" }}>{strategy.title}</p>
          <span >v{strategy.version}</span>
        </div>
        
        <p >"{strategy.summary}"</p>
        
        <div style={{ display: "flex" }}>
          {strategy.tags.map((t, i) => (
            <span key={i} >
              {t}
            </span>
          ))}
        </div>
      </div>
      
      <button
        onClick={onPublish}
        style={{ width: "100%", paddingLeft: "16px", paddingRight: "16px", color: "white", fontWeight: "700" }}
      >
        🚀 Publish to Vault
      </button>
    </div>
  );
} 