
import React from 'react';

const VaultHeatmapPage: React.FC = () => {
  return (
    <section className="theme-vault min-h-screen px-6 py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in slide-up">
        <h1 className="text-6xl md:text-8xl font-bold text-glow-gold mb-8">
          Vault Heatmap
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          Performance visualization grid
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-bold text-white mb-8">🔥 Performance Heatmap</h2>
        <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
          {Array.from({ length: 96 }, (_, i) => {
            const intensity = Math.random();
            const isHot = intensity > 0.7;
            const isCold = intensity < 0.3;
            
            return (
              <div
                key={i}
                className={`
                  aspect-square rounded-sm border transition-all duration-300 cursor-pointer
                  ${isHot 
                    ? 'bg-red-500/30 border-red-400/50 hover:bg-red-500/50 hover:scale-110' 
                    : isCold 
                    ? 'bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/40 hover:scale-110'
                    : 'bg-yellow-500/20 border-yellow-400/30 hover:bg-yellow-500/40 hover:scale-110'
                  }
                `}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-section motion-shadow animate-in fade-in slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-xl font-semibold text-white mb-4">📋 Legend</h3>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500/30 border border-blue-400/50 rounded"></div>
            <span className="text-blue-300 text-sm">Low Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-400/50 rounded"></div>
            <span className="text-yellow-300 text-sm">Average Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500/30 border border-red-400/50 rounded"></div>
            <span className="text-red-300 text-sm">High Performance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultHeatmapPage;
