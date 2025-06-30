
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Clock, Code, GitBranch, GitMerge, Check, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getStrategyVersions, activateStrategyVersion } from '@/lib/db/strategies';
import { useAuth } from '@/hooks/use-auth';

interface StrategyVersion {
  id: string;
  strategy_id: string;
  user_id: string;
  version: string;
  code: string;
  description: string;
  changes_summary: string;
  performance_data: any;
  is_live: boolean;
  created_at: string;
  improvement_reason?: string;
  is_active?: boolean;
}

export default function StrategyVersions({ strategyId }: { strategyId: string }) {
  const [versions, setVersions] = useState<StrategyVersion[]>([]);
  const [activeTab, setActiveTab] = useState('versions');
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadVersions = async () => {
      if (!strategyId) return;
      
      try {
        setLoading(true);
        const data = await getStrategyVersions(strategyId);
        if (data) {
          setVersions(data);
        }
      } catch (error) {
        console.error('Error loading strategy versions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVersions();
  }, [strategyId]);

  const handleActivateVersion = async (versionId: string) => {
    try {
      setActivating(true);
      await activateStrategyVersion(versionId);
      
      setVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          is_active: v.id === versionId
        }))
      );
    } catch (error) {
      console.error('Error activating version:', error);
    } finally {
      setActivating(false);
    }
  };

  const handleViewCode = (versionId: string) => {
    navigate(`/strategy/${strategyId}/version/${versionId}`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading versions...</div>;
  }

  return (
    <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-blue-400"/>
          Strategy Versions
        </CardTitle>
        <CardDescription className="text-white/70">
          View and manage different versions of this strategy
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="bg-gray-800/50">
            <TabsTrigger value="versions" className="data-[state=active]:bg-blue-600">
              Versions ({versions.length})
            </TabsTrigger>
            <TabsTrigger value="changelog" className="data-[state=active]:bg-blue-600">
              Changelog
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="versions" className="pt-2">
          <div className="space-y-4 p-6">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No versions available for this strategy yet.
              </div>
            ) : (
              versions.map((version) => (
                <div key={version.id} className="bg-gray-800/40 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Version {version.version}</span>
                        {version.is_active && (
                          <Badge className="bg-green-600 text-xs">Active</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1"/>
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" 
                        size="sm"
                        onClick={() => handleViewCode(version.id)}
                      >
                        <Code className="h-4 w-4 mr-1"/>
                        View Code
                      </Button>
                      
                      {!version.is_active && user?.id === version.user_id && (
                        <Button variant="default" 
                          size="sm"
                          onClick={() => handleActivateVersion(version.id)}
                          disabled={activating}
                        >
                          <Check className="h-4 w-4 mr-1"/>
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {version.description && (
                    <div className="mt-3 text-sm text-white/80">
                      {version.description}
                    </div>
                  )}
                  
                  {version.improvement_reason && (
                    <div className="mt-2 text-sm">
                      <span className="text-blue-400">Improvement: </span>
                      <span className="text-white/80">{version.improvement_reason}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="changelog" className="pt-2">
          <div className="p-6 space-y-6">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No changelog available yet.
              </div>
            ) : (
              versions.slice().reverse().map((version, index) => (
                <div key={version.id} className="relative">
                  {index !== versions.length - 1 && (
                    <div className="absolute top-6 bottom-0 left-3 w-0.5 bg-gray-700/50"/>
                  )}
                  
                  <div className="flex gap-4">
                    <div className="bg-blue-600 rounded-full h-6 w-6 flex items-center justify-center z-10">
                      <GitMerge className="h-3 w-3"/>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Version {version.version}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(version.created_at).toLocaleDateString()}
                        </span>
                        {version.is_active && (
                          <Badge className="bg-green-600 text-xs">Active</Badge>
                        )}
                      </div>
                      
                      {version.changes_summary && (
                        <div className="mt-2 text-sm text-white/80">
                          {version.changes_summary}
                        </div>
                      )}
                      
                      <div className="mt-4 mb-8">
                        <Button variant="outline" 
                          size="sm"
                          onClick={() => handleViewCode(version.id)}
                        >
                          <Code className="h-4 w-4 mr-1"/>
                          View Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
