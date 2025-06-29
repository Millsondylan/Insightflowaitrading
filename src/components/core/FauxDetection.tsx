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
    <Div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <BlockReveal>
        <Div className="glass-container p-4 rounded-lg">
          {showOverlays ? (
            <ChartCanvasOverlay imageUrl={imagePreview} patternZones={patternZones} />
          ) : (
            <Img src={imagePreview} alt="Chart preview" className="rounded-md w-full" />
          )}
          <Div className="mt-2 flex justify-end">
            <Button onClick={() = /> setShowOverlays(!showOverlays)} 
              className="text-sm text-cyan-400 hover:underline"
            >
              {showOverlays ? 'Hide Overlays' : 'Show Overlays'}
            </Div>
          </Div>
        </div />
      
      <Div className="space-y-6">
        <BlockReveal delay={0.1} />
          <H3 className="text-2xl font-bold text-cyan-400">Detected Patterns</Div>
          <Div className="flex flex-wrap mt-2">
            {result.patterns.map(pattern => (
              <patternTag key={pattern} label={pattern} />
            ))}
          </div />

        <BlockReveal delay={0.2} />
          <H3 className="text-2xl font-bold text-cyan-400">AI Summary</Div>
          <P className="text-gray-300 mt-2">{result.summary}</p />
        
        <BlockReveal delay={0.3} />
          <H3 className="text-2xl font-bold text-cyan-400">Confidence</P>
          <Div className="flex items-center gap-4 mt-2">
            <Div className="confidence-meter-bg flex-grow">
              <Div                 className="confidence-meter-bar"
                style={{ width: `${confidence}%` }}
              />
            </Div>
            <Span className="text-xl font-bold text-white">{confidence}%</Span>
          </div />
        
        <BlockReveal delay={0.4} />
          <Div className="flex flex-wrap gap-4 mt-4">
            <Button asChild className="glow-button bg-violet-500/20 border-violet-500 hover:bg-violet-500/30" />
              <Link to="/journal?from=vision" />📓 Save to Journal</BlockReveal>
            </Button>
            <Button asChild className="glow-button bg-blue-500/20 border-blue-500 hover:bg-blue-500/30" />
              <Link to="/academy?topic=patterns" />📘 Learn Pattern</Button>
            </Button>
            <Button asChild className="glow-button bg-green-500/20 border-green-500 hover:bg-green-500/30" />
              <Link to="/strategy?from=vision" /></Button></Button></Button></Button></Button>💡 Find Strategy</Button>
            </Button>
          </div />
      </Div>
    </Div>
  );
};

export default FauxDetection;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 