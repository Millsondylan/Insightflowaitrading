'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  BookOpen, 
  Brain, 
  Calendar, 
  ChartLine, 
  FileText, 
  Globe, 
  Lightbulb, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export function Dashboard() {
  const router = useRouter();

  const systemModules = [
    {
      id: 'strategy',
      title: 'Strategy Intelligence',
      description: 'AI-powered strategy builder and vault management',
      icon: Brain,
      color: 'text-blue-500',
      href: '/modules/strategy'
    },
    {
      id: 'markets',
      title: 'Market & Setup Engine',
      description: 'AI-curated insights and market analysis',
      icon: TrendingUp,
      color: 'text-green-500',
      href: '/modules/markets'
    },
    {
      id: 'reflection',
      title: 'Trade Reflection',
      description: 'Visual trade timelines and AI coaching',
      icon: ChartLine,
      color: 'text-purple-500',
      href: '/modules/reflection'
    },
    {
      id: 'journal',
      title: 'Mindset & Journaling',
      description: 'AI-powered self-reflection and emotional tracking',
      icon: FileText,
      color: 'text-orange-500',
      href: '/modules/journal'
    },
    {
      id: 'community',
      title: 'Community & Multiplayer',
      description: 'Collaborative tools and shared strategies',
      icon: Users,
      color: 'text-pink-500',
      href: '/modules/community'
    },
    {
      id: 'academy',
      title: 'Learning Engine',
      description: 'Self-paced education with AI feedback',
      icon: BookOpen,
      color: 'text-indigo-500',
      href: '/modules/academy'
    },
    {
      id: 'copilot',
      title: 'Copilot AI Integration',
      description: 'Embedded AI assistance throughout the platform',
      icon: Lightbulb,
      color: 'text-yellow-500',
      href: '/modules/copilot'
    },
    {
      id: 'broker',
      title: 'Broker Sync',
      description: 'Real broker integration and trade capture',
      icon: Globe,
      color: 'text-red-500',
      href: '/modules/broker'
    }
  ];

  const quickActions = [
    {
      title: 'Create Strategy',
      description: 'Build a new trading strategy with AI assistance',
      icon: Brain,
      href: '/modules/strategy/create'
    },
    {
      title: 'Market Analysis',
      description: 'Get AI-curated market insights',
      icon: TrendingUp,
      href: '/modules/markets/analysis'
    },
    {
      title: 'Trade Journal',
      description: 'Record and reflect on your trades',
      icon: FileText,
      href: '/modules/journal/new'
    },
    {
      title: 'Daily Planner',
      description: 'Plan your trading day with AI guidance',
      icon: Calendar,
      href: '/modules/markets/planner'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Insight Flow
          </h1>
          <p className="text-slate-300 text-lg">
            Your AI-powered trading intelligence platform
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-slate-400">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">System Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systemModules.map((module) => (
              <Card 
                key={module.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all hover:scale-105 cursor-pointer"
                onClick={() => router.push(module.href)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                    <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center text-slate-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity yet. Start by creating your first strategy!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 