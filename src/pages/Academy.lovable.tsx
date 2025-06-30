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
    <Card >
      <Cardheader />
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
            <Icon />
          <Badge />
            {course.category}
          </Card>
        </div>
        <Cardtitle  style={{ fontSize: "1.125rem", color: "white" }}>
          {course.title}
        </Cardtitle>
        <Carddescription >
          {course.description}
        </Carddescription />
      <Cardcontent >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Duration</Carddescription>
            <span className="text-white font-medium">{course.duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Lessons</div>
            <span className="text-white font-medium">{course.lessons.length} lessons</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Students</div>
            <span className="text-white font-medium">{course.enrolled.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star >
              ))}
            </div>
            <span className="text-sm text-gray-400">({course.rating})</span>
          </div>
          <Button  style={{ width: "100%" }}> navigate(`/academy/${course.id}`)}
          >
            Start Learning
            <ChevronRight >
          </button>
        </div />
    </Card>
  );
};

const FeaturedSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"></div>
        <zap >
        Featured Courses
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card >
          <Cardheader >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <target  style={{ color: "white" }}>
              </div>
              <div>
                <Cardtitle  style={{ color: "white" }}></div>Quick Start Trading</div>
                <Carddescription >
                  Get trading in 7 days
                </Carddescription>
              </div>
            </div />
          <Cardcontent >
            <p className="text-sm text-gray-300 mb-4">
              Intensive bootcamp covering all essentials to start trading confidently within a week.
            </Cardcontent>
            <Button  style={{ width: "100%", color: "white" }}>
              Enroll Now
            </button />
        </button>
        
        <Card >
          <Cardheader >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <award  style={{ color: "white" }}/>
              <div>
                <Cardtitle  style={{ color: "white" }}></Card>Pro Certification</div>
                <Carddescription >
                  Industry recognized cert
                </Carddescription>
              </div>
            </div />
          <Cardcontent >
            <p className="text-sm text-gray-300 mb-4">
              Complete comprehensive program and earn your professional trading certification.
            </Cardcontent>
            <Button  style={{ width: "100%", color: "white" }}>
              Learn More
            </button />
        </button>
        
        <Card >
          <Cardheader >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users  style={{ color: "white" }}/>
              <div>
                <Cardtitle  style={{ color: "white" }}></Card>Live Mentorship</div>
                <Carddescription >
                  1-on-1 with experts
                </Carddescription>
              </div>
            </div />
          <Cardcontent >
            <p className="text-sm text-gray-300 mb-4">
              Get personalized guidance from professional traders in live sessions.
            </Cardcontent>
            <Button  style={{ width: "100%", color: "white" }}>
              Book Session
            </button />
        </button>
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
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl"></div>
            <bookopen  style={{ color: "white" }}>
          </div>
          Trading Academy
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Master the markets with comprehensive courses designed by professional traders. 
          From basics to advanced strategies, we've got you covered.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card >
          <Cardcontent >
            <div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.length}+
            </div>
            <div className="text-sm text-gray-400">Courses</div />
        </div>
        <Card >
          <Cardcontent >
            <div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.reduce((acc, course) => acc + course.enrolled, 0).toLocaleString()}+
            </Card>
            <div className="text-sm text-gray-400">Students</div />
        </div>
        <Card >
          <Cardcontent >
            <div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.reduce((acc, course) => acc + course.lessons.length, 0)}+
            </Card>
            <div className="text-sm text-gray-400">Lessons</div />
        </div>
        <Card >
          <Cardcontent >
            <div className="text-3xl font-bold text-white mb-1">
              4.8
            </Card>
            <div className="text-sm text-gray-400">Avg Rating</div />
        </div>
      </div>
      
      {/* Featured Section */}
      <featuredsection >
      
      {/* Category Filter */}
      <Tabs defaultValue="all">
        <Tabslist  style={{ display: "grid", width: "100%" }}>
          {categories.map((category) => (
            <Tabstrigger /></Tabslist /></Tabslist />
              {category}
            </Tabs>
          ))}
        </TabsList>
        
        <TabsContent >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <coursecard >
            ))}
          </div />
      </TabsContent>
      
      {/* Live Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        <Card >
          <Cardheader >
            <Cardtitle  style={{ color: "white", display: "flex", alignItems: "center" }}></div>
              <radio >
              Live Trading Sessions
            </div>
            <Carddescription >
              Join professional traders in real-time market analysis
            </Carddescription />
          <Cardcontent >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white"/></Cardcontent /></Cardcontent />Forex London Session</Carddescription>
                  <p className="text-sm text-gray-400">With TraderPro • Starting in 2h</p>
                </div>
                <Button size="sm">
                  Join Live
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white"></div>Crypto Market Review</div>
                  <p className="text-sm text-gray-400">With CryptoKing • Tomorrow 9 AM</p>
                </div>
                <Button size="sm" variant="outline">
                  Set Reminder
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-white"></div>Options Strategy Workshop</div>
                  <p className="text-sm text-gray-400">With ThetaGang • Friday 2 PM</p>
                </div>
                <Button size="sm" variant="outline">
                  Set Reminder
                </button>
              </div>
            </div>
            <Link to="/broadcast" style={{ display: "block" }}>
              <Button variant="ghost" style={{ width: "100%" }}/></Link /></Link />
                View All Sessions
                <ChevronRight />
            </Link />
        </Link>
        
        <Card >
          <Cardheader >
            <Cardtitle  style={{ color: "white", display: "flex", alignItems: "center" }}/></Card /></Card />
              <MessageSquare >
              Community
            </Card>
            <Carddescription >
              Connect with fellow traders
            </Carddescription />
          <Cardcontent >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Users />
                <div className="flex-1">
                  <p className="text-sm text-white">Active Discussions</Carddescription>
                  <p className="text-xs text-gray-400">234 topics today</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                  <award >
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Study Groups</div>
                  <p className="text-xs text-gray-400">45 active groups</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <target >
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Trading Challenges</div>
                  <p className="text-xs text-gray-400">New challenge weekly</p>
                </div>
              </div>
            </div>
            <Link to="/community">
              <Button  style={{ width: "100%" }}/></Link /></Link />
                Join Community
              </Link />
          </Cardcontent />
      </Link>
    </div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
