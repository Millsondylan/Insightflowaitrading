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

export const LocalFirstPrototype: React.FC<Localfirstprototypeprops > = ({ onSync }) => {
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
    <Card  />
      <Div className="flex items-center justify-between mb-6">
        <Div className="flex items-center gap-2">
          <Harddrive >
          <H2 className="text-2xl font-bold">Local Prototype</Localfirstprototypeprops>
        </Div>
        <Div className="flex items-center gap-4">
          <Badge  />
            {syncStatus === 'synced' ? (
              <>
                <cloud >
                Synced
              </>
            ) : syncStatus === 'pending' ? (
              <>
                <refreshcw >
                {localChanges} pending
              </>
            ) : (
              <>
                <harddrive >
                Offline
              </>
            )}
          </Div>
          <Button variant="outline" size="sm">
            Sync to Cloud
          </Button>
        </Div>
      </Div>

      <tabs defaultValue="editor">
        <Tabslist  style={{ display: "grid", width: "100%" }}>
          <Tabstrigger value="editor">Editor</Tabslist>
          <Tabstrigger value="results">Results</Tabstrigger>
          <Tabstrigger value="history">History</Tabstrigger>
        </TabsList>

        <tabscontent value="editor">
          <Div className="relative">
            <Textarea
              className="w-full h-[400px] p-4 bg-secondary/20 rounded-lg font-mono text-sm"
              value={prototypeCode}
              onChange={(e) => {
                setPrototypeCode(e.target.value);
                setLocalChanges(localChanges + 1);
                setSyncStatus('pending');
              }}
            />
            <Div className="absolute top-2 right-2 flex items-center gap-2">
              <Badge variant="outline" style={{ fontSize: "0.75rem" }}>
                <harddrive >
                Local Only
              </Div>
            </Div>
          </Div>
          
          <Div className="flex gap-2">
            <Button >
              <play >
              Run Local Test
            </Div>
            <Button variant="outline">
              <save >
              Save Draft
            </Button>
          </Div>
        </TabsContent>

        <tabscontent value="results">
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Div className="p-4 bg-secondary/20 rounded-lg text-center">
              <P className="text-2xl font-bold text-green-500">{testResults.winRate}%</Div>
              <P className="text-sm text-muted-foreground">Win Rate</P>
            </Div>
            <Div className="p-4 bg-secondary/20 rounded-lg text-center">
              <P className="text-2xl font-bold">{testResults.profitFactor}</Div>
              <P className="text-sm text-muted-foreground">Profit Factor</P>
            </Div>
            <Div className="p-4 bg-secondary/20 rounded-lg text-center">
              <P className="text-2xl font-bold text-red-500">{testResults.maxDrawdown}%</Div>
              <P className="text-sm text-muted-foreground">Max Drawdown</P>
            </Div>
            <Div className="p-4 bg-secondary/20 rounded-lg text-center">
              <P className="text-2xl font-bold">{testResults.trades}</Div>
              <P className="text-sm text-muted-foreground">Total Trades</P>
            </Div>
          </Div>

          <Div className="p-4 bg-blue-500/10 rounded-lg">
            <P className="text-sm text-blue-600">
              Results are calculated locally using cached market data. Sync to cloud for full backtesting.
            </Div>
          </Div>
        </TabsContent>

        <tabscontent value="history">
          <Div className="space-y-2">
            <Div className="p-3 border rounded-lg flex items-center justify-between">
              <Div>
                <P className="font-medium">Current Draft</Div>
                <P className="text-sm text-muted-foreground">Modified 2 minutes ago</P>
              </Div>
              <Badge variant="secondary">Unsaved</Badge>
            </Div>
            <Div className="p-3 border rounded-lg flex items-center justify-between">
              <Div>
                <P className="font-medium">v1.2 - Risk Update</Div>
                <P className="text-sm text-muted-foreground">Saved locally 1 hour ago</P>
              </Div>
              <Badge >Synced</Badge>
            </Div>
            <Div className="p-3 border rounded-lg flex items-center justify-between">
              <Div>
                <P className="font-medium">v1.1 - Initial Strategy</Div>
                <P className="text-sm text-muted-foreground">Created yesterday</P>
              </Div>
              <Badge >Synced</Badge>
            </Div>
          </Div>
        </TabsContent>
      </Tabs>

      <Div className="mt-6 p-4 bg-secondary/20 rounded-lg">
        <H4 className="font-medium mb-2"></Div></Div>Local-First Benefits</Div>
        <Ul className="space-y-1 text-sm text-muted-foreground">
          <Li>• Work offline without interruption</Ul>
          <Li>• Instant feedback on changes</Li>
          <Li>• Automatic conflict resolution</Li>
          <Li>• Version history preserved locally</Li>
        </Ul>
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
