
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Award, Target } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  type: 'achievement' | 'skill' | 'milestone' | 'special';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface BadgeDisplayProps {
  badges: BadgeData[];
  title?: string;
  showProgress?: boolean;
}

const BadgeDisplay = ({ badges, title = "Achievements", showProgress = true }: BadgeDisplayProps) => {
  const getBadgeIcon = (type: BadgeData['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
      case 'skill':
        return <Star className="h-4 w-4" />;
      case 'milestone':
        return <Target className="h-4 w-4" />;
      case 'special':
        return <Award className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: BadgeData['type'], earned: boolean) => {
    if (!earned) return 'outline';
    
    switch (type) {
      case 'achievement':
        return 'default';
      case 'skill':
        return 'secondary';
      case 'milestone':
        return 'outline';
      case 'special':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Your earned badges and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-lg border transition-all ${
                badge.earned 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getBadgeIcon(badge.type)}
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                </div>
                <Badge variant={getBadgeVariant(badge.type, badge.earned)}>
                  {badge.earned ? 'Earned' : 'Locked'}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">
                {badge.description}
              </p>
              
              {badge.earned && badge.earnedDate && (
                <p className="text-xs text-green-600">
                  Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                </p>
              )}
              
              {showProgress && badge.progress !== undefined && badge.maxProgress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress}/{badge.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeDisplay;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
