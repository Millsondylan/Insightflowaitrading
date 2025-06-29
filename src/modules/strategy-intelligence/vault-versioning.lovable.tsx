// TODO: implement strategy versioning with diff viewer
import React from 'react';

interface VaultVersioningProps {
  strategyId: string;
}

export const VaultVersioning: React.FC<VaultVersioningProps> = ({ strategyId }) => {
  const [versions, setVersions] = React.useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');

  return (
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Version History</h2>
      <div >
        <div style={{ display: "flex" }}>
          <Button variant="outline" size="sm">Compare Versions</Button>
          <Button variant="outline" size="sm">Restore Version</Button>
        </div>
        <div >
          {versions.map((v, i) => (
            <div key={i} style={{ border: "1px solid #374151" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span >v{v.version}</span>
                <span >{v.date}</span>
              </div>
              <p >{v.changes}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}; 