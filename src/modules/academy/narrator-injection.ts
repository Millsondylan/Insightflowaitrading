import { Lesson, LessonSection, LessonProgress, NarratorConfig, MemoryRecord } from './types';

/**
 * NarratorInjection - Provides AI-powered narration for lessons based on user progress and memory
 * 
 * This module enhances the learning experience by:
 * 1. Injecting personalized AI narration into lesson content
 * 2. Adapting explanations based on user's learning history
 * 3. Providing contextual hints and encouragement
 * 4. Creating a conversational learning experience
 */
export class NarratorInjection {
  private userId: string;
  private config: NarratorConfig;
  private userMemory: MemoryRecord[] = [];
  private userProgress: LessonProgress[] = [];
  private currentLesson: Lesson | null = null;
  private currentSection: LessonSection | null = null;
  private narrationHistory: string[] = [];
  
  constructor(userId: string, config?: Partial<NarratorConfig></NarratorConfig>) {
    this.userId = userId;
    
    // Default configuration
    this.config = {
      voice: 'friendly',
      pace: 'medium',
      style: 'conversational',
      personalityTraits: ['helpful', 'encouraging', 'patient'],
      adaptToUser: true,
      useMemory: true,
      maxResponseLength: 150,
      ...config
    };
  }
  
  /**
   * Initializes the narrator with user data
   */
  async initialize(lessonId: string): Promise<void> {
    try {
      // Load user memory records
      this.userMemory = await this.fetchUserMemory(this.userId);
      
      // Load user progress data
      this.userProgress = await this.fetchUserProgress(this.userId);
      
      // Load lesson data
      this.currentLesson = await this.fetchLesson(lessonId);
      
      // Reset narration history
      this.narrationHistory = [];
      
      console.log(`Narrator initialized for user ${this.userId} and lesson ${lessonId}`);
    } catch (error) {
      console.error('Failed to initialize narrator:', error);
      throw new Error('Failed to initialize narrator');
    }
  }
  
  /**
   * Generates narration for a specific lesson section
   */
  async generateNarration(sectionId: string): Promise<string> {
    if (!this.currentLesson) {
      throw new Error('Narrator not initialized with a lesson');
    }
    
    // Find the current section
    this.currentSection = this.currentLesson.sections.find(s => s.id === sectionId) || null;
    
    if (!this.currentSection) {
      throw new Error(`Section ${sectionId} not found in current lesson`);
    }
    
    // Build context for AI narration
    const context = this.buildNarrationContext();
    
    // Generate narration using AI
    const narration = await this.callNarratorAI(context);
    
    // Store in history
    this.narrationHistory.push(narration);
    
    return narration;
  }
  
  /**
   * Provides a hint or explanation based on user's current context
   */
  async generateHint(conceptId: string, difficulty: number = 0.5): Promise<string> {
    // Find memory record for this concept
    const memoryRecord = this.userMemory.find(m => m.conceptId === conceptId);
    
    // Adjust difficulty based on memory strength
    let adjustedDifficulty = difficulty;
    if (memoryRecord && this.config.adaptToUser) {
      adjustedDifficulty = difficulty * (1 - memoryRecord.strength);
    }
    
    // Build context for hint generation
    const context = {
      conceptId,
      difficulty: adjustedDifficulty,
      previousHints: this.narrationHistory.slice(-3),
      currentSection: this.currentSection,
      memoryStrength: memoryRecord?.strength || 0
    };
    
    // Generate hint using AI
    const hint = await this.callHintAI(context);
    
    return hint;
  }
  
  /**
   * Updates memory records after user interaction
   */
  async updateMemory(conceptId: string, performance: 'poor' | 'fair' | 'good' | 'excellent'): Promise<void> {
    // Find existing memory record
    let memoryRecord = this.userMemory.find(m => m.conceptId === conceptId);
    
    // Create new record if not found
    if (!memoryRecord) {
      memoryRecord = {
        userId: this.userId,
        lessonId: this.currentLesson?.id || '',
        conceptId,
        strength: 0,
        lastReviewed: new Date().toISOString(),
        nextReviewDue: new Date().toISOString(), // Will be updated below
        reviewHistory: []
      };
      this.userMemory.push(memoryRecord);
    }
    
    // Update strength based on performance
    const performanceValue = 
      performance === 'excellent' ? 1.0 :
      performance === 'good' ? 0.7 :
      performance === 'fair' ? 0.4 :
      0.1;
    
    // Exponential moving average for memory strength
    memoryRecord.strength = memoryRecord.strength * 0.7 + performanceValue * 0.3;
    
    // Add to review history
    memoryRecord.reviewHistory.push({
      timestamp: new Date().toISOString(),
      performance
    });
    
    // Calculate next review using spaced repetition algorithm
    const daysUntilNextReview = this.calculateSpacedRepetitionInterval(
      memoryRecord.strength,
      memoryRecord.reviewHistory.length
    );
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysUntilNextReview);
    memoryRecord.nextReviewDue = nextReview.toISOString();
    memoryRecord.lastReviewed = new Date().toISOString();
    
    // Save updated memory record
    await this.saveMemoryRecord(memoryRecord);
  }
  
  /**
   * Calculates spaced repetition interval using the SuperMemo-2 algorithm
   */
  private calculateSpacedRepetitionInterval(strength: number, repetitions: number): number {
    // Base interval (in days)
    let interval = 1;
    
    // Adjust based on repetitions (SuperMemo-2 algorithm)
    if (repetitions > 1) {
      // Convert strength (0-1) to SM-2 quality (0-5)
      const quality = Math.round(strength * 5);
      
      // Calculate easiness factor (EF)
      const ef = Math.max(1.3, 2.5 - 0.8 * quality + 0.2 * quality * quality);
      
      // Calculate interval
      if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
    }
    
    // Cap maximum interval at 60 days
    return Math.min(interval, 60);
  }
  
  /**
   * Builds context for AI narration
   */
  private buildNarrationContext(): Record<string, any> {
    // Get user's progress in this lesson
    const lessonProgress = this.userProgress.find(p => 
      p.lessonId === this.currentLesson?.id
    );
    
    // Get relevant memory records for concepts in this section
    const relevantMemories = this.userMemory.filter(m => 
      m.lessonId === this.currentLesson?.id
    );
    
    // Calculate overall memory strength for this lesson
    const averageMemoryStrength = relevantMemories.length > 0
      ? relevantMemories.reduce((sum, m) => sum + m.strength, 0) / relevantMemories.length
      : 0.5;
    
    // Build context object
    return {
      userId: this.userId,
      lessonId: this.currentLesson?.id,
      sectionId: this.currentSection?.id,
      sectionTitle: this.currentSection?.title,
      sectionType: this.currentSection?.type,
      sectionContent: this.currentSection?.content,
      narratorPrompt: this.currentSection?.narratorPrompt || '',
      narratorConfig: this.config,
      progress: lessonProgress?.progress || 0,
      timeSpent: lessonProgress?.timeSpent || 0,
      memoryStrength: averageMemoryStrength,
      previousNarrations: this.narrationHistory.slice(-3),
      isFirstSection: this.currentLesson?.sections[0].id === this.currentSection?.id,
      isLastSection: this.currentLesson?.sections[this.currentLesson.sections.length - 1].id === this.currentSection?.id,
    };
  }
  
  /**
   * Calls AI service to generate narration
   */
  private async callNarratorAI(context: Record<string, any>): Promise<string> {
    try {
      // TODO: Replace with actual AI service call
      // For now, return mock narration
      return this.generateMockNarration(context);
    } catch (error) {
      console.error('Failed to generate narration:', error);
      return 'I\'m here to help you learn. Let\'s continue with the lesson.';
    }
  }
  
  /**
   * Calls AI service to generate hints
   */
  private async callHintAI(context: Record<string, any>): Promise<string> {
    try {
      // TODO: Replace with actual AI service call
      // For now, return mock hint
      return this.generateMockHint(context);
    } catch (error) {
      console.error('Failed to generate hint:', error);
      return 'Try reviewing the previous section and think about how the concepts connect.';
    }
  }
  
  /**
   * Mock function to generate narration (to be replaced with AI service)
   */
  private generateMockNarration(context: Record<string, any>): string {
    const { sectionTitle, narratorConfig, progress, memoryStrength, isFirstSection, isLastSection } = context;
    
    if (isFirstSection) {
      return `Welcome to this lesson! I'm your ${narratorConfig.voice} guide, and we'll explore ${sectionTitle} together. Let's dive in!`;
    }
    
    if (isLastSection) {
      return `We've reached the final section on ${sectionTitle}. You've made excellent progress! Let's wrap up with these key concepts.`;
    }
    
    if (progress < 0.3) {
      return `Let's continue with ${sectionTitle}. Take your time to understand these concepts - they're important foundations for what's coming next.`;
    }
    
    if (memoryStrength < 0.4) {
      return `Now we're looking at ${sectionTitle}. I notice some of these concepts might be challenging - let me know if you need more examples.`;
    }
    
    return `Great progress! Now let's explore ${sectionTitle}. Based on your understanding so far, you should find these concepts interesting.`;
  }
  
  /**
   * Mock function to generate hints (to be replaced with AI service)
   */
  private generateMockHint(context: Record<string, any>): string {
    const { difficulty, memoryStrength } = context;
    
    if (difficulty > 0.7) {
      return "This is a challenging concept. Try breaking it down into smaller parts and understand each one separately.";
    }
    
    if (memoryStrength < 0.3) {
      return "Let's revisit this concept. Remember that it builds on what we learned earlier about data structures.";
    }
    
    return "You're on the right track! Consider how this concept relates to real-world trading scenarios.";
  }
  
  /**
   * Fetches user memory records from database
   */
  private async fetchUserMemory(userId: string): Promise<MemoryRecord[]></MemoryRecord> {
    // TODO: Replace with actual database call
    return [];
  }
  
  /**
   * Fetches user progress data from database
   */
  private async fetchUserProgress(userId: string): Promise<LessonProgress[]></LessonProgress> {
    // TODO: Replace with actual database call
    return [];
  }
  
  /**
   * Fetches lesson data from database
   */
  private async fetchLesson(lessonId: string): Promise<Lesson></Lesson> {
    // TODO: Replace with actual database call
    return {
      id: lessonId,
      title: 'Mock Lesson',
      description: 'This is a mock lesson for development',
      duration: 30,
      difficulty: 'intermediate',
      topics: ['trading', 'analysis'],
      prerequisites: [],
      sections: [
        {
          id: 'section1',
          title: 'Introduction',
          content: 'Welcome to the lesson',
          type: 'text',
          duration: 5
        },
        {
          id: 'section2',
          title: 'Main Concepts',
          content: 'Here are the main concepts',
          type: 'text',
          duration: 15
        },
        {
          id: 'section3',
          title: 'Conclusion',
          content: 'Let\'s wrap up',
          type: 'text',
          duration: 10
        }
      ],
      quizzes: [],
      resources: []
    };
  }
  
  /**
   * Saves memory record to database
   */
  private async saveMemoryRecord(record: MemoryRecord): Promise<void> {
    // TODO: Replace with actual database call
    console.log('Saving memory record:', record);
  }
}

// Add Lovable.dev compatibility
export const lovable = {
  tables: ['lessons', 'lessonProgress', 'memoryRecords'],
  aiBlocks: ['lessonNarrator', 'conceptExplainer', 'adaptiveLearning'],
  functions: ['generateNarration', 'updateMemoryStrength', 'calculateNextReview']
}; 