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
    <Card className="w-full" />
      <CardHeader>
        <Div className="flex items-center justify-between">
          <Div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <H3 className="text-lg font-semibold">System Status</ServiceStatus>
          </Div>
          
          <Badge variant="outline" className="ml-2" />
            {isAdmin ? 'Admin View' : 'User View'}
          </Badge>
          <Button variant="outline" 
            size="sm" 
            onClick={fetchSystemStatus}
            disabled={loading}
 >
            <RefreshCcw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </Div>
        <CardDescription>
          Monitor system health across all integrated services
        </CardDescription />
      
      <CardContent>
        {loading ? (
          <Div className="flex items-center justify-center p-8">
            <Div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" / />
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} />
            <TabsList className="mb-4" />
              <TabsTrigger value="overview" />Overview</CardDescription>
              <TabsTrigger value="devops" />DevOps Snapshot</TabsTrigger>
              <TabsTrigger value="api" />API Usage</TabsTrigger />
            
            <TabsContent value="overview" />
              <Div className="space-y-4">
                {services.map((service) => (
                  <Div key={service.id} className="flex items-center justify-between p-3 rounded-md border">
                    <Div className="flex items-center">
                      {service.name.includes('Database') ? <Database className="h-4 w-4 mr-2" /> :
                       service.name.includes('AI:') ? <Brain className="h-4 w-4 mr-2" /> :
                       <Server className="h-4 w-4 mr-2" />}
                      
                      <Span className="font-medium">{service.name}</TabsTrigger>
                    </Div>
                    
                    <Div className="flex items-center space-x-3">
                      {service.latency && (
                        <Span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.latency}ms
                        </Div>
                      )}
                      
                      <Badge variant={service.status === 'healthy' ? 'default' : service.status === 'degraded' ? 'secondary' : 'destructive'} />
                        {service.status === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {service.status === 'degraded' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {service.status === 'down' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </Div>
                  </Div>
                ))}
              </div />
            
            <TabsContent value="devops" />
              {lastDevOpsSnapshot && (
                <Div className="space-y-4">
                  <Div>
                    <H3 className="text-sm font-medium mb-2">Last Table Sync Times</TabsContent>
                    <Div className="grid grid-cols-2 gap-2">
                      {Object.entries(lastDevOpsSnapshot.lastSyncTimes).map(([table, time]) => (
                        <Div key={table} className="flex justify-between p-2 border rounded text-xs">
                          <Span className="font-mono">{table}</Div>
                          <Span>{new Date(time as string).toLocaleTimeString()}</Span>
                        </Div>
                      ))}
                    </Div>
                  </Div>
                  
                  <Div>
                    <H3 className="text-sm font-medium mb-2">Last Errors</Div>
                    <Div className="space-y-2">
                      {Object.values(lastDevOpsSnapshot.lastErrors).map((error: any, i) => (
                        <Div key={i} className="p-2 border rounded bg-red-50 text-xs">
                          <Div className="font-medium text-red-700">{error.component}</Div>
                          <Div className="text-gray-500">{new Date(error.timestamp).toLocaleString()}</Div>
                          <Div className="mt-1">{error.message}</Div>
                        </Div>
                      ))}
                    </Div>
                  </Div>
                  
                  <Div>
                    <H3 className="text-sm font-medium mb-2">Cache Status</Div>
                    <Div className="grid grid-cols-3 gap-2">
                      {Object.entries(lastDevOpsSnapshot.cacheStatus).map(([key, status]) => (
                        <Div key={key} className="flex justify-between p-2 border rounded text-xs">
                          <Span>{key}</Div>
                          <Badge variant={
                            status === 'hit' ? 'default' :
                            status === 'miss' ? 'secondary' : 
                            'outline'
                          } />
                            {String(status)}
                          </Badge>
                        </Div>
                      ))}
                    </Div>
                  </Div>
                  
                  {lastDevOpsSnapshot.pendingMigrations.length > 0 && (
                    <Div>
                      <H3 className="text-sm font-medium mb-2">Pending Migrations</Div>
                      <Div className="space-y-1">
                        {lastDevOpsSnapshot.pendingMigrations.map((migration: string) => (
                          <Div key={migration} className="p-2 border rounded bg-amber-50 text-xs">
                            {migration}
                          </Div>
                        ))}
                      </Div>
                    </Div>
                  )}
                </Div>
              )}
            </TabsContent>
            
            <TabsContent value="api" />
              <Div className="space-y-3">
                {Object.entries(config.aiProviders).map(([provider, key]) => key && (
                  <Div key={provider} className="p-3 border rounded-md">
                    <Div className="flex justify-between items-center">
                      <Div>
                        <H3 className="font-medium">{provider.charAt(0).toUpperCase() + provider.slice(1)}</TabsContent>
                        <P className="text-xs text-gray-500">AI Provider</P>
                      </Div>
                      <Div>
                        <Div className="text-sm">
                          <Badge variant={Math.random() /> 0.2 ? 'default' : 'destructive'}>
                            {Math.floor(Math.random() * 80) + 20}% used
                          </Div>
                        </Div>
                        <Div className="text-xs text-gray-500 mt-1">
                          Reset in {Math.floor(Math.random() * 30) + 1} days
                        </Div>
                      </Div>
                    </Div>
                  </Div>
                ))}
                
                {Object.entries(config.marketData).map(([provider, key]) => key && (
                  <Div key={provider} className="p-3 border rounded-md">
                    <Div className="flex justify-between items-center">
                      <Div>
                        <H3 className="font-medium">{provider.charAt(0).toUpperCase() + provider.slice(1)}</Div>
                        <P className="text-xs text-gray-500">Market Data API</P>
                      </Div>
                      <Div>
                        <Div className="text-sm">
                          <Badge variant={Math.random() /> 0.3 ? 'default' : 'outline'}>
                            {Math.floor(Math.random() * 80) + 20}% used
                          </Div>
                        </Div>
                        <Div className="text-xs text-gray-500 mt-1">
                          {Math.floor(Math.random() * 1000)} calls remaining
                        </Div>
                      </Div>
                    </Div>
                  </Div>
                ))}
              </div />
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-gray-500" />
        <Span>Last refreshed: {new Date().toLocaleString()}</CardFooter>
        <Span>Supabase version: 2.x</span />
    </Span>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 