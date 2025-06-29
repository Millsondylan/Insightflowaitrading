import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import { 
  getCategories, 
  getCourses, 
  getUserProgress,
  startCourse,
  AcademyCategory,
  AcademyCourse,
  AcademyProgress
} from '@/lib/db/academy';
import { useAuditLog } from '@/lib/monitoring/auditLogger';

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

const CourseCard = ({ course, progress }: { course: AcademyCourse; progress?: AcademyProgress }) => {
  const Icon = iconMap[course.icon || 'BookOpen'] || BookOpen;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logClick } = useAuditLog();
  
  const categoryColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    expert: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  
  const handleCourseClick = async () => {
    logClick('CourseCard', { courseId: course.id, courseTitle: course.title });
    
    if (user && !progress) {
      await startCourse(user.id, course.id);
    }
    
    navigate(`/academy/course/${course.id}`);
  };
  
  return (
    <Card 
      className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
      onClick={handleCourseClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${categoryColors[course.difficulty || 'beginner']}`}>
            <Icon className="w-6 h-6" />
          </div>
          <badge className={categoryColors[course.difficulty || 'beginner']}>
            {course.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl text-white">{course.title}</CardTitle>
        <CardDescription className="text-gray-400">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-semibold">{Math.round(progress.progress_percentage)}%</span>
              </div>
              <progress 
                value={progress.progress_percentage} 
                className="h-2 bg-gray-700"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{course.duration_hours} hours</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{course.enrolled_count.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <bookOpen className="w-4 h-4" />
              <span>{course.modules_count} lessons</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementCard = ({ icon: Icon, title, value, color }: any) => (
  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AcademyPage() {
  const { user } = useAuth();

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const { logNavigation } = useAuditLog();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<academyCategory[]>([]);
  const [courses, setCourses] = useState<academyCourse[]>([]);
  const [userProgress, setUserProgress] = useState<academyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    logNavigation('home', '/academy');
    loadData();
  }, [user]);
  
  useEffect(() => {
    loadCourses();
  }, [selectedCategory]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, coursesData] = await Promise.all([
        getCategories(),
        getCourses()
      ]);
      
      setCategories(categoriesData);
      setCourses(coursesData);
      
      if (user) {
        const progressData = await getUserProgress(user.id);
        setUserProgress(progressData);
      }
    } catch (error) {
      console.error('Error loading academy data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadCourses = async () => {
    try {
      const coursesData = await getCourses(
        selectedCategory === 'all' 
          ? {} 
          : { difficulty: selectedCategory as any }
      );
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };
  
  const getProgressForCourse = (courseId: string) => {
    return userProgress.find(p => p.course_id === courseId);
  };
  
  const completedCourses = userProgress.filter(p => p.completed_at).length;
  const totalTimeSpent = userProgress.reduce((sum, p) => sum + p.time_spent_seconds, 0) / 3600;
  const averageProgress = userProgress.length > 0 
    ? userProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / userProgress.length
    : 0;
  
  const categoryOptions = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <bookOpen className="w-8 h-8 text-white" />
          </span>
          Trading Academy
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Master the markets with comprehensive courses designed by professional traders. 
          From basics to advanced strategies, we've got you covered.
        </p>
      </div>
      
      {/* Stats */}
      {user && userProgress.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <achievementCard
            icon={Award}
            title="Courses Completed"
            value={completedCourses}
            color="bg-green-600"
          />
          <achievementCard
            icon={Target}
            title="Average Progress"
            value={`${Math.round(averageProgress)}%`}
            color="bg-blue-600"
          />
          <achievementCard
            icon={Clock}
            title="Time Invested"
            value={`${totalTimeSpent.toFixed(1)}h`}
            color="bg-purple-600"
          />
          <achievementCard
            icon={Zap}
            title="Current Streak"
            value="7 days"
            color="bg-orange-600"
          />
        </div>
      )}
      
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto bg-gray-800">
          {categoryOptions.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="capitalize data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={getProgressForCourse(course.id)}
            />
          ))}
        </div>
      )}
      
      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No courses found in this category.</p>
        </div>
      )}
    </div>
  );
}
