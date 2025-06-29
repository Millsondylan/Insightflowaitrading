// TODO: implement strategy versioning with diff viewer
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VaultVersioningProps {
  strategyId: string;
}

export const VaultVersioning: React.FC<VaultVersioningProps> = ({ strategyId }) => {
  const [versions, setVersions] = React.useState<any[]>([]);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');

  return (
    <Card className="theme-card p-6" />
      <H2 className="text-2xl font-bold mb-4">Version History</VaultVersioningProps>
      <Div className="space-y-4">
        <Div className="flex gap-2">
          <Button variant="outline" size="sm" />Compare Versions</Div>
          <Button variant="outline" size="sm" />Restore Version</Button>
        </Div>
        <Div className="space-y-2">
          {versions.map((v, i) => (
            <Div key={i} className="p-3 border rounded hover:bg-accent cursor-pointer">
              <Div className="flex justify-between items-center">
                <Span className="font-medium">v{v.version}</Div>
                <Span className="text-sm text-muted-foreground">{v.date}</Span>
              </Div>
              <P className="text-sm text-muted-foreground mt-1">{v.changes}</P>
            </Div>
          ))}
        </Div>
      </Div>
    </Card>
  );
}; 