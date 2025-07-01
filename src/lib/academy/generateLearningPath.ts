import { supabase } from '../../integrations/supabase/client';
import { createLearningPathItem } from '../db/ai-coaching';

interface TradeWeakness {
  area: string;
  confidence: number; // 0-1 scale, higher means more confident this is a weakness
  examples: string[];
}

interface LearningPathItem {
  lessonId: string;
  reason: string;
}

/**
 * Analyzes a user's trades and journal entries to identify weak areas
 */
export async function analyzeUserWeaknesses(userId: string): Promise<TradeWeakness[]> {
  const weaknesses: TradeWeakness[] = [];
  
  try {
    // Get user's recent trades
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    
    // Get user's journal entries
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    // Get user's quiz results
    const { data: quizResults } = await supabase
      .from('academy_quiz_results')
      .select('*, academy_quiz(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    // Analyze trades for patterns
    if (trades && trades.length > 0) {
      // Check win rate
      const winningTrades = trades.filter(trade => trade.outcome === 'win');
      const winRate = trades.length > 0 ? winningTrades.length / trades.length : 0;
      
      if (winRate < 0.4) {
        weaknesses.push({
          area: 'trade-entries',
          confidence: 0.8,
          examples: [
            `Low win rate of ${(winRate * 100).toFixed(1)}% across ${trades.length} trades`,
            'Multiple consecutive losses suggest entry criteria issues'
          ]
        });
      }
      
      // Check risk management
      const hasRiskIssues = trades.some(trade => 
        (trade.r_multiple && trade.r_multiple < -2) || 
        (trade.max_drawdown && trade.max_drawdown > 0.1)
      );
      
      if (hasRiskIssues) {
        const badRiskTrades = trades.filter(trade => 
          (trade.r_multiple && trade.r_multiple < -2) || 
          (trade.max_drawdown && trade.max_drawdown > 0.1)
        );
        
        weaknesses.push({
          area: 'risk-management',
          confidence: 0.9,
          examples: [
            `${badRiskTrades.length} trades with excessive risk or drawdown`,
            `Average loss multiple: ${Math.abs(badRiskTrades.reduce((sum, t) => sum + (t.r_multiple || 0), 0) / badRiskTrades.length).toFixed(1)}R`
          ]
        });
      }
      
      // Check trade management
      const hasTradeMgmtIssues = trades.some(trade => 
        (trade.exit_reason === 'emotional') || 
        (trade.entry_condition_matched && trade.outcome === 'loss')
      );
      
      if (hasTradeMgmtIssues) {
        weaknesses.push({
          area: 'trade-management',
          confidence: 0.7,
          examples: [
            'Multiple emotional exits recorded',
            'Losing trades despite valid entry conditions suggests exit timing issues'
          ]
        });
      }
    }
    
    // Analyze journal entries for psychological patterns
    if (journalEntries && journalEntries.length > 0) {
      // Check for mentions of emotions or psychological issues
      const emotionalEntries = journalEntries.filter(entry => 
        entry.content.toLowerCase().includes('fear') ||
        entry.content.toLowerCase().includes('greed') ||
        entry.content.toLowerCase().includes('emotional') ||
        entry.content.toLowerCase().includes('revenge') ||
        entry.content.toLowerCase().includes('fomo')
      );
      
      if (emotionalEntries.length > 3) {
        weaknesses.push({
          area: 'trading-psychology',
          confidence: 0.85,
          examples: [
            `${emotionalEntries.length} journal entries mentioning emotional trading`,
            'Recurring themes of fear, FOMO, or revenge trading'
          ]
        });
      }
    }
    
    // Analyze quiz results for knowledge gaps
    if (quizResults && quizResults.length > 0) {
      // Group quiz results by topic
      const topicResults: Record<string, {total: number, correct: number}> = {};
      
      quizResults.forEach(result => {
        const topic = result.academy_quiz?.topic || 'unknown';
        
        if (!topicResults[topic]) {
          topicResults[topic] = { total: 0, correct: 0 };
        }
        
        topicResults[topic].total += result.total_questions || 0;
        topicResults[topic].correct += result.correct_answers || 0;
      });
      
      // Find topics with low scores
      Object.entries(topicResults).forEach(([topic, scores]) => {
        const scorePercent = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
        
        if (scorePercent < 70) {
          weaknesses.push({
            area: `knowledge-${topic}`,
            confidence: 0.75,
            examples: [
              `${scorePercent.toFixed(1)}% score on ${topic} quizzes`,
              `${scores.correct} correct out of ${scores.total} questions`
            ]
          });
        }
      });
    }
    
    return weaknesses;
  } catch (error) {
    console.error('Error analyzing user weaknesses:', error);
    return [];
  }
}

/**
 * Maps trading weaknesses to appropriate lessons
 */
async function mapWeaknessesToLessons(weaknesses: TradeWeakness[]): Promise<LearningPathItem[]> {
  try {
    // Get all lessons
    const { data: allLessons } = await supabase
      .from('academy_lessons')
      .select('*');
    
    if (!allLessons) return [];
    
    // Match lessons to weaknesses
    const lessons: LearningPathItem[] = [];
    
    // Sort weaknesses by confidence (highest first)
    const sortedWeaknesses = [...weaknesses].sort((a, b) => b.confidence - a.confidence);
    
    for (const weakness of sortedWeaknesses) {
      // Find lessons that match this weakness area
      const matchingLessons = allLessons.filter(lesson => {
        const tags = lesson.tags || [];
        const title = lesson.title?.toLowerCase() || '';
        const description = lesson.description?.toLowerCase() || '';
        
        // Extract base area (remove "knowledge-" prefix if present)
        const area = weakness.area.replace('knowledge-', '').toLowerCase();
        
        return tags.includes(area) || 
               title.includes(area) || 
               description.includes(area);
      });
      
      if (matchingLessons.length > 0) {
        // Take the most relevant lesson (could be refined further)
        const lesson = matchingLessons[0];
        
        lessons.push({
          lessonId: lesson.id,
          reason: `Suggested to improve your ${weakness.area.replace('-', ' ')}: ${weakness.examples[0]}`
        });
        
        // Limit to 3 lessons total
        if (lessons.length >= 3) break;
      }
    }
    
    return lessons;
  } catch (error) {
    console.error('Error mapping weaknesses to lessons:', error);
    return [];
  }
}

/**
 * Generates personalized quiz questions for a specific weak area
 */
export async function generatePersonalizedQuiz(userId: string, weaknessArea: string): Promise<any> {
  try {
    // Call OpenAI to generate quiz questions
    const response = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        topic: weaknessArea,
        questionCount: 5
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating personalized quiz:', error);
    return null;
  }
}

/**
 * Creates a personalized learning path for a user based on their weaknesses
 */
export async function generateLearningPath(userId: string): Promise<boolean> {
  try {
    // First analyze the user's weaknesses
    const weaknesses = await analyzeUserWeaknesses(userId);
    
    if (weaknesses.length === 0) {
      console.log('No weaknesses identified for user:', userId);
      return false;
    }
    
    // Map weaknesses to appropriate lessons
    const recommendedLessons = await mapWeaknessesToLessons(weaknesses);
    
    if (recommendedLessons.length === 0) {
      console.log('No suitable lessons found for user weaknesses:', userId);
      return false;
    }
    
    // Check for existing learning path items to avoid duplicates
    const { data: existingItems } = await supabase
      .from('user_learning_path')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('status', 'pending');
    
    const existingLessonIds = new Set(existingItems?.map(item => item.lesson_id) || []);
    
    // Create learning path items for new lessons
    for (const lesson of recommendedLessons) {
      if (!existingLessonIds.has(lesson.lessonId)) {
        await createLearningPathItem(userId, lesson.lessonId, lesson.reason);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error generating learning path:', error);
    return false;
  }
} 