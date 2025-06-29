
import React from 'react';

const ChatPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          AI Trading Chat
        </h1>
        <p >
          Your intelligent trading companion
        </p>
      </div>

      {/* Chat Container */}
      <div style={{ marginLeft: "auto", marginRight: "auto" }} style={{ animationDelay: '100ms' }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Chat Messages */}
          <div >
            <div style={{ display: "flex" }}>
              <div >
                <div style={{ border: "1px solid #374151", paddingLeft: "16px", paddingRight: "16px" }}>
                  <p style={{ color: "white" }}>Hello! I'm your AI trading assistant. How can I help you analyze the markets today?</p>
                </div>
                <div style={{ color: "#9CA3AF" }}>AI Assistant</div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div >
                <div style={{ border: "1px solid #374151", paddingLeft: "16px", paddingRight: "16px" }}>
                  <p style={{ color: "white" }}>What's your take on TSLA's recent price action?</p>
                </div>
                <div style={{ color: "#9CA3AF" }}>You</div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div >
                <div style={{ border: "1px solid #374151", paddingLeft: "16px", paddingRight: "16px" }}>
                  <p style={{ color: "white" }}>TSLA is showing strong momentum with a breakout above the 200-day moving average. Volume is supporting the move, but watch for resistance around $250.</p>
                </div>
                <div style={{ color: "#9CA3AF" }}>AI Assistant</div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div >
            <div style={{ display: "flex" }}>
              <div >
                <div style={{ border: "1px solid #374151", borderRadius: "0.75rem", paddingLeft: "16px", paddingRight: "16px" }}>
                  <div style={{ color: "#9CA3AF" }}>Type your message...</div>
                </div>
              </div>
              <button >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div  style={{ animationDelay: '200ms' }}>
          <div >
            <h3 style={{ color: "white", marginBottom: "16px" }}>💡 Quick Questions</h3>
            <div >
              <button >
                <div >Analyze my portfolio risk</div>
              </button>
              <button >
                <div >Market sentiment today</div>
              </button>
              <button >
                <div >Best sectors to watch</div>
              </button>
              <button >
                <div >Options flow analysis</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
