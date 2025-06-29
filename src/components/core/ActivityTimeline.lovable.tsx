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

const iconMap: Record<Activitytype> = {
  journal: BookOpen,
  strategy: Bot,
  user: UserPlus,
  reflection: Brain,
};

const ActivityTimeline: React.FC<activitytimelineprops  /> = ({ events }) => {
  const [filter, setFilter] = useState<Activitytype >('all');

  const filteredEvents = useMemo(() => {
    if (filter === 'all') {
      return events;
    }
    return events.filter(event => event.type === filter);
  }, [events, filter]);

  const renderIcon = (type: ActivityType) => {
    const Icon = iconMap[type] || BookOpen;
    return <Icon / / / / / />;
  };

  return (
    <Div className="activity-timeline-container">
      <Div className="flex justify-between items-center mb-6">
        <H3 className="text-xl font-semibold text-white" /></Activitytype /></Activitytype />Activity Timeline</Activitytype>
        <Select > setFilter(value as ActivityType | 'all')}>
          <selecttrigger >
            <selectvalue placeholder="Filter by type" />
          <selectcontent >
            <selectitem value="all">All Activities</Select>
            <selectitem value="user">New Users</SelectItem>
            <selectitem value="journal">Journals</SelectItem>
            <selectitem value="strategy">Strategies</SelectItem />
        </Select>
      </Div>
      
      <Div className="activity-timeline">
        <animatepresence >
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
                <Div className="timeline-icon">
                  {renderIcon(event.type)}
                </Div>
                <Div className="timeline-item-content">
                  <P className="timeline-label">{event.label}</Div>
                  <P className="timeline-timestamp">
                    <timeago >
                  </P>
                </Div>
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
      </Div>
    </Div>
  );
};

export default ActivityTimeline; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
