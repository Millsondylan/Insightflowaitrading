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

export const LocalFirstPrototype: React.FC<localfirstprototypeprops  > = ({ onSync }) => {
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
    <card  >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <harddrive  >
          <h2 className="text-2xl font-bold">Local Prototype</h2>
        </div>
        <div className="flex items-center gap-4">
          <badge  >
            {syncStatus === 'synced' ? (
              <>
                <cloud  >
                Synced
              </>
            ) : syncStatus === 'pending' ? (
              <>
                <refreshcw  >
                {localChanges} pending
              </>
            ) : (
              <>
                <harddrive  >
                Offline
              </>
            )}
          </Badge>
          <button variant="outline" size="sm" >
            Sync to Cloud
          </Button>
        </div>
      </div>

      <tabs defaultValue="editor" >
        <tabslist  style={{ display: "grid", width: "100%" }}>
          <tabstrigger value="editor" >Editor</TabsTrigger>
          <tabstrigger value="results" >Results</TabsTrigger>
          <tabstrigger value="history" >History</TabsTrigger>
        </TabsList>

        <tabscontent value="editor" >
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
              <badge variant="outline" style={{ fontSize: "0.75rem" }}>
                <harddrive  >
                Local Only
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button  >
              <play  >
              Run Local Test
            </Button>
            <button variant="outline" >
              <save  >
              Save Draft
            </Button>
          </div>
        </TabsContent>

        <tabscontent value="results" >
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

        <tabscontent value="history" >
          <div className="space-y-2">
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Current Draft</p>
                <p className="text-sm text-muted-foreground">Modified 2 minutes ago</p>
              </div>
              <badge variant="secondary" >Unsaved</Badge>
            </div>
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">v1.2 - Risk Update</p>
                <p className="text-sm text-muted-foreground">Saved locally 1 hour ago</p>
              </div>
              <badge  >Synced</Badge>
            </div>
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">v1.1 - Initial Strategy</p>
                <p className="text-sm text-muted-foreground">Created yesterday</p>
              </div>
              <badge  >Synced</Badge>
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
