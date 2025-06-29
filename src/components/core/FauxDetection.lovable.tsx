import { useEffect, useState } from 'react';
import { DetectionResult } from '@/lib/vision/sampleDetections';
import { PatternZone, getSampleOverlays } from '@/lib/vision/sampleOverlays';
import BlockReveal from '../ui/BlockReveal';
import PatternTag from '../ui/PatternTag';
import ChartCanvasOverlay from './ChartCanvasOverlay';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import '@/styles/vision.css';
import '@/styles/vision-overlay.css';

interface FauxDetectionProps {
  result: DetectionResult;
  imagePreview: string;
}

const FauxDetection = ({ result, imagePreview }: FauxDetectionProps) => {
  const [confidence, setConfidence] = useState(0);
  const [patternZones, setPatternZones] = useState<PatternZone[]>([]);
  const [showOverlays, setShowOverlays] = useState(true);

  useEffect(() => {
    // Animate the confidence bar
    const confidenceTimer = setTimeout(() => setConfidence(result.confidence), 100);
    
    // Get sample pattern zones
    const zones = getSampleOverlays();
    setPatternZones(zones);
    
    return () => clearTimeout(confidenceTimer);
  }, [result.confidence]);

  return (
    <div >
      <BlockReveal>
        <div style={{ padding: "16px" }}>
          {showOverlays ? (
            <span style={{fontSize: '16px'}}>📊</span>
          ) : (
            <img src={imagePreview} alt="Chart preview" style={{ width: "100%" }} />
          )}
          <div style={{ display: "flex" }}>
            <button 
              onClick={() => setShowOverlays(!showOverlays)} 
              
            >
              {showOverlays ? 'Hide Overlays' : 'Show Overlays'}
            </button>
          </div>
        </div>
      </BlockReveal>
      
      <div >
        <BlockReveal delay={0.1}>
          <h3 style={{ fontWeight: "700" }}>Detected Patterns</h3>
          <div style={{ display: "flex" }}>
            {result.patterns.map(pattern => (
              <PatternTag key={pattern} label={pattern} />
            ))}
          </div>
        </BlockReveal>

        <BlockReveal delay={0.2}>
          <h3 style={{ fontWeight: "700" }}>AI Summary</h3>
          <p >{result.summary}</p>
        </BlockReveal>
        
        <BlockReveal delay={0.3}>
          <h3 style={{ fontWeight: "700" }}>Confidence</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div >
              <div
                
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span style={{ fontWeight: "700", color: "white" }}>{confidence}%</span>
          </div>
        </BlockReveal>
        
        <BlockReveal delay={0.4}>
          <div style={{ display: "flex" }}>
            <Button asChild >
              <Link to="/journal?from=vision">📓 Save to Journal</Link>
            </Button>
            <Button asChild >
              <Link to="/academy?topic=patterns">📘 Learn Pattern</Link>
            </Button>
            <Button asChild >
              <Link to="/strategy?from=vision">💡 Find Strategy</Link>
            </Button>
          </div>
        </BlockReveal>
      </div>
    </div>
  );
};

export default FauxDetection; 