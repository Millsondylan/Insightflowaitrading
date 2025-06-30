import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { 
  BookOpen, Star, Trophy, CheckCircle, Play, Lock, Crown, Medal, Zap, Clock, Users, TrendingUp, Award
} from 'lucide-react';
import DocumentHead from '@/components/core/DocumentHead';
import { toast } from '@/components/ui/use-toast';

interface AcademyLesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  xp_reward: number;
  is_completed: boolean;
  is_locked: boolean;
  completion_rate: number;
  rating: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  is_unlocked: boolean;
  progress: number;
  max_progress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const AcademyV2 = () => {
  const { user } = useAuth();
  
  const [lessons] = useState<AcademyLesson[]>([
    { id: '1', title: 'Trading Fundamentals', description: 'Master the basics', difficulty: 'beginner', duration: '30 min', xp_reward: 100, is_completed: true, is_locked: false, completion_rate: 100, rating: 4.8 },
    { id: '2', title: 'Technical Analysis', description: 'Chart reading mastery', difficulty: 'intermediate', duration: '45 min', xp_reward: 200, is_completed: true, is_locked: false, completion_rate: 100, rating: 4.9 },
    { id: '3', title: 'Risk Management', description: 'Protect your capital', difficulty: 'intermediate', duration: '40 min', xp_reward: 250, is_completed: false, is_locked: false, completion_rate: 65, rating: 4.7 },
    { id: '4', title: 'AI Trading Strategies', description: 'AI-powered decisions', difficulty: 'advanced', duration: '60 min', xp_reward: 400, is_completed: false, is_locked: false, completion_rate: 0, rating: 4.6 },
    { id: '5', title: 'Options Mastery', description: 'Advanced derivatives', difficulty: 'advanced', duration: '90 min', xp_reward: 500, is_completed: false, is_locked: true, completion_rate: 0, rating: 4.5 }
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: '1', title: 'First Steps', description: 'Complete first lesson', icon: '🎯', xp_reward: 50, is_unlocked: true, progress: 1, max_progress: 1, rarity: 'common' },
    { id: '2', title: 'Knowledge Seeker', description: 'Complete 5 lessons', icon: '📚', xp_reward: 200, is_unlocked: true, progress: 5, max_progress: 5, rarity: 'common' },
    { id: '3', title: 'Streak Master', description: '7 day streak', icon: '🔥', xp_reward: 300, is_unlocked: false, progress: 4, max_progress: 7, rarity: 'rare' },
    { id: '4', title: 'Trading Legend', description: 'Reach level 50', icon: '👑', xp_reward: 1000, is_unlocked: false, progress: 12, max_progress: 50, rarity: 'legendary' }
  ]);

  const [userStats] = useState({
    total_xp: 1250, level: 12, current_level_xp: 250, next_level_xp: 1000,
    lessons_completed: 15, streak_days: 4, rank: 1247, achievements_unlocked: 8
  });

  const [leaderboard] = useState([
    { rank: 1, username: 'CryptoMaster_Pro', xp: 15420, level: 45 },
    { rank: 2, username: 'ForexGuru', xp: 14280, level: 42 },
    { rank: 3, username: 'AITrader', xp: 12950, level: 38 },
    { rank: 4, username: 'You', xp: userStats.total_xp, level: userStats.level }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    return difficulty === 'beginner' ? 'text-green-400 border-green-500/50' :
           difficulty === 'intermediate' ? 'text-yellow-400 border-yellow-500/50' :
           'text-red-400 border-red-500/50';
  };

  const getRarityColor = (rarity: string) => {
    return rarity === 'common' ? 'text-gray-400' :
           rarity === 'rare' ? 'text-blue-400' :
           rarity === 'epic' ? 'text-purple-400' : 'text-yellow-400';
  };

  const startLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || lesson.is_locked) return;
    toast({ title: `Starting: ${lesson.title}`, description: `Earn ${lesson.xp_reward} XP!` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <DocumentHead title="Trading Academy - InsightFlow AI" description="Interactive trading education with gamification" />

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Academy</h1>
            <p className="text-gray-400">Level up your trading skills</p>
          </div>
          
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Level {userStats.level}</p>
                  <p className="text-lg font-bold text-white">{userStats.total_xp.toLocaleString()} XP</p>
                  <Progress value={(userStats.current_level_xp / userStats.next_level_xp) * 100} className="w-32 h-2 mt-1" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Rank #{userStats.rank}</p>
                  <p className="text-sm text-orange-400">{userStats.streak_days}🔥 day streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="lessons" className="text-white data-[state=active]:bg-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />Lessons
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-blue-600">
              <Trophy className="w-4 h-4 mr-2" />Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-blue-600">
              <Medal className="w-4 h-4 mr-2" />Leaderboard
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-white data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className={`bg-black/20 border-gray-700 text-white transition-all hover:scale-105 ${lesson.is_locked ? 'opacity-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">{lesson.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {lesson.is_completed && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {lesson.is_locked && <Lock className="w-5 h-5 text-gray-400" />}
                      {lesson.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{lesson.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />{lesson.duration}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <Zap className="w-3 h-3" />+{lesson.xp_reward} XP
                      </div>
                    </div>

                    {lesson.completion_rate > 0 && lesson.completion_rate < 100 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-blue-400">{lesson.completion_rate}%</span>
                        </div>
                        <Progress value={lesson.completion_rate} className="h-2" />
                      </div>
                    )}

                    {lesson.is_completed ? (
                      <Button disabled className="w-full bg-green-600/20 text-green-300">
                        <CheckCircle className="w-4 h-4 mr-2" />Completed
                      </Button>
                    ) : lesson.is_locked ? (
                      <Button disabled className="w-full bg-gray-600/20 text-gray-400">
                        <Lock className="w-4 h-4 mr-2" />Locked
                      </Button>
                    ) : lesson.completion_rate > 0 ? (
                      <Button onClick={() => startLesson(lesson.id)} className="w-full bg-orange-600 hover:bg-orange-700">
                        <Play className="w-4 h-4 mr-2" />Continue
                      </Button>
                    ) : (
                      <Button onClick={() => startLesson(lesson.id)} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Play className="w-4 h-4 mr-2" />Start Lesson
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-black/20 border-gray-700 text-white ${achievement.is_unlocked ? 'border-yellow-500/50' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${achievement.is_unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{achievement.title}</h3>
                          <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                          {achievement.is_unlocked && <CheckCircle className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-blue-400">
                            <Zap className="w-3 h-3" />+{achievement.xp_reward} XP
                          </div>
                          <span className="text-xs text-gray-400">{achievement.progress}/{achievement.max_progress}</span>
                        </div>
                        
                        {!achievement.is_unlocked && (
                          <Progress value={(achievement.progress / achievement.max_progress) * 100} className="h-2 mt-2" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-black/20 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {leaderboard.map((player, index) => (
                  <div key={player.username} className={`flex items-center justify-between p-4 rounded-lg ${
                    player.username === 'You' ? 'bg-blue-500/10 border-l-4 border-blue-500' :
                    index === 0 ? 'bg-yellow-500/10 border-l-4 border-yellow-500' :
                    'hover:bg-white/5'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        player.username === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-medium text-white">{player.username}</p>
                        <p className="text-sm text-gray-400">Level {player.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-400">{player.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { title: 'Lessons Completed', value: userStats.lessons_completed, icon: CheckCircle, color: 'text-green-400' },
                { title: 'Current Streak', value: `${userStats.streak_days} days`, icon: () => <div className="text-2xl">🔥</div>, color: 'text-orange-400' },
                { title: 'Achievements', value: `${userStats.achievements_unlocked}/20`, icon: Award, color: 'text-purple-400' }
              ].map((stat) => (
                <Card key={stat.title} className="bg-black/20 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-black/20 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Learning Path Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { path: 'Trading Fundamentals', completed: 8, total: 10 },
                  { path: 'Technical Analysis', completed: 5, total: 12 },
                  { path: 'Risk Management', completed: 3, total: 8 },
                  { path: 'Advanced Strategies', completed: 1, total: 15 }
                ].map((path) => (
                  <div key={path.path} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{path.path}</span>
                      <span className="text-sm text-gray-400">{path.completed}/{path.total}</span>
                    </div>
                    <Progress value={(path.completed / path.total) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademyV2; 