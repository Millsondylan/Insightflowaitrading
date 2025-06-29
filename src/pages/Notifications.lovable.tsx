
import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <Section className="theme-notify min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <Div className="text-center space-y-4 animate-in fade-in slide-up">
        <H1 className="text-6xl md:text-8xl font-bold text-glow-orange mb-8" /></Section /></Section />
          Notifications
        </Section>
        <P className="text-xl md:text-2xl text-gray-300 font-light">
          Stay informed, stay ahead
        </P>
      </Div>

      {/* Notification Feed */}
      <Div className="space-y-4 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <Div className="glass-section motion-shadow hover-glow">
          <Div className="flex items-start space-x-4">
            <Div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Span className="text-green-400">📈</Div>
            </Div>
            <Div className="flex-1">
              <Div className="flex justify-between items-start mb-2">
                <H3 className="font-semibold text-green-400"></Div>Price Alert</Div>
                <Span className="text-gray-400 text-sm">2m ago</Span>
              </Div>
              <P className="text-gray-300">TSLA reached your target price of $250</P>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow hover-glow">
          <Div className="flex items-start space-x-4">
            <Div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Span className="text-blue-400">🎯</Div>
            </Div>
            <Div className="flex-1">
              <Div className="flex justify-between items-start mb-2">
                <H3 className="font-semibold text-blue-400"></Div>Strategy Signal</Div>
                <Span className="text-gray-400 text-sm">15m ago</Span>
              </Div>
              <P className="text-gray-300">Momentum strategy triggered a buy signal for NVDA</P>
            </Div>
          </Div>
        </Div>

        <Div className="glass-section motion-shadow hover-glow">
          <Div className="flex items-start space-x-4">
            <Div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
              <Span className="text-violet-400">🔔</Div>
            </Div>
            <Div className="flex-1">
              <Div className="flex justify-between items-start mb-2">
                <H3 className="font-semibold text-violet-400"></Div>Market Update</Div>
                <Span className="text-gray-400 text-sm">1h ago</Span>
              </Div>
              <P className="text-gray-300">Fed announcement scheduled for 2:00 PM EST</P>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Notification Settings */}
      <Div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <H2 className="text-3xl font-bold text-white mb-6"></Div>⚙️ Notification Settings</Div>
        <Div className="space-y-4">
          <Div className="glass-card">
            <Div className="flex justify-between items-center">
              <Span className="text-gray-300"></Div>Price Alerts</Div>
              <Div className="w-12 h-6 bg-orange-500/20 rounded-full border border-orange-400/30"></Div>
            </Div>
          </Div>
          <Div className="glass-card">
            <Div className="flex justify-between items-center">
              <Span className="text-gray-300"></Div>Strategy Signals</Div>
              <Div className="w-12 h-6 bg-orange-500/20 rounded-full border border-orange-400/30"></Div>
            </Div>
          </Div>
          <Div className="glass-card">
            <Div className="flex justify-between items-center">
              <Span className="text-gray-300"></Div>Market News</Div>
              <Div className="w-12 h-6 bg-orange-500/20 rounded-full border border-orange-400/30"></Div>
            </Div>
          </Div>
        </Div>
      </div />
  );
};

export default NotificationsPage;


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
