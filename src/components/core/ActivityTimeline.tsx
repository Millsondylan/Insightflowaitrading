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

const iconMap: Record<ActivityType, React.ElementType> = {
  journal: BookOpen,
  strategy: Bot,
  user: UserPlus,
  reflection: Brain,
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filteredEvents = useMemo(() => {
    if (filter === 'all') {
      return events;
    }
    return events.filter(event => event.type === filter);
  }, [events, filter]);

  const renderIcon = (type: ActivityType) => {
    const Icon = iconMap[type] || BookOpen;
    return <Icon className="h-4 w-4"/>;
  };

  return (
    <div className="activity-timeline-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
        <Select value={filter} onValueChange={(value) => setFilter(value as ActivityType | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="user">New Users</SelectItem>
            <SelectItem value="journal">Journals</SelectItem>
            <SelectItem value="strategy">Strategies</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="activity-timeline">
        <AnimatePresence>
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
                    <TimeAgo datetime={event.timestamp}/>
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