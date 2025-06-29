
import React from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';

const LandingBuilderPage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <ScrollSection style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} delay={0}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
            <span >Insight</span>{' '}
            <span >Flow</span>
          </h1>
          <p >
            Where Trading Intelligence Meets Intuition
          </p>
          <div style={{ marginLeft: "auto", marginRight: "auto" }}></div>
          
          {/* Navigation Cards */}
          <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Link to="/strategy" >
              <div >
                <div style={{ marginBottom: "16px" }}>🧠</div>
                <h3 >Strategy Builder</h3>
                <p style={{ color: "#9CA3AF" }}>AI-powered strategy generation from your trading intuition</p>
              </div>
            </Link>
            
            <Link to="/journal" >
              <div >
                <div style={{ marginBottom: "16px" }}>📓</div>
                <h3 >Trade Journal</h3>
                <p style={{ color: "#9CA3AF" }}>Capture and reflect on your trading psychology</p>
              </div>
            </Link>
            
            <Link to="/academy" >
              <div >
                <div style={{ marginBottom: "16px" }}>📘</div>
                <h3 >Trading Academy</h3>
                <p style={{ color: "#9CA3AF" }}>Structured learning for trading mastery</p>
              </div>
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Features Preview */}
      <ScrollSection  delay={200} animation="slide-right">
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <h2 style={{ fontWeight: "700", color: "white" }}>
              Built for Modern Traders
            </h2>
            <p style={{ color: "#9CA3AF", marginLeft: "auto", marginRight: "auto" }}>
              Combining cutting-edge AI with deep market psychology insights
            </p>
          </div>
          
          <div style={{ alignItems: "center" }}>
            <div style={{ marginTop: "32px" }}>
              <div >
                <div style={{ display: "flex" }}>
                  <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ✨
                  </div>
                  <div>
                    <h4 style={{ color: "white" }}>AI Strategy Generation</h4>
                    <p style={{ color: "#9CA3AF" }}>Transform your trading ideas into structured, backtestable strategies</p>
                  </div>
                </div>
              </div>
              
              <div >
                <div style={{ display: "flex" }}>
                  <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    🧠
                  </div>
                  <div>
                    <h4 style={{ color: "white" }}>Psychology Tracking</h4>
                    <p style={{ color: "#9CA3AF" }}>Identify patterns in your decision-making and emotional responses</p>
                  </div>
                </div>
              </div>
              
              <div >
                <div style={{ display: "flex" }}>
                  <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    📈
                  </div>
                  <div>
                    <h4 style={{ color: "white" }}>Adaptive Learning</h4>
                    <p style={{ color: "#9CA3AF" }}>Personalized education that evolves with your trading journey</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div >
              <div style={{ borderRadius: "0.75rem", border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div >
                  <div style={{ marginBottom: "16px" }}>📊</div>
                  <p style={{ color: "#9CA3AF" }}>Interactive Demo Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Call to Action */}
      <ScrollSection  delay={400} animation="scale-in">
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div >
            <h3 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>
              Ready to Elevate Your Trading?
            </h3>
            <p style={{ color: "#9CA3AF" }}>
              Join thousands of traders who've transformed their approach with Insight Flow
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link to="/strategy">
                <button >
                  Start Building Strategies
                </button>
              </Link>
              <Link to="/academy">
                <button >
                  Begin Learning
                </button>
              </Link>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
};

export default LandingBuilderPage;
