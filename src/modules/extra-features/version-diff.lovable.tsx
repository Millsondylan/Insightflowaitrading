// TODO: implement version diff comparison viewer
import React from 'react';

interface VersionDiffProps {
  strategyId: string;
  versions?: any[];
}

export const VersionDiff: React.FC<VersionDiffProps> = ({ strategyId, versions = [] }) => {
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
      case 'added': return <span style={{fontSize: '16px'}}>➕</span>;
      case 'removed': return <span style={{fontSize: '16px'}}>➖</span>;
      case 'modified': return <span style={{fontSize: '16px'}}>✏️</span>;
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
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <GitCompare  />
        <h2 style={{ fontWeight: "700" }}>Version Comparison</h2>
      </div>

      <div >
        <div>
          <label >Compare</label>
          <Select value={leftVersion} onValueChange={setLeftVersion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockVersions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label >With</label>
          <Select value={rightVersion} onValueChange={setRightVersion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockVersions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 >Changes</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>➕</span>
              <span >2 added</span>
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>➖</span>
              <span >1 removed</span>
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>✏️</span>
              <span >1 modified</span>
            </span>
          </div>
        </div>

        {diffs.map((diff, i) => (
          <div
            key={i}
            className={`p-4 border rounded-lg ${getDiffBg(diff.type)}`}
          >
            <div style={{ display: "flex" }}>
              {getDiffIcon(diff.type)}
              <div >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span >{diff.section}</span>
                  <span >Line {diff.line}</span>
                </div>
                
                {diff.type === 'modified' ? (
                  <div >
                    <div style={{ display: "flex" }}>
                      <span style={{fontSize: '16px'}}>➖</span>
                      <code >
                        {diff.oldContent}
                      </code>
                    </div>
                    <div style={{ display: "flex" }}>
                      <span style={{fontSize: '16px'}}>➕</span>
                      <code >
                        {diff.newContent}
                      </code>
                    </div>
                  </div>
                ) : (
                  <code >
                    {diff.content}
                  </code>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
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