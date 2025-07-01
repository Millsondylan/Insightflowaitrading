import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Award,
  ChevronRight,
  Bot,
  LineChart,
  Shield,
  Zap,
  MessageSquare,
  Trophy
} from 'lucide-react';

interface Stats {
  activeUsers: number;
  totalTrades: number;
  badgesEarned: number;
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Trading",
    description: "Get real-time trade suggestions from GPT-4, Claude, and Gemini"
  },
  {
    icon: LineChart,
    title: "Advanced Backtesting",
    description: "Test strategies on historical data with visual analytics"
  },
  {
    icon: Bot,
    title: "Strategy Builder",
    description: "Build custom strategies with natural language prompts"
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Automated risk controls and position sizing"
  },
  {
    icon: MessageSquare,
    title: "Community & Chat",
    description: "Learn from pro traders in real-time voice rooms"
  },
  {
    icon: Trophy,
    title: "Trading Academy",
    description: "Interactive lessons with quizzes and certifications"
  }
];

const pricingPlans = [
  {
    name: "Free Trial",
    price: "$0",
    duration: "7 days",
    features: [
      "Basic AI suggestions",
      "5 backtests per day",
      "Community access",
      "1 saved strategy"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Pro Monthly",
    price: "$49",
    duration: "per month",
    features: [
      "Unlimited AI suggestions",
      "Unlimited backtests",
      "Voice chat rooms",
      "50 saved strategies",
      "Priority support",
      "Custom indicators"
    ],
    cta: "Go Pro",
    popular: true
  },
  {
    name: "Pro Yearly",
    price: "$399",
    duration: "per year",
    features: [
      "Everything in Pro Monthly",
      "Save $189 per year",
      "Early access features",
      "1-on-1 coaching session",
      "API access"
    ],
    cta: "Best Value",
    popular: false
  }
];

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    activeUsers: 0,
    totalTrades: 0,
    badgesEarned: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch active users count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total trades
      const { count: tradeCount } = await supabase
        .from('trades')
        .select('*', { count: 'exact', head: true });

      // Fetch badges earned (from user_progress)
      const { count: badgeCount } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true);

      setStats({
        activeUsers: userCount || 0,
        totalTrades: tradeCount || 0,
        badgesEarned: badgeCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Trade Smarter with
            <span className="text-cyan-400"> AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
            The most advanced AI trading platform powered by GPT-4, Claude, and Gemini. 
            Build strategies, backtest ideas, and trade with confidence.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400">{stats.activeUsers.toLocaleString()}+</div>
              <div className="text-purple-200 mt-2">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400">{stats.totalTrades.toLocaleString()}+</div>
              <div className="text-purple-200 mt-2">Trades Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400">{stats.badgesEarned.toLocaleString()}+</div>
              <div className="text-purple-200 mt-2">Badges Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Everything You Need to Trade Like a Pro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-cyan-400 mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-200">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-cyan-400 scale-105' : 'border-white/20'} bg-white/10 backdrop-blur-sm`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-cyan-400">{plan.price}</span>
                    <span className="text-purple-200 ml-2">{plan.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <TrendingUp className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" />
                        <span className="text-purple-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Join thousands of traders using AI to make smarter decisions
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                Start Your Free Trial
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 