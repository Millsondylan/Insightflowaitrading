
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { getUserDashboardWidgets, saveWidget, dismissWidget } from '../../lib/db/ai-coaching';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X, GripVertical, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { LineChart } from '../charts/LineChart';
import TradingViewChart from "../charts/TradingViewChart";
import { ScrollArea } from '../ui/scroll-area';

// Import widgets
import SuggestedSetupWidget from './widgets/SuggestedSetupWidget';

// Define widget types
export type WidgetType = 
  | 'strategy-reminder'
  | 'trade-quality'
  | 'favorite-pair'
  | 'strategy-upgrade'
  | 'suggested-setup'
  | 'risk-analysis'
  | 'journal-insight'
  | 'learning-path';

// Widget registry maps widget IDs to components
const WIDGET_REGISTRY: Record<WidgetType, React.ComponentType<any>> = {
  'strategy-reminder': SuggestedSetupWidget,
  'trade-quality': SuggestedSetupWidget,
  'favorite-pair': SuggestedSetupWidget,
  'strategy-upgrade': SuggestedSetupWidget,
  'suggested-setup': SuggestedSetupWidget,
  'risk-analysis': SuggestedSetupWidget,
  'journal-insight': SuggestedSetupWidget,
  'learning-path': SuggestedSetupWidget,
};

// Widget metadata
const WIDGET_METADATA: Record<WidgetType, { title: string, description: string }> = {
  'strategy-reminder': { 
    title: 'Strategy Reminder', 
    description: 'Reminds you of strategies you haven\'t used recently' 
  },
  'trade-quality': { 
    title: 'Trade Quality Report', 
    description: 'Analysis of your recent trade quality' 
  },
  'favorite-pair': { 
    title: 'Favorite Pair', 
    description: 'Quick view of your favorite trading pairs' 
  },
  'strategy-upgrade': { 
    title: 'Strategy Upgrades', 
    description: 'AI-generated improvements for your strategies' 
  },
  'suggested-setup': { 
    title: 'Today\'s Setup', 
    description: 'AI-generated trading setup based on your profile' 
  },
  'risk-analysis': { 
    title: 'Risk Analysis', 
    description: 'Analysis of your risk management' 
  },
  'journal-insight': { 
    title: 'Journal Insights', 
    description: 'AI analysis of your trading journal' 
  },
  'learning-path': { 
    title: 'Learning Path', 
    description: 'Personalized lessons based on your weak areas' 
  },
};

interface WidgetData {
  id: string;
  widget_id: WidgetType;
  position: number;
  pinned: boolean;
  dismissed: boolean;
  last_seen: string;
  settings: any;
}

export default function AdaptiveDashboard() {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [availableWidgets, setAvailableWidgets] = useState<WidgetType[]>([]);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  
  // Load user's widgets from Supabase
  useEffect(() => {
    async function loadWidgets() {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const { data } = await getUserDashboardWidgets(user.id);
        if (data) {
          // Sort by position
          setWidgets(data.sort((a: any, b: any) => a.position - b.position));
          
          // Calculate available widgets (ones not already on dashboard)
          const usedWidgetIds = new Set(data.map((w: any) => w.widget_id));
          const available = Object.keys(WIDGET_REGISTRY).filter(
            id => !usedWidgetIds.has(id as WidgetType)
          ) as WidgetType[];
          setAvailableWidgets(available);
        }
      } catch (error) {
        console.error('Failed to load dashboard widgets:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadWidgets();
  }, [user?.id]);

  // Handle removing a widget from dashboard
  const handleDismissWidget = async (widgetId: string) => {
    if (!user?.id) return;
    
    try {
      await dismissWidget(user.id, widgetId);
      
      // Update local state
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
      
      // Add to available widgets
      const dismissedWidget = widgets.find(w => w.id === widgetId);
      if (dismissedWidget) {
        setAvailableWidgets(prev => [...prev, dismissedWidget.widget_id]);
      }
    } catch (error) {
      console.error('Failed to dismiss widget:', error);
    }
  };
  
  // Add a new widget to dashboard
  const handleAddWidget = async (widgetType: WidgetType) => {
    if (!user?.id) return;
    
    try {
      // Determine next position
      const position = widgets.length;
      
      // Save to database
      const { data, error } = await saveWidget(user.id, {
        widget_id: widgetType,
        position,
        settings: {}
      });
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setWidgets(prev => [...prev, data[0]]);
        setAvailableWidgets(prev => prev.filter(w => w !== widgetType));
      }
      
      setShowWidgetSelector(false);
    } catch (error) {
      console.error('Failed to add widget:', error);
    }
  };
  
  // Filter widgets based on active tab
  const filteredWidgets = widgets.filter(widget => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pinned') return widget.pinned;
    return false;
  });
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Dashboard</h2>
        <Button onClick={() => setShowWidgetSelector(!showWidgetSelector)}>
          {showWidgetSelector ? 'Close' : (
            <>
              <Plus className="mr-1 h-4 w-4" />
              Add Widget
            </>
          )}
        </Button>
      </div>
      
      {showWidgetSelector && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add a Widget</CardTitle>
            <CardDescription>Select a widget to add to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {availableWidgets.length === 0 ? (
              <p className="text-muted-foreground">All widgets are already on your dashboard.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {availableWidgets.map(widgetType => (
                  <Card key={widgetType} className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddWidget(widgetType)}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">{WIDGET_METADATA[widgetType].title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{WIDGET_METADATA[widgetType].description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Widgets</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredWidgets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Widgets Added</CardTitle>
                <CardDescription>Add widgets to customize your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowWidgetSelector(true)}>Add Your First Widget</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWidgets.map((widget, index) => {
                const WidgetComponent = WIDGET_REGISTRY[widget.widget_id];
                
                return (
                  <div key={widget.id} className="relative">
                    <Card className="h-full">
                      <Button
                        onClick={() => handleDismissWidget(widget.id)}
                        className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      
                      <WidgetComponent
                        data={widget.settings}
                        userId={user?.id}
                      />
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pinned" className="mt-6">
          {filteredWidgets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Pinned Widgets</CardTitle>
                <CardDescription>Pin widgets to see them here</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWidgets.map(widget => {
                const WidgetComponent = WIDGET_REGISTRY[widget.widget_id];
                return (
                  <Card key={widget.id} className="relative">
                    <Button
                      onClick={() => handleDismissWidget(widget.id)}
                      className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <WidgetComponent
                      data={widget.settings}
                      userId={user?.id}
                    />
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
