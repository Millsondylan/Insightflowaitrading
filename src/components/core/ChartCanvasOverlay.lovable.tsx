import { useState } from 'react';
import { PatternZone } from '@/lib/vision/sampleOverlays';
import PatternTooltip from '@/components/ui/PatternTooltip';
import '@/styles/vision-overlay.css';

interface ChartCanvasOverlayProps {
  imageUrl: string;
  patternZones: PatternZone[];
}

const ChartCanvasOverlay = ({ imageUrl, patternZones }: ChartCanvasOverlayProps) => {
  const [hoveredZone, setHoveredZone] = useState<PatternZone | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleZoneMouseEnter = (zone: PatternZone, e: React.MouseEvent) => {
    setHoveredZone(zone);
    
    // Calculate tooltip position
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top;
    
    setTooltipPosition({
      x: centerX,
      y: topY,
    });
  };

  const handleZoneMouseLeave = () => {
    setHoveredZone(null);
  };

  return (
    <div className="chart-overlay-container">
      <img src={imageUrl} alt="Chart with pattern overlays" />
      
      {patternZones.map((zone) => (
        <div
          key={zone.id}
          className={`pattern-zone ${zone.type || 'neutral'}`}
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
            opacity: hoveredZone?.id === zone.id ? 1 : 0.7,
          }}
          onMouseEnter={(e) => handleZoneMouseEnter(zone, e)}
          onMouseLeave={handleZoneMouseLeave}
        />
      ))}
      
      {hoveredZone && (
        <PatternTooltip
          label={hoveredZone.label}
          description={hoveredZone.description}
          confidence={hoveredZone.confidence}
          type={hoveredZone.type}
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%) translateY(-10px)',
          }}
        />
      )}
    </div>
  );
};

export default ChartCanvasOverlay; 