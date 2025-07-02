
import { Link } from 'react-router-dom';
import { TrendingUp, Brain, Shield, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            InsightFlow AI Trading Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Harness the power of AI to enhance your trading strategies, analyze markets, and make informed decisions with our cutting-edge platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="border border-gray-600 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-800/50 rounded-lg">
            <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-400">Advanced AI algorithms analyze market patterns and trends</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/50 rounded-lg">
            <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Smart Trading</h3>
            <p className="text-gray-400">Intelligent trading strategies backed by data</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/50 rounded-lg">
            <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Risk Management</h3>
            <p className="text-gray-400">Built-in risk assessment and management tools</p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/50 rounded-lg">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Insights</h3>
            <p className="text-gray-400">Get instant market insights and trading signals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
