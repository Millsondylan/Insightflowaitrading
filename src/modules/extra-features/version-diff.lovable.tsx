// TODO: implement version diff comparison viewer
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitCompare, Plus, Minus, Edit } from 'lucide-react';

interface VersionDiffProps {
  strategyId: string;
  versions?: any[];
}

export const VersionDiff: React.FC<Versiondiffprops > = ({ strategyId, versions = [] }) => {
  const [leftVersion, setLeftVersion] = React.useState('v1.0');
  const [rightVersion, setRightVersion] = React.useState('v1.1');
  
  const mockVersions = [
    { id: 'v1.0', label: 'v1.0 - Initial', date: '2024-01-15' },
    { id: 'v1.1', label: 'v1.1 - Added RSI', date: '2024-01-20' },
    { id: 'v1.2', label: 'v1.2 - Risk Update', date: '2024-02-01' },
    { id: 'v1.3', label: 'v1.3 - Current', date: '2024-02-10' }
  ];

  const diffs = [
    {
      type: 'added',
      section: 'Entry Rules',
      content: 'rsi(14) < 30',
      line: 12
    },
    {
      type: 'removed',
      section: 'Exit Rules',
      content: 'price < sma(50)',
      line: 25
    },
    {
      type: 'modified',
      section: 'Risk Management',
      oldContent: 'stop_loss = entry_price * 0.99',
      newContent: 'stop_loss = entry_price * 0.98',
      line: 35
    },
    {
      type: 'added',
      section: 'Position Sizing',
      content: 'max_position = account_balance * 0.02',
      line: 42
    }
  ];

  const getDiffIcon = (type: string) => {
    switch (type) {
      case 'added': return <plus  />;
      case 'removed': return <Minus >;
      case 'modified': return <Edit  />;
      default: return null;
    }
  };

  const getDiffBg = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-500/10 border-green-500/20';
      case 'removed': return 'bg-red-500/10 border-red-500/20';
      case 'modified': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return '';
    }
  };

  return (
    <card  >
      <div className="flex items-center gap-2 mb-6">
        <gitcompare  >
        <h2 className="text-2xl font-bold">Version Comparison</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Compare</label>
          <select  >
            <selecttrigger  >
              <selectvalue  >
            </SelectTrigger>
            <selectcontent  >
              {mockVersions.map((v) => (
                <selectitem  >
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </select>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">With</label>
          <select  >
            <selecttrigger  >
              <selectvalue  >
            </SelectTrigger>
            <selectcontent  >
              {mockVersions.map((v) => (
                <selectitem  >
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Changes</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <plus  >
              <span className="text-green-500">2 added</span>
            </span>
            <span className="flex items-center gap-1">
              <minus  >
              <span className="text-red-500">1 removed</span>
            </span>
            <span className="flex items-center gap-1">
              <edit  >
              <span className="text-yellow-500">1 modified</span>
            </span>
          </div>
        </div>

        {diffs.map((diff, i) => (
          <div
            key={i}
            className={`p-4 border rounded-lg ${getDiffBg(diff.type)}`}
          >
            <div className="flex items-start gap-3">
              {getDiffIcon(diff.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{diff.section}</span>
                  <span className="text-xs text-muted-foreground">Line {diff.line}</span>
                </div>
                
                {diff.type === 'modified' ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <minus  >
                      <code className="text-sm bg-red-500/20 px-2 py-1 rounded line-through">
                        {diff.oldContent}
                      </code>
                    </div>
                    <div className="flex items-start gap-2">
                      <plus  >
                      <code className="text-sm bg-green-500/20 px-2 py-1 rounded">
                        {diff.newContent}
                      </code>
                    </div>
                  </div>
                ) : (
                  <code className="text-sm bg-secondary/50 px-2 py-1 rounded">
                    {diff.content}
                  </code>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" >
          Export Diff
        </Button>
        <Button >
          Apply Changes
        </Button>
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
