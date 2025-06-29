import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface LovablePreviewProps {
  sourceCode?: string;
  onEdit?: (componentId: string, changes: any) => void;
}

export const LovablePreview: React.FC<LovablePreviewProps> = ({
  sourceCode = '',
  onEdit
}) => {
  const [preview, setPreview] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableProperties, setEditableProperties] = useState<any>({});
  
  useEffect(() => {
    if (sourceCode) {
      // Generate preview from source code
      renderPreview(sourceCode);
    }
  }, [sourceCode]);
  
  const renderPreview = (code: string) => {
    // This would be replaced with actual rendering logic
    // For now, we'll just simulate a preview
    setPreview(code);
  };
  
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
    // In a real implementation, this would extract editable properties
    setEditableProperties({
      className: 'p-4 bg-background-primary rounded-lg shadow',
      textContent: 'Sample Component',
      style: {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 'normal'
      }
    });
    setIsEditing(true);
  };
  
  const handlePropertyChange = (property: string, value: any) => {
    setEditableProperties({
      ...editableProperties,
      [property]: value
    });
  };
  
  const handleStyleChange = (property: string, value: any) => {
    setEditableProperties({
      ...editableProperties,
      style: {
        ...editableProperties.style,
        [property]: value
      }
    });
  };
  
  const applyChanges = () => {
    if (selectedComponent && onEdit) {
      onEdit(selectedComponent, editableProperties);
    }
    setIsEditing(false);
    setSelectedComponent(null);
  };
  
  return (
    <div className="lovable-preview">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Visual Editor</h2>
        <div className="flex space-x-2">
          <Button variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={!isEditing}
          >
            Cancel
          </Button>
          <Button onClick={applyChanges}
            disabled={!isEditing}
         >
            Apply Changes
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="h-full">
            <div className="p-4 h-full flex items-center justify-center border-2 border-dashed border-border-primary rounded-lg">
              {preview ? (
                <div className="w-full h-full relative">
                  <div 
                    className="absolute inset-0 bg-transparent cursor-pointer z-10"
                    onClick={() => handleComponentSelect('sample-component-1')}
                  />
                  <div className="preview-content">
                    {/* This would be replaced with actual rendered preview */}
                    <div className="p-4 bg-background-secondary rounded">
                      <h3 className="text-lg font-medium">Preview Component</h3>
                      <p>Click to edit this component</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-text-muted">
                  No preview available
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <div className="p-4">
              {isEditing ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Edit Component</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Text Content</label>
                      <input value={editableProperties.textContent}
                        onChange={(e) => handlePropertyChange('textContent', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">CSS Classes</label>
                      <input value={editableProperties.className}
                        onChange={(e) => handlePropertyChange('className', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color"
                          value={editableProperties.style.color}
                          onChange={(e) => handleStyleChange('color', e.target.value)}
                          className="w-8 h-8 rounded"
                        />
                        <input value={editableProperties.style.color}
                          onChange={(e) => handleStyleChange('color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Font Size</label>
                      <div className="flex items-center space-x-2">
                        <input type="number"
                          value={parseInt(editableProperties.style.fontSize)}
                          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                          className="w-20"
                          min={8}
                          max={72}
                        />
                        <span>px</span>
                        <input type="range"
                          value={parseInt(editableProperties.style.fontSize)}
                          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                          min={8}
                          max={72}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Font Weight</label>
                      <select
                        value={editableProperties.style.fontWeight}
                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                        className="w-full p-2 bg-background-primary border border-border-primary rounded"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="lighter">Light</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-text-muted h-full flex items-center justify-center">
                  <div>
                    <p className="mb-4">Select a component to edit</p>
                    <button onClick={() => handleComponentSelect('sample-component-1')}>
                      Select Component
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
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

export default LovablePreview;
