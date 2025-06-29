// TODO: implement Supabase data adapter
import React from 'react';

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
      case 'synced': return <span style={{fontSize: '16px'}}>✅</span>;
      case 'syncing': return <RefreshCw  />;
      default: return <AlertCircle  />;
    }
  };

  return (
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Database  />
          <h2 style={{ fontWeight: "700" }}>Supabase Adapter</h2>
        </div>
        <Badge variant={syncStatus.connected ? 'default' : 'destructive'}>
          {syncStatus.connected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div >
        <div style={{ padding: "16px" }}>
          <p >Last Sync</p>
          <p >{syncStatus.lastSync.toLocaleString()}</p>
        </div>
        <div style={{ padding: "16px" }}>
          <p >Pending Changes</p>
          <p >{syncStatus.pendingChanges}</p>
        </div>
        <div style={{ padding: "16px" }}>
          <p >Total Records</p>
          <p >
            {syncStatus.tables.reduce((acc, t) => acc + t.records, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div >
        <h3 >Table Status</h3>
        {syncStatus.tables.map((table) => (
          <div key={table.name} style={{ display: "flex", alignItems: "center", border: "1px solid #374151" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className={getStatusColor(table.status)}>
                {getStatusIcon(table.status)}
              </div>
              <div>
                <p >{table.name}</p>
                <p >{table.records} records</p>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor(table.status)}>
              {table.status}
            </Badge>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <Button 
          onClick={syncData} 
          disabled={isSyncing || !syncStatus.connected}
          
        >
          {isSyncing ? (
            <>
              <RefreshCw  />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw  />
              Sync Now
            </>
          )}
        </Button>
        <Button variant="outline">
          Configure
        </Button>
      </div>

      <div style={{ padding: "16px" }}>
        <h4 >Connection Details</h4>
        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Project URL:</span>
            <code >your-project.supabase.co</code>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Region:</span>
            <span>us-east-1</span>
          </div>
        </div>
      </div>
    </Card>
  );
}; 