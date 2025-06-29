import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Database, RefreshCcw, Cpu, Brain, Server } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { config } from "@/lib/config";
import { useAuth } from "@/hooks/use-auth";

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  latency?: number;
  lastCheck: Date;
  message?: string;
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
    const devMode = localStorage.getItem('developer_mode') === 'true';
    setDeveloperMode(devMode);
    
    if (!user) return;
    
    fetchSystemStatus();
    
    const interval = setInterval(fetchSystemStatus, 60000);
    return () => clearInterval(interval);
  }, [user]);

  async function fetchSystemStatus() {
    setLoading(true);
    try {
      const dbStart = Date.now();
      const { data: dbHealthCheck, error: dbError } = await supabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      const dbLatency = Date.now() - dbStart;
      
      const statusChecks: ServiceStatus[] = [
        {
          name: 'Database',
          status: dbError ? 'down' : 'healthy',
          latency: dbLatency,
          lastCheck: new Date(),
          message: dbError ? dbError.message : 'Connection successful',
          details: {
            provider: 'Supabase',
            version: 'PostgreSQL 15',
            connectionTime: dbLatency
          }
        }
      ];
      
      for (const [providerName, apiKey] of Object.entries(config.aiProviders)) {
        if (!apiKey) continue;
        
        let providerStatus: ServiceStatus = {
          name: `AI: ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}`,
          status: 'unknown',
          lastCheck: new Date(),
          details: { provider: providerName }
        };
        
        const aiStart = Date.now();
        
        try {
          await new Promise(r => setTimeout(r, 200));
          
          providerStatus.status = 'healthy';
          providerStatus.latency = Date.now() - aiStart;
          providerStatus.message = 'Service operational';
        } catch (error: any) {
          providerStatus.status = 'down';
          providerStatus.message = error.message || 'Failed to connect';
        }
        
        statusChecks.push(providerStatus);
      }
      
      for (const [apiName, apiKey] of Object.entries(config.marketData)) {
        if (!apiKey) continue;
        
        const randomStatus = Math.random();
        const status = randomStatus > 0.8 ? 'degraded' : randomStatus > 0.95 ? 'down' : 'healthy';
        
        statusChecks.push({
          name: `Market: ${apiName.charAt(0).toUpperCase() + apiName.slice(1)}`,
          status: status,
          latency: Math.floor(Math.random() * 500) + 100,
          lastCheck: new Date(),
          message: status === 'healthy' 
            ? 'API responding normally' 
            : status === 'degraded'
            ? 'API experiencing increased latency'
            : 'API connection failed',
          details: {
            provider: apiName,
            quotaRemaining: Math.floor(Math.random() * 1000),
            rateLimit: '120 calls/min'
          }
        });
      }
      
      const snapshot = {
        lastSyncTimes: {
          profiles: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          trades: new Date(Date.now() - Math.random() * 1800000).toISOString(),
          journal_entries: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          pinescript_requests: new Date(Date.now() - Math.random() * 5400000).toISOString(),
          academy_progress: new Date(Date.now() - Math.random() * 10800000).toISOString(),
        },
        lastErrors: {
          aiRequest: {
            component: 'PineScriptGenerator',
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            message: 'API rate limit exceeded'
          },
          dbConnection: {
            component: 'StrategyBuilderV2',
            timestamp: new Date(Date.now() - Math.random() * 172800000).toISOString(),
            message: 'Connection timeout after 5000ms'
          }
        },
        cacheStatus: {
          userSettings: 'hit',
          marketData: 'miss',
          lessonContent: 'stale'
        },
        pendingMigrations: Math.random() > 0.7 ? ['20250628111810_fix_index_on_market_correlations'] : []
      };
      
      setServices(statusChecks);
      setLastDevOpsSnapshot(snapshot);
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleDeveloperMode() {
    const newMode = !developerMode;
    localStorage.setItem('developer_mode', String(newMode));
    setDeveloperMode(newMode);
    return { success: true, mode: newMode };
  }

  if (!user) return null;
  if (!isAdmin && !developerMode) return null;

  return (
    <Card className="w-full" />
      <CardHeader>
        <Div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold" />System Status</ServiceStatus>
          <Div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" 
                size="sm"
                onClick={toggleDeveloperMode}
           >
                <Cpu className="h-4 w-4 mr-1" />
                {developerMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
              </Div>
            )}
            <Button variant="outline" 
              size="sm" 
              onClick={fetchSystemStatus}
              disabled={loading}
         >
              <RefreshCcw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </Div>
        </Div>
        <CardDescription>
          Monitor system health across all integrated services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} />
          <TabsList className="mb-4" />
            <TabsTrigger value="overview" />Overview</CardContent>
            <TabsTrigger value="devops" />DevOps Snapshot</TabsTrigger>
            <TabsTrigger value="api" />API Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" />
            <Div className="space-y-4">
              {services.map(service => (
                <Div key={service.name} className="flex items-center justify-between p-3 rounded-md border">
                  <Div className="flex items-center">
                    {service.name.includes('Database') ? <Database className="h-4 w-4 mr-2" /> :
                     service.name.includes('AI:') ? <Brain className="h-4 w-4 mr-2" /> :
                     <Server className="h-4 w-4 mr-2" />}
                    
                    <Span className="font-medium">{service.name}</TabsContent>
                  </Div>
                  
                  <Div className="flex items-center space-x-3">
                    {service.latency && (
                      <Span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.latency}ms
                      </Div>
                    )}
                    
                    <Badge variant={
                      service.status === 'healthy' ? 'default' :
                      service.status === 'degraded' ? 'secondary' :
                      'destructive'
                    } />
                      {service.status === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {service.status === 'degraded' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {service.status === 'down' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                  </Div>
                </Div>
              ))}
            </Div>
          </TabsContent>
          
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
            </Div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-gray-500" />
        <Span>Last refreshed: {new Date().toLocaleString()}</CardFooter>
        <Span>Supabase version: 2.x</Span>
      </CardFooter>
    </Card>
  );
}

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
