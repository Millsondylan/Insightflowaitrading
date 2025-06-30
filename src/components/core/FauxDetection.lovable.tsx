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
  const [patternZones, setPatternZones] = useState<patternzone>([]);
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
      <blockreveal />
        <div className="glass-container p-4 rounded-lg">
          {showOverlays ? (
            <Chartcanvasoverlay >
          ) : (
            <img src={imagePreview} alt="Chart preview" className="rounded-md w-full"/>
          )}
          <div className="mt-2 flex justify-end">
            <Button  onClick={() => setShowOverlays(!showOverlays)} 
              className="text-sm text-cyan-400 hover:underline"
            >
              {showOverlays ? 'Hide Overlays' : 'Show Overlays'}
            </div>
          </div>
        </div />
      
      <div className="space-y-6">
        <Blockreveal />
          <h3 className="text-2xl font-bold text-cyan-400">Detected Patterns</div>
          <div className="flex flex-wrap mt-2">
            {result.patterns.map(pattern => (
              <patterntag >
            ))}
          </div />

        <blockreveal >
          <h3 className="text-2xl font-bold text-cyan-400">AI Summary</div>
          <p className="text-gray-300 mt-2">{result.summary}</p />
        
        <blockreveal >
          <h3 className="text-2xl font-bold text-cyan-400">Confidence</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="confidence-meter-bg flex-grow">
              <div                 className="confidence-meter-bar"
                style={{ width: `${confidence}%` }}
 />
            </div>
            <span className="text-xl font-bold text-white">{confidence}%</span>
          </div />
        
        <blockreveal >
          <div className="flex flex-wrap gap-4 mt-4">
            <Button >
              <Link to="/journal?from=vision"></div>📓 Save to Journal</div>
            </button>
            <Button >
              <Link to="/academy?topic=patterns"></button>📘 Learn Pattern</button>
            </button>
            <Button >
              <Link to="/strategy?from=vision"></button>💡 Find Strategy</button>
            </button>
          </div />
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
