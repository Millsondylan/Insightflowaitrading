// TODO: implement replay annotation system
import React from 'react';

interface ReplayAnnotationsProps {
  tradeId?: string;
  onAnnotationAdd?: (annotation: any) => void;
}

export const ReplayAnnotations: React.FC<ReplayAnnotationsProps> = ({ tradeId, onAnnotationAdd }) => {
  const annotationTypes = [
    { id: 'volatility-trap', label: 'Volatility Trap', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'reversal', label: 'Reversal', icon: TrendingUp, color: 'text-blue-500' },
    { id: 'breakout', label: 'Breakout', icon: Zap, color: 'text-purple-500' },
    { id: 'exit-signal', label: 'Exit Signal', icon: TrendingDown, color: 'text-yellow-500' }
  ];

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
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-4">Replay Annotations</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Add Annotation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {annotationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setSelectedType(type.id)}
                >
                  <Icon className={`h-4 w-4 ${type.color}`} />
                  <span className="text-xs">{type.label}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a note about this moment..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />
            <Button onClick={addAnnotation} disabled={!selectedType}>
              <Tag className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Annotations Timeline</h3>
          <div className="space-y-3">
            {annotations.map((annotation) => {
              const type = annotationTypes.find(t => t.id === annotation.type);
              const Icon = type?.icon || Tag;

              return (
                <div key={annotation.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50">
                  <div className={`mt-1 ${type?.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline">{type?.label}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{annotation.timestamp}</span>
                        <span>•</span>
                        <span>${annotation.price}</span>
                      </div>
                    </div>
                    <p className="text-sm">{annotation.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-secondary/20 rounded-lg">
          <h4 className="font-medium mb-2">Pattern Recognition</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Based on your annotations, we've identified recurring patterns:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-background rounded">
              <p className="text-lg font-bold text-red-500">3</p>
              <p className="text-xs text-muted-foreground">Volatility Traps/Week</p>
            </div>
            <div className="text-center p-2 bg-background rounded">
              <p className="text-lg font-bold text-green-500">78%</p>
              <p className="text-xs text-muted-foreground">Exit Signal Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 