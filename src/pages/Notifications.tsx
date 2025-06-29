
import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <section className="theme-notify min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-orange mb-8">
          Notifications
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Stay informed, stay ahead
        </p>
      </div>

      {/* Notification Feed */}
      <div className="space-y-4 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400">📈</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-green-400">Price Alert</h3>
                <span className="text-gray-400 text-sm">2m ago</span>
              </div>
              <p className="text-gray-300">TSLA reached your target price of $250</p>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400">🎯</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-blue-400">Strategy Signal</h3>
                <span className="text-gray-400 text-sm">15m ago</span>
              </div>
              <p className="text-gray-300">Momentum strategy triggered a buy signal for NVDA</p>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
              <span className="text-violet-400">🔔</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-violet-400">Market Update</h3>
                <span className="text-gray-400 text-sm">1h ago</span>
              </div>
              <p className="text-gray-300">Fed announcement scheduled for 2:00 PM EST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">⚙️ Notification Settings</h2>
        <div className="space-y-4">
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Price Alerts</span>
              <div className="w-12 h-6 bg-orange-500/20 rounded-full border border-orange-400/30"></div>
            </div>
          </div>
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Strategy Signals</span>
              <div className="w-12 h-6 bg-orange-500/20 rounded-full border border-orange-400/30"></div>
            </div>
          </div>
          <div className="glass-card">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Market News</span>
              <div className="w-12 h-6 bg-orange-500/20 rounded-full border border-orange-400/30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationsPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
