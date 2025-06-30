import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Target } from 'lucide-react';

interface StrategyReminder {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
}

interface StrategyReminderWidgetProps {
  reminders?: StrategyReminder[];
}

const StrategyReminderWidget: React.FC<StrategyReminderWidgetProps> = ({ 
  reminders = [] 
}) => {
  const pendingReminders = reminders.filter(r => !r.completed);

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-cyan-400" />
          Strategy Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingReminders.length === 0 ? (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-white/30 mx-auto mb-2" />
            <p className="text-white/50 text-sm">No pending reminders</p>
          </div>
        ) : (
          pendingReminders.slice(0, 3).map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{reminder.title}</h4>
                <p className="text-white/60 text-xs mt-1">{reminder.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-white/40" />
                  <span className="text-white/40 text-xs">{reminder.time}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Complete
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default StrategyReminderWidget; 