import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Target, Award } from 'lucide-react';

const mockCourses = [
  {
    id: 1,
    title: 'Trading Fundamentals',
    description: 'Learn the basics of trading and market analysis',
    difficulty: 'beginner',
    duration: '2 hours',
    lessons: 8,
    completed: false
  },
  {
    id: 2,
    title: 'Technical Analysis',
    description: 'Master chart patterns and technical indicators',
    difficulty: 'intermediate',
    duration: '4 hours',
    lessons: 12,
    completed: false
  },
  {
    id: 3,
    title: 'Risk Management',
    description: 'Protect your capital with proper risk management',
    difficulty: 'advanced',
    duration: '3 hours',
    lessons: 10,
    completed: false
  }
];

const Academy = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Trading Academy</h1>
        <p className="text-gray-400">
          Master trading skills with our comprehensive course library
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="bg-black/20 border-white/10 hover:bg-black/30 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-blue-600/20">
                  <BookOpen className="w-6 h-6 text-blue-400"/>
                </div>
                <Badge variant={course.difficulty === 'beginner' ? 'default' : course.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                  {course.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl text-white">{course.title}</CardTitle>
              <CardDescription className="text-gray-400">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lessons: {course.lessons}</span>
                  <span className="text-gray-400">Duration: {course.duration}</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Start Course
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-black/20 border-white/10 p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
            <p className="text-white font-semibold">First Course</p>
            <p className="text-gray-400 text-sm">Complete your first course</p>
          </Card>
          <Card className="bg-black/20 border-white/10 p-4 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2"/>
            <p className="text-white font-semibold">Quick Learner</p>
            <p className="text-gray-400 text-sm">Complete 3 courses in a week</p>
          </Card>
          <Card className="bg-black/20 border-white/10 p-4 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2"/>
            <p className="text-white font-semibold">Master Trader</p>
            <p className="text-gray-400 text-sm">Complete all advanced courses</p>
          </Card>
          <Card className="bg-black/20 border-white/10 p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2"/>
            <p className="text-white font-semibold">Knowledge Seeker</p>
            <p className="text-gray-400 text-sm">Read 50 articles</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Academy;