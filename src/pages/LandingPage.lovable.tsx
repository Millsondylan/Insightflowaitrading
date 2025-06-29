import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  BrainCircuit,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeScrollObserver from '@/components/core/ThemeScrollObserver';
import { ThemeName } from '@/contexts/ThemeContext';

const SectionWrapper = React.forwardRef<HTMLDivElement >(
  ({ children, className, id }, ref) => (
    <Section ref={ref} id={id} className={`w-full px-6 py-24 sm:py-32 ${className}`}>
      {children}
    </HTMLDivElement>
  )
);

const LandingPage = () => {
  const navigate = useNavigate();

  // Refs for each section
  const heroRef = useRef<HTMLDivElement >(null);
  const featuresRef = useRef<HTMLDivElement >(null);
  const portfolioRef = useRef<HTMLDivElement >(null);
  const testimonialsRef = useRef<HTMLDivElement >(null);

  const sections = [
    { ref: heroRef, theme: 'landing' as ThemeName },
    { ref: featuresRef, theme: 'academy' as ThemeName },
    { ref: portfolioRef, theme: 'portfolio' as ThemeName },
    { ref: testimonialsRef, theme: 'NeonWave' as ThemeName },
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: "AI Strategy Builder",
      description: "Design and validate strategies with our AI-powered visual builder.",
    },
    {
      icon: BarChart3,
      title: "Advanced Charting",
      description: "A professional-grade interface with advanced tools and indicators.",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Protect your capital with our integrated risk analysis and alerts.",
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "Collaborate and learn from a community of thousands of traders.",
    }
  ];

  const testimonials = [
    {
      quote: "InsightFlow has revolutionized my trading. The AI insights are a game-changer.",
      author: "Alex W.",
      handle: "@alex_trades"
    },
    {
      quote: "The best trading platform I've ever used. Intuitive, powerful, and beautiful.",
      author: "Samantha G.",
      handle: "@sammie_charts"
    },
     {
      quote: "Finally, a platform that feels like it's from the future. The UI is just incredible.",
      author: "Kenji T.",
      handle: "@kenji_flow"
    }
  ]

  return (
    <Div className="min-h-screen text-gray-100 transition-colors duration-500">
      <Themescrollobserver>
      
      {/* Navigation Header - Stays consistent */}
      <Nav className="w-full p-4 md:p-6 flex justify-between items-center fixed top-0 z-50 bg-black/30 backdrop-blur-lg">
        <Div className="flex items-center space-x-3">
          <Div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <trendingup  style={{ color: "white" }}>
          </HTMLDivElement>
          <H1 className="text-2xl font-bold text-white">InsightFlow AI</H1>
        </Div>
        <Div className="flex space-x-2 md:space-x-4">
          <Button variant="ghost" /> navigate('/auth')} className="text-white hover:bg-white/10">
            Sign In
          </Div>
          <Button > navigate('/auth')} className="quantum-button text-white">
            Start Free Trial
          </Button>
        </Div>
      </Nav>

      {/* Hero Section (Landing Theme) */}
      <sectionwrapper id="hero" style={{ display: "flex", alignItems: "center" }}>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
         >
            <Badge  style={{ fontSize: "0.875rem", border: "1px solid #E5E7EB" }}>
              <Span className="mr-2">🚀</Badge> Over 10,000 traders trust InsightFlow AI
            </Badge>

            <H1 className="text-5xl md:text-7xl font-bold leading-tight hologram-text">
                The Future of Trading is Here.
            </H1>

            <P className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6">
              Make smarter, faster, and more confident trading decisions with real-time insights, advanced analytics, and a powerful, intuitive interface.
            </P>

            <Div className="flex justify-center space-x-4 pt-8">
              <Button size="lg" /> navigate('/auth')} className="quantum-button text-lg px-8 py-4">
                Get Started <arrowright >
              </Div>
            </Div>
        </motion.div>
      </SectionWrapper>

      {/* Features Section (Academy Theme) */}
      <sectionwrapper id="features">
        <Div className="text-center mb-16">
          <H2 className="text-4xl font-bold text-white mb-4">A New Standard for Trading Intelligence</Div>
          <P className="text-xl text-gray-400 max-w-3xl mx-auto">
            InsightFlow AI provides everything you need to navigate the markets with confidence.
          </P>
        </Div>
        <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card  style={{ height: "100%" }}>
                <Cardheader >
                  <Div className="w-16 h-16 mx-auto rounded-lg bg-black/30 flex items-center justify-center mb-4 border border-white/10">
                    <feature.icon className="w-8 h-8 text-cyan-300" />
                  </Div>
                  <Cardtitle  style={{ color: "white", fontSize: "1.25rem" }}>{feature.title}</Cardtitle>
                </CardHeader>
                <Cardcontent >
                  <P className="text-gray-400 text-center">{feature.description}</Cardcontent>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Div>
      </SectionWrapper>
      
      {/* Placeholder for Portfolio Section */}
      <sectionwrapper id="portfolio-demo">
        <Div className="text-center mb-12">
            <H2 className="text-4xl font-bold text-white mb-4"></Div>Your Portfolio, Supercharged</Div>
            <P className="text-xl text-gray-400">Track your performance with stunning visuals.</P>
        </Div>
        <Div className="glass-card p-8">
            <H3 className="text-2xl font-bold mb-4 text-white"></Div>Performance Overview</Div>
            <Div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
              <P className="text-gray-500">-- PnL Curve Chart Placeholder --</Div>
            </Div>
        </Div>
      </SectionWrapper>

      {/* Testimonials Section (NeonWave Theme) */}
      <sectionwrapper id="testimonials">
         <Div className="text-center mb-16">
          <H2 className="text-4xl font-bold text-white mb-4"></Div>Loved by Modern Traders</Div>
          <P className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our users are saying.
          </P>
        </Div>
        <Div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
             <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card  style={{ height: "100%" }}>
                <Cardcontent ></Div>
                  <P className="text-lg text-white mb-4">"{testimonial.quote}"</P>
                  <Div className="flex items-center">
                    <P className="font-bold text-white">{testimonial.author}</Div>
                    <P className="ml-2 text-gray-400">{testimonial.handle}</P>
                  </Div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Div>
      </SectionWrapper>
    </Div>
  );
};

export default LandingPage; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
