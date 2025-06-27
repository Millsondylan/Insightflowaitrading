import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JournalForm from '@/components/core/JournalForm';
import JournalTimeline from '@/components/core/JournalTimeline';
import { Brain, TrendingUp, BarChart3, Target } from "lucide-react";

const JournalPage: React.FC = () => {
  const [refreshTimeline, setRefreshTimeline] = useState(0);
  
  // Handler for when a new entry is added to refresh the timeline
  const handleEntryAdded = () => {
    setRefreshTimeline(prev => prev + 1);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold">Trade Journal</h1>
          <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <p className="text-gray-400">
          Document your trades, track performance, and get AI-powered insights to identify patterns and improve your trading strategy.
        </p>
        <div className="mt-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-400 mb-1">AI Analysis Available</h3>
              <p className="text-xs text-gray-300">
                Click the <Brain className="h-3 w-3 inline mx-1 text-blue-400" /> icon on any journal entry to get personalized insights on your trading psychology and decision-making patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <Tabs defaultValue="new-entry" className="w-full">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="new-entry" className="flex-1">New Entry</TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new-entry">
              <JournalForm onEntryAdded={handleEntryAdded} />
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card className="ai-reflection-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span>Trading Analytics</span>
                    <Badge variant="outline" className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                      Coming Soon
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <div className="mb-6 relative">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center brain-thinking">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-medium text-gray-300 mb-3">Advanced AI Analytics</h3>
                    <p className="text-gray-500 mb-6">
                      Phase 5B will introduce comprehensive AI-powered performance analytics and trade pattern recognition.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4 text-left">
                      <div className="flex items-start space-x-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <Target className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-green-400">Pattern Recognition</h4>
                          <p className="text-xs text-gray-400">Identify recurring behavioral patterns and emotional triggers</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-400">Performance Metrics</h4>
                          <p className="text-xs text-gray-400">Advanced statistics on win rates, drawdowns, and consistency</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                        <Brain className="h-5 w-5 text-purple-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-purple-400">Coaching Insights</h4>
                          <p className="text-xs text-gray-400">Personalized recommendations for trading improvement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Timeline Panel */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Recent Entries</h2>
              <div className="text-sm text-gray-400 flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span>Click brain icons for AI analysis</span>
              </div>
            </div>
            
            <JournalTimeline refreshTrigger={refreshTimeline} limit={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage; 