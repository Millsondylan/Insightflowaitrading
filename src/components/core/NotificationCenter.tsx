import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, Mail, Settings, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, UserNotification } from '@/lib/db/userSettings';
import { useAuditLog } from '@/lib/monitoring/auditLogger';

export default function NotificationCenter() {
  const { user } = useAuth();
  const { logClick } = useAuditLog();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    if (user && open) {
      loadNotifications();
    }
  }, [user, open, activeTab]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (!open) {
        // Only check for new count when not actively viewing
        checkUnreadCount();
      }
    }, 30000);

    // Initial load of unread count
    checkUnreadCount();

    return () => clearInterval(interval);
  }, [user]);

  const checkUnreadCount = async () => {
    if (!user) return;
    
    try {
      const data = await getUserNotifications(user.id, { unreadOnly: true });
      setUnreadCount(data.length);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let options: any = { limit: 20 };
      
      if (activeTab === 'unread') {
        options.unreadOnly = true;
      } else if (activeTab !== 'all') {
        options.status = activeTab;
      }
      
      const data = await getUserNotifications(user.id, options);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id: string) => {
    logClick('NotificationRead', { notificationId: id });
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n)
        );
        setUnreadCount(prev => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleReadAll = async () => {
    logClick('MarkAllNotificationsRead');
    try {
      const success = await markAllNotificationsAsRead(user?.id || '');
      if (success) {
        setNotifications(prev => 
          prev.map(n => !n.read_at ? { ...n, status: 'read', read_at: new Date().toISOString() } : n)
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'trade_alert':
        return <AlertCircle className={`w-5 h-5 ${priority === 'urgent' ? 'text-red-500' : 'text-yellow-500'}`} />;
      case 'market_update':
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'journal_reminder':
        return <Clock className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      case 'message':
        return <Mail className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'normal':
        return '';
      case 'low':
        return 'bg-gray-500/5 border-gray-500/10';
      default:
        return '';
    }
  };

  const renderNotification = (notification: UserNotification) => {
    const isUnread = notification.status === 'pending' || !notification.read_at;
    
    return (
      <div key={notification.id}
        className={`p-4 border rounded-lg mb-2 transition-colors ${isUnread ? 'bg-blue-500/10 border-blue-500/20' : 'bg-gray-800 border-gray-700'} ${getPriorityClass(notification.priority)}`}
     >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getNotificationIcon(notification.notification_type, notification.priority)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className={`font-medium ${isUnread ? 'text-white' : 'text-gray-300'} mb-1`}>
                {notification.title}
              </h4>
              <span className="text-xs text-gray-500">
                {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : ''}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
            <div className="flex items-center justify-between">
              {notification.data?.action && (
                <Button size="sm" variant="ghost" className="h-8 text-xs">
                  {notification.data.action}
                </Button>
              )}
              {isUnread && (
                <Button size="sm"
                  variant="ghost"
                  className="h-8 text-xs ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRead(notification.id);
                  }}
                >
                  <Check className="w-3 h-3 mr-1" /> Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" 
          size="icon"
          className="relative"
          onClick={() => logClick('OpenNotifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-blue-600"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0" 
        align="end" 
        sideOffset={5}
      >
        <div className="flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
          <h3 className="font-semibold text-lg text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={handleReadAll}
              >
                Mark all as read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <div className="px-4 pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-1 bg-blue-600 text-xs" variant="secondary">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px] p-4">
            <TabsContent value="all" className="m-0">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map(renderNotification)
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Bell className="w-10 h-10 mx-auto mb-4 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.filter(n => !n.read_at).length > 0 ? (
                notifications.filter(n => !n.read_at).map(renderNotification)
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Check className="w-10 h-10 mx-auto mb-4 opacity-30" />
                  <p>No unread notifications</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="read" className="m-0">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.filter(n => n.read_at).length > 0 ? (
                notifications.filter(n => n.read_at).map(renderNotification)
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Info className="w-10 h-10 mx-auto mb-4 opacity-30" />
                  <p>No read notifications</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-2 border-t border-gray-800">
          <Button variant="ghost" 
            size="sm" 
            className="w-full text-xs text-gray-400"
            onClick={() => {
              logClick('ViewAllNotifications');
              setOpen(false);
              // Navigate to full notifications page
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 