import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ConfigItem = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <div>
      <h4 style={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}>
        <Icon size={16} />
        {title}
      </h4>
      {children}
    </div>
  );
};

export default function StrategyBuilderPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <div >
      {/* Main Builder Section */}
      <div style={{ marginTop: "32px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div>
                <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                    <span ><Bot  /></span>
                    AI Strategy Builder
                </h1>
                <p style={{ color: "#9CA3AF" }}>Craft a new strategy using natural language.</p>
            </div>
        </div>

        {/* Prompt Input */}
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
          <h3 style={{ color: "white" }}>Describe your strategy idea</h3>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A mean-reversion strategy for AAPL on the 5-minute chart using Bollinger Bands and RSI..."
            
          />
          <div style={{ display: "flex" }}>
            <Button style={{ color: "white" }}>
                <Sparkles size={16} />
                Generate Strategy
            </Button>
          </div>
        </div>

        {/* Generated Output */}
        <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
            <h3 style={{ color: "white", display: "flex", alignItems: "center" }}>
                <span style={{fontSize: '16px'}}>📄</span>
                Generated Pine Script
            </h3>
            <div style={{ padding: "16px" }}>
                // Your generated strategy code will appear here...
            </div>
        </div>
      </div>

      {/* Configuration Sidebar */}
      <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "24px" }}>
        <h2 style={{ fontWeight: "700", color: "white" }}>Configuration</h2>
        
        <ConfigItem icon={Settings} title="Parameters">
          {/* Placeholder for parameters */}
          <p >Parameters will be extracted here.</p>
        </ConfigItem>

        <div ></div>
        
        <ConfigItem icon={Book} title="Next Steps">
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Link to="/planner">
                    <Button variant="outline" style={{ width: "100%" }}>Create Trading Plan</Button>
                </Link>
                <Link to="/vault">
                    <Button variant="outline" style={{ width: "100%" }}>Save to Vault</Button>
                </Link>
            </div>
        </ConfigItem>
      </div>
    </div>
  );
}
