// TODO: implement local-first prototyping environment
import React from 'react';

interface LocalFirstPrototypeProps {
  onSync?: () => void;
}

export const LocalFirstPrototype: React.FC<LocalFirstPrototypeProps> = ({ onSync }) => {
  const [syncStatus, setSyncStatus] = React.useState<'synced' | 'pending' | 'offline'>('synced');
  const [localChanges, setLocalChanges] = React.useState(0);
  const [prototypeCode, setPrototypeCode] = React.useState(`// Local Strategy Prototype
// Changes are saved locally first

entry_rules:
  - price > sma(20)
  - volume > avg_volume

exit_rules:
  - price < sma(20)
  - stop_loss: 2%
`);

  const [testResults, setTestResults] = React.useState({
    winRate: 0,
    profitFactor: 0,
    maxDrawdown: 0,
    trades: 0
  });

  const runLocalBacktest = () => {
    // Simulate local backtest
    setTestResults({
      winRate: 68,
      profitFactor: 1.85,
      maxDrawdown: 8.5,
      trades: 42
    });
    setLocalChanges(localChanges + 1);
    setSyncStatus('pending');
  };

  const syncToCloud = async () => {
    setSyncStatus('pending');
    // TODO: Connect to createPrototype function
    setTimeout(() => {
      setSyncStatus('synced');
      setLocalChanges(0);
      onSync?.();
    }, 1500);
  };

  return (
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <HardDrive  />
          <h2 style={{ fontWeight: "700" }}>Local Prototype</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge variant={syncStatus === 'synced' ? 'default' : syncStatus === 'pending' ? 'secondary' : 'destructive'}>
            {syncStatus === 'synced' ? (
              <>
                <Cloud  />
                Synced
              </>
            ) : syncStatus === 'pending' ? (
              <>
                <RefreshCw  />
                {localChanges} pending
              </>
            ) : (
              <>
                <HardDrive  />
                Offline
              </>
            )}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={syncToCloud}
            disabled={localChanges === 0 || syncStatus === 'offline'}
          >
            Sync to Cloud
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" >
        <TabsList style={{ width: "100%" }}>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" >
          <div >
            <textarea
              style={{ width: "100%", padding: "16px" }}
              value={prototypeCode}
              onChange={(e) => {
                setPrototypeCode(e.target.value);
                setLocalChanges(localChanges + 1);
                setSyncStatus('pending');
              }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <Badge variant="outline" >
                <HardDrive  />
                Local Only
              </Badge>
            </div>
          </div>
          
          <div style={{ display: "flex" }}>
            <Button onClick={runLocalBacktest} >
              <Play  />
              Run Local Test
            </Button>
            <Button variant="outline">
              <Save  />
              Save Draft
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="results" >
          <div >
            <div style={{ padding: "16px" }}>
              <p style={{ fontWeight: "700" }}>{testResults.winRate}%</p>
              <p >Win Rate</p>
            </div>
            <div style={{ padding: "16px" }}>
              <p style={{ fontWeight: "700" }}>{testResults.profitFactor}</p>
              <p >Profit Factor</p>
            </div>
            <div style={{ padding: "16px" }}>
              <p style={{ fontWeight: "700" }}>{testResults.maxDrawdown}%</p>
              <p >Max Drawdown</p>
            </div>
            <div style={{ padding: "16px" }}>
              <p style={{ fontWeight: "700" }}>{testResults.trades}</p>
              <p >Total Trades</p>
            </div>
          </div>

          <div style={{ padding: "16px" }}>
            <p >
              Results are calculated locally using cached market data. Sync to cloud for full backtesting.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="history" >
          <div >
            <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center" }}>
              <div>
                <p >Current Draft</p>
                <p >Modified 2 minutes ago</p>
              </div>
              <Badge variant="secondary">Unsaved</Badge>
            </div>
            <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center" }}>
              <div>
                <p >v1.2 - Risk Update</p>
                <p >Saved locally 1 hour ago</p>
              </div>
              <Badge>Synced</Badge>
            </div>
            <div style={{ border: "1px solid #374151", display: "flex", alignItems: "center" }}>
              <div>
                <p >v1.1 - Initial Strategy</p>
                <p >Created yesterday</p>
              </div>
              <Badge>Synced</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div style={{ padding: "16px" }}>
        <h4 >Local-First Benefits</h4>
        <ul >
          <li>• Work offline without interruption</li>
          <li>• Instant feedback on changes</li>
          <li>• Automatic conflict resolution</li>
          <li>• Version history preserved locally</li>
        </ul>
      </div>
    </Card>
  );
}; 