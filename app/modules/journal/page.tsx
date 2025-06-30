'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar,
  Clock,
  Brain,
  Heart,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  emotionalState: string;
  energyLevel: number;
  focusScore: number;
  tradingPerformance: 'good' | 'neutral' | 'poor';
  tags: string[];
  aiInsights: string[];
  moodTrend: 'up' | 'down' | 'stable';
}

export default function JournalPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');

  // Mock data - in real app this would come from Supabase
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      title: 'Great Trading Day - Stayed Disciplined',
      content: 'Today was a fantastic trading day. I stuck to my strategy and didn\'t let emotions get the best of me. The EURUSD trade was textbook - waited for the breakout confirmation and entered with proper position sizing. Key lesson: patience really does pay off.',
      timestamp: '2024-01-15T18:30:00Z',
      emotionalState: 'confident',
      energyLevel: 8,
      focusScore: 9,
      tradingPerformance: 'good',
      tags: ['discipline', 'patience', 'breakout'],
      aiInsights: [
        'Your confidence level is high today, which correlates with better decision-making',
        'The focus on strategy adherence shows strong emotional control'
      ],
      moodTrend: 'up'
    },
    {
      id: '2',
      title: 'Frustrated with Market Conditions',
      content: 'The market is choppy and I\'m finding it hard to find good setups. I feel like I\'m forcing trades when I should be waiting. Need to remember that it\'s okay to sit on the sidelines when conditions aren\'t right.',
      timestamp: '2024-01-14T16:45:00Z',
      emotionalState: 'frustrated',
      energyLevel: 4,
      focusScore: 6,
      tradingPerformance: 'poor',
      tags: ['frustration', 'patience', 'market-conditions'],
      aiInsights: [
        'Your frustration is affecting your trading decisions',
        'Consider taking a break when market conditions don\'t align with your strategy'
      ],
      moodTrend: 'down'
    },
    {
      id: '3',
      title: 'Learning from Yesterday\'s Mistakes',
      content: 'Reflecting on yesterday\'s poor performance. I realize I was trading out of boredom rather than following my strategy. The key lesson is to only trade when I have a clear edge and proper setup.',
      timestamp: '2024-01-13T09:15:00Z',
      emotionalState: 'reflective',
      energyLevel: 7,
      focusScore: 8,
      tradingPerformance: 'neutral',
      tags: ['learning', 'mistakes', 'strategy'],
      aiInsights: [
        'Your self-awareness is improving - recognizing emotional triggers',
        'This reflection shows good growth mindset'
      ],
      moodTrend: 'stable'
    }
  ];

  const moodFilters = ['all', 'confident', 'frustrated', 'reflective', 'anxious', 'excited'];

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || entry.emotionalState === selectedMood;
    return matchesSearch && matchesMood;
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'confident': return 'text-green-400';
      case 'frustrated': return 'text-red-400';
      case 'reflective': return 'text-blue-400';
      case 'anxious': return 'text-yellow-400';
      case 'excited': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'good': return 'bg-green-600';
      case 'neutral': return 'bg-yellow-600';
      case 'poor': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <FileText className="h-8 w-8 text-orange-400 mr-3" />
              Mindset & Journaling
            </h1>
            <p className="text-slate-300">AI-powered self-reflection and emotional tracking</p>
          </div>
          <button
            onClick={() => router.push('/modules/journal/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {moodFilters.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedMood === mood
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Journal Entries */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Brain className="h-6 w-6 text-blue-400 mr-2" />
              Journal Entries
            </h2>
            {filteredEntries.map(entry => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No entries found</h3>
                <p className="text-slate-500">Start your first journal entry to track your trading mindset</p>
              </div>
            )}
          </div>

          {/* Right Column - AI Insights & Stats */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
                AI Mindset Analysis
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-green-400">Positive Trend</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Your emotional awareness has improved by 25% this week
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-400">Pattern Detected</div>
                      <div className="text-xs text-slate-300 mt-1">
                        You perform better when you journal before trading
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-purple-600/20 border border-purple-600/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-purple-400">Recommendation</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Consider a 10-minute meditation before your next session
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emotional Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Emotional Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Confidence Level:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-white text-sm">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stress Level:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-white text-sm">40%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Focus Score:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-white text-sm">85%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules/journal/new')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write New Entry
                </button>
                <button
                  onClick={() => router.push('/modules/journal/analysis')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Mindset Analysis
                </button>
                <button
                  onClick={() => router.push('/modules/journal/patterns')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Pattern Recognition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const router = useRouter();

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'good': return 'bg-green-600';
      case 'neutral': return 'bg-yellow-600';
      case 'poor': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'confident': return 'text-green-400';
      case 'frustrated': return 'text-red-400';
      case 'reflective': return 'text-blue-400';
      case 'anxious': return 'text-yellow-400';
      case 'excited': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/journal/${entry.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{entry.title}</h3>
          <p className="text-slate-400 text-sm mb-3 line-clamp-3">{entry.content}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPerformanceColor(entry.tradingPerformance)}`}>
            {entry.tradingPerformance.toUpperCase()}
          </span>
          <span className={`text-sm font-medium ${getMoodColor(entry.emotionalState)}`}>
            {entry.emotionalState}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {entry.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">{entry.energyLevel}/10</div>
          <div className="text-xs text-slate-400">Energy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{entry.focusScore}/10</div>
          <div className="text-xs text-slate-400">Focus</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">
            {entry.moodTrend === 'up' ? '↗' : entry.moodTrend === 'down' ? '↘' : '→'}
          </div>
          <div className="text-xs text-slate-400">Mood</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-700 rounded">
            <Edit className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
} 