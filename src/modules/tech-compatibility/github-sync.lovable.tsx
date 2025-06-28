import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface Repository {
  name: string;
  owner: string;
  description?: string;
  lastCommit?: string;
  branch: string;
  status: 'connected' | 'disconnected' | 'syncing';
}

export const GitHubSync: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  
  // Mock repositories
  useEffect(() => {
    // In a real app, this would fetch data from GitHub API
    if (isConnected) {
      setRepositories([
        {
          name: 'insightflow-trading-app',
          owner: 'millsondylan',
          description: 'AI-powered trading strategy builder and portfolio management',
          lastCommit: '2 hours ago',
          branch: 'main',
          status: 'connected'
        },
        {
          name: 'trading-components',
          owner: 'millsondylan',
          description: 'Reusable components for trading applications',
          lastCommit: '3 days ago',
          branch: 'develop',
          status: 'disconnected'
        }
      ]);
    }
  }, [isConnected]);
  
  const handleConnect = async () => {
    // Simulate API connection
    setIsSyncing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsConnected(true);
    setIsSyncing(false);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    setRepositories([]);
  };
  
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('Syncing repository...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSyncMessage('Sync completed successfully!');
    setIsSyncing(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setSyncMessage(null), 3000);
  };
  
  const handleAddRepository = async () => {
    if (!repoUrl.trim()) return;
    
    setIsSyncing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract repo info from URL
    const urlParts = repoUrl.split('/');
    const owner = urlParts[urlParts.length - 2] || 'unknown';
    const name = urlParts[urlParts.length - 1] || 'repo-name';
    
    setRepositories([
      ...repositories,
      {
        name,
        owner,
        description: 'New repository',
        branch: 'main',
        status: 'connected'
      }
    ]);
    
    setRepoUrl('');
    setIsSyncing(false);
  };
  
  return (
    <div className="github-sync">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">GitHub Integration</h1>
            <p className="text-text-muted">Sync your Lovable components with GitHub repositories</p>
          </div>
          <Badge variant={isConnected ? "success" : "outline"} className="px-3 py-1">
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
        
        <Card className="p-6">
          {!isConnected ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Connect to GitHub</h2>
              <p className="mb-4 text-sm">
                Connect your GitHub account to enable version control and collaboration features.
              </p>
              
              <Button onClick={handleConnect} disabled={isSyncing}>
                {isSyncing ? 'Connecting...' : 'Connect GitHub Account'}
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Connected Repositories</h2>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
              
              {repositories.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <p>No repositories connected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {repositories.map((repo, index) => (
                    <Card key={index} className="p-4 bg-background-secondary">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{repo.owner}/{repo.name}</div>
                          <div className="text-sm text-text-muted">{repo.description}</div>
                          <div className="flex items-center mt-2 text-xs">
                            <span className="mr-3">Branch: {repo.branch}</span>
                            {repo.lastCommit && <span>Last commit: {repo.lastCommit}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={repo.status === 'connected' ? 'success' : 'outline'} className="text-xs px-2">
                            {repo.status === 'connected' ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button size="sm" onClick={handleSync} disabled={isSyncing || repo.status !== 'connected'}>
                            Sync
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {syncMessage && (
                <div className="mt-4 p-3 bg-background-secondary rounded text-sm">
                  {syncMessage}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-border-primary">
                <h3 className="text-md font-semibold mb-3">Add Repository</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Repository URL (e.g., https://github.com/username/repo)"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddRepository} disabled={!repoUrl.trim() || isSyncing}>
                    {isSyncing ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">GitHub Integration Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Version Control</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Track changes to your Lovable components</li>
                <li>Revert to previous versions when needed</li>
                <li>Branch and merge workflow support</li>
                <li>Code review capabilities</li>
                <li>Detailed change history</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Collaboration</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Work with multiple team members</li>
                <li>Coordinate changes through pull requests</li>
                <li>Automated CI/CD integration</li>
                <li>Role-based access control</li>
                <li>Conflict resolution management</li>
              </ul>
            </div>
          </div>
        </Card>
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

export default GitHubSync;
