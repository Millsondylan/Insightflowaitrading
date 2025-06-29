import { ScrollSection } from '../hooks/use-scroll-reveal';
import StrategyGenerator from '../components/StrategyGenerator';

export interface StrategyResponse {
  strategyName: string;
  description: string;
  rules: string[];
  entryChecklist: string[];
  warnings: string[];
  backtestTips: string[];
}

const StrategyPage = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <ScrollSection style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} delay={0}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
            Visualize Your Edge
          </h1>
          <p >
            AI-crafted strategies from your own intuition
          </p>
          <div >
            <div style={{ marginLeft: "auto", marginRight: "auto" }}></div>
          </div>
        </div>
      </ScrollSection>

      {/* Strategy Generator Section */}
      <ScrollSection  delay={100}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
              ✏️ Strategy Generator
            </div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "16px" }}>
              Describe Your Trading Idea
            </h2>
            <p style={{ color: "#9CA3AF" }}>
              Enter your trading setup and let AI transform it into a complete strategy
            </p>
          </div>
          
          <StrategyGenerator />
        </div>
      </ScrollSection>

      {/* CTA Footer */}
      <ScrollSection  delay={200}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <h4 style={{ marginBottom: "16px" }}>Ready to Execute?</h4>
            <p style={{ color: "#9CA3AF" }}>Take your strategy to the next level</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button >
              🔁 Backtest Strategy
            </button>
            <button >
              📓 Save to Journal
            </button>
            <button >
              📘 Learn in Academy
            </button>
            <button >
              💬 Share Strategy
            </button>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default StrategyPage;
