
import React from 'react';

const SettingsNotificationsPage: React.FC = () => {
  return (
    <Section className="theme-notify min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-orange mb-8"></Section></Section>
          Notification Settings
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Customize your alerts
        </P>
      </Div>

      {/* Settings Categories */}
      <Div className="space-y-8 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-orange-400 mb-6"></Div></Div>📱 Push Notifications</Div>
          <Div className="space-y-4">
            <Div className="glass-card">
              <Div className="flex justify-between items-center">
                <Div>
                  <Div className="font-semibold text-white">Price Alerts</Div>
                  <Div className="text-gray-400 text-sm">Get notified when prices hit your targets</Div>
                </Div>
                <Div className="w-12 h-6 bg-orange-500/30 rounded-full border border-orange-400/50"></Div>
              </Div>
            </Div>
            <Div className="glass-card">
              <Div className="flex justify-between items-center">
                <Div>
                  <Div className="font-semibold text-white">Strategy Signals</Div>
                  <Div className="text-gray-400 text-sm">AI-generated trading opportunities</Div>
                </Div>
                <Div className="w-12 h-6 bg-orange-500/30 rounded-full border border-orange-400/50"></Div>
              </Div>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow">
          <H2 className="text-2xl font-bold text-yellow-400 mb-6"></Div></Div>📧 Email Notifications</Div>
          <Div className="space-y-4">
            <Div className="glass-card">
              <Div className="flex justify-between items-center">
                <Div>
                  <Div className="font-semibold text-white">Daily Digest</Div>
                  <Div className="text-gray-400 text-sm">Market summary and your portfolio</Div>
                </Div>
                <Div className="w-12 h-6 bg-yellow-500/30 rounded-full border border-yellow-400/50"></Div>
              </Div>
            </Div>
            <Div className="glass-card">
              <Div className="flex justify-between items-center">
                <Div>
                  <Div className="font-semibold text-white">Weekly Reports</Div>
                  <Div className="text-gray-400 text-sm">Performance analysis and insights</Div>
                </Div>
                <Div className="w-12 h-6 bg-yellow-500/30 rounded-full border border-yellow-400/50"></Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Frequency Settings */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-2xl font-bold text-white mb-6"></Div></Div>⏰ Notification Frequency</Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Div className="glass-card text-center">
            <Div className="text-orange-400 font-semibold mb-2">Instant</Div>
            <Div className="text-gray-300 text-sm">Real-time alerts</Div>
          </Div>
          <Div className="glass-card text-center">
            <Div className="text-yellow-400 font-semibold mb-2">Batched</Div>
            <Div className="text-gray-300 text-sm">Every 15 minutes</Div>
          </Div>
          <Div className="glass-card text-center">
            <Div className="text-amber-400 font-semibold mb-2">Summary</Div>
            <Div className="text-gray-300 text-sm">Daily digest only</Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default SettingsNotificationsPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
