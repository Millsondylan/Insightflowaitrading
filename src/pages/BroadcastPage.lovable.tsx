import React from 'react';
import { Link } from 'react-router-dom';

const mockChat = [
    { user: 'CryptoWhale', message: 'Great analysis on the current market.' },
    { user: 'StockSensei', message: 'What are your thoughts on the upcoming Fed meeting?' },
];

export default function BroadcastPage() {
  return (
    <div>
        <Link to="/academy" style={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
            <ArrowLeft size={16} />
            Back to Academy
        </Link>
        <div >
            {/* Main Video Player */}
            <div >
                <div style={{ backgroundColor: "black", border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p >Live video stream would be here.</p>
                </div>
                <div>
                    <h1 style={{ fontWeight: "700", color: "white" }}>Live Market Analysis with TraderPro</h1>
                    <p style={{ color: "#9CA3AF" }}>Discussing Q3 earnings and macro trends.</p>
                </div>
            </div>

            {/* Chat Sidebar */}
            <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "16px" }}>
                    <h3 style={{ color: "white", display: "flex", alignItems: "center" }}><Radio size={18} /> Live Chat</h3>
                </div>
                <div style={{ padding: "16px" }}>
                    {mockChat.map((chat, index) => (
                        <div key={index} >
                            <span >{chat.user}: </span>
                            <span >{chat.message}</span>
                        </div>
                    ))}
                </div>
                <div style={{ padding: "16px", display: "flex" }}>
                    <Textarea placeholder="Say something..."  rows={1}/>
                    <Button><Send size={16} /></Button>
                </div>
            </div>
        </div>
    </div>
  );
} 