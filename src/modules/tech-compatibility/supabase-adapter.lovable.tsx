import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface SupabaseAdapterProps {
  onConnected?: (config: any) => void;
}

export const SupabaseAdapter: React.FC<SupabaseAdapterProps> = ({ onConnected }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectUrl, setProjectUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [autoMigrate, setAutoMigrate] = useState<boolean>(true);
  const [edgeFunctionsEnabled, setEdgeFunctionsEnabled] = useState<boolean>(true);
  const [tables, setTables] = useState<{name: string, rows: number, lastUpdated: string}[]>([]);
  const [functions, setFunctions] = useState<{name: string, active: boolean}[]>([]);
  
  // Mock connection status
  useEffect(() => {
    if (isConnected) {
      // Simulating fetched data from Supabase
      setTables([
        { name: 'users', rows: 234, lastUpdated: '2 hours ago' },
        { name: 'strategies', rows: 87, lastUpdated: '5 hours ago' },
        { name: 'backtest_results', rows: 492, lastUpdated: '1 day ago' },
        { name: 'journal_entries', rows: 156, lastUpdated: '3 days ago' },
        { name: 'market_data', rows: 12500, lastUpdated: '12 hours ago' }
      ]);
      
      setFunctions([
        { name: 'generate-strategy', active: true },
        { name: 'run-backtest', active: true },
        { name: 'analyze-journal', active: false },
        { name: 'market-scanner', active: true }
      ]);
    }
  }, [isConnected]);
  
  const handleConnect = async () => {
    if (!projectUrl || !apiKey) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      
      if (onConnected) {
        onConnected({
          projectUrl,
          apiKey,
          autoMigrate,
          edgeFunctionsEnabled
        });
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    setTables([]);
    setFunctions([]);
  };
  
  const runMigration = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTables(prev => 
        prev.map(table => {
          if (Math.random() > 0.7) {
            return { ...table, lastUpdated: 'just now' };
          }
          return table;
        })
      );
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="supabase-adapter">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Supabase Integration</h1>
            <p className="text-text-muted">Configure database, authentication and serverless functions</p>
          </div>
          <Badge variant={isConnected ? "success" : "outline"} className="px-3 py-1">
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
        
        {!isConnected ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Connect to Supabase</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Project URL</label>
                <Input
                  placeholder="https://your-project.supabase.co"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <Input
                  type="password"
                  placeholder="Your Supabase API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-text-muted mt-1">You can find this in your Supabase project settings</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-migrate" 
                    checked={autoMigrate} 
                    onCheckedChange={setAutoMigrate} 
                  />
                  <Label htmlFor="auto-migrate">Auto-migrate schema</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edge-functions" 
                    checked={edgeFunctionsEnabled} 
                    onCheckedChange={setEdgeFunctionsEnabled} 
                  />
                  <Label htmlFor="edge-functions">Enable Edge Functions</Label>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleConnect}
              disabled={!projectUrl || !apiKey || isLoading}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Connect to Supabase'}
            </Button>
            
            <div className="mt-6 pt-4 border-t border-border-primary">
              <h3 className="text-sm font-medium mb-2">Need a Supabase project?</h3>
              <p className="text-xs text-text-muted">
                Create a new project on <a href="https://supabase.com" className="text-brand-primary hover:underline" target="_blank" rel="noreferrer">supabase.com</a> and use the provided credentials.
              </p>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Supabase Project</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={runMigration} disabled={isLoading}>
                    {isLoading ? 'Running...' : 'Run Migration'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="p-4 bg-background-secondary">
                  <div className="text-text-muted text-sm">Project</div>
                  <div className="text-lg font-medium truncate">{projectUrl.replace('https://', '').replace('.supabase.co', '')}</div>
                </Card>
                
                <Card className="p-4 bg-background-secondary">
                  <div className="text-text-muted text-sm">Tables</div>
                  <div className="text-lg font-medium">{tables.length}</div>
                </Card>
                
                <Card className="p-4 bg-background-secondary">
                  <div className="text-text-muted text-sm">Edge Functions</div>
                  <div className="text-lg font-medium">{functions.filter(f => f.active).length} active</div>
                </Card>
              </div>
              
              <Tabs defaultValue="tables" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="tables">Database</TabsTrigger>
                  <TabsTrigger value="functions">Edge Functions</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tables" className="mt-0">
                  <div className="rounded border border-border-primary overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-background-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left">Table</th>
                          <th className="px-4 py-3 text-right">Rows</th>
                          <th className="px-4 py-3 text-right">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tables.map((table, i) => (
                          <tr key={i} className="border-t border-border-primary">
                            <td className="px-4 py-3 font-medium">{table.name}</td>
                            <td className="px-4 py-3 text-right">{table.rows.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right text-text-muted">{table.lastUpdated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="functions" className="mt-0">
                  <div className="rounded border border-border-primary overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-background-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left">Function</th>
                          <th className="px-4 py-3 text-right">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {functions.map((func, i) => (
                          <tr key={i} className="border-t border-border-primary">
                            <td className="px-4 py-3 font-medium">{func.name}</td>
                            <td className="px-4 py-3 text-right">
                              <Badge variant={func.active ? "success" : "secondary"}>
                                {func.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="outline" size="sm">
                                Deploy
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="auth" className="mt-0">
                  <div className="text-center py-6">
                    <h3 className="text-lg font-medium mb-2">Authentication Providers</h3>
                    <p className="text-text-muted mb-4">Configure authentication providers for your application</p>
                    
                    <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                        Facebook
                      </Button>
                      
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        GitHub
                      </Button>
                      
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        Email/Password
                      </Button>
                      
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="4" />
                          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                          <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
                          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
                        </svg>
                        Google
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Database Schema</h2>
              
              <div className="text-sm mb-4">
                <p>
                  This integration automatically creates and manages the database schema for your Lovable application.
                  You can customize the schema by editing the migration files.
                </p>
              </div>
              
              <div className="overflow-x-auto rounded border border-border-primary">
                <pre className="p-4 bg-background-secondary text-xs font-mono">
{`-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create strategies table
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backtest_results table
CREATE TABLE backtest_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  metrics JSONB NOT NULL DEFAULT '{}',
  trades JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`}
                </pre>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline">
                  Edit Schema
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default SupabaseAdapter;
