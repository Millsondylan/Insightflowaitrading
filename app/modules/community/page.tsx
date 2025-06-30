'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Plus, 
  Search, 
  MessageSquare,
  Share2,
  Heart,
  Eye,
  Edit,
  Trash2,
  Brain,
  TrendingUp,
  Star,
  Globe,
  Lock,
  UserPlus
} from 'lucide-react';

interface CommunityStrategy {
  id: string;
  name: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  performance: {
    winRate: number;
    totalTrades: number;
    avgReturn: number;
  };
  tags: string[];
  isPublic: boolean;
  likes: number;
  views: number;
  createdAt: string;
  lastUpdated: string;
  collaborators: number;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
  };
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  isQuestion: boolean;
}

export default function CommunityPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'strategies' | 'discussions'>('strategies');

  // Mock data - in real app this would come from Supabase
  const communityStrategies: CommunityStrategy[] = [
    {
      id: '1',
      name: 'Breakout Momentum Scanner',
      description: 'Advanced breakout detection with volume confirmation and RSI filtering. Perfect for trending markets.',
      author: {
        id: 'user1',
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        reputation: 95
      },
      performance: {
        winRate: 72,
        totalTrades: 156,
        avgReturn: 2.1
      },
      tags: ['breakout', 'momentum', 'volume', 'RSI'],
      isPublic: true,
      likes: 127,
      views: 2340,
      createdAt: '2024-01-10T10:30:00Z',
      lastUpdated: '2024-01-15T14:20:00Z',
      collaborators: 3
    },
    {
      id: '2',
      name: 'Mean Reversion Scalper Pro',
      description: 'High-frequency scalping strategy using Bollinger Bands and stochastic oscillator.',
      author: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        reputation: 88
      },
      performance: {
        winRate: 68,
        totalTrades: 89,
        avgReturn: 0.8
      },
      tags: ['scalping', 'mean-reversion', 'Bollinger', 'stochastic'],
      isPublic: true,
      likes: 89,
      views: 1567,
      createdAt: '2024-01-08T16:45:00Z',
      lastUpdated: '2024-01-14T09:15:00Z',
      collaborators: 1
    }
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      title: 'How do you handle high volatility periods?',
      content: 'I\'ve been struggling with the recent market volatility. What strategies do you use to adapt your trading during these periods?',
      author: {
        id: 'user3',
        name: 'Mike Rodriguez',
        avatar: '/avatars/mike.jpg',
        reputation: 67
      },
      likes: 23,
      comments: 15,
      tags: ['volatility', 'risk-management', 'strategy'],
      createdAt: '2024-01-15T11:20:00Z',
      isQuestion: true
    },
    {
      id: '2',
      title: 'My experience with AI-powered strategy validation',
      content: 'I\'ve been using the AI strategy validator for the past month and it\'s been incredibly helpful. Here\'s what I learned...',
      author: {
        id: 'user4',
        name: 'Emma Wilson',
        avatar: '/avatars/emma.jpg',
        reputation: 92
      },
      likes: 45,
      comments: 8,
      tags: ['AI', 'strategy-validation', 'experience'],
      createdAt: '2024-01-14T15:30:00Z',
      isQuestion: false
    }
  ];

  const categories = ['all', 'breakout', 'scalping', 'swing-trading', 'mean-reversion', 'trend-following'];

  const filteredStrategies = communityStrategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           strategy.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Users className="h-8 w-8 text-pink-400 mr-3" />
              Community & Multiplayer
            </h1>
            <p className="text-slate-300">Collaborative tools and shared strategies</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/community/create-strategy')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Share Strategy
            </button>
            <button
              onClick={() => router.push('/modules/community/new-post')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              New Post
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search strategies and discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('strategies')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'strategies'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Strategies
          </button>
          <button
            onClick={() => setViewMode('discussions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'discussions'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Discussions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {viewMode === 'strategies' ? (
              <>
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-400 mr-2" />
                  Community Strategies
                </h2>
                {filteredStrategies.map(strategy => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <MessageSquare className="h-6 w-6 text-green-400 mr-2" />
                  Community Discussions
                </h2>
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </>
            )}
          </div>

          {/* Right Column - Community Stats & Actions */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Globe className="h-5 w-5 text-blue-400 mr-2" />
                Community Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Members:</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shared Strategies:</span>
                  <span className="text-white font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Discussions:</span>
                  <span className="text-white font-medium">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Win Rate:</span>
                  <span className="text-green-400 font-medium">68.5%</span>
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Top Contributors</h2>
              <div className="space-y-3">
                {[
                  { name: 'Alex Chen', reputation: 95, strategies: 12 },
                  { name: 'Sarah Johnson', reputation: 88, strategies: 8 },
                  { name: 'Emma Wilson', reputation: 92, strategies: 6 },
                  { name: 'Mike Rodriguez', reputation: 67, strategies: 4 }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {contributor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{contributor.name}</div>
                        <div className="text-slate-400 text-xs">{contributor.strategies} strategies</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm font-medium">{contributor.reputation}</div>
                      <div className="text-slate-400 text-xs">reputation</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules/community/create-strategy')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Strategy
                </button>
                <button
                  onClick={() => router.push('/modules/community/collaborate')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Collaborators
                </button>
                <button
                  onClick={() => router.push('/modules/community/ai-assistant')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Community Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: CommunityStrategy }) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/community/strategy/${strategy.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
            {strategy.isPublic ? (
              <Globe className="h-4 w-4 text-blue-400" />
            ) : (
              <Lock className="h-4 w-4 text-yellow-400" />
            )}
          </div>
          <p className="text-slate-400 text-sm mb-3">{strategy.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{strategy.performance.winRate}%</div>
            <div className="text-xs text-slate-400">Win Rate</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {strategy.author.name.charAt(0)}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{strategy.author.name}</div>
            <div className="text-slate-400 text-xs">{strategy.author.reputation} reputation</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {strategy.likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {strategy.views}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {strategy.collaborators}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {strategy.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Updated {new Date(strategy.lastUpdated).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-700 rounded">
            <Heart className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded">
            <Share2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const router = useRouter();

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/community/post/${post.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">{post.title}</h3>
            {post.isQuestion && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                Question
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{post.content}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {post.author.name.charAt(0)}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{post.author.name}</div>
            <div className="text-slate-400 text-xs">{post.author.reputation} reputation</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {post.comments}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-700 rounded">
            <Heart className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded">
            <MessageSquare className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
} 