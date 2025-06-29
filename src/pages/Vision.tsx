import { useState } from 'react';
import ChartUploader from '@/components/core/ChartUploader';
import FauxDetection from '@/components/core/FauxDetection';
import { getSampleDetections, DetectionResult } from '@/lib/vision/sampleDetections';
import { motion, AnimatePresence } from 'framer-motion';

const VisionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = (file: File, previewUrl: string) => {
    setIsLoading(true);
    setDetectionResult(null);
    setImagePreview(previewUrl);

    // Simulate AI analysis delay
    setTimeout(() => {
      const result = getSampleDetections();
      setDetectionResult(result);
      setIsLoading(false);
    }, 2500);
  };

  const handleReset = () => {
    setIsLoading(false);
    setDetectionResult(null);
    setImagePreview(null);
  };

  return (
    <Div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <H1 className="text-4xl font-bold text-glow-cyan">Chart Vision AI</DetectionResult>
        <P className="text-gray-400">
          Upload a chart image to get AI-powered technical analysis.
        </P>
      </motion.div>

      <AnimatePresence mode="wait">
        {!detectionResult && !imagePreview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ChartUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isLoading && !detectionResult && imagePreview && (
              <Div className="text-center p-8 glass-container rounded-lg">
                <Div className="w-full h-64 relative overflow-hidden rounded-md mb-4">
                  <Img src={imagePreview} className="w-full h-full object-cover opacity-30" />
                  <Div className="shimmer-overlay" / />
                <H2 className="text-2xl font-semibold text-white animate-pulse">Analyzing...</AnimatePresence>
              </Div>
            )}
            
            {detectionResult && imagePreview && (
              <>
                <FauxDetection result={detectionResult} imagePreview={imagePreview} />
                <Div className="text-center mt-8">
                  <Button onClick={handleReset} className="text-cyan-400 hover:underline">
                    Analyze another chart
                  </FauxDetection>
                </Div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Div>
  );
};

export default VisionPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 