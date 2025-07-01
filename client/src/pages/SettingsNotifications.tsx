import React from 'react';

const SettingsNotificationsPage: React.FC = () => {
  return (
    <section className="theme-notify min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-orange mb-8">
          Notification Settings
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Customize your alerts
        </p>
      </div>

      {/* Settings Categories */}
      <div className="space-y-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-orange-400 mb-6">📱 Push Notifications</h2>
          <div className="space-y-4">
            <div className="glass-card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">Price Alerts</div>
                  <div className="text-gray-400 text-sm">Get notified when prices hit your targets</div>
                </div>
                <div className="w-12 h-6 bg-orange-500/30 rounded-full border border-orange-400/50"></div>
              </div>
            </div>
            <div className="glass-card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">Strategy Signals</div>
                  <div className="text-gray-400 text-sm">AI-generated trading opportunities</div>
                </div>
                <div className="w-12 h-6 bg-orange-500/30 rounded-full border border-orange-400/50"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">📧 Email Notifications</h2>
          <div className="space-y-4">
            <div className="glass-card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">Daily Digest</div>
                  <div className="text-gray-400 text-sm">Market summary and your portfolio</div>
                </div>
                <div className="w-12 h-6 bg-yellow-500/30 rounded-full border border-yellow-400/50"></div>
              </div>
            </div>
            <div className="glass-card">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">Weekly Reports</div>
                  <div className="text-gray-400 text-sm">Performance analysis and insights</div>
                </div>
                <div className="w-12 h-6 bg-yellow-500/30 rounded-full border border-yellow-400/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Settings */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-2xl font-bold text-white mb-6">⏰ Notification Frequency</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card text-center">
            <div className="text-orange-400 font-semibold mb-2">Instant</div>
            <div className="text-gray-300 text-sm">Real-time alerts</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-yellow-400 font-semibold mb-2">Batched</div>
            <div className="text-gray-300 text-sm">Every 15 minutes</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-amber-400 font-semibold mb-2">Summary</div>
            <div className="text-gray-300 text-sm">Daily digest only</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsNotificationsPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
