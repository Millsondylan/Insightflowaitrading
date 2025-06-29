import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <CardHeader>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <Icon  />
          </div>
          <Badge className={categoryColors[course.category]}>
            {course.category}
          </Badge>
        </div>
        <CardTitle style={{ color: "white" }}>
          {course.title}
        </CardTitle>
        <CardDescription style={{ color: "#9CA3AF" }}>
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#9CA3AF" }}>Duration</span>
            <span style={{ color: "white" }}>{course.duration}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#9CA3AF" }}>Lessons</span>
            <span style={{ color: "white" }}>{course.lessons.length} lessons</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#9CA3AF" }}>Students</span>
            <span style={{ color: "white" }}>{course.enrolled.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {[...Array(5)].map((_, i) => (
                <span style={{fontSize: '16px'}}>⭐</span>
              ))}
            </div>
            <span style={{ color: "#9CA3AF" }}>({course.rating})</span>
          </div>
          <Button 
            style={{ width: "100%" }}
            onClick={() => navigate(`/academy/${course.id}`)}
          >
            Start Learning
            <ChevronRight  />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedSection = () => {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{ fontWeight: "700", color: "white", display: "flex", alignItems: "center" }}>
        <span style={{fontSize: '16px'}}>⚡</span>
        Featured Courses
      </h2>
      <div >
        <Card >
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{fontSize: '16px'}}>🎯</span>
              </div>
              <div>
                <CardTitle style={{ color: "white" }}>Quick Start Trading</CardTitle>
                <CardDescription >
                  Get trading in 7 days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: "16px" }}>
              Intensive bootcamp covering all essentials to start trading confidently within a week.
            </p>
            <Button style={{ width: "100%", color: "white" }}>
              Enroll Now
            </Button>
          </CardContent>
        </Card>
        
        <Card >
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award style={{ color: "white" }} />
              </div>
              <div>
                <CardTitle style={{ color: "white" }}>Pro Certification</CardTitle>
                <CardDescription >
                  Industry recognized cert
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: "16px" }}>
              Complete comprehensive program and earn your professional trading certification.
            </p>
            <Button style={{ width: "100%", color: "white" }}>
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card >
          <CardHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{fontSize: '16px'}}>👤</span>
              </div>
              <div>
                <CardTitle style={{ color: "white" }}>Live Mentorship</CardTitle>
                <CardDescription >
                  1-on-1 with experts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: "16px" }}>
              Get personalized guidance from professional traders in live sessions.
            </p>
            <Button style={{ width: "100%", color: "white" }}>
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
    <div style={{ marginTop: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontWeight: "700", color: "white", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ borderRadius: "0.75rem" }}>
            <BookOpen style={{ color: "white" }} />
          </span>
          Trading Academy
        </h1>
        <p style={{ color: "#9CA3AF", marginLeft: "auto", marginRight: "auto" }}>
          Master the markets with comprehensive courses designed by professional traders. 
          From basics to advanced strategies, we've got you covered.
        </p>
      </div>
      
      {/* Stats */}
      <div style={{ marginBottom: "32px" }}>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>
              {comprehensiveCourses.length}+
            </div>
            <div style={{ color: "#9CA3AF" }}>Courses</div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>
              {comprehensiveCourses.reduce((acc, course) => acc + course.enrolled, 0).toLocaleString()}+
            </div>
            <div style={{ color: "#9CA3AF" }}>Students</div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>
              {comprehensiveCourses.reduce((acc, course) => acc + course.lessons.length, 0)}+
            </div>
            <div style={{ color: "#9CA3AF" }}>Lessons</div>
          </CardContent>
        </Card>
        <Card >
          <CardContent style={{ padding: "24px" }}>
            <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "white" }}>
              4.8
            </div>
            <div style={{ color: "#9CA3AF" }}>Avg Rating</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Section */}
      <FeaturedSection />
      
      {/* Category Filter */}
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList style={{ width: "100%", marginLeft: "auto", marginRight: "auto", marginBottom: "32px" }}>
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory} >
          <div >
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Live Section */}
      <div >
        <Card >
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <Radio  />
              Live Trading Sessions
            </CardTitle>
            <CardDescription style={{ color: "#9CA3AF" }}>
              Join professional traders in real-time market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div >
              <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
                <div>
                  <h4 style={{ color: "white" }}>Forex London Session</h4>
                  <p style={{ color: "#9CA3AF" }}>With TraderPro • Starting in 2h</p>
                </div>
                <Button size="sm" >
                  Join Live
                </Button>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
                <div>
                  <h4 style={{ color: "white" }}>Crypto Market Review</h4>
                  <p style={{ color: "#9CA3AF" }}>With CryptoKing • Tomorrow 9 AM</p>
                </div>
                <Button size="sm" variant="outline">
                  Set Reminder
                </Button>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
                <div>
                  <h4 style={{ color: "white" }}>Options Strategy Workshop</h4>
                  <p style={{ color: "#9CA3AF" }}>With ThetaGang • Friday 2 PM</p>
                </div>
                <Button size="sm" variant="outline">
                  Set Reminder
                </Button>
              </div>
            </div>
            <Link to="/broadcast" >
              <Button variant="ghost" style={{ width: "100%" }}>
                View All Sessions
                <ChevronRight  />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card >
          <CardHeader>
            <CardTitle style={{ color: "white", display: "flex", alignItems: "center" }}>
              <MessageSquare  />
              Community
            </CardTitle>
            <CardDescription style={{ color: "#9CA3AF" }}>
              Connect with fellow traders
            </CardDescription>
          </CardHeader>
          <CardContent >
            <div >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{fontSize: '16px'}}>👤</span>
                </div>
                <div >
                  <p style={{ color: "white" }}>Active Discussions</p>
                  <p style={{ color: "#9CA3AF" }}>234 topics today</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Award  />
                </div>
                <div >
                  <p style={{ color: "white" }}>Study Groups</p>
                  <p style={{ color: "#9CA3AF" }}>45 active groups</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{fontSize: '16px'}}>🎯</span>
                </div>
                <div >
                  <p style={{ color: "white" }}>Trading Challenges</p>
                  <p style={{ color: "#9CA3AF" }}>New challenge weekly</p>
                </div>
              </div>
            </div>
            <Link to="/community">
              <Button style={{ width: "100%" }}>
                Join Community
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
