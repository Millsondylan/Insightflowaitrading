import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityEvent, ActivityType } from '@/lib/admin/getActivityTimeline';
import { cn } from '@/lib/utils';
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
    return <Icon  />;
  };

  return (
    <div >
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ color: "white" }}>Activity Timeline</h3>
        <Select value={filter} onValueChange={(value) => setFilter(value as ActivityType | 'all')}>
          <SelectTrigger >
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="user">New Users</SelectItem>
            <SelectItem value="journal">Journals</SelectItem>
            <SelectItem value="strategy">Strategies</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div >
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
                <div >
                  {renderIcon(event.type)}
                </div>
                <div >
                  <p >{event.label}</p>
                  <p >
                    <TimeAgo datetime={event.timestamp} />
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ paddingTop: "32px", paddingBottom: "32px" }}
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