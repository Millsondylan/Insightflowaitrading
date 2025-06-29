// Vision Chart Labeler
// This function runs daily to analyze uploaded chart images using YOLOv8

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import OpenAI from 'openai';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI for additional analysis
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Roboflow (for YOLOv8 API)
const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY;
const ROBOFLOW_MODEL = 'trading-pattern-detector/2'; // Example model name/version

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

    // Get recently uploaded chart images that haven't been analyzed
    const { data: chartImages, error: chartsError } = await supabase
      .from('chart_uploads')
      .select('id, user_id, image_url, uploaded_at, metadata')
      .is('analyzed_at', null)
      .order('uploaded_at', { ascending: false })
      .limit(20); // Limit to avoid timeouts
      
    if (chartsError) throw chartsError;
    if (!chartImages || chartImages.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No new charts to analyze' })
      };
    }
    
    // Process each chart image
    const processPromises = chartImages.map(async (chart) => {
      try {
        await processChartImage(chart);
      } catch (err) {
        console.error(`Error processing chart ${chart.id}:`, err);
      }
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Chart analysis completed successfully',
        processed: processPromises.length
      })
    };
    
  } catch (error) {
    console.error('Error in chart labeler function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze chart images' })
    };
  }
};

async function processChartImage(chart) {
  try {
    // Get the chart image URL
    const imageUrl = chart.image_url;
    
    // 1. Run YOLOv8 analysis through Roboflow API
    const yoloDetections = await detectPatternsWithYOLO(imageUrl);
    
    // 2. Additional GPT-4 Vision analysis for context
    const gptAnalysis = await analyzeWithGPTVision(imageUrl);
    
    // 3. Combine both analyses
    const combinedAnalysis = {
      yolo_detections: yoloDetections,
      gpt_analysis: gptAnalysis,
      detected_patterns: yoloDetections.predictions?.map(p => p.class) || [],
      confidence_scores: yoloDetections.predictions?.map(p => p.confidence) || [],
      summary: gptAnalysis.summary || 'No pattern detected',
      analyzed_at: new Date().toISOString()
    };
    
    // 4. Store results in chart_analysis table
    const { error: insertError } = await supabase
      .from('chart_analysis')
      .insert([
        {
          user_id: chart.user_id,
          image_url: chart.image_url,
          yolo_json: yoloDetections,
          detected_at: new Date().toISOString(),
          asset_symbol: chart.metadata?.symbol,
          timeframe: chart.metadata?.timeframe,
          tags: combinedAnalysis.detected_patterns
        }
      ]);
      
    if (insertError) throw insertError;
    
    // 5. Mark the chart as analyzed
    const { error: updateError } = await supabase
      .from('chart_uploads')
      .update({
        analyzed_at: new Date().toISOString(),
        analysis_result: combinedAnalysis
      })
      .eq('id', chart.id);
      
    if (updateError) throw updateError;
    
    // 6. Create a notification for the user
    const { error: notificationError } = await supabase
      .from('ai_notifications')
      .insert([
        {
          user_id: chart.user_id,
          type: 'chart_analysis',
          title: 'Chart Pattern Analysis',
          content: `AI analysis has detected the following patterns in your chart: ${combinedAnalysis.detected_patterns.join(', ')}. ${gptAnalysis.summary}`,
          created_at: new Date().toISOString(),
          read: false,
          data: { 
            chart_id: chart.id,
            patterns: combinedAnalysis.detected_patterns,
            image_url: chart.image_url
          }
        }
      ]);
      
    if (notificationError) throw notificationError;
    
    return combinedAnalysis;
  } catch (error) {
    console.error('Error processing chart:', error);
    throw error;
  }
}

async function detectPatternsWithYOLO(imageUrl) {
  try {
    // Call the Roboflow API to run YOLOv8 inference
    const response = await fetch(
      `https://detect.roboflow.com/${ROBOFLOW_MODEL}?api_key=${ROBOFLOW_API_KEY}&image=${encodeURIComponent(imageUrl)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Roboflow API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('YOLOv8 detection error:', error);
    return { predictions: [] };
  }
}

async function analyzeWithGPTVision(imageUrl) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert technical analyst examining trading charts. Identify technical patterns (like head and shoulders, double tops, triangles, channels, support/resistance levels) and key indicators visible in the chart. Be specific and technical in your analysis."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this trading chart. Identify any technical patterns, trend lines, support/resistance levels, and other notable features. Provide a brief summary of what you observe." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 300
    });

    const analysis = response.choices[0]?.message?.content || '';
    
    // Extract a short summary
    const summary = analysis.split('.')[0] + '.';

    return {
      full_analysis: analysis,
      summary: summary
    };
  } catch (error) {
    console.error('GPT Vision analysis error:', error);
    return {
      full_analysis: 'Analysis failed',
      summary: 'Unable to analyze chart'
    };
  }
} 