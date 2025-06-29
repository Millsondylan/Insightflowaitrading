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
  const [patternZones, setPatternZones] = useState<Patternzone>([]);
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
      <blockreveal  />
        <Div className="glass-container p-4 rounded-lg">
          {showOverlays ? (
            <Chartcanvasoverlay >
          ) : (
            <Img src={imagePreview} alt="Chart preview" className="rounded-md w-full" />
          )}
          <Div className="mt-2 flex justify-end">
            <Button  onClick={() => setShowOverlays(!showOverlays)} 
              className="text-sm text-cyan-400 hover:underline"
            >
              {showOverlays ? 'Hide Overlays' : 'Show Overlays'}
            </Patternzone>
          </Div>
        </Div>
      </BlockReveal>
      
      <Div className="space-y-6">
        <Blockreveal  />
          <H3 className="text-2xl font-bold text-cyan-400">Detected Patterns</Div>
          <Div className="flex flex-wrap mt-2">
            {result.patterns.map(pattern => (
              <patterntag >
            ))}
          </Div>
        </BlockReveal>

        <blockreveal >
          <H3 className="text-2xl font-bold text-cyan-400">AI Summary</H3>
          <P className="text-gray-300 mt-2">{result.summary}</P>
        </BlockReveal>
        
        <blockreveal >
          <H3 className="text-2xl font-bold text-cyan-400">Confidence</H3>
          <Div className="flex items-center gap-4 mt-2">
            <Div className="confidence-meter-bg flex-grow">
              <Div
                className="confidence-meter-bar"
                style={{ width: `${confidence}%` }}
              />
            </Div>
            <Span className="text-xl font-bold text-white">{confidence}%</Span>
          </Div>
        </BlockReveal>
        
        <blockreveal >
          <Div className="flex flex-wrap gap-4 mt-4">
            <Button >
              <Link to="/journal?from=vision"></Div></Div>📓 Save to Journal</Div>
            </Button>
            <Button >
              <Link to="/academy?topic=patterns"></Button></Button>📘 Learn Pattern</Button>
            </Button>
            <Button >
              <Link to="/strategy?from=vision"></Button></Button>💡 Find Strategy</Button>
            </Button>
          </Div>
        </BlockReveal>
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
