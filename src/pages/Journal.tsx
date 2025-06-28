
import React, { useState } from 'react';
import { ScrollSection } from '../hooks/use-scroll-reveal';

const JournalPage: React.FC = () => {
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish'>('bullish');
  
  const mockEntries = [
    {
      id: 1,
      title: "TSLA Momentum Breakout",
      symbol: "TSLA",
      entry: "$245.50",
      exit: "$267.80",
      sentiment: "bullish" as const,
      date: "2024-01-15",
      profit: "+9.1%",
      day: "Monday"
    },
    {
      id: 2,
      title: "SPY Put Protection",
      symbol: "SPY",
      entry: "$478.20",
      exit: "$465.90",
      sentiment: "bearish" as const,
      date: "2024-01-14",
      profit: "+2.6%",
      day: "Sunday"
    },
    {
      id: 3,
      title: "NVDA Failed Breakout",
      symbol: "NVDA",
      entry: "$598.40",
      exit: "$582.10",
      sentiment: "bullish" as const,
      date: "2024-01-13",
      profit: "-2.7%",
      day: "Saturday"
    },
    {
      id: 4,
      title: "AAPL Support Bounce",
      symbol: "AAPL",
      entry: "$185.20",
      exit: "$192.40",
      sentiment: "bullish" as const,
      date: "2024-01-12",
      profit: "+3.9%",
      day: "Friday"
    }
  ];

  return (
    <div className="theme-journal scroll-container">
      {/* Header */}
      <ScrollSection className="px-6 py-20" delay={0}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-glow-violet mb-6">
            Your Trading Mind, Captured
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
            Document your journey, track your evolution, and discover patterns in your trading psychology
          </p>
          <div className="mt-8">
            <div className="threadline-glow w-48 mx-auto"></div>
          </div>
        </div>
      </ScrollSection>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Form Block */}
          <div className="lg:col-span-5">
            <ScrollSection delay={200} animation="slide-right">
              <div className="glass-form sticky top-8">
                <div className="flex items-center mb-8">
                  <span className="text-2xl mr-3">📝</span>
                  <h2 className="text-2xl md:text-3xl font-semibold text-glow-violet">New Entry</h2>
                </div>
                
                <form className="space-y-8">
                  {/* Title Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Trade Title
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., AAPL Breakout Play"
                      className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-400/50 focus:bg-black/40 transition-all duration-300"
                    />
                  </div>

                  {/* Symbol Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Symbol
                    </label>
                    <input 
                      type="text" 
                      placeholder="AAPL, TSLA, SPY..."
                      className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-400/50 focus:bg-black/40 transition-all duration-300"
                    />
                  </div>

                  {/* Entry/Exit Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Entry Price
                      </label>
                      <input 
                        type="text" 
                        placeholder="$150.00"
                        className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-400/50 focus:bg-black/40 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Exit Price
                      </label>
                      <input 
                        type="text" 
                        placeholder="$165.50"
                        className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-400/50 focus:bg-black/40 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Upload Screenshot Mock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Chart Screenshot
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-violet-400/50 hover:bg-violet-500/5 transition-all duration-300 cursor-pointer group">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
                      <p className="text-gray-400 text-lg">Drop your chart here</p>
                      <p className="text-gray-500 text-sm mt-2">or click to browse</p>
                    </div>
                  </div>

                  {/* Sentiment Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Market Sentiment
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSentiment('bullish')}
                        className={`py-4 px-6 rounded-xl border-2 transition-all duration-300 font-medium ${
                          sentiment === 'bullish' 
                            ? 'sentiment-bullish border-green-400/50' 
                            : 'border-white/20 text-gray-400 hover:border-green-400/30 hover:bg-green-500/5'
                        }`}
                      >
                        🟢 Bullish
                      </button>
                      <button
                        type="button"
                        onClick={() => setSentiment('bearish')}
                        className={`py-4 px-6 rounded-xl border-2 transition-all duration-300 font-medium ${
                          sentiment === 'bearish' 
                            ? 'sentiment-bearish border-red-400/50' 
                            : 'border-white/20 text-gray-400 hover:border-red-400/30 hover:bg-red-500/5'
                        }`}
                      >
                        🔴 Bearish
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full glow-button glow-violet py-4 text-lg font-medium"
                  >
                    Capture Entry
                  </button>
                </form>
              </div>
            </ScrollSection>
          </div>
          
          {/* Timeline Container */}
          <div className="lg:col-span-7">
            <ScrollSection delay={400}>
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-medium text-glow-magenta">Trading Timeline</h2>
                    <p className="text-gray-400 mt-2">{mockEntries.length} trades captured</p>
                  </div>
                  <div className="glass-card px-4 py-2">
                    <span className="text-emerald-400 font-medium">+12.9% Overall</span>
                  </div>
                </div>

                {/* Memory Thread Divider */}
                <div className="threadline-glow w-full mb-12"></div>
                
                {/* Journal Entries with Day Separators */}
                <div className="space-y-8">
                  {mockEntries.map((entry, index) => (
                    <div key={entry.id}>
                      {/* Day Separator */}
                      {(index === 0 || mockEntries[index - 1].day !== entry.day) && (
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-3 h-3 bg-violet-400 rounded-full"></div>
                          <div className="h-px bg-gradient-to-r from-violet-400/50 to-transparent flex-1"></div>
                          <span className="text-violet-300 font-medium">{entry.day}</span>
                        </div>
                      )}
                      
                      <div className="glass-card hover:bg-black/40 transition-all duration-300 motion-shadow">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                              {entry.title}
                            </h3>
                            <p className="text-gray-400">{entry.date}</p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-block text-sm font-medium mb-2 ${
                              entry.sentiment === 'bullish' ? 'sentiment-bullish' : 'sentiment-bearish'
                            }`}>
                              {entry.sentiment === 'bullish' ? '🟢 Bullish' : '🔴 Bearish'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 glass-card">
                            <p className="text-gray-400 text-sm mb-1">Symbol</p>
                            <p className="text-white font-bold text-lg">{entry.symbol}</p>
                          </div>
                          <div className="text-center p-4 glass-card">
                            <p className="text-gray-400 text-sm mb-1">Entry → Exit</p>
                            <p className="text-white font-bold">{entry.entry} → {entry.exit}</p>
                          </div>
                          <div className="text-center p-4 glass-card">
                            <p className="text-gray-400 text-sm mb-1">Profit/Loss</p>
                            <p className={`font-bold text-lg ${
                              entry.profit.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {entry.profit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load More Placeholder */}
                <div className="text-center py-12">
                  <button className="glow-button glow-violet">
                    Load Earlier Entries
                  </button>
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
