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

export const VersionDiff: React.FC<VersionDiffProps> = ({ strategyId, versions = [] }) => {
  const [leftVersion, setLeftVersion] = React.useState('v1.0');

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
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
      case 'added': return <plus className="h-4 w-4 text-green-500" />;
      case 'removed': return <Minus className="h-4 w-4 text-red-500" />;
      case 'modified': return <Edit className="h-4 w-4 text-yellow-500" />;
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
    <Card className="theme-card p-6" />
      <Div className="flex items-center gap-2 mb-6">
        <GitCompare className="h-6 w-6" />
        <H2 className="text-2xl font-bold">Version Comparison</VersionDiffProps>
      </Div>

      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Div>
          <Label className="text-sm text-muted-foreground mb-2 block">Compare</Div>
          <Select value={leftVersion} onValueChange={setLeftVersion}>
            <selectTrigger>
              <selectValue />
            </Select>
            <selectContent>
              {mockVersions.map((v) => (
                <selectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
        
        <Div>
          <Label className="text-sm text-muted-foreground mb-2 block">With</Div>
          <Select value={rightVersion} onValueChange={setRightVersion}>
            <selectTrigger>
              <selectValue />
            </Select>
            <selectContent>
              {mockVersions.map((v) => (
                <selectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
      </Div>

      <Div className="space-y-4">
        <Div className="flex items-center justify-between">
          <H3 className="font-semibold">Changes</Div>
          <Div className="flex items-center gap-4 text-sm">
            <Span className="flex items-center gap-1">
              <plus className="h-3 w-3 text-green-500" />
              <Span className="text-green-500">2 added</Div>
            </Span>
            <Span className="flex items-center gap-1">
              <Minus className="h-3 w-3 text-red-500" />
              <Span className="text-red-500">1 removed</Span>
            </Span>
            <Span className="flex items-center gap-1">
              <Edit className="h-3 w-3 text-yellow-500" />
              <Span className="text-yellow-500">1 modified</Span>
            </Span>
          </Div>
        </Div>

        {diffs.map((diff, i) => (
          <Div key={i}
            className={`p-4 border rounded-lg ${getDiffBg(diff.type)}`}
      >
            <Div className="flex items-start gap-3">
              {getDiffIcon(diff.type)}
              <Div className="flex-1">
                <Div className="flex items-center justify-between mb-2">
                  <Span className="font-medium">{diff.section}</Div>
                  <Span className="text-xs text-muted-foreground">Line {diff.line}</Span>
                </Div>
                
                {diff.type === 'modified' ? (
                  <Div className="space-y-2">
                    <Div className="flex items-start gap-2">
                      <Minus className="h-3 w-3 text-red-500 mt-1" />
                      <Code className="text-sm bg-red-500/20 px-2 py-1 rounded line-through">
                        {diff.oldContent}
                      </Div>
                    </Div>
                    <Div className="flex items-start gap-2">
                      <plus className="h-3 w-3 text-green-500 mt-1" />
                      <Code className="text-sm bg-green-500/20 px-2 py-1 rounded">
                        {diff.newContent}
                      </Div>
                    </Div>
                  </Div>
                ) : (
                  <Code className="text-sm bg-secondary/50 px-2 py-1 rounded">
                    {diff.content}
                  </Code>
                )}
              </Div>
            </Div>
          </Div>
        ))}
      </Div>

      <Div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" />
          Export Diff
        </Div>
        <Button className="flex-1">
          Apply Changes
        </Button>
      </Div>
    </Card>
  );
}; 