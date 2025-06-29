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

const SectionWrapper = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string, id: string }>(
  ({ children, className, id }, ref) => (
    <section ref={ref} id={id} className={`w-full px-6 py-24 sm:py-32 ${className}`}>
      {children}
    </section>
  )
);

const LandingPage = () => {
  const navigate = useNavigate();

  // Refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen text-gray-100 transition-colors duration-500">
      <themeScrollObserver sections={sections} />
      
      {/* Navigation Header - Stays consistent */}
      <nav className="w-full p-4 md:p-6 flex justify-between items-center fixed top-0 z-50 bg-black/30 backdrop-blur-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <trendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">InsightFlow AI</h1>
        </div>
        <div className="flex space-x-2 md:space-x-4">
          <Button variant="ghost" onClick={() => navigate('/auth')} className="text-white hover:bg-white/10">
            Sign In
          </Button>
          <button onClick={() => navigate('/auth')} className="quantum-button text-white">
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section (Landing Theme) */}
      <sectionWrapper ref={heroRef} id="hero" className="pt-40 pb-32 text-center flex flex-col items-center">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
         >
            <badge className="mb-6 px-4 py-2 text-sm border bg-black/20 border-white/20">
              <span className="mr-2">🚀</span> Over 10,000 traders trust InsightFlow AI
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight hologram-text">
                The Future of Trading is Here.
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6">
              Make smarter, faster, and more confident trading decisions with real-time insights, advanced analytics, and a powerful, intuitive interface.
            </p>

            <div className="flex justify-center space-x-4 pt-8">
              <Button size="lg" onClick={() => navigate('/auth')} className="quantum-button text-lg px-8 py-4">
                Get Started <arrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
        </motion.div>
      </SectionWrapper>

      {/* Features Section (Academy Theme) */}
      <sectionWrapper ref={featuresRef} id="features" className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">A New Standard for Trading Intelligence</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            InsightFlow AI provides everything you need to navigate the markets with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card h-full gradient-border">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-lg bg-black/30 flex items-center justify-center mb-4 border border-white/10">
                    <feature.icon className="w-8 h-8 text-cyan-300" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
      
      {/* Placeholder for Portfolio Section */}
      <sectionWrapper ref={portfolioRef} id="portfolio-demo" className="container mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Your Portfolio, Supercharged</h2>
            <p className="text-xl text-gray-400">Track your performance with stunning visuals.</p>
        </div>
        <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-4 text-white">Performance Overview</h3>
            <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">-- PnL Curve Chart Placeholder --</p>
            </div>
        </div>
      </SectionWrapper>

      {/* Testimonials Section (NeonWave Theme) */}
      <sectionWrapper ref={testimonialsRef} id="testimonials" className="container mx-auto">
         <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Loved by Modern Traders</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our users are saying.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
             <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card h-full">
                <CardContent className="pt-6">
                  <p className="text-lg text-white mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="ml-2 text-gray-400">{testimonial.handle}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default LandingPage;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 