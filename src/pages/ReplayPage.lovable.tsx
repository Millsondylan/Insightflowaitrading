import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ReplayPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Link to={`/vault/${id}`} style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
        <ArrowLeft size={16} />
        Back to Strategy Details
      </Link>

      <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", padding: "32px", display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ fontWeight: "700", color: "white" }}>Replay for Strategy #{id}</h1>
            <Button variant="ghost"><span style={{fontSize: '16px'}}>⚙️</span> </Button>
        </header>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p >Chart and replay visualization would be here.</p>
        </div>

        <footer style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button variant="ghost"><FastForward  size={20} /></Button>
            <Button size="lg" >
                <Play size={24} />
            </Button>
            <Button variant="ghost"><FastForward size={20} /></Button>
        </footer>
      </div>
    </div>
  );
} 