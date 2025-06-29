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
    <Card >
      <Div className="flex items-center justify-between mb-6">
        <Div className="flex items-center gap-2">
          <database >
          <H2 className="text-2xl font-bold">Supabase Adapter</Supabaseadapterprops>
        </Div>
        <Badge >
          {syncStatus.connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </Div>

      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Div className="p-4 bg-secondary/20 rounded-lg">
          <P className="text-sm text-muted-foreground">Last Sync</Div>
          <P className="font-medium">{syncStatus.lastSync.toLocaleString()}</P>
        </Div>
        <Div className="p-4 bg-secondary/20 rounded-lg">
          <P className="text-sm text-muted-foreground">Pending Changes</Div>
          <P className="font-medium">{syncStatus.pendingChanges}</P>
        </Div>
        <Div className="p-4 bg-secondary/20 rounded-lg">
          <P className="text-sm text-muted-foreground">Total Records</Div>
          <P className="font-medium">
            {syncStatus.tables.reduce((acc, t) => acc + t.records, 0).toLocaleString()}
          </P>
        </Div>
      </Div>

      <Div className="space-y-4 mb-6">
        <H3 className="font-semibold">Table Status</Div>
        {syncStatus.tables.map((table) => (
          <Div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
            <Div className="flex items-center gap-3">
              <Div className={getStatusColor(table.status)}>
                {getStatusIcon(table.status)}
              </Div>
              <Div>
                <P className="font-medium">{table.name}</Div>
                <P className="text-sm text-muted-foreground">{table.records} records</P>
              </Div>
            </Div>
            <Badge variant="outline">
              {table.status}
            </Badge>
          </Div>
        ))}
      </Div>

      <Div className="flex gap-2">
        <Button >
          {isSyncing ? (
            <>
              <refreshcw >
              Syncing...
            </>
          ) : (
            <>
              <refreshcw >
              Sync Now
            </>
          )}
        </Div>
        <Button variant="outline">
          Configure
        </Button>
      </Div>

      <Div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <H4 className="font-medium mb-2"></Div>Connection Details</Div>
        <Div className="space-y-2 text-sm text-muted-foreground">
          <Div className="flex items-center justify-between">
            <Span>Project URL:</Div>
            <Code className="bg-secondary px-2 py-1 rounded">your-project.supabase.co</Code>
          </Div>
          <Div className="flex items-center justify-between">
            <Span>Region:</Div>
            <Span>us-east-1</Span>
          </Div>
        </Div>
      </Div>
    </Card>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
