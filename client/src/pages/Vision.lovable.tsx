import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import ChartUploader from '@/components/core/ChartUploader';
import FauxDetection from '@/components/core/FauxDetection';

const DetectionResult = () => {
  return (
    <motion.div
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FauxDetection />
    </motion.div>
  );
};

export default function Vision() {
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-glow-cyan">Chart Vision AI</FauxDetection>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upload your chart images and let our AI analyze market structures, identify patterns, 
          and suggest potential trading opportunities.
        </p>
      </div>

      <AnimatePresence>
        {!hasUploaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto"
          >
            <ChartUploader>
              <Card className="border-dashed border-2 border-gray-600 bg-black/20 cursor-pointer hover:bg-black/30 transition-all">
                <CardContent className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-400"/>
                  </AnimatePresence>
                  <div>
                    <h3 className="text-xl font-medium text-white">Upload Chart Image</div>
                    <p className="text-gray-400 mt-2">Drag and drop your chart image, or click to browse</p>
                  </div>
                </CardContent>
              </Card>
            </ChartUploader>
          </motion.div>
        )}

        {isUploading && (
          <motion.div className="max-w-md mx-auto">
            <Card className="border-blue-500/40 bg-blue-900/10">
              <CardContent className="p-12 flex flex-col items-center justify-center space-y-6 text-center relative">
                <div className="shimmer-overlay"/>
                <h2 className="text-2xl font-semibold text-white animate-pulse">Analyzing...</Card>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {hasUploaded && (
          <motion.div className="space-y-8">
            <Button onClick={() => setHasUploaded(false)} variant="outline" className="mb-6">
              <Upload className="w-4 h-4 mr-2"/>
              Upload New Chart
            </button>
            
            <DetectionResult /></DetectionResult>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
