import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bot, UserPlus, Brain } from 'lucide-react';
import { ActivityEvent, ActivityType } from '@/lib/admin/getActivityTimeline';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import TimeAgo from 'timeago-react';
import '@/styles/admin.css';

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

const iconMap: Record<activityType, React.ElementType> = {
  journal: BookOpen,
  strategy: Bot,
  user: UserPlus,
  reflection: Brain,
};

const ActivityTimeline: React.FC<activityTimelineProps> = ({ events }) => {
  const [filter, setFilter] = useState<activityType | 'all'>('all');

  const filteredEvents = useMemo(() => {
    if (filter === 'all') {
      return events;
    }
    return events.filter(event => event.type === filter);
  }, [events, filter]);

  const renderIcon = (type: ActivityType) => {
    const Icon = iconMap[type] || BookOpen;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="activity-timeline-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
        <select value={filter} onValueChange={(value) => setFilter(value as ActivityType | 'all')}>
          <selectTrigger className="w-[180px]">
            <selectValue placeholder="Filter by type" />
          </SelectTrigger>
          <selectContent>
            <selectItem value="all">All Activities</SelectItem>
            <selectItem value="user">New Users</SelectItem>
            <selectItem value="journal">Journals</SelectItem>
            <selectItem value="strategy">Strategies</SelectItem>
          </SelectContent>
        </select>
      </div>
      
      <div className="activity-timeline">
        <animatePresence>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn('timeline-item', `type-${event.type}`)}
              >
                <div className="timeline-icon">
                  {renderIcon(event.type)}
                </div>
                <div className="timeline-item-content">
                  <p className="timeline-label">{event.label}</p>
                  <p className="timeline-timestamp">
                    <timeAgo datetime={event.timestamp} />
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              No activities found for the selected filter.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityTimeline;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 