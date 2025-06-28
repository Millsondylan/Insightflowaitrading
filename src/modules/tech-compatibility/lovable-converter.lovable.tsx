// TODO: implement React to Lovable.dev converter
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';

interface ConversionResult {
  original: string;
  converted: string;
  changes: {
    description: string;
    type: 'added' | 'modified' | 'removed';
  }[];
  status: 'success' | 'warning' | 'error';
  message: string;
}

export const LovableConverter: React.FC = () => {
  const [componentPath, setComponentPath] = useState<string>('');
  const [conversionInProgress, setConversionInProgress] = useState<boolean>(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [recentConversions, setRecentConversions] = useState<{path: string, timestamp: number}[]>([]);
  
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComponentPath(e.target.value);
  };
  
  const convertComponent = async () => {
    if (!componentPath.trim()) {
      return;
    }
    
    setConversionInProgress(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      const mockResult: ConversionResult = {
        original: `import React from 'react';

const ComponentName = () => {
  return (
    <div className="component-wrapper">
      <h1>Original Component</h1>
      <p>This needs to be converted to Lovable format</p>
    </div>
  );
}

export default ComponentName;`,
        converted: `import React from 'react';

const ComponentName = () => {
  return (
    <div className="component-wrapper">
      <h1>Lovable Compatible Component</h1>
      <p>This has been converted to Lovable format</p>
    </div>
  );
}

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default ComponentName;`,
        changes: [
          {
            description: 'Added lovable export object',
            type: 'added'
          },
          {
            description: 'Updated component content to be Lovable compatible',
            type: 'modified'
          },
          {
            description: 'Added proper React exports',
            type: 'added'
          }
        ],
        status: 'success',
        message: 'Component successfully converted to Lovable format!'
      };
      
      setConversionResult(mockResult);
      
      // Add to recent conversions
      const newConversion = { path: componentPath, timestamp: Date.now() };
      setRecentConversions(prev => [newConversion, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionResult({
        original: '',
        converted: '',
        changes: [],
        status: 'error',
        message: 'Failed to convert component. Please try again.'
      });
    } finally {
      setConversionInProgress(false);
    }
  };
  
  const convertAll = async () => {
    setConversionInProgress(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result
      const mockResult: ConversionResult = {
        original: 'Multiple components',
        converted: 'Multiple components converted to Lovable format',
        changes: [
          {
            description: 'Converted 15 components to Lovable format',
            type: 'added'
          },
          {
            description: 'Added lovable export object to all components',
            type: 'added'
          },
          {
            description: 'Updated imports for Lovable compatibility',
            type: 'modified'
          }
        ],
        status: 'success',
        message: 'Project successfully converted to Lovable format!'
      };
      
      setConversionResult(mockResult);
      
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionResult({
        original: '',
        converted: '',
        changes: [],
        status: 'error',
        message: 'Failed to convert project. Please try again.'
      });
    } finally {
      setConversionInProgress(false);
    }
  };
  
  return (
    <div className="lovable-converter">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Lovable Converter</h1>
            <p className="text-text-muted">Convert your components to be Lovable compatible</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Tech Compatibility
          </Badge>
        </div>
        
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Convert Component</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter component path (e.g. src/components/Button.tsx)"
                value={componentPath}
                onChange={handlePathChange}
                className="flex-1"
              />
              <Button 
                onClick={convertComponent}
                disabled={conversionInProgress || !componentPath.trim()}
              >
                {conversionInProgress ? 'Converting...' : 'Convert'}
              </Button>
              <Button 
                variant="outline"
                onClick={convertAll}
                disabled={conversionInProgress}
              >
                Convert All
              </Button>
            </div>
          </div>
          
          {recentConversions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Recent Conversions</h3>
              <div className="flex flex-wrap gap-2">
                {recentConversions.map((conversion, index) => (
                  <button
                    key={index}
                    className="text-xs bg-background-secondary hover:bg-background-interactive px-2 py-1 rounded"
                    onClick={() => setComponentPath(conversion.path)}
                  >
                    {conversion.path.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {conversionResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Conversion Results</h3>
              
              <div className={`p-4 rounded mb-4 ${
                conversionResult.status === 'success' ? 'bg-status-success/10 text-status-success' :
                conversionResult.status === 'warning' ? 'bg-status-warning/10 text-status-warning' :
                'bg-status-error/10 text-status-error'
              }`}>
                {conversionResult.message}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Changes made:</h4>
                <ul className="space-y-1">
                  {conversionResult.changes.map((change, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        change.type === 'added' ? 'bg-status-success' :
                        change.type === 'modified' ? 'bg-status-warning' :
                        'bg-status-error'
                      }`}></span>
                      {change.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Tabs defaultValue="converted" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="original">Original Code</TabsTrigger>
                  <TabsTrigger value="converted">Converted Code</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-2">
                  <div className="bg-background-secondary p-4 rounded font-mono text-sm overflow-auto max-h-64">
                    <pre>{conversionResult.original}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="converted" className="mt-2">
                  <div className="bg-background-secondary p-4 rounded font-mono text-sm overflow-auto max-h-64">
                    <pre>{conversionResult.converted}</pre>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="mr-2">
                  Download Converted File
                </Button>
                <Button>
                  Apply Changes
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lovable Compatibility Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Required Changes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Add a lovable export object to each component</li>
                <li>Ensure component is React.FC typed</li>
                <li>Use Tailwind classes for styling</li>
                <li>Make components fully self-contained</li>
                <li>Follow stable ID pattern for visual editing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Benefits</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Full Visual Editing compatibility</li>
                <li>Real-time preview updates</li>
                <li>AI-assisted improvements</li>
                <li>Component reuse across projects</li>
                <li>Better collaboration features</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default LovableConverter; 