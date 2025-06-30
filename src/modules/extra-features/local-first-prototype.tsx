// TODO: implement local-first prototyping environment
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardDrive, Cloud, RefreshCw, Save, Play } from 'lucide-react';

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
    <Card className="theme-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HardDrive className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Local Prototype</h2>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={syncStatus === 'synced' ? 'default' : syncStatus === 'pending' ? 'secondary' : 'destructive'}>
            {syncStatus === 'synced' ? (
              <>
                <Cloud className="h-3 w-3 mr-1" />
                Synced
              </>
            ) : syncStatus === 'pending' ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                {localChanges} pending
              </>
            ) : (
              <>
                <HardDrive className="h-3 w-3 mr-1" />
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

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-[400px] p-4 bg-secondary/20 rounded-lg font-mono text-sm"
              value={prototypeCode}
              onChange={(e) => {
                setPrototypeCode(e.target.value);
                setLocalChanges(localChanges + 1);
                setSyncStatus('pending');
              }}
            />
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <HardDrive className="h-3 w-3 mr-1" />
                Local Only
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={runLocalBacktest} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Run Local Test
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/20 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-500">{testResults.winRate}%</p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center">
              <p className="text-2xl font-bold">{testResults.profitFactor}</p>
              <p className="text-sm text-muted-foreground">Profit Factor</p>
            </div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-500">{testResults.maxDrawdown}%</p>
              <p className="text-sm text-muted-foreground">Max Drawdown</p>
            </div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center">
              <p className="text-2xl font-bold">{testResults.trades}</p>
              <p className="text-sm text-muted-foreground">Total Trades</p>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg">
            <p className="text-sm text-blue-600">
              Results are calculated locally using cached market data. Sync to cloud for full backtesting.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Current Draft</p>
                <p className="text-sm text-muted-foreground">Modified 2 minutes ago</p>
              </div>
              <Badge variant="secondary">Unsaved</Badge>
            </div>
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">v1.2 - Risk Update</p>
                <p className="text-sm text-muted-foreground">Saved locally 1 hour ago</p>
              </div>
              <Badge>Synced</Badge>
            </div>
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">v1.1 - Initial Strategy</p>
                <p className="text-sm text-muted-foreground">Created yesterday</p>
              </div>
              <Badge>Synced</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
        <h4 className="font-medium mb-2">Local-First Benefits</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Work offline without interruption</li>
          <li>• Instant feedback on changes</li>
          <li>• Automatic conflict resolution</li>
          <li>• Version history preserved locally</li>
        </ul>
      </div>
    </Card>
  );
}; 