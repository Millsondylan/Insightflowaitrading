// LMS Coach Bot
// This function runs periodically to analyze user LMS progress and recommend next lessons

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler = async (event, context) => {
  try {
    // Check if this is a scheduled event or manual trigger
    const isScheduled = event.body === null || event.httpMethod === undefined;
    
    // If API request (not scheduled), validate token
    if (!isScheduled) {
      const authHeader = event.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Missing or invalid token' })
        };
      }
      
      // Verify the JWT token with Supabase
      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized: Invalid token' })
        };
      }
    }

    // Get users who have LMS progress
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email');
      
    if (usersError) throw usersError;
    
    // Process each user (limit processing to avoid timeouts)
    const processPromises = users.slice(0, 10).map(async (user) => {
      try {
        await processUserLMSProgress(user.id, user.email);
      } catch (err) {
        console.error(`Error processing user ${user.id}:`, err);
      }
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'LMS coaching completed successfully',
        processed: processPromises.length
      })
    };
    
  } catch (error) {
    console.error('Error in LMS coach function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate LMS recommendations' })
    };
  }
};

async function processUserLMSProgress(userId, userEmail) {
  try {
    // Get all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, description, difficulty, topics');
      
    if (coursesError) throw coursesError;
    
    // Get user's completed lessons
    const { data: completedLessons, error: lessonsError } = await supabase
      .from('user_lesson_progress')
      .select('*, lesson:lesson_id(id, title, course_id)')
      .eq('user_id', userId)
      .eq('status', 'completed');
      
    if (lessonsError) throw lessonsError;
    
    // Get user's trading activity
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('symbol, direction, profit_loss_percent')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (tradesError) throw tradesError;
    
    // Calculate completed courses and progress
    const courseProgress = {};
    courses.forEach(course => {
      courseProgress[course.id] = {
        title: course.title,
        completedLessons: 0,
        totalLessons: 0,
        percentComplete: 0
      };
    });
    
    // Get total lessons per course
    const { data: allLessons, error: allLessonsError } = await supabase
      .from('lessons')
      .select('id, course_id');
      
    if (allLessonsError) throw allLessonsError;
    
    // Update total lesson counts
    allLessons.forEach(lesson => {
      if (courseProgress[lesson.course_id]) {
        courseProgress[lesson.course_id].totalLessons++;
      }
    });
    
    // Update completed lesson counts
    completedLessons.forEach(progress => {
      const courseId = progress.lesson?.course_id;
      if (courseId && courseProgress[courseId]) {
        courseProgress[courseId].completedLessons++;
      }
    });
    
    // Calculate percentages
    Object.keys(courseProgress).forEach(courseId => {
      const course = courseProgress[courseId];
      course.percentComplete = course.totalLessons > 0 
        ? Math.round((course.completedLessons / course.totalLessons) * 100) 
        : 0;
    });
    
    // Format data for GPT analysis
    const userProgressData = {
      completedLessons: completedLessons.length,
      courseProgress: Object.values(courseProgress),
      recentSymbols: [...new Set(trades.map(t => t.symbol))],
      profitableTrades: trades.filter(t => t.profit_loss_percent > 0).length,
      losingTrades: trades.filter(t => t.profit_loss_percent < 0).length
    };
    
    // Generate next lesson recommendations
    const recommendations = await generateRecommendations(userProgressData, courses);
    
    // Store recommendations in the database
    const { error: insertError } = await supabase
      .from('ai_notifications')
      .insert([
        {
          user_id: userId,
          type: 'lms_recommendation',
          title: 'Your Learning Path Recommendations',
          content: recommendations.message,
          created_at: new Date().toISOString(),
          read: false,
          data: { 
            recommended_courses: recommendations.recommendedCourses,
            recommended_lessons: recommendations.recommendedLessons
          }
        }
      ]);
      
    if (insertError) throw insertError;
    
    // Send realtime notification through Supabase
    const payload = {
      type: 'lms_recommendation',
      title: 'New Learning Recommendations',
      message: recommendations.shortMessage,
      user_id: userId,
      data: {
        recommended_courses: recommendations.recommendedCourses.map(c => c.id)
      }
    };
    
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type: 'lms',
          title: 'Learning Recommendations',
          message: recommendations.shortMessage,
          data: payload
        }
      ]);
    
    return recommendations;
  } catch (error) {
    console.error('Error processing user LMS progress:', error);
    throw error;
  }
}

async function generateRecommendations(userProgress, courses) {
  // Format courses data
  const coursesData = courses.map(course => {
    const progress = userProgress.courseProgress.find(p => p.title === course.title) || { percentComplete: 0 };
    return {
      id: course.id,
      title: course.title,
      difficulty: course.difficulty,
      topics: course.topics,
      description: course.description,
      percentComplete: progress.percentComplete
    };
  });
  
  // Generate recommendations using GPT-4
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { 
        role: "system", 
        content: "You are an expert trading coach and educator. Your role is to recommend the next best courses or lessons for a trader based on their progress and recent trading activity. Be encouraging and specific." 
      },
      { 
        role: "user", 
        content: `
Here is data about a trader's learning progress and recent trading:

Completed lessons: ${userProgress.completedLessons}
Recent trading symbols: ${userProgress.recentSymbols.join(', ')}
Profitable trades: ${userProgress.profitableTrades}
Losing trades: ${userProgress.losingTrades}

Course progress:
${JSON.stringify(userProgress.courseProgress, null, 2)}

Available courses:
${JSON.stringify(coursesData, null, 2)}

Based on this information:
1. Recommend 2-3 specific courses they should focus on next and why
2. If they are struggling (more losing than profitable trades), suggest specific topics they should study
3. Provide a brief, encouraging message about continuing their education
4. Include a short, 1-2 sentence version of your recommendation for a notification
`
      }
    ],
    functions: [
      {
        name: "provide_recommendations",
        parameters: {
          type: "object",
          properties: {
            recommendedCourses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            recommendedLessons: {
              type: "array", 
              items: { 
                type: "string" 
              }
            },
            message: { type: "string" },
            shortMessage: { type: "string" }
          },
          required: ["recommendedCourses", "message", "shortMessage"]
        }
      }
    ],
    function_call: { name: "provide_recommendations" },
    temperature: 0.7,
    max_tokens: 800
  });

  // Extract the recommendations
  const functionCall = completion.choices[0]?.message?.function_call;
  if (functionCall && functionCall.name === "provide_recommendations") {
    const recommendations = JSON.parse(functionCall.arguments);
    return recommendations;
  }
  
  // Fallback if function call doesn't work
  return {
    recommendedCourses: coursesData.slice(0, 2).map(c => ({
      id: c.id,
      title: c.title,
      reason: "Recommended based on your progress"
    })),
    recommendedLessons: ["Risk Management Basics", "Chart Pattern Recognition"],
    message: "Continue your learning journey with these recommended courses. Focus on risk management and chart pattern recognition to improve your trading.",
    shortMessage: "New course recommendations available based on your progress."
  };
} 