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
      <Cardheader  />
        <Div className="flex justify-between items-start">
          <Div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
            <Icon >
          </Card>
          <Badge  />
            {course.category}
          </Badge>
        </Div>
        <Cardtitle  style={{ fontSize: "1.125rem", color: "white" }}>
          {course.title}
        </Cardtitle>
        <Carddescription >
          {course.description}
        </Carddescription>
      </Cardheader>
      <Cardcontent >
        <Div className="space-y-4">
          <Div className="flex items-center justify-between text-sm">
            <Span className="text-gray-400">Duration</Cardcontent>
            <Span className="text-white font-medium">{course.duration}</Span>
          </Div>
          <Div className="flex items-center justify-between text-sm">
            <Span className="text-gray-400">Lessons</Div>
            <Span className="text-white font-medium">{course.lessons.length} lessons</Span>
          </Div>
          <Div className="flex items-center justify-between text-sm">
            <Span className="text-gray-400">Students</Div>
            <Span className="text-white font-medium">{course.enrolled.toLocaleString()}</Span>
          </Div>
          <Div className="flex items-center gap-2">
            <Div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <star >
              ))}
            </Div>
            <Span className="text-sm text-gray-400">({course.rating})</Span>
          </Div>
          <Button  style={{ width: "100%" }}> navigate(`/academy/${course.id}`)}
          >
            Start Learning
            <chevronright >
          </Button>
        </Div>
      </Cardcontent>
    </Card>
  );
};

const FeaturedSection = () => {
  return (
    <Div className="mb-8">
      <H2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"></Div></Div>
        <zap >
        Featured Courses
      </Div>
      <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card >
          <Cardheader >
            <Div className="flex items-center gap-3">
              <Div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <target  style={{ color: "white" }}>
              </Div>
              <Div>
                <Cardtitle  style={{ color: "white" }}></Div></Div>Quick Start Trading</Div>
                <Carddescription >
                  Get trading in 7 days
                </Carddescription>
              </Div>
            </Div>
          </Cardheader>
          <Cardcontent >
            <P className="text-sm text-gray-300 mb-4">
              Intensive bootcamp covering all essentials to start trading confidently within a week.
            </Cardcontent>
            <Button  style={{ width: "100%", color: "white" }}>
              Enroll Now
            </Button>
          </Cardcontent>
        </Card>
        
        <Card >
          <Cardheader >
            <Div className="flex items-center gap-3">
              <Div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <award  style={{ color: "white" }}>
              </Card>
              <Div>
                <Cardtitle  style={{ color: "white" }}></Div></Div>Pro Certification</Div>
                <Carddescription >
                  Industry recognized cert
                </Carddescription>
              </Div>
            </Div>
          </Cardheader>
          <Cardcontent >
            <P className="text-sm text-gray-300 mb-4">
              Complete comprehensive program and earn your professional trading certification.
            </Cardcontent>
            <Button  style={{ width: "100%", color: "white" }}>
              Learn More
            </Button>
          </Cardcontent>
        </Card>
        
        <Card >
          <Cardheader >
            <Div className="flex items-center gap-3">
              <Div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <users  style={{ color: "white" }}>
              </Card>
              <Div>
                <Cardtitle  style={{ color: "white" }}></Div></Div>Live Mentorship</Div>
                <Carddescription >
                  1-on-1 with experts
                </Carddescription>
              </Div>
            </Div>
          </Cardheader>
          <Cardcontent >
            <P className="text-sm text-gray-300 mb-4">
              Get personalized guidance from professional traders in live sessions.
            </Cardcontent>
            <Button  style={{ width: "100%", color: "white" }}>
              Book Session
            </Button>
          </Cardcontent>
        </Card>
      </Div>
    </Div>
  );
};

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredCourses = selectedCategory === 'all' 
    ? comprehensiveCourses 
    : comprehensiveCourses.filter(course => course.category === selectedCategory);
  
  const categories = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];
  
  return (
    <Div className="space-y-8">
      {/* Header */}
      <Div className="text-center mb-8">
        <H1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Span className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl"></Div></Div>
            <bookopen  style={{ color: "white" }}>
          </Div>
          Trading Academy
        </H1>
        <P className="text-xl text-gray-400 max-w-2xl mx-auto">
          Master the markets with comprehensive courses designed by professional traders. 
          From basics to advanced strategies, we've got you covered.
        </P>
      </Div>
      
      {/* Stats */}
      <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card >
          <Cardcontent >
            <Div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.length}+
            </Div>
            <Div className="text-sm text-gray-400">Courses</Div>
          </Cardcontent>
        </Card>
        <Card >
          <Cardcontent >
            <Div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.reduce((acc, course) => acc + course.enrolled, 0).toLocaleString()}+
            </Card>
            <Div className="text-sm text-gray-400">Students</Div>
          </Cardcontent>
        </Card>
        <Card >
          <Cardcontent >
            <Div className="text-3xl font-bold text-white mb-1">
              {comprehensiveCourses.reduce((acc, course) => acc + course.lessons.length, 0)}+
            </Card>
            <Div className="text-sm text-gray-400">Lessons</Div>
          </Cardcontent>
        </Card>
        <Card >
          <Cardcontent >
            <Div className="text-3xl font-bold text-white mb-1">
              4.8
            </Card>
            <Div className="text-sm text-gray-400">Avg Rating</Div>
          </Cardcontent>
        </Card>
      </Div>
      
      {/* Featured Section */}
      <featuredsection >
      
      {/* Category Filter */}
      <tabs defaultValue="all">
        <Tabslist  style={{ display: "grid", width: "100%" }}>
          {categories.map((category) => (
            <Tabstrigger ></Tabslist></Tabslist>
              {category}
            </Tabslist>
          ))}
        </TabsList>
        
        <tabscontent >
          <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <coursecard >
            ))}
          </Div>
        </TabsContent>
      </Tabs>
      
      {/* Live Section */}
      <Div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        <Card >
          <Cardheader >
            <Cardtitle  style={{ color: "white", display: "flex", alignItems: "center" }}></Div></Div>
              <radio >
              Live Trading Sessions
            </Div>
            <Carddescription >
              Join professional traders in real-time market analysis
            </Carddescription>
          </Cardheader>
          <Cardcontent >
            <Div className="space-y-4">
              <Div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <Div>
                  <H4 className="font-medium text-white"></Cardcontent></Cardcontent>Forex London Session</Cardcontent>
                  <P className="text-sm text-gray-400">With TraderPro • Starting in 2h</P>
                </Div>
                <Button size="sm">
                  Join Live
                </Button>
              </Div>
              <Div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <Div>
                  <H4 className="font-medium text-white"></Div></Div>Crypto Market Review</Div>
                  <P className="text-sm text-gray-400">With CryptoKing • Tomorrow 9 AM</P>
                </Div>
                <Button size="sm" variant="outline">
                  Set Reminder
                </Button>
              </Div>
              <Div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <Div>
                  <H4 className="font-medium text-white"></Div></Div>Options Strategy Workshop</Div>
                  <P className="text-sm text-gray-400">With ThetaGang • Friday 2 PM</P>
                </Div>
                <Button size="sm" variant="outline">
                  Set Reminder
                </Button>
              </Div>
            </Div>
            <Link to="/broadcast" style={{ display: "block" }}>
              <Button variant="ghost" style={{ width: "100%" }}></Link></Link>
                View All Sessions
                <chevronright >
              </Link>
            </Link>
          </Cardcontent>
        </Card>
        
        <Card >
          <Cardheader >
            <Cardtitle  style={{ color: "white", display: "flex", alignItems: "center" }}></Card></Card>
              <messagesquare >
              Community
            </Card>
            <Carddescription >
              Connect with fellow traders
            </Carddescription>
          </Cardheader>
          <Cardcontent >
            <Div className="space-y-3">
              <Div className="flex items-center gap-3">
                <Div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <users >
                </Cardcontent>
                <Div className="flex-1">
                  <P className="text-sm text-white">Active Discussions</Div>
                  <P className="text-xs text-gray-400">234 topics today</P>
                </Div>
              </Div>
              <Div className="flex items-center gap-3">
                <Div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                  <award >
                </Div>
                <Div className="flex-1">
                  <P className="text-sm text-white">Study Groups</Div>
                  <P className="text-xs text-gray-400">45 active groups</P>
                </Div>
              </Div>
              <Div className="flex items-center gap-3">
                <Div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <target >
                </Div>
                <Div className="flex-1">
                  <P className="text-sm text-white">Trading Challenges</Div>
                  <P className="text-xs text-gray-400">New challenge weekly</P>
                </Div>
              </Div>
            </Div>
            <Link to="/community">
              <Button  style={{ width: "100%" }}></Link></Link>
                Join Community
              </Link>
            </Link>
          </Cardcontent>
        </Card>
      </Div>
    </Div>
  );
}


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
