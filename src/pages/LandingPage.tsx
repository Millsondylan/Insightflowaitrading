import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Insights",
      description: "Leverage advanced AI to analyze market trends and identify trading opportunities.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "Intuitive Interface",
      description: "A clean, user-friendly interface designed for both novice and experienced traders.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your funds and data are protected with multi-layered, industry-leading security.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Rapid Execution",
      description: "Execute trades in milliseconds with our high-performance trading engine.",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100">
      {/* Navigation Header */}
      <nav className="w-full p-6 flex justify-between items-center fixed top-0 z-50 bg-[#0D1117]/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            InsightFlow AI
          </h1>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="text-white hover:bg-gray-800"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        id="hero"
        className="w-full px-6 pt-40 pb-32 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="space-y-6">
          <Badge className="bg-gray-800 text-blue-400 border-blue-400/30 px-4 py-2 text-sm">
            <span>🚀</span> Over 10,000 traders trust InsightFlow AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-white">
              The Ultimate AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Trading Copilot
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Make smarter, faster, and more confident trading decisions with real-time insights, advanced analytics, and a powerful, intuitive interface.
          </p>

          <div className="flex justify-center space-x-4 pt-6">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/trading')}
              className="text-white border-gray-700 hover:bg-gray-800 hover:text-white text-lg px-8 py-4"
            >
              View Demo
            </Button>
          </div>

          <div className="flex justify-center items-center space-x-8 pt-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        id="features"
        className="container mx-auto px-6 py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            A New Standard for Trading Intelligence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            InsightFlow AI provides everything you need to navigate the markets with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#161B22] border border-gray-800 hover:border-blue-500/50 transition-all duration-300 rounded-lg">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-lg bg-gray-800 flex items-center justify-center mb-4 border border-gray-700`}>
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage; 