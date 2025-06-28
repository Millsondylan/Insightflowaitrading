import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Percent, Brain, BarChart2, Radio, MessageSquare, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const courses = [
    { title: 'Technical Analysis 101', category: 'Beginner', lessons: 12, icon: BarChart2 },
    { title: 'Advanced Risk Management', category: 'Advanced', lessons: 8, icon: Percent },
    { title: 'Trading Psychology', category: 'Intermediate', lessons: 10, icon: Brain },
    { title: 'Options & Derivatives', category: 'Advanced', lessons: 15, icon: BarChart2 },
];

const CourseCard = ({ course }: { course: (typeof courses)[0] }) => {
    const Icon = course.icon;
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm group hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start">
                <div>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                    <p className="text-sm text-gray-400">{course.category} • {course.lessons} Lessons</p>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle />
                </Button>
            </div>
        </div>
    );
};

export default function AcademyPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="bg-white/10 p-2 rounded-lg"><BookOpen className="text-blue-400" /></span>
                        Academy
                    </h1>
                    <p className="text-gray-400 mt-1">Master the markets with our expert-led courses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => <CourseCard key={course.title} course={course} />)}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4">Continue Learning</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-300">Technical Analysis 101</p>
                        <Progress value={66} className="h-2" />
                        <p className="text-xs text-gray-500 text-right">8 of 12 lessons complete</p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Resume Course</Button>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Radio size={18} /> Live Broadcasts</h3>
                    <p className="text-sm text-gray-400 mb-4">Join live sessions with professional traders.</p>
                    <Link to="/broadcast">
                        <Button variant="outline" className="w-full">View Schedule</Button>
                    </Link>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><MessageSquare size={18} /> Discussions</h3>
                    <p className="text-sm text-gray-400 mb-4">Discuss course material with the community.</p>
                    <Link to="/community">
                        <Button variant="outline" className="w-full">Go to Community</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
