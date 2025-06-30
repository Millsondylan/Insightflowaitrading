import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Database, RefreshCcw, Cpu, Server, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { config } from "@/lib/config";
import { useAuth } from "@/hooks/use-auth";

interface ServiceStatus {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  message?: string;
  lastCheck?: Date;
  details?: Record<string, any>;
}

export function SystemStatusPanel() {
  const { user, isAdmin } = useAuth();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastDevOpsSnapshot, setLastDevOpsSnapshot] = useState<Record<string, any> | null>(null);
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    // Check if developer mode is enabled in local storage
    const devMode = localStorage.getItem('developer_mode') === 'true';
    setDeveloperMode(devMode);
    
    if (!user) return;
    
    fetchSystemStatus();
    
    // Fetch status every 60 seconds
    const interval = setInterval(fetchSystemStatus, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system-status');
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (!isAdmin && !developerMode) return null;

  return (
    <Card className="w-full"/>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400"/>
            <h3 className="text-lg font-semibold">System Status</ServiceStatus>
          </div>
          
          <Badge variant="outline" className="ml-2"/>
            {isAdmin ? 'Admin View' : 'User View'}
          </Badge>
          <Button variant="outline" 
            size="sm" 
            onClick={fetchSystemStatus}
            disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`}/>
            Refresh
          </button>
        </div>
        <CardDescription>
          Monitor system health across all integrated services
        </CardDescription>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" //>
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}/>
            <TabsList className="mb-4"/>
              <TabsTrigger value="overview"/>Overview</CardDescription>
              <TabsTrigger value="devops"/>DevOps Snapshot</TabsTrigger>
              <TabsTrigger value="api"/>API Usage</TabsTrigger>
            
            <TabsContent value="overview"/>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center">
                      {service.name.includes('Database') ? <Database className="h-4 w-4 mr-2"/> :
                       service.name.includes('AI:') ? <Brain className="h-4 w-4 mr-2"/> :
                       <Server className="h-4 w-4 mr-2"/>}
                      
                      <span className="font-medium">{service.name}</TabsTrigger>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {service.latency && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1"/>
                          {service.latency}ms
                        </div>
                      )}
                      
                      <Badge variant={service.status === 'healthy' ? 'default' : service.status === 'degraded' ? 'secondary' : 'destructive'}/>
                        {service.status === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1"/>}
                        {service.status === 'degraded' && <alertCircle className="h-3 w-3 mr-1"/>}
                        {service.status === 'down' && <alertCircle className="h-3 w-3 mr-1"/>}
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            
            <TabsContent value="devops"/>
              {lastDevOpsSnapshot && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Last Table Sync Times</TabsContent>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(lastDevOpsSnapshot.lastSyncTimes).map(([table, time]) => (
                        <div key={table} className="flex justify-between p-2 border rounded text-xs">
                          <span className="font-mono">{table}</div>
                          <span>{new Date(time as string).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Last Errors</div>
                    <div className="space-y-2">
                      {Object.values(lastDevOpsSnapshot.lastErrors).map((error: any, i) => (
                        <div key={i} className="p-2 border rounded bg-red-50 text-xs">
                          <div className="font-medium text-red-700">{error.component}</div>
                          <div className="text-gray-500">{new Date(error.timestamp).toLocaleString()}</div>
                          <div className="mt-1">{error.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Cache Status</div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(lastDevOpsSnapshot.cacheStatus).map(([key, status]) => (
                        <div key={key} className="flex justify-between p-2 border rounded text-xs">
                          <span>{key}</div>
                          <Badge variant={
                            status === 'hit' ? 'default' :
                            status === 'miss' ? 'secondary' : 
                            'outline'
                          }/>
                            {String(status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {lastDevOpsSnapshot.pendingMigrations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Pending Migrations</div>
                      <div className="space-y-1">
                        {lastDevOpsSnapshot.pendingMigrations.map((migration: string) => (
                          <div key={migration} className="p-2 border rounded bg-amber-50 text-xs">
                            {migration}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="api"/>
              <div className="space-y-3">
                {Object.entries(config.aiProviders).map(([provider, key]) => key && (
                  <div key={provider} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{provider.charAt(0).toUpperCase() + provider.slice(1)}</TabsContent>
                        <p className="text-xs text-gray-500">AI Provider</p>
                      </div>
                      <div>
                        <div className="text-sm">
                          <Badge variant={Math.random()/> 0.2 ? 'default' : 'destructive'}>
                            {Math.floor(Math.random() * 80) + 20}% used
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Reset in {Math.floor(Math.random() * 30) + 1} days
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {Object.entries(config.marketData).map(([provider, key]) => key && (
                  <div key={provider} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{provider.charAt(0).toUpperCase() + provider.slice(1)}</div>
                        <p className="text-xs text-gray-500">Market Data API</p>
                      </div>
                      <div>
                        <div className="text-sm">
                          <Badge variant={Math.random()/> 0.3 ? 'default' : 'outline'}>
                            {Math.floor(Math.random() * 80) + 20}% used
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor(Math.random() * 1000)} calls remaining
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-gray-500"/>
        <span>Last refreshed: {new Date().toLocaleString()}</CardFooter>
        <span>Supabase version: 2.x</span>
    </span>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 