
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const AcademyBuilderPage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <ScrollSection style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} delay={0}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
            Learn, Test, Evolve
          </h1>
          <p >
            Scroll-through lessons and unlock your trading mastery
          </p>
          <div >
            <div style={{ marginLeft: "auto", marginRight: "auto" }}></div>
          </div>
        </div>
      </ScrollSection>

      {/* Progress Overview */}
      <ScrollSection  delay={100}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <div style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
              📈 Learning Progress
            </div>
            <h2 style={{ fontSize: "1.875rem", marginBottom: "32px" }}>
              Your Trading Education Journey
            </h2>
            
            {/* Progress Bar */}
            <div style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "32px" }}>
              <div style={{ display: "flex", color: "#9CA3AF" }}>
                <span>Overall Progress</span>
                <span>67%</span>
              </div>
              <div style={{ width: "100%" }}>
                <div ></div>
              </div>
            </div>
            
            <p style={{ color: "#9CA3AF" }}>
              Continue your journey to trading mastery with structured lessons and hands-on practice
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* Lesson Blocks Grid */}
      <ScrollSection  delay={200} animation="slide-right">
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            
            {/* Lesson Block 1 - Technical Analysis */}
            <div >
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  📊
                </div>
                <h3 >Technical Analysis</h3>
                <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Master chart patterns, indicators, and price action</p>
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Support & Resistance</span>
                  <span >✓</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Trend Analysis</span>
                  <span >✓</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Candlestick Patterns</span>
                  <span >In Progress</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 2 - Risk Management */}
            <div >
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  🛡️
                </div>
                <h3 >Risk Management</h3>
                <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Protect your capital with proven strategies</p>
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Position Sizing</span>
                  <span >✓</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Stop Loss Strategies</span>
                  <span >In Progress</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Portfolio Theory</span>
                  <span >Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 3 - Trading Psychology */}
            <div >
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  🧠
                </div>
                <h3 >Trading Psychology</h3>
                <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Master your emotions and decision-making</p>
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Emotional Control</span>
                  <span >In Progress</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Discipline Building</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Behavioral Finance</span>
                  <span >Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 4 - Market Analysis */}
            <div >
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  🌍
                </div>
                <h3 >Market Analysis</h3>
                <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Understand macro trends and market cycles</p>
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Economic Indicators</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Sector Analysis</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >News Impact</span>
                  <span >Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 5 - Advanced Strategies */}
            <div >
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  ⚡
                </div>
                <h3 >Advanced Strategies</h3>
                <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Complex trading techniques and algorithms</p>
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Options Strategies</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Algorithmic Trading</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Portfolio Optimization</span>
                  <span >Locked</span>
                </div>
              </div>
            </div>

            {/* Lesson Block 6 - Practical Application */}
            <div >
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  🎯
                </div>
                <h3 >Practical Application</h3>
                <p style={{ color: "#9CA3AF", marginBottom: "16px" }}>Real-world trading scenarios and case studies</p>
              </div>
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Paper Trading</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Case Studies</span>
                  <span >Locked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >Strategy Testing</span>
                  <span >Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Achievement Badge */}
      <ScrollSection  delay={300} animation="scale-in">
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <div >🏆</div>
            <h4 style={{ marginBottom: "16px" }}>
              Achievement Unlocked
            </h4>
            <div style={{ border: "1px solid #374151" }}>
              Technical Analysis Fundamentals Master
            </div>
            <p style={{ color: "#9CA3AF", marginBottom: "32px" }}>
              You've successfully completed the foundation level of technical analysis. Ready for the next challenge?
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button >
                Continue Learning
              </button>
              <button >
                Practice Quiz
              </button>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default AcademyBuilderPage;
