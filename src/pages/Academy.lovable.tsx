import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Percent, 
  Brain, 
  BarChart2, 
  Radio, 
  MessageSquare, 
  PlayCircle,
  Shield,
  Bitcoin,
  Bot,
  TrendingUp,
  DollarSign,
  Globe,
  Calculator,
  Building,
  Users,
  Clock,
  Star,
  ChevronRight,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { comprehensiveCourses } from '@/lib/academy/comprehensiveLessonData';

// Map icon names to components
const iconMap: { [key: string]: any } = {
  BarChart2,
  Shield,
  Bitcoin,
  Bot,
  TrendingUp,
  DollarSign,
  Brain,
  Globe,
  Calculator,
  Building,
};

const CourseCard = ({ course }: { course: typeof comprehensiveCourses[0] }) => {
  const Icon = iconMap[course.icon] || BookOpen;
  const navigate = useNavigate();
  
  const categoryColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    expert: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  
  return (
    <card  >
      <cardheader  >
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
            <icon  >
          </div>
          <badge  >
            {course.category}
          </Badge>
        </div>
        <cardtitle  style={{ fontSize: "1.125rem", color: "white" }}>
          {course.title}
        </CardTitle>
        <carddescription  >
          {course.description}
        </CardDescription>
      </CardHeader>
      <cardcontent  >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Duration</span>
            <span className="text-white font-medium">{course.duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Lessons</span>
            <span className="text-white font-medium">{course.lessons.length} lessons</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Students</span>
            <span className="text-white font-medium">{course.enrolled.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <star  >
              ))}
            </div>
            <span className="text-sm text-gray-400">({course.rating})</span>
          </div>
          <button  style={{ width: "100%" }}> navigate(`/academy/${course.id}`)}
          >
            Start Learning
            <chevronright  >
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <zap  >
        Featured Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <card  >
          <cardheader  >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <target  style={{ color: "white" }}>
              </div>
              <div>
                <cardtitle  style={{ color: "white" }}>Quick Start Trading</CardTitle>
                <carddescription  >
                  Get trading in 7 days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <cardcontent  >
            <p className="text-sm text-gray-300 mb-4">
              Intensive bootcamp covering all essentials to start trading confidently within a week.
            </p>
            <button  style={{ width: "100%", color: "white" }}>
              Enroll Now
            </Button>
          </CardContent>
        </Card>
        
        <card  >
          <cardheader  >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <award  style={{ color: "white" }}>
              </div>
              <div>
                <cardtitle  style={{ color: "white" }}>Pro Certification</CardTitle>
                <carddescription  >
                  Industry recognized cert
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <cardcontent  >
            <p className="text-sm text-gray-300 mb-4">
              Complete comprehensive program and earn your professional trading certification.
            </p>
            <button  style={{ width: "100%", color: "white" }}>
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <card  >
          <cardheader  >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <users  style={{ color: "white" }}>
              </div>
              <div>
                <cardtitle  style={{ color: "white" }}>Live Mentorship</CardTitle>
                <carddescription  >
                  1-on-1 with experts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <cardcontent  >
            <p className="text-sm text-gray-300 mb-4">
              Get personalized guidance from professional traders in live sessions.
            </p>
            <button  style={{ width: "100%", color: "white" }}>
              Book Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredCourses = selectedCategory === 'all' 
    ? comprehensiveCourses 
    : comprehensiveCourses.filter(course => course.category === selectedCategory);
  
  const categories = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <bookopen  style={{ color: "white" }}>
          </span>
          Trading Academy
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Master the markets with comprehensive courses designed by professional traders. 
          From basics to advanced strategies, we've got you covered.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <card  >
          <cardcontent  >
            <div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.length}+
            </div>
            <div className="text-sm text-gray-400">Courses</div>
          </CardContent>
        </Card>
        <card  >
          <cardcontent  >
            <div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.reduce((acc, course) => acc + course.enrolled, 0).toLocaleString()}+
            </div>
            <div className="text-sm text-gray-400">Students</div>
          </CardContent>
        </Card>
        <card  >
          <cardcontent  >
            <div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.reduce((acc, course) => acc + course.lessons.length, 0)}+
            </div>
            <div className="text-sm text-gray-400">Lessons</div>
          </CardContent>
        </Card>
        <card  >
          <cardcontent  >
            <div className="text-3xl font-bold text-white mb-1">
              4.8
            </div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Section */}
      <featuredsection  >
      
      {/* Category Filter */}
      <tabs defaultValue="all" >
        <tabslist  style={{ display: "grid", width: "100%" }}>
          {categories.map((category) => (
            <tabstrigger  >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <tabscontent  >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <coursecard  >
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Live Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        <card  >
          <cardheader  >
            <cardtitle  style={{ color: "white", display: "flex", alignItems: "center" }}>
              <radio  >
              Live Trading Sessions
            </CardTitle>
            <carddescription  >
              Join professional traders in real-time market analysis
            </CardDescription>
          </CardHeader>
          <cardcontent  >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Forex London Session</h4>
                  <p className="text-sm text-gray-400">With TraderPro • Starting in 2h</p>
                </div>
                <button size="sm" >
                  Join Live
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Crypto Market Review</h4>
                  <p className="text-sm text-gray-400">With CryptoKing • Tomorrow 9 AM</p>
                </div>
                <button size="sm" variant="outline" >
                  Set Reminder
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Options Strategy Workshop</h4>
                  <p className="text-sm text-gray-400">With ThetaGang • Friday 2 PM</p>
                </div>
                <button size="sm" variant="outline" >
                  Set Reminder
                </Button>
              </div>
            </div>
            <link to="/broadcast" style={{ display: "block" }}>
              <button variant="ghost" style={{ width: "100%" }}>
                View All Sessions
                <chevronright  >
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <card  >
          <cardheader  >
            <cardtitle  style={{ color: "white", display: "flex", alignItems: "center" }}>
              <messagesquare  >
              Community
            </CardTitle>
            <carddescription  >
              Connect with fellow traders
            </CardDescription>
          </CardHeader>
          <cardcontent  >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <users  >
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Active Discussions</p>
                  <p className="text-xs text-gray-400">234 topics today</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                  <award  >
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Study Groups</p>
                  <p className="text-xs text-gray-400">45 active groups</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <target  >
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Trading Challenges</p>
                  <p className="text-xs text-gray-400">New challenge weekly</p>
                </div>
              </div>
            </div>
            <link to="/community" >
              <button  style={{ width: "100%" }}>
                Join Community
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const lovable = { component: true };
