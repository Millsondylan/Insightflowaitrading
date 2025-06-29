import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const LovableNextConverter: React.FC = () => {
  const [projectPath, setProjectPath] = useState<string>('');
  const [isDryRun, setIsDryRun] = useState<boolean>(true);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Next.js Migration Tool</h1>
      <p className="mb-4">Convert your Lovable React app to Next.js</p>
      
      <Card className="p-4">
        <div className="mb-4">
          <label className="block mb-2">Project Path:</label>
          <input value={projectPath}
            onChange={(e) = /> setProjectPath(e.target.value)}
            placeholder="./my-project"
          />
        </div>
        
        <button>Start Migration</Button>
      </Card>
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default LovableNextConverter;
