
import React, { useState, useEffect } from "react";
import { ScrollSection } from '../hooks/use-scroll-reveal';

const AcademyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  const lessons = [
    {
      id: 1,
      topic: "Technical Analysis",
      title: "Understanding Price Action",
      content: "Price action forms the foundation of technical analysis, representing the raw movement of security prices over time. By studying these patterns, traders can identify potential future movements and make informed decisions.",
      keyTakeaways: [
        "Price action reflects all available market information",
        "Support and resistance levels are fundamental concepts",
        "Volume confirmation strengthens price signals",
        "Clean setups provide optimal risk-reward ratios"
      ],
      completed: true
    },
    {
      id: 2,
      topic: "Technical Analysis", 
      title: "Support and Resistance Mastery",
      content: "Support and resistance represent psychological levels where buying and selling pressures converge. These zones become more significant with each test, creating reliable reference points for entry and exit decisions.",
      keyTakeaways: [
        "Support acts as a price floor, resistance as a ceiling",
        "Broken resistance often becomes new support",
        "Volume increases level significance",
        "Round numbers often act as psychological barriers"
      ],
      completed: true
    },
    {
      id: 3,
      topic: "Risk Management",
      title: "Position Sizing Excellence", 
      content: "Position sizing determines your survival and success in trading. Proper sizing ensures no single trade can devastate your account while allowing meaningful profits when you're correct.",
      keyTakeaways: [
        "Never risk more than 1-2% per trade",
        "Size based on stop loss distance",
        "Larger positions require tighter stops",
        "Consistency leads to predictable outcomes"
      ],
      completed: false
    },
    {
      id: 4,
      topic: "Risk Management",
      title: "Stop Loss Strategies",
      content: "Stop losses serve as your insurance against catastrophic losses. Effective placement requires balancing protection with giving trades adequate room to develop naturally.",
      keyTakeaways: [
        "Define stops before entering positions",
        "Base stops on technical levels, not dollars",
        "Trailing stops can lock in profits",
        "Mental stops require strict discipline"
      ],
      completed: false
    },
    {
      id: 5,
      topic: "Trading Psychology",
      title: "Emotional Mastery",
      content: "Psychology often determines trading success more than technical skill. Fear and greed create predictable patterns that can derail even the best strategies without proper awareness and control.",
      keyTakeaways: [
        "FOMO leads to poor timing",
        "Revenge trading compounds losses", 
        "Journaling reveals emotional patterns",
        "Stress management improves performance"
      ],
      completed: false
    }
  ];

  const topics = [
    { name: "Technical Analysis", count: 2, color: "text-blue-400" },
    { name: "Risk Management", count: 2, color: "text-emerald-400" },
    { name: "Trading Psychology", count: 1, color: "text-violet-400" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollProgress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
      
      const sections = lessons.map((_, index) => 
        document.getElementById(`lesson-${index}`)
      );
      
      const currentSection = sections.findIndex((section) => {
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
    <div className="theme-academy scroll-container">
      {/* Progress Sidebar */}
      <div className="progress-sidebar hidden lg:block">
        <div className="glass-card p-4">
          <div className="space-y-4">
            {lessons.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${activeSection === index ? 'active' : 'inactive'}`}
                title={`Lesson ${index + 1}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <ScrollSection className="px-6 py-20" delay={0}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-glow-blue mb-6">
            Learn, Test, Evolve
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-4xl mx-auto">
            Master the art and science of trading through structured lessons, practical exercises, and continuous evolution
          </p>
          <div className="mt-8">
            <div className="threadline-glow w-40 mx-auto"></div>
          </div>
        </div>
      </ScrollSection>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
          
          {/* Progress Overview */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <ScrollSection delay={200} animation="slide-right">
                <div className="glass-section">
                  <h3 className="text-lg font-semibold text-glow-emerald mb-6">
                    Progress Overview
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span>Completion</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-6">
                    {topics.map((topic, index) => (
                      <div key={topic.name} className="border-l-2 border-gray-600 pl-4">
                        <h4 className={`font-medium text-sm ${topic.color}`}>
                          {topic.name}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">
                          {topic.count} lessons
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Active Lesson Indicator */}
                  <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-400">
                        Lesson {activeSection + 1} Active
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollSection>
            </div>
          </div>

          {/* Lesson Content */}
          <main className="lg:col-span-9">
            <div className="space-y-20">
              {lessons.map((lesson, index) => (
                <ScrollSection 
                  key={lesson.id} 
                  delay={index * 100}
                  className="scroll-section"
                >
                  <div 
                    id={`lesson-${index}`}
                    className="glass-section motion-shadow"
                  >
                    {/* Lesson Status & Topic */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
                        {lesson.topic}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.completed 
                          ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300' 
                          : 'bg-gray-500/20 border border-gray-400/30 text-gray-400'
                      }`}>
                        {lesson.completed ? '✓ Complete' : 'In Progress'}
                      </div>
                    </div>
                    
                    {/* Lesson Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-glow-blue mb-8">
                      {lesson.title}
                    </h2>
                    
                    {/* Lesson Content */}
                    <div className="mb-10">
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {lesson.content}
                      </p>
                    </div>
                    
                    {/* Key Takeaways */}
                    <div>
                      <h4 className="text-xl font-semibold text-emerald-400 mb-6">
                        Key Takeaways
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {lesson.keyTakeaways.map((takeaway, takeawayIndex) => (
                          <div
                            key={takeawayIndex}
                            className="flex items-start space-x-3 p-4 glass-card hover:bg-black/30 transition-all duration-300"
                          >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-3 flex-shrink-0" />
                            <span className="text-gray-300 leading-relaxed">
                              {takeaway}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quiz Block Placeholder */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h4 className="text-lg font-semibold text-blue-400 mb-4">Quick Knowledge Check</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 glass-card hover:bg-black/30 cursor-pointer transition-all duration-300">
                          <input type="radio" name={`quiz-${lesson.id}`} className="text-blue-400" />
                          <span className="text-gray-300">Sample quiz option A</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 glass-card hover:bg-black/30 cursor-pointer transition-all duration-300">
                          <input type="radio" name={`quiz-${lesson.id}`} className="text-blue-400" />
                          <span className="text-gray-300">Sample quiz option B</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 glass-card hover:bg-black/30 cursor-pointer transition-all duration-300">
                          <input type="radio" name={`quiz-${lesson.id}`} className="text-blue-400" />
                          <span className="text-gray-300">Sample quiz option C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollSection>
              ))}

              {/* Completion Badge */}
              <ScrollSection delay={600} className="text-center py-20">
                <div className="glass-section max-w-md mx-auto motion-shadow">
                  <div className="text-6xl mb-6">🏆</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-glow-emerald mb-4">
                    Mastered: Trading Foundations
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Outstanding progress! You've completed the fundamentals.
                  </p>
                  <div className="space-y-4">
                    <button className="glow-button glow-blue w-full">
                      Continue to Advanced Topics
                    </button>
                    <button className="glow-button glow-emerald w-full">
                      Review & Practice
                    </button>
                  </div>
                </div>
              </ScrollSection>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AcademyPage;
