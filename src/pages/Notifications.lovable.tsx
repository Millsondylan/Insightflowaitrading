
import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Notifications
        </h1>
        <p >
          Stay informed, stay ahead
        </p>
      </div>

      {/* Notification Feed */}
      <div  style={{ animationDelay: '100ms' }}>
        <div >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span >📈</span>
            </div>
            <div >
              <div style={{ display: "flex" }}>
                <h3 >Price Alert</h3>
                <span style={{ color: "#9CA3AF" }}>2m ago</span>
              </div>
              <p >TSLA reached your target price of $250</p>
            </div>
          </div>
        </div>

        <div >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span >🎯</span>
            </div>
            <div >
              <div style={{ display: "flex" }}>
                <h3 >Strategy Signal</h3>
                <span style={{ color: "#9CA3AF" }}>15m ago</span>
              </div>
              <p >Momentum strategy triggered a buy signal for NVDA</p>
            </div>
          </div>
        </div>

        <div >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span >🔔</span>
            </div>
            <div >
              <div style={{ display: "flex" }}>
                <h3 >Market Update</h3>
                <span style={{ color: "#9CA3AF" }}>1h ago</span>
              </div>
              <p >Fed announcement scheduled for 2:00 PM EST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>⚙️ Notification Settings</h2>
        <div >
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Price Alerts</span>
              <div style={{ border: "1px solid #374151" }}></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Strategy Signals</span>
              <div style={{ border: "1px solid #374151" }}></div>
            </div>
          </div>
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span >Market News</span>
              <div style={{ border: "1px solid #374151" }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationsPage;
