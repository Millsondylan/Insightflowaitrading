'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Play, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { StarField } from './StarField';

interface CryptoPrice {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export function LandingPage() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
    { symbol: 'BTC', price: '$101,564.00', change: '+2.34%', isPositive: true },
    { symbol: 'ETH', price: '$3,473.06', change: '-1.23%', isPositive: false },
    { symbol: 'USDT', price: '$1.00', change: '+0.01%', isPositive: true },
  ]);

  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handleTryDemo = () => {
    // Navigate to demo trading page
    window.location.href = '/demo';
  };

  const handleWatchDemo = () => {
    // Open demo video modal or navigate to demo video
    console.log('Watch demo clicked');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Animated Star Field Background */}
      <StarField />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">TradingAI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Features
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Pricing
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            About
          </Button>
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        {/* Platform Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-6 py-2">
            <span className="text-cyan-300 font-medium flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Next-Generation Trading Platform</span>
            </span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight">
            Trade Smarter with
            <br />
            <span className="text-white">AI Intelligence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Harness the power of artificial intelligence to generate
            <br />
            profitable trading strategies, analyze markets in real-time,
            <br />
            and execute trades with precision.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-16"
        >
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            onClick={handleTryDemo}
            variant="outline"
            size="lg"
            className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-8 py-4 text-lg font-semibold rounded-full"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Demo Trading
          </Button>

          <Button
            onClick={handleWatchDemo}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Live Crypto Prices Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <Card className="bg-purple-900/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-purple-200 font-semibold text-lg">Live Crypto Prices</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              {cryptoPrices.map((crypto, index) => (
                <motion.div
                  key={crypto.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-white font-bold text-lg mb-1">
                    {crypto.symbol}
                  </div>
                  <div className="text-cyan-300 font-semibold text-xl mb-2">
                    {crypto.price}
                  </div>
                  <div className={`flex items-center justify-center space-x-1 ${
                    crypto.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {crypto.isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{crypto.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Shopping Cart Button (floating) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="fixed bottom-8 right-8 z-20"
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
          </svg>
        </Button>
      </motion.div>
    </div>
  );
}