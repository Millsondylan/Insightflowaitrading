import { supabase } from '../../integrations/supabase/client';

// Strategy Evolution
export async function logStrategyPerformance(strategyId: string, userId: string, data: {
  win_rate: number;
  avg_drawdown: number;
  avg_r_multiple: number;
  execution_success_rate: number;
  changes?: any;
}) {
  return await supabase
    .from('strategy_performance_log')
    .insert({
      strategy_id: strategyId,
      user_id: userId,
      win_rate: data.win_rate,
      avg_drawdown: data.avg_drawdown,
      avg_r_multiple: data.avg_r_multiple,
      execution_success_rate: data.execution_success_rate,
      changes: data.changes
    });
}

export async function createStrategyVersion(strategyId: string, userId: string, code: string, reason: string) {
  return await supabase
    .from('strategy_versions')
    .insert({
      strategy_id: strategyId,
      user_id: userId,
      code,
      improvement_reason: reason,
      is_active: false
    });
}

export async function getStrategyVersions(strategyId: string) {
  return await supabase
    .from('strategy_versions')
    .select('*')
    .eq('strategy_id', strategyId)
    .order('created_at', { ascending: false });
}

export async function activateStrategyVersion(versionId: string, strategyId: string) {
  // First deactivate all versions
  await supabase
    .from('strategy_versions')
    .update({ is_active: false })
    .eq('strategy_id', strategyId);
  
  // Then activate the selected one
  return await supabase
    .from('strategy_versions')
    .update({ is_active: true })
    .eq('id', versionId);
}

// Voice Coaching
export async function createCoachSession(userId: string, data: {
  market_context?: any;
  strategy_id?: string;
}) {
  return await supabase
    .from('coach_sessions')
    .insert({
      user_id: userId,
      market_context: data.market_context,
      strategy_id: data.strategy_id
    })
    .select()
    .single();
}

export async function updateCoachSessionTranscript(sessionId: string, message: {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}) {
  // First get the current transcript
  const { data: session } = await supabase
    .from('coach_sessions')
    .select('transcript')
    .eq('id', sessionId)
    .single();

  const transcript = session?.transcript || [];
  transcript.push(message);

  // Update with the new message
  return await supabase
    .from('coach_sessions')
    .update({ transcript })
    .eq('id', sessionId);
}

export async function endCoachSession(sessionId: string) {
  return await supabase
    .from('coach_sessions')
    .update({ end_time: new Date().toISOString() })
    .eq('id', sessionId);
}

// Dashboard Widgets
export async function getUserDashboardWidgets(userId: string) {
  return await supabase
    .from('user_dashboard_widgets')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true });
}

export async function saveWidget(userId: string, data: {
  widget_id: string;
  position: number;
  settings?: any;
}) {
  return await supabase
    .from('user_dashboard_widgets')
    .upsert({
      user_id: userId,
      widget_id: data.widget_id,
      position: data.position,
      settings: data.settings,
      last_seen: new Date().toISOString()
    });
}

export async function dismissWidget(userId: string, widgetId: string) {
  return await supabase
    .from('user_dashboard_widgets')
    .update({ dismissed: true })
    .eq('user_id', userId)
    .eq('widget_id', widgetId);
}

// Learning Path
export async function createLearningPathItem(userId: string, lessonId: string, reason: string) {
  return await supabase
    .from('user_learning_path')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      reason
    });
}

export async function getUserLearningPath(userId: string) {
  return await supabase
    .from('user_learning_path')
    .select(`
      *,
      academy_lessons (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
}

export async function completePathItem(itemId: string) {
  return await supabase
    .from('user_learning_path')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', itemId);
}

// AI Suggestions
export async function createSuggestion(userId: string, data: {
  suggestion: string;
  action_button?: string;
  action_target?: string;
}) {
  return await supabase
    .from('user_suggestions')
    .insert({
      user_id: userId,
      suggestion: data.suggestion,
      action_button: data.action_button,
      action_target: data.action_target
    });
}

export async function getUserSuggestions(userId: string) {
  return await supabase
    .from('user_suggestions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'new')
    .order('created_at', { ascending: false });
}

export async function markSuggestionStatus(suggestionId: string, status: 'applied' | 'ignored') {
  return await supabase
    .from('user_suggestions')
    .update({
      status,
      acted_at: new Date().toISOString()
    })
    .eq('id', suggestionId);
}

// User AI Preferences
export async function getAIPreferences(userId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('ai_preferences')
    .eq('user_id', userId)
    .single();
    
  return data?.ai_preferences || {
    strategy_evolution: true,
    voice_coaching: true,
    adaptive_dashboard: true,
    learning_path: true,
    ai_suggestions: true
  };
}

export async function updateAIPreferences(userId: string, preferences: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any) {
  return await supabase
    .from('user_profiles')
    .update({ ai_preferences: preferences })
    .eq('user_id', userId);
} 