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
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700", marginBottom: "16px" }}>Replay Annotations</h2>

      <div >
        <div>
          <h3 >Add Annotation</h3>
          <div style={{ marginBottom: "16px" }}>
            {annotationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                  size="sm"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setSelectedType(type.id)}
                >
                  <Icon className={`h-4 w-4 ${type.color}`} />
                  <span >{type.label}</span>
                </Button>
              );
            })}
          </div>
          
          <div style={{ display: "flex" }}>
            <Input
              placeholder="Add a note about this moment..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />
            <Button onClick={addAnnotation} disabled={!selectedType}>
              <Tag  />
              Add
            </Button>
          </div>
        </div>

        <div>
          <h3 >Annotations Timeline</h3>
          <div >
            {annotations.map((annotation) => {
              const type = annotationTypes.find(t => t.id === annotation.type);
              const Icon = type?.icon || Tag;

              return (
                <div key={annotation.id} style={{ display: "flex", border: "1px solid #374151" }}>
                  <div className={`mt-1 ${type?.color}`}>
                    <Icon  />
                  </div>
                  <div >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Badge variant="outline">{type?.label}</Badge>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>{annotation.timestamp}</span>
                        <span>•</span>
                        <span>${annotation.price}</span>
                      </div>
                    </div>
                    <p >{annotation.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          <h4 >Pattern Recognition</h4>
          <p >
            Based on your annotations, we've identified recurring patterns:
          </p>
          <div >
            <div >
              <p style={{ fontWeight: "700" }}>3</p>
              <p >Volatility Traps/Week</p>
            </div>
            <div >
              <p style={{ fontWeight: "700" }}>78%</p>
              <p >Exit Signal Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 