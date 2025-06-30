import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DocumentHead from '@/components/core/DocumentHead';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <DocumentHead 
        title="About Us" 
        description="Learn about InsightFlow AI's mission to democratize advanced trading intelligence and make institutional-grade tools accessible to individual traders."
        ogImage="/images/about-us-banner.jpg"
      />
      
      <h1 className="text-4xl font-bold mb-8 text-white">About InsightFlow AI</h1>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Our Mission</h2>
          <p className="mb-6 text-gray-300">
            InsightFlow AI was founded with a clear mission: to democratize advanced trading intelligence 
            and make institutional-grade tools accessible to individual traders. We believe that by 
            combining cutting-edge AI with intuitive design, we can level the playing field and help 
            traders of all experience levels make more informed decisions.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Our Platform</h2>
          <p className="mb-6 text-gray-300">
            Our platform integrates multiple AI models including OpenAI, Groq, Gemini, FinGPT, 
            YOLOv8, and Whisper to provide comprehensive trading insights. Our infrastructure 
            is built on modern cloud technology with robust security ensuring your data remains 
            protected and personalized.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10,000+</div>
              <div className="text-gray-400">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">25+</div>
              <div className="text-gray-400">AI Models Integrated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">98%</div>
              <div className="text-gray-400">Customer Satisfaction</div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Our Team</h2>
          <p className="mb-6 text-gray-300">
            Our team brings together experts from trading, artificial intelligence, and user experience 
            design. With backgrounds from top financial institutions and tech companies, we're passionate 
            about creating tools that make a real difference in trading outcomes.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Our Approach</h2>
          <p className="text-gray-300">
            We believe that successful trading combines technical analysis with mindset management. 
            That's why our platform integrates journaling tools, risk management features, and AI coaching 
            alongside sophisticated technical analysis capabilities. This holistic approach helps traders 
            develop complete skills rather than just focusing on indicators or entry points.
          </p>
        </CardContent>
      </Card>
      
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-lg border border-blue-500/20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Join Our Community</h2>
        <p className="text-gray-300 mb-6">
          Be part of a growing community of traders who are transforming their approach to the markets 
          with AI-powered insights and proven strategies.
        </p>
      </div>
    </div>
  );
}

export const lovable = { 
  component: AboutPage 
};