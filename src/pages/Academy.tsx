
import React, { useState, useEffect, useMemo } from "react";
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/use-scroll-reveal';

const ScrollSection = ({ children, className = "", delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => {
  const { elementRef, isVisible } = useScrollReveal();
  
  return (
    <section 
      ref={elementRef}
      className={`scroll-fade-in scroll-snap-section ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

const AcademyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  const lessons = [
    {
      id: 1,
      topic: "Technical Analysis Fundamentals",
      title: "Understanding Price Action",
      content: "Price action is the foundation of all technical analysis. It represents the movement of a security's price plotted over time. By studying price action, traders can identify patterns and trends that may indicate future price movements.\n\nPrice action analysis focuses on the relationship between price, volume, and time. Unlike indicators that are derived from price data, price action looks directly at the raw market data to make trading decisions.",
      keyTakeaways: [
        "Price action reflects all available market information",
        "Support and resistance levels are key price action concepts",
        "Volume confirmation strengthens price action signals",
        "Clean price action setups often provide the best risk-reward ratios"
      ]
    },
    {
      id: 2,
      topic: "Technical Analysis Fundamentals", 
      title: "Support and Resistance",
      content: "Support and resistance are among the most fundamental concepts in technical analysis. Support represents a price level where buying interest is strong enough to overcome selling pressure, while resistance is where selling pressure overcomes buying interest.\n\nThese levels are not exact prices but rather zones where price tends to react. The more times a level is tested and holds, the more significant it becomes.",
      keyTakeaways: [
        "Support acts as a floor, resistance as a ceiling",
        "Previous resistance often becomes new support when broken",
        "Volume increases the significance of support/resistance levels",
        "Psychological round numbers often act as support/resistance"
      ]
    },
    {
      id: 3,
      topic: "Risk Management",
      title: "Position Sizing Fundamentals", 
      content: "Position sizing is arguably the most important aspect of successful trading. It determines how much capital you risk on each trade and directly impacts your long-term profitability and account survival.\n\nProper position sizing ensures that no single trade can significantly damage your account, while still allowing for meaningful profits when you're right.",
      keyTakeaways: [
        "Never risk more than 1-2% of your account on a single trade",
        "Position size should be based on stop loss distance",
        "Larger positions require tighter stops and vice versa",
        "Consistency in position sizing leads to predictable outcomes"
      ]
    },
    {
      id: 4,
      topic: "Risk Management",
      title: "Stop Loss Strategies",
      content: "Stop losses are your insurance policy against catastrophic losses. They define your maximum acceptable loss on a trade before you exit the position. Effective stop loss placement requires balancing protection with giving the trade room to work.\n\nDifferent market conditions and trading styles require different stop loss approaches.",
      keyTakeaways: [
        "Always define your stop loss before entering a trade",
        "Stop losses should be based on technical levels, not dollar amounts",
        "Trailing stops can help lock in profits on winning trades",
        "Mental stops require discipline but offer flexibility"
      ]
    },
    {
      id: 5,
      topic: "Trading Psychology",
      title: "Emotional Control",
      content: "Trading psychology is often cited as the most challenging aspect of successful trading. Fear and greed are the two primary emotions that can derail even the best trading strategy.\n\nDeveloping emotional control takes time and practice. It requires understanding your psychological biases and implementing systems to counteract them.",
      keyTakeaways: [
        "Fear of missing out (FOMO) leads to poor entry timing",
        "Revenge trading after losses often compounds mistakes", 
        "Keeping a trading journal helps identify emotional patterns",
        "Meditation and stress management improve trading performance"
      ]
    }
  ];

  const topics = useMemo(() => {
    const topicMap: Record<string, number> = {};
    lessons.forEach(lesson => {
      if (!topicMap[lesson.topic]) {
        topicMap[lesson.topic] = 0;
      }
      topicMap[lesson.topic]++;
    });
    return Object.entries(topicMap).map(([name, count]) => ({ name, count }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate progress
      const scrollProgress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
      
      // Update active section
      const sections = lessons.map((_, index) => 
        document.getElementById(`lesson-${index}`)
      );
      
      const currentSection = sections.findIndex((section, index) => {
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.4;
      });
      
      if (currentSection !== -1) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="theme-academy min-h-screen">
      <div className="container mx-auto py-12 px-4">
        
        {/* Header */}
        <ScrollSection className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-glow-blue mb-4">
            Insight Flow Academy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your journey to trading mastery starts here. Learn key concepts, from technical analysis to risk management.
          </p>
        </ScrollSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
          
          {/* Progress Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <div className="glass-section p-6">
                <h3 className="text-lg font-semibold text-glow-emerald mb-4">
                  Progress
                </h3>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Completion</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Topic List */}
                <div className="space-y-4">
                  {topics.map((topic, index) => (
                    <div key={topic.name} className="border-l-2 border-gray-600 pl-4">
                      <h4 className="font-medium text-blue-400 text-sm">
                        {topic.name}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {topic.count} lessons
                      </p>
                    </div>
                  ))}
                </div>

                {/* Active Section Indicator */}
                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-sm text-blue-400">
                      Currently: Lesson {activeSection + 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <main className="lg:col-span-9">
            <div className="space-y-16">
              {lessons.map((lesson, index) => (
                <ScrollSection 
                  key={lesson.id} 
                  delay={index * 100}
                  className="scroll-snap-section"
                >
                  <div 
                    id={`lesson-${index}`}
                    className="glass-section p-8 md:p-12"
                  >
                    {/* Topic Badge */}
                    <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
                      {lesson.topic}
                    </div>
                    
                    {/* Lesson Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-glow-blue mb-8">
                      {lesson.title}
                    </h2>
                    
                    {/* Lesson Content */}
                    <div className="prose prose-invert max-w-none mb-10">
                      <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                        {lesson.content}
                      </p>
                    </div>
                    
                    {/* Key Takeaways */}
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-400 mb-6">
                        Key Takeaways
                      </h4>
                      <ul className="space-y-3">
                        {lesson.keyTakeaways.map((takeaway, takeawayIndex) => (
                          <motion.li
                            key={takeawayIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: takeawayIndex * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-3 flex-shrink-0" />
                            <span className="text-gray-300 text-base leading-relaxed">
                              {takeaway}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollSection>
              ))}

              {/* Completion Badge */}
              <ScrollSection delay={600} className="text-center py-16">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="glass-section p-12 max-w-md mx-auto"
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-glow-emerald mb-2">
                    Mastered: Trading Foundations
                  </h3>
                  <p className="text-gray-400">
                    Congratulations on completing the fundamentals!
                  </p>
                  <div className="mt-6">
                    <button className="glow-button glow-blue">
                      Continue Learning
                    </button>
                  </div>
                </motion.div>
              </ScrollSection>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AcademyPage;
