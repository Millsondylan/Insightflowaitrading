
import React from 'react';

const SettingsNotificationsPage: React.FC = () => {
  return (
    <section style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "32px" }}>
          Notification Settings
        </h1>
        <p >
          Customize your alerts
        </p>
      </div>

      {/* Settings Categories */}
      <div style={{ marginTop: "32px" }} style={{ animationDelay: '100ms' }}>
        <div >
          <h2 style={{ fontWeight: "700" }}>📱 Push Notifications</h2>
          <div >
            <div >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ color: "white" }}>Price Alerts</div>
                  <div style={{ color: "#9CA3AF" }}>Get notified when prices hit your targets</div>
                </div>
                <div style={{ border: "1px solid #374151" }}></div>
              </div>
            </div>
            <div >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ color: "white" }}>Strategy Signals</div>
                  <div style={{ color: "#9CA3AF" }}>AI-generated trading opportunities</div>
                </div>
                <div style={{ border: "1px solid #374151" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div >
          <h2 style={{ fontWeight: "700" }}>📧 Email Notifications</h2>
          <div >
            <div >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ color: "white" }}>Daily Digest</div>
                  <div style={{ color: "#9CA3AF" }}>Market summary and your portfolio</div>
                </div>
                <div style={{ border: "1px solid #374151" }}></div>
              </div>
            </div>
            <div >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ color: "white" }}>Weekly Reports</div>
                  <div style={{ color: "#9CA3AF" }}>Performance analysis and insights</div>
                </div>
                <div style={{ border: "1px solid #374151" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Settings */}
      <div  style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontWeight: "700", color: "white" }}>⏰ Notification Frequency</h2>
        <div >
          <div >
            <div >Instant</div>
            <div >Real-time alerts</div>
          </div>
          <div >
            <div >Batched</div>
            <div >Every 15 minutes</div>
          </div>
          <div >
            <div >Summary</div>
            <div >Daily digest only</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsNotificationsPage;
