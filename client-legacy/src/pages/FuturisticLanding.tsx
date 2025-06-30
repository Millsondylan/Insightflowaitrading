import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Zap, 
  Play, 
  TrendingUp, 
  Shield, 
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Bitcoin,
  DollarSign
} from 'lucide-react';

interface CryptoPrice {
  symbol: string;
  price: string;
  change: string;
  positive: boolean;
}

const FuturisticLanding = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
    { symbol: 'BTC', price: '$101,564.00', change: '+2.34%', positive: true },
    { symbol: 'ETH', price: '$2,473.06', change: '-1.23%', positive: false },
    { symbol: 'USDT', price: '$1.00', change: '+0.01%', positive: true }
  ]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices(prev => prev.map(crypto => ({
        ...crypto,
        price: `$${(parseFloat(crypto.price.replace('$', '').replace(',', '')) * (0.995 + Math.random() * 0.01)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`,
        positive: Math.random() > 0.5
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden floating-particles">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white neon-text">InsightFlow AI</span>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <motion.div 
          style={{ y }}
          className="text-center z-10 px-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-8 px-6 py-3 text-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30 text-cyan-300 neon-glow">
              <Rocket className="w-5 h-5 mr-2" />
              Next-Generation Trading Platform
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold leading-tight mb-8"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trade Smarter with
            </span>
            <br />
            <span className="text-white neon-text">
              AI Intelligence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Harness the power of artificial intelligence to generate profitable trading strategies, 
            analyze markets in real-time, and execute trades with precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              onClick={() => navigate('/auth/register')}
              size="lg"
              className="btn-futuristic bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 text-lg font-semibold neon-glow"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => navigate('/demo')}
              size="lg"
              variant="outline"
              className="btn-futuristic border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 px-8 py-4 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Demo Trading
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:text-cyan-400 px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Live Crypto Prices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="glass-effect p-6 max-w-2xl mx-auto gradient-border">
              <h3 className="text-lg font-semibold text-center mb-4 text-cyan-400">
                Live Crypto Prices
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {cryptoPrices.map((crypto, index) => (
                  <motion.div
                    key={crypto.symbol}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-white mb-1">
                      {crypto.symbol}
                    </div>
                    <div className="text-2xl font-bold text-cyan-400 mb-1">
                      {crypto.price}
                    </div>
                    <div className={`text-sm font-semibold ${
                      crypto.positive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {crypto.change}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 neon-text">
              Advanced Trading Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to dominate the markets with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'AI Market Analysis',
                description: 'Advanced algorithms analyze market patterns and predict trends with high accuracy'
              },
              {
                icon: Shield,
                title: 'Risk Management',
                description: 'Intelligent risk assessment and automated stop-loss protection'
              },
              {
                icon: BarChart3,
                title: 'Real-Time Data',
                description: 'Lightning-fast market data from global exchanges and trading venues'
              },
              {
                icon: Users,
                title: 'Social Trading',
                description: 'Follow successful traders and copy their strategies automatically'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
              >
                <Card className="glass-effect p-6 h-full gradient-border hover:neon-glow transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 group-hover:text-white transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Active Traders' },
              { number: '$2.5B+', label: 'Trading Volume' },
              { number: '99.9%', label: 'Uptime' },
              { number: '4.9/5', label: 'User Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 neon-text">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 neon-text">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful traders who are already using AI to maximize their profits
            </p>
            <Button
              onClick={() => navigate('/auth/register')}
              size="lg"
              className="btn-futuristic bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-12 py-6 text-xl font-bold neon-glow"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Start Trading Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FuturisticLanding;
