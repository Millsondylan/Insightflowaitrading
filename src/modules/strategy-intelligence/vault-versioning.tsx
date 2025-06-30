// TODO: implement strategy versioning with diff viewer
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VaultVersioningProps {
  strategyId: string;
}

export const VaultVersioning: React.FC<VaultVersioningProps> = ({ strategyId }) => {
  const [versions, setVersions] = React.useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');

  return (
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-4">Version History</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Compare Versions</Button>
          <Button variant="outline" size="sm">Restore Version</Button>
        </div>
        <div className="space-y-2">
          {versions.map((v, i) => (
            <div key={i} className="p-3 border rounded hover:bg-accent cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="font-medium">v{v.version}</span>
                <span className="text-sm text-muted-foreground">{v.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{v.changes}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}; 