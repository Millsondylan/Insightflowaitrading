'use client';

import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl">Insight Flow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-cyan-300 transition-colors">
              Features
            </button>
            <button className="text-white hover:text-cyan-300 transition-colors">
              Pricing
            </button>
            <button className="text-white hover:text-cyan-300 transition-colors">
              About
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full hover:from-cyan-500 hover:to-blue-600 transition-all"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-6 py-2 mb-8">
              <svg className="w-4 h-4 mr-2 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="text-cyan-300 font-medium">Next-Generation Trading Platform</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Trade Smarter with
            </span>
            <br />
            <span className="text-white">AI Intelligence</span>
          </h1>

          <p className="text-xl md:text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed mb-12">
            Harness the power of artificial intelligence to generate
            profitable trading strategies, analyze markets in real-time,
            and execute trades with precision.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-16">
            <button
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>Get Started Free</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </button>

            <button
              onClick={() => console.log('Demo clicked')}
              className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Try Demo Trading</span>
            </button>
          </div>

          {/* Live Crypto Prices */}
          <div className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-2xl inline-block">
            <div className="text-center mb-6">
              <h3 className="text-purple-200 font-semibold text-lg">Live Crypto Prices</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-1">BTC</div>
                <div className="text-cyan-300 font-semibold text-xl mb-2">$101,564.00</div>
                <div className="flex items-center justify-center space-x-1 text-green-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5"/>
                  </svg>
                  <span className="font-medium">+2.34%</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-1">ETH</div>
                <div className="text-cyan-300 font-semibold text-xl mb-2">$3,473.06</div>
                <div className="flex items-center justify-center space-x-1 text-red-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 10l-5 5-5-5"/>
                  </svg>
                  <span className="font-medium">-1.23%</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-white font-bold text-lg mb-1">USDT</div>
                <div className="text-cyan-300 font-semibold text-xl mb-2">$1.00</div>
                <div className="flex items-center justify-center space-x-1 text-green-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14l5-5 5 5"/>
                  </svg>
                  <span className="font-medium">+0.01%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Strategy Builder</h3>
            <p className="text-purple-200">Generate profitable trading strategies using advanced AI algorithms</p>
          </div>
          
          <div className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zm-8-2l-4-4 1.5-1.5L11 14l6.5-6.5L19 9l-8 8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Backtesting</h3>
            <p className="text-purple-200">Test your strategies against historical data with precision</p>
          </div>
          
          <div className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Trading Journal</h3>
            <p className="text-purple-200">Track your performance and learn from every trade</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}