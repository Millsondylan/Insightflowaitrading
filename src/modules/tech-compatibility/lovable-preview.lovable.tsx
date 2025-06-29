import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface LovablePreviewProps {
  sourceCode?: string;
  onEdit?: (componentId: string, changes: any // eslint-disable-line @typescript-eslint/no-explicit-any) => void;
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
  
  const handlePropertyChange = (property: string, value: unknown) => {
    setEditableProperties({
      ...editableProperties,
      [property]: value
    });
  };
  
  const handleStyleChange = (property: string, value: unknown) => {
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
    <Div className="lovable-preview">
      <Div className="flex justify-between items-center mb-4">
        <H2 className="text-xl font-bold">Visual Editor</LovablePreviewProps>
        <Div className="flex space-x-2">
          <Button variant="outline"
            onClick={() = /> setIsEditing(false)}
            disabled={!isEditing}
          >
            Cancel
          </Div>
          <Button onClick={applyChanges}
            disabled={!isEditing}
       >
            Apply Changes
          </Button>
        </Div>
      </Div>
      
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Div className="md:col-span-2">
          <Card className="h-full" />
            <Div className="p-4 h-full flex items-center justify-center border-2 border-dashed border-border-primary rounded-lg">
              {preview ? (
                <Div className="w-full h-full relative">
                  <Div 
                    className="absolute inset-0 bg-transparent cursor-pointer z-10"
                    onClick={() => handleComponentSelect('sample-component-1')}
                  />
                  <Div className="preview-content">
                    {/* This would be replaced with actual rendered preview */}
                    <Div className="p-4 bg-background-secondary rounded">
                      <H3 className="text-lg font-medium">Preview Component</Div>
                      <P>Click to edit this component</P>
                    </Div>
                  </Div>
                </Div>
              ) : (
                <Div className="text-center text-text-muted">
                  No preview available
                </Div>
              )}
            </Div>
          </Card>
        </Div>
        
        <Div>
          <Card className="h-full" />
            <Div className="p-4">
              {isEditing ? (
                <Div>
                  <H3 className="text-lg font-medium mb-4">Edit Component</Div>
                  
                  <Div className="space-y-4">
                    <Div>
                      <Label className="block text-sm font-medium mb-1">Text Content</Div>
                      <Input value={editableProperties.textContent}
                        onChange={(e) => handlePropertyChange('textContent', e.target.value)}
                        className="w-full"
                      />
                    </Input>
                    
                    <Div>
                      <Label className="block text-sm font-medium mb-1">CSS Classes</Div>
                      <Input value={editableProperties.className}
                        onChange={(e) => handlePropertyChange('className', e.target.value)}
                        className="w-full"
                      />
                    </Input>
                    
                    <Div>
                      <Label className="block text-sm font-medium mb-2">Text Color</Div>
                      <Div className="flex items-center space-x-2">
                        <Input type="color"
                          value={editableProperties.style.color}
                          onChange={(e) => handleStyleChange('color', e.target.value)}
                          className="w-8 h-8 rounded"
                        />
                        <Input value={editableProperties.style.color}
                          onChange={(e) => handleStyleChange('color', e.target.value)}
                          className="flex-1"
                        />
                      </Div>
                    </Div>
                    
                    <Div>
                      <Label className="block text-sm font-medium mb-1">Font Size</Div>
                      <Div className="flex items-center space-x-2">
                        <Input type="number"
                          value={parseInt(editableProperties.style.fontSize)}
                          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                          className="w-20"
                          min={8}
                          max={72}
                        />
                        <Span>px</Div>
                        <Input type="range"
                          value={parseInt(editableProperties.style.fontSize)}
                          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                          min={8}
                          max={72}
                          className="flex-1"
                        />
                      </Input>
                    </Div>
                    
                    <Div>
                      <Label className="block text-sm font-medium mb-1">Font Weight</Div>
                      <Select
                        value={editableProperties.style.fontWeight}
                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                        className="w-full p-2 bg-background-primary border border-border-primary rounded"
                      >
                        <Option value="normal">Normal</Select>
                        <Option value="bold">Bold</Option>
                        <Option value="lighter">Light</Option>
                      </Select>
                    </Div>
                  </Div>
                </Div>
              ) : (
                <Div className="text-center text-text-muted h-full flex items-center justify-center">
                  <Div>
                    <P className="mb-4">Select a component to edit</Div>
                    <Button onClick={() =></Button> handleComponentSelect('sample-component-1')}>
                      Select Component
                    </Button>
                  </Div>
                </Div>
              )}
            </Div>
          </Card>
        </Div>
      </Div>
    </Div>
  );
};

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default LovablePreview;
