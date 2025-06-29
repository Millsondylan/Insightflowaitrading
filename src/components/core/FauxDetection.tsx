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
  const [patternZones, setPatternZones] = useState<patternZone[]>([]);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <blockReveal>
        <div className="glass-container p-4 rounded-lg">
          {showOverlays ? (
            <ChartCanvasOverlay imageUrl={imagePreview} patternZones={patternZones} />
          ) : (
            <img src={imagePreview} alt="Chart preview" className="rounded-md w-full" />
          )}
          <div className="mt-2 flex justify-end">
            <Button  onClick={() => setShowOverlays(!showOverlays)} 
              className="text-sm text-cyan-400 hover:underline"
            >
              {showOverlays ? 'Hide Overlays' : 'Show Overlays'}
            </Button>
          </div>
        </div>
      </BlockReveal>
      
      <div className="space-y-6">
        <blockReveal delay={0.1}>
          <h3 className="text-2xl font-bold text-cyan-400">Detected Patterns</h3>
          <div className="flex flex-wrap mt-2">
            {result.patterns.map(pattern => (
              <patternTag key={pattern} label={pattern} />
            ))}
          </div>
        </BlockReveal>

        <blockReveal delay={0.2}>
          <h3 className="text-2xl font-bold text-cyan-400">AI Summary</h3>
          <p className="text-gray-300 mt-2">{result.summary}</p>
        </BlockReveal>
        
        <blockReveal delay={0.3}>
          <h3 className="text-2xl font-bold text-cyan-400">Confidence</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="confidence-meter-bg flex-grow">
              <div
                className="confidence-meter-bar"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xl font-bold text-white">{confidence}%</span>
          </div>
        </BlockReveal>
        
        <blockReveal delay={0.4}>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button asChild className="glow-button bg-violet-500/20 border-violet-500 hover:bg-violet-500/30">
              <Link to="/journal?from=vision">📓 Save to Journal</Link>
            </Button>
            <Button asChild className="glow-button bg-blue-500/20 border-blue-500 hover:bg-blue-500/30">
              <Link to="/academy?topic=patterns">📘 Learn Pattern</Link>
            </Button>
            <Button asChild className="glow-button bg-green-500/20 border-green-500 hover:bg-green-500/30">
              <Link to="/strategy?from=vision">💡 Find Strategy</Link>
            </Button>
          </div>
        </BlockReveal>
      </div>
    </div>
  );
};

export default FauxDetection;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 