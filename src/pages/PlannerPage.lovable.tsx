import React from 'react';
import { Link } from 'react-router-dom';

export default function PlannerPage() {
  return (
    <div>
      <Link to="/strategy-builder" style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
        <ArrowLeft size={16} />
        Back to Strategy Builder
      </Link>
      
      <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "32px" }}>
        <header style={{ display: "flex", marginBottom: "32px" }}>
            <div>
                <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
                    <span ><span style={{fontSize: '16px'}}>📅</span></span>
                    Trading Planner
                </h1>
                <p style={{ color: "#9CA3AF" }}>Outline your trading plan for the generated strategy.</p>
            </div>
            <Button size="lg" style={{ color: "white" }}>
                Save Plan
            </Button>
        </header>

        <div >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p >Checklist and planning components will be here.</p>
            </div>
        </div>
      </div>
    </div>
  );
} 