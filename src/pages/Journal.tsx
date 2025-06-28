
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

const ScrollSection = ({ children, className = "", delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  
  return (
    <section 
      ref={elementRef}
      className={`scroll-fade-in scroll-snap-section ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

const JournalPage: React.FC = () => {
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish'>('bullish');
  
  const mockEntries = [
    {
      id: 1,
      title: "TSLA Momentum Play",
      symbol: "TSLA",
      entry: "$245.50",
      exit: "$267.80",
      sentiment: "bullish" as const,
      date: "2024-01-15",
      profit: "+9.1%"
    },
    {
      id: 2,
      title: "SPY Put Hedge",
      symbol: "SPY",
      entry: "$478.20",
      exit: "$465.90",
      sentiment: "bearish" as const,
      date: "2024-01-14",
      profit: "+2.6%"
    },
    {
      id: 3,
      title: "NVDA Breakout Fail",
      symbol: "NVDA",
      entry: "$598.40",
      exit: "$582.10",
      sentiment: "bullish" as const,
      date: "2024-01-13",
      profit: "-2.7%"
    }
  ];

  return (
    <div className="theme-journal min-h-screen">
      <div className="container mx-auto py-8 px-4">
        
        {/* Header */}
        <ScrollSection className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-glow-violet mb-4">Trade Journal</h1>
          <p className="text-xl text-gray-300">
            Document your journey, track your growth
          </p>
        </ScrollSection>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* New Entry Form */}
          <div className="lg:col-span-5">
            <ScrollSection delay={200}>
              <div className="glass-section p-8 sticky top-8">
                <h2 className="text-2xl font-semibold text-glow-violet mb-6">New Entry</h2>
                
                <form className="space-y-6">
                  {/* Title Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Trade Title
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., AAPL Breakout Play"
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                  </div>

                  {/* Symbol Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Symbol
                    </label>
                    <input 
                      type="text" 
                      placeholder="AAPL"
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                  </div>

                  {/* Entry/Exit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Entry Price
                      </label>
                      <input 
                        type="text" 
                        placeholder="$150.00"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Exit Price
                      </label>
                      <input 
                        type="text" 
                        placeholder="$165.50"
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chart Screenshot
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-violet-400/50 transition-colors cursor-pointer">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-400">Drop your chart here</p>
                    </div>
                  </div>

                  {/* Sentiment Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Market Sentiment
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setSentiment('bullish')}
                        className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                          sentiment === 'bullish' 
                            ? 'sentiment-bullish' 
                            : 'border-white/10 text-gray-400 hover:border-green-500/30'
                        }`}
                      >
                        🟢 Bullish
                      </button>
                      <button
                        type="button"
                        onClick={() => setSentiment('bearish')}
                        className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                          sentiment === 'bearish' 
                            ? 'sentiment-bearish' 
                            : 'border-white/10 text-gray-400 hover:border-red-500/30'
                        }`}
                      >
                        🔴 Bearish
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full glow-button glow-violet py-3"
                  >
                    Save Entry
                  </button>
                </form>
              </div>
            </ScrollSection>
          </div>
          
          {/* Timeline Panel */}
          <div className="lg:col-span-7">
            <ScrollSection delay={400}>
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-medium text-glow-magenta">Recent Entries</h2>
                  <div className="text-sm text-gray-400">
                    {mockEntries.length} trades logged
                  </div>
                </div>

                {/* Memory Thread Divider */}
                <div className="memory-thread w-full mb-8"></div>
                
                {/* Journal Entries */}
                <div className="space-y-6">
                  {mockEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card p-6 hover:bg-black/40 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {entry.title}
                          </h3>
                          <p className="text-gray-400">{entry.date}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            entry.sentiment === 'bullish' ? 'sentiment-bullish' : 'sentiment-bearish'
                          }`}>
                            {entry.sentiment === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-gray-400 text-sm">Symbol</p>
                          <p className="text-white font-semibold">{entry.symbol}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Entry → Exit</p>
                          <p className="text-white font-semibold">{entry.entry} → {entry.exit}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">P&L</p>
                          <p className={`font-semibold ${entry.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.profit}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
