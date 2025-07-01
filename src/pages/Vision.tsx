import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ChartUploader from '@/components/core/ChartUploader';
import FauxDetection from '@/components/core/FauxDetection';
import { getSampleDetections, DetectionResult } from '@/lib/vision/sampleDetections';
import { 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  LineChart, 
  TrendingUp, 
  Zap,
  Eye,
  Bot
} from 'lucide-react';

const VisionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = (file: File, previewUrl: string) => {
    setImagePreview(previewUrl);
    setIsLoading(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const sampleResult = getSampleDetections();
      setDetectionResult(sampleResult);
      setIsLoading(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setDetectionResult(null);
    setImagePreview(null);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-glow-cyan">Chart Vision AI</h1>
        <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
          Upload trading charts and get instant AI-powered pattern recognition, 
          trend analysis, and actionable trading insights.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Eye className="w-16 h-16 text-blue-400 mx-auto mb-4"/>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Chart Analysis
              </h2>
              <p className="text-gray-400">
                Upload your trading chart for AI-powered analysis
              </p>
            </div>

            <ChartUploader onFileUpload={handleFileUpload} isLoading={isLoading}/>

            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6"
              >
                <img
                  src={imagePreview}
                  alt="Uploaded chart"
                  className="w-full rounded-lg border border-white/10"
               />
              </motion.div>
            )}

            {(imagePreview || detectionResult) && (
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                className="w-full mt-4"
              >
                Upload New Chart
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {!imagePreview && !isLoading && !detectionResult && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-500">
                    Upload a chart to get started with AI analysis
                  </p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Analyzing Chart...
                  </h3>
                  <p className="text-gray-400">
                    AI is processing your chart for patterns and insights
                  </p>
                </motion.div>
              )}

              {detectionResult && imagePreview && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FauxDetection result={detectionResult} imagePreview={imagePreview}/>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold text-white mb-2">
              Pattern Recognition
            </h3>
            <p className="text-gray-400">
              Identify support/resistance, trend lines, and chart patterns automatically
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold text-white mb-2">
              Instant Analysis
            </h3>
            <p className="text-gray-400">
              Get immediate insights and trading suggestions based on chart analysis
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
          <CardContent className="p-6 text-center">
            <LineChart className="w-12 h-12 text-green-400 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold text-white mb-2">
              Multi-Timeframe
            </h3>
            <p className="text-gray-400">
              Works with charts from any timeframe - scalping to swing trading
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisionPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 