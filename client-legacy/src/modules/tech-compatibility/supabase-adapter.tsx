
// TODO: implement Supabase data adapter
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SupabaseAdapterProps {
  onSync?: () => void;
}

export const SupabaseAdapter: React.FC<SupabaseAdapterProps> = ({ onSync }) => {
  const [syncStatus, setSyncStatus] = React.useState({
    connected: true,
    lastSync: new Date('2024-02-12T10:30:00'),
    pendingChanges: 3,
    tables: [
      { name: 'strategies', status: 'synced', records: 245 },
      { name: 'trades', status: 'syncing', records: 1842 },
      { name: 'journal_entries', status: 'pending', records: 89 },
      { name: 'users', status: 'synced', records: 42 }
    ]
  });

  const [isSyncing, setIsSyncing] = React.useState(false);

  const syncData = async () => {
    setIsSyncing(true);
    // TODO: Connect to adaptToSupabase function
    setTimeout(() => {
      setSyncStatus({
        ...syncStatus,
        lastSync: new Date(),
        pendingChanges: 0,
        tables: syncStatus.tables.map(t => ({ ...t, status: 'synced' }))
      });
      setIsSyncing(false);
      onSync?.();
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-500';
      case 'syncing': return 'text-yellow-500';
      case 'pending': return 'text-orange-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="theme-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Supabase Adapter</h2>
        </div>
        <Badge variant={syncStatus.connected ? 'default' : 'destructive'}>
          {syncStatus.connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Last Sync</p>
          <p className="font-medium">{syncStatus.lastSync.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Pending Changes</p>
          <p className="font-medium">{syncStatus.pendingChanges}</p>
        </div>
        <div className="p-4 bg-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Records</p>
          <p className="font-medium">
            {syncStatus.tables.reduce((acc, t) => acc + t.records, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="font-semibold">Table Status</h3>
        {syncStatus.tables.map((table) => (
          <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={getStatusColor(table.status)}>
                {getStatusIcon(table.status)}
              </div>
              <div>
                <p className="font-medium">{table.name}</p>
                <p className="text-sm text-muted-foreground">{table.records} records</p>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor(table.status)}>
              {table.status}
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={syncData} 
          disabled={isSyncing || !syncStatus.connected}
          className="flex-1">
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
        <Button variant="outline">
          Configure
        </Button>
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <h4 className="font-medium mb-2">Connection Details</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Project URL:</span>
            <code className="bg-secondary px-2 py-1 rounded">your-project.supabase.co</code>
          </div>
          <div className="flex items-center justify-between">
            <span>Region:</span>
            <span>us-east-1</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
