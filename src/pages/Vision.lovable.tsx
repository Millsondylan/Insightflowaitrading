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
    <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "32px" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "32px" }}
      >
        <h1 style={{ fontWeight: "700" }}>Chart Vision AI</h1>
        <p style={{ color: "#9CA3AF" }}>
          Upload a chart image to get AI-powered technical analysis.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!detectionResult && !imagePreview ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <span style={{fontSize: '16px'}}>📊</span>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isLoading && !detectionResult && imagePreview && (
              <div style={{ padding: "32px" }}>
                <div style={{ width: "100%", marginBottom: "16px" }}>
                  <img src={imagePreview} style={{ width: "100%" }} />
                  <div  />
                </div>
                <h2 style={{ color: "white" }}>Analyzing...</h2>
              </div>
            )}
            
            {detectionResult && imagePreview && (
              <>
                <FauxDetection result={detectionResult} imagePreview={imagePreview} />
                <div >
                  <button onClick={handleReset} >
                    Analyze another chart
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisionPage; 