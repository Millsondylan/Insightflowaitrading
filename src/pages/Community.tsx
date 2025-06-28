
import React from 'react';

const CommunityPage: React.FC = () => {
  return (
    <section className="theme-community min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-magenta mb-8">
          Trading Community
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Connect, share, and learn together
        </p>
      </div>

      {/* Community Feed */}
      <div className="space-y-6 animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center">
              <span className="text-rose-400">👤</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-white">TraderPro</span>
                <span className="text-gray-400 text-sm">2h ago</span>
              </div>
              <p className="text-gray-300 mb-4">
                Just closed my TSLA position for a +15% gain. The momentum strategy is working well in this market!
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-rose-400 hover:text-rose-300">
                  <span>❤️</span>
                  <span>24</span>
                </button>
                <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300">
                  <span>💬</span>
                  <span>8</span>
                </button>
                <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300">
                  <span>🔄</span>
                  <span>12</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-section motion-shadow hover-glow">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
              <span className="text-violet-400">👤</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-white">CryptoQueen</span>
                <span className="text-gray-400 text-sm">4h ago</span>
              </div>
              <p className="text-gray-300 mb-4">
                Market looking volatile today. Anyone else seeing the unusual volume patterns in tech stocks?
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-rose-400 hover:text-rose-300">
                  <span>❤️</span>
                  <span>18</span>
                </button>
                <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300">
                  <span>💬</span>
                  <span>15</span>
                </button>
                <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300">
                  <span>🔄</span>
                  <span>7</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-white mb-6">🔥 Trending</h2>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-rose-500/20 border border-rose-400/30 rounded-full text-rose-300 text-sm">#TechStocks</span>
          <span className="px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full text-violet-300 text-sm">#CryptoTrading</span>
          <span className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm">#OptionsFlow</span>
          <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm">#MarketAnalysis</span>
        </div>
      </div>
    </section>
  );
};

export default CommunityPage;
