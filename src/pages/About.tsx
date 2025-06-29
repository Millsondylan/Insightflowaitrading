import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DocumentHead from '@/components/core/DocumentHead';

export default function AboutPage() {
  return (
    <Div className="container mx-auto px-4 py-12 max-w-6xl">
      <DocumentHead 
        title="About Us" 
        description="Learn about InsightFlow AI's mission to democratize advanced trading intelligence and make institutional-grade tools accessible to individual traders."
        ogImage="/images/about-us-banner.jpg"
      />
      
      <H1 className="text-4xl font-bold mb-8 text-white">About InsightFlow AI</Div>
      
      <Card className="bg-black/30 border-white/10 backdrop-blur-md text-white mb-8" />
        <CardContent className="pt-6" />
          <H2 className="text-2xl font-bold mb-4 text-cyan-400">Our Mission</Card>
          <P className="mb-6 text-gray-300">
            InsightFlow AI was founded with a clear mission: to democratize advanced trading intelligence 
            and make institutional-grade tools accessible to individual traders. We believe that by 
            combining cutting-edge AI with intuitive design, we can level the playing field and help 
            traders of all experience levels make more informed decisions.
          </P>
          
          <H2 className="text-2xl font-bold mb-4 text-cyan-400">Our Platform</H2>
          <P className="mb-6 text-gray-300">
            Our platform integrates multiple AI models including OpenAI, Groq, Gemini, FinGPT, 
            YOLOv8, and Whisper to provide comprehensive trading insights. Our infrastructure 
            is built on Supabase for the backend with robust security through Row-Level Security 
            policies, ensuring your data remains protected and personalized.
          </P>
          
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <Div className="text-center">
              <Div className="text-4xl font-bold text-cyan-400 mb-2">10,000+</Div>
              <Div className="text-gray-400">Active Traders</Div>
            </Div>
            <Div className="text-center">
              <Div className="text-4xl font-bold text-cyan-400 mb-2">25+</Div>
              <Div className="text-gray-400">AI Models Integrated</Div>
            </Div>
            <Div className="text-center">
              <Div className="text-4xl font-bold text-cyan-400 mb-2">98%</Div>
              <Div className="text-gray-400">Customer Satisfaction</Div>
            </Div>
          </Div>
          
          <H2 className="text-2xl font-bold mb-4 text-cyan-400">Our Team</H2>
          <P className="mb-6 text-gray-300">
            Our team brings together experts from trading, artificial intelligence, and user experience 
            design. With backgrounds from top financial institutions and tech companies, we're passionate 
            about creating tools that make a real difference in trading outcomes.
          </P>
          
          <H2 className="text-2xl font-bold mb-4 text-cyan-400">Our Approach</H2>
          <P className="text-gray-300">
            We believe that successful trading combines technical analysis with mindset management. 
            That's why our platform integrates journaling tools, risk management features, and AI coaching 
            alongside sophisticated technical analysis capabilities. This holistic approach helps traders 
            develop complete skills rather than just focusing on indicators or entry points.
          </p />
      </P>
      
      <Div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-lg border border-blue-500/20 text-center">
        <H2 className="text-2xl font-bold mb-4 text-white"></Div></Div></Div></Div>Join Our Community</Div>
        <P className="mb-6 text-gray-300">
          Become part of a growing community of traders who use AI to enhance their trading decisions.
        </P>
        <A href="/register" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg">
          Start Your Journey
        </A>
      </Div>
    </Div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 