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

export const SupabaseAdapter: React.FC<Supabaseadapterprops> = ({ onSync }) => {
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
      case 'synced': return <Checkcircle  />;
      case 'syncing': return <Refreshcw >;
      default: return <Alertcircle  />;
    }
  };

  return (
    <card  >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <database  >
          <h2 className="text-2xl font-bold">Supabase Adapter</h2>
        </div>
        <badge  >
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
            <badge variant="outline" >
              {table.status}
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button >
          {isSyncing ? (
            <>
              <refreshcw  >
              Syncing...
            </>
          ) : (
            <>
              <refreshcw  >
              Sync Now
            </>
          )}
        </Button>
        <Button variant="outline" >
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
