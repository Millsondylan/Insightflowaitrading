
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface SystemStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  lastChecked: string;
  uptime: string;
}

const SystemStatusPanel: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      service: 'API Server',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      uptime: '99.9%'
    },
    {
      service: 'Database',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      uptime: '99.8%'
    },
    {
      service: 'CDN',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      uptime: '99.95%'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setSystemStatus(prev => prev.map(status => ({
        ...status,
        lastChecked: new Date().toISOString()
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'down':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'down':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
          <Button
            onClick={refreshStatus}
            variant="ghost"
            size="sm"
            disabled={isRefreshing}
            className="text-white/70 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {systemStatus.map((status, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.status)}
              <div>
                <h3 className="font-medium text-white">{status.service}</h3>
                <p className="text-sm text-white/60">
                  Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(status.status)}>
                {status.status}
              </Badge>
              <p className="text-sm text-white/60 mt-1">
                Uptime: {status.uptime}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
