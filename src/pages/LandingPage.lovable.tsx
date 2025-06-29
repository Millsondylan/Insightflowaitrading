import React, { useRef } from 'react';
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
    <div style={{ minHeight: "100vh" }}>
      <ThemeScrollObserver sections={sections} />
      
      {/* Navigation Header - Stays consistent */}
      <nav style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{fontSize: '16px'}}>📈</span>
          </div>
          <h1 style={{ fontWeight: "700", color: "white" }}>InsightFlow AI</h1>
        </div>
        <div style={{ display: "flex" }}>
          <Button variant="ghost" onClick={() => navigate('/auth')} style={{ color: "white" }}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth')} style={{ color: "white" }}>
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section (Landing Theme) */}
      <SectionWrapper ref={heroRef} id="hero" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
         >
            <Badge style={{ paddingLeft: "16px", paddingRight: "16px", border: "1px solid #374151" }}>
              <span >🚀</span> Over 10,000 traders trust InsightFlow AI
            </Badge>

            <h1 style={{ fontWeight: "700" }}>
                The Future of Trading is Here.
            </h1>

            <p style={{ marginLeft: "auto", marginRight: "auto" }}>
              Make smarter, faster, and more confident trading decisions with real-time insights, advanced analytics, and a powerful, intuitive interface.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button size="lg" onClick={() => navigate('/auth')} >
                Get Started <ArrowRight  />
              </Button>
            </div>
        </motion.div>
      </SectionWrapper>

      {/* Features Section (Academy Theme) */}
      <SectionWrapper ref={featuresRef} id="features" style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
        <div >
          <h2 style={{ fontWeight: "700", color: "white", marginBottom: "16px" }}>A New Standard for Trading Intelligence</h2>
          <p style={{ color: "#9CA3AF", marginLeft: "auto", marginRight: "auto" }}>
            InsightFlow AI provides everything you need to navigate the markets with confidence.
          </p>
        </div>
        <div >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card >
                <CardHeader >
                  <div style={{ marginLeft: "auto", marginRight: "auto", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", border: "1px solid #374151" }}>
                    <feature.icon  />
                  </div>
                  <CardTitle style={{ color: "white" }}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: "#9CA3AF" }}>{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
      
      {/* Placeholder for Portfolio Section */}
      <SectionWrapper ref={portfolioRef} id="portfolio-demo" style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
        <div >
            <h2 style={{ fontWeight: "700", color: "white", marginBottom: "16px" }}>Your Portfolio, Supercharged</h2>
            <p style={{ color: "#9CA3AF" }}>Track your performance with stunning visuals.</p>
        </div>
        <div style={{ padding: "32px" }}>
            <h3 style={{ fontWeight: "700", marginBottom: "16px", color: "white" }}>Performance Overview</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p >-- PnL Curve Chart Placeholder --</p>
            </div>
        </div>
      </SectionWrapper>

      {/* Testimonials Section (NeonWave Theme) */}
      <SectionWrapper ref={testimonialsRef} id="testimonials" style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
         <div >
          <h2 style={{ fontWeight: "700", color: "white", marginBottom: "16px" }}>Loved by Modern Traders</h2>
          <p style={{ color: "#9CA3AF", marginLeft: "auto", marginRight: "auto" }}>
            Don't just take our word for it. Here's what our users are saying.
          </p>
        </div>
        <div >
          {testimonials.map((testimonial, index) => (
             <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card >
                <CardContent >
                  <p style={{ color: "white", marginBottom: "16px" }}>"{testimonial.quote}"</p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ fontWeight: "700", color: "white" }}>{testimonial.author}</p>
                    <p style={{ color: "#9CA3AF" }}>{testimonial.handle}</p>
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