// TODO: implement replay annotation system
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, AlertTriangle, TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface ReplayAnnotationsProps {
  tradeId?: string;
  onAnnotationAdd?: (annotation: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any) => void;
}

export const ReplayAnnotations: React.FC<ReplayAnnotationsProps> = ({ tradeId, onAnnotationAdd }) => {
  const annotationTypes = [
    { id: 'volatility-trap', label: 'Volatility Trap', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'reversal', label: 'Reversal', icon: TrendingUp, color: 'text-blue-500' },
    { id: 'breakout', label: 'Breakout', icon: Zap, color: 'text-purple-500' },
    { id: 'exit-signal', label: 'Exit Signal', icon: TrendingDown, color: 'text-yellow-500' }
  ];

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

  const [annotations, setAnnotations] = React.useState([
    {
      id: 1,
      type: 'volatility-trap',
      timestamp: '00:45',
      note: 'False breakout detected, price reversed quickly',
      price: 44250
    },
    {
      id: 2,
      type: 'reversal',
      timestamp: '02:15',
      note: 'Major support held, trend reversal confirmed',
      price: 43800
    },
    {
      id: 3,
      type: 'exit-signal',
      timestamp: '03:30',
      note: 'RSI divergence, momentum weakening',
      price: 44500
    }
  ]);

  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [customNote, setCustomNote] = React.useState('');

  const addAnnotation = () => {
    if (!selectedType) return;

    const newAnnotation = {
      id: Date.now(),
      type: selectedType,
      timestamp: '04:00', // Would be dynamic in real implementation
      note: customNote,
      price: 45000 // Would be from current chart price
    };

    setAnnotations([...annotations, newAnnotation]);
    onAnnotationAdd?.(newAnnotation);
    setCustomNote('');
    setSelectedType(null);
    // TODO: Connect to createAnnotation function
  };

  return (
    <Card className="theme-card p-6" />
      <H2 className="text-2xl font-bold mb-4">Replay Annotations</ReplayAnnotationsProps>

      <Div className="space-y-6">
        <Div>
          <H3 className="font-semibold mb-3">Add Annotation</Div>
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {annotationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button key={type.id}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() = /> setSelectedType(type.id)}
                >
                  <Icon className={`h-4 w-4 ${type.color}`} />
                  <Span className="text-xs">{type.label}</Div>
                </Button>
              );
            })}
          </Div>
          
          <Div className="flex gap-2">
            <Input placeholder="Add a note about this moment..."
              value={customNote}
              onChange={(e) = /> setCustomNote(e.target.value)}
            />
            <Button onClick={addAnnotation} disabled={!selectedType}>
              <Tag className="h-4 w-4 mr-2" />
              Add
            </Div>
          </Div>
        </Div>

        <Div>
          <H3 className="font-semibold mb-3">Annotations Timeline</Div>
          <Div className="space-y-3">
            {annotations.map((annotation) => {
              const type = annotationTypes.find(t => t.id === annotation.type);
              const Icon = type?.icon || Tag;

              return (
                <Div key={annotation.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50">
                  <Div className={`mt-1 ${type?.color}`}>
                    <Icon className="h-5 w-5" / / / / / />
                  </Div>
                  <Div className="flex-1">
                    <Div className="flex items-center justify-between mb-1">
                      <Badge variant="outline"></Div>{type?.label}</Div>
                      <Div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Span>{annotation.timestamp}</Div>
                        <Span>•</Span>
                        <Span>${annotation.price}</Span>
                      </Div>
                    </Div>
                    <P className="text-sm">{annotation.note}</P>
                  </Div>
                </Div>
              );
            })}
          </Div>
        </Div>

        <Div className="p-4 bg-secondary/20 rounded-lg">
          <H4 className="font-medium mb-2"></Div>Pattern Recognition</Div>
          <P className="text-sm text-muted-foreground mb-3">
            Based on your annotations, we've identified recurring patterns:
          </P>
          <Div className="grid grid-cols-2 gap-2">
            <Div className="text-center p-2 bg-background rounded">
              <P className="text-lg font-bold text-red-500">3</Div>
              <P className="text-xs text-muted-foreground">Volatility Traps/Week</P>
            </Div>
            <Div className="text-center p-2 bg-background rounded">
              <P className="text-lg font-bold text-green-500">78%</Div>
              <P className="text-xs text-muted-foreground">Exit Signal Accuracy</P>
            </Div>
          </Div>
        </Div>
      </div />
  );
}; 