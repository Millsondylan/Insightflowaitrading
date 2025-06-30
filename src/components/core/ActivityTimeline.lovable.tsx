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

const iconMap: Record<Activitytype > = {
  journal: BookOpen,
  strategy: Bot,
  user: UserPlus,
  reflection: Brain,
};

const ActivityTimeline: React.FC<Activitytimelineprops  /> = ({ events }) => {
  const [filter, setFilter] = useState<activitytype  >('all');

  const filteredEvents = useMemo(() => {
    if (filter === 'all') {
      return events;
    }
    return events.filter(event => event.type === filter);
  }, [events, filter]);

  const renderIcon = (type: ActivityType) => {
    const Icon = iconMap[type] || BookOpen;
    return <icon  >;
  };

  return (
    <div className="activity-timeline-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Activity Timeline</h3>
        <select  > setFilter(value as ActivityType | 'all')}>
          <selecttrigger  >
            <selectvalue placeholder="Filter by type" >
          </SelectTrigger>
          <selectcontent  >
            <selectitem value="all" >All Activities</SelectItem>
            <selectitem value="user" >New Users</SelectItem>
            <selectitem value="journal" >Journals</SelectItem>
            <selectitem value="strategy" >Strategies</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="activity-timeline">
        <animatepresence  >
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
                    <timeago  >
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
