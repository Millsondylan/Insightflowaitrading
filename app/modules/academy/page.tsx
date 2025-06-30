'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Play, 
  Pause,
  CheckCircle,
  Clock,
  Star,
  Brain,
  Target,
  TrendingUp,
  Award,
  Lock,
  Unlock,
  Video,
  FileText,
  Code
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'text' | 'interactive' | 'quiz';
  isCompleted: boolean;
  isLocked: boolean;
  progress: number; // 0-100
  tags: string[];
  prerequisites: string[];
  rewards: {
    xp: number;
    badges: string[];
  };
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  estimatedTime: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
}

export default function AcademyPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Mock data - in real app this would come from Supabase
  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'Trading Fundamentals',
      description: 'Master the basics of trading psychology, risk management, and market analysis.',
      totalLessons: 12,
      completedLessons: 8,
      progress: 67,
      estimatedTime: 8,
      difficulty: 'beginner',
      isActive: true
    },
    {
      id: '2',
      name: 'Technical Analysis Pro',
      description: 'Advanced chart patterns, indicators, and technical analysis techniques.',
      totalLessons: 18,
      completedLessons: 5,
      progress: 28,
      estimatedTime: 12,
      difficulty: 'intermediate',
      isActive: true
    },
    {
      id: '3',
      name: 'AI-Powered Trading',
      description: 'Learn to leverage AI tools for strategy development and market analysis.',
      totalLessons: 15,
      completedLessons: 0,
      progress: 0,
      estimatedTime: 10,
      difficulty: 'advanced',
      isActive: false
    }
  ];

  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Understanding Market Psychology',
      description: 'Learn how emotions drive market movements and how to control your own psychology.',
      duration: 25,
      difficulty: 'beginner',
      type: 'video',
      isCompleted: true,
      isLocked: false,
      progress: 100,
      tags: ['psychology', 'basics', 'emotions'],
      prerequisites: [],
      rewards: { xp: 100, badges: ['First Steps'] }
    },
    {
      id: '2',
      title: 'Risk Management Fundamentals',
      description: 'Essential risk management techniques to protect your capital.',
      duration: 30,
      difficulty: 'beginner',
      type: 'interactive',
      isCompleted: true,
      isLocked: false,
      progress: 100,
      tags: ['risk-management', 'basics', 'capital'],
      prerequisites: ['1'],
      rewards: { xp: 150, badges: ['Risk Manager'] }
    },
    {
      id: '3',
      title: 'Chart Pattern Recognition',
      description: 'Identify and trade common chart patterns with high probability setups.',
      duration: 45,
      difficulty: 'intermediate',
      type: 'video',
      isCompleted: false,
      isLocked: false,
      progress: 60,
      tags: ['technical-analysis', 'patterns', 'charting'],
      prerequisites: ['1', '2'],
      rewards: { xp: 200, badges: ['Pattern Master'] }
    },
    {
      id: '4',
      title: 'AI Strategy Builder Workshop',
      description: 'Hands-on workshop using AI tools to build and validate trading strategies.',
      duration: 60,
      difficulty: 'advanced',
      type: 'interactive',
      isCompleted: false,
      isLocked: true,
      progress: 0,
      tags: ['AI', 'strategy', 'workshop'],
      prerequisites: ['1', '2', '3'],
      rewards: { xp: 300, badges: ['AI Trader'] }
    }
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredPaths = learningPaths.filter(path => {
    const matchesDifficulty = selectedDifficulty === 'all' || path.difficulty === selectedDifficulty;
    return matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'interactive': return Code;
      case 'quiz': return Brain;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-400 mr-3" />
              Learning Engine (Academy 2.0)
            </h1>
            <p className="text-slate-300">Self-paced education with AI feedback and memory tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/modules/academy/progress')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              My Progress
            </button>
            <button
              onClick={() => router.push('/modules/academy/playground')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Lesson Playground
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">1,250</div>
              <div className="text-sm text-slate-400">Total XP</div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">13</div>
              <div className="text-sm text-slate-400">Lessons Completed</div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm text-slate-400">Badges Earned</div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">8.5h</div>
              <div className="text-sm text-slate-400">Time Invested</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Learning Paths */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Target className="h-6 w-6 text-blue-400 mr-2" />
              Learning Paths
            </h2>
            {filteredPaths.map(path => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>

          {/* Right Column - Current Lesson & Stats */}
          <div className="space-y-6">
            {/* Current Lesson */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Play className="h-5 w-5 text-green-400 mr-2" />
                Continue Learning
              </h2>
              <div className="space-y-4">
                {lessons.filter(lesson => !lesson.isCompleted && !lesson.isLocked).slice(0, 3).map(lesson => (
                  <div key={lesson.id} className="p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                       onClick={() => router.push(`/modules/academy/lesson/${lesson.id}`)}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{lesson.title}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400 text-xs">{lesson.duration}m</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(lesson.difficulty)} bg-slate-600`}>
                        {lesson.difficulty}
                      </span>
                      <span className="text-slate-400 text-xs">{lesson.progress}% complete</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="h-5 w-5 text-yellow-400 mr-2" />
                Recent Achievements
              </h2>
              <div className="space-y-3">
                {[
                  { badge: 'Risk Manager', description: 'Completed risk management fundamentals', xp: 150 },
                  { badge: 'First Steps', description: 'Completed your first lesson', xp: 100 },
                  { badge: 'Consistent Learner', description: '7 days of consecutive learning', xp: 200 }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-slate-700 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{achievement.badge}</div>
                      <div className="text-slate-400 text-xs">{achievement.description}</div>
                    </div>
                    <div className="text-green-400 text-sm font-medium">+{achievement.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Learning Assistant */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 text-purple-400 mr-2" />
                AI Learning Assistant
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-purple-600/20 border border-purple-600/30 rounded-lg">
                  <div className="text-sm text-purple-400 font-medium mb-1">Learning Tip</div>
                  <div className="text-xs text-slate-300">
                    Based on your progress, I recommend focusing on technical analysis next. You're ready for intermediate concepts!
                  </div>
                </div>
                <button
                  onClick={() => router.push('/modules/academy/ai-coach')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                >
                  Ask AI Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearningPathCard({ path }: { path: LearningPath }) {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer"
         onClick={() => router.push(`/modules/academy/path/${path.id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{path.name}</h3>
            {!path.isActive && <Lock className="h-4 w-4 text-yellow-400" />}
          </div>
          <p className="text-slate-400 text-sm mb-3">{path.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-blue-400">{path.progress}%</div>
          <div className="text-xs text-slate-400">Complete</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-1 rounded ${getDifficultyColor(path.difficulty)} bg-slate-700`}>
            {path.difficulty}
          </span>
          <span className="text-slate-400 text-sm">{path.estimatedTime}h</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>{path.completedLessons}/{path.totalLessons} lessons</span>
        </div>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all" 
          style={{ width: `${path.progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {path.isActive ? (
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
              Continue
            </button>
          ) : (
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
              Unlock
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500">
          {path.completedLessons} of {path.totalLessons} completed
        </div>
      </div>
    </div>
  );
} 