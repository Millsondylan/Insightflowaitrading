import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth/helpers';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface AuditLog {
  id: string;
  user_id: string | null;
  action_type: 'button_click' | 'toggle_change' | 'form_submit' | 'navigation' | 'api_call' | 'error';
  component_name: string;
  component_path?: string;
  action_details: Record<string, any>;
  client_timestamp: string;
  server_timestamp: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  duration_ms?: number;
}

export interface UIError {
  id: string;
  user_id: string | null;
  error_type: string;
  error_message: string;
  stack_trace?: string;
  component_stack?: string;
  browser_info: Record<string, any>;
  gpt_analysis?: string;
  user_facing_message?: string;
  suggested_actions?: any[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution_status: 'new' | 'triaged' | 'in_progress' | 'resolved' | 'wont_fix';
  occurred_at: string;
}

export interface InteractionHeatmap {
  id: string;
  user_id: string;
  page_path: string;
  component_id: string;
  interaction_type: 'click' | 'hover' | 'focus' | 'scroll';
  x_position?: number;
  y_position?: number;
  viewport_width?: number;
  viewport_height?: number;
  time_on_component?: number;
  interaction_count: number;
  device_type?: string;
  created_at: string;
}

// Types for audit logging
interface AuditLogData {
  user_id?: string | null;
  action_type: string;
  component_name: string;
  component_path?: string;
  action_details?: Record<string, any>;
  client_timestamp: string;
  session_id: string;
  ip_address?: string;
  user_agent?: string;
  duration_ms?: number;
}

// Audit logger state
let SESSION_ID: string | null = null;
let USER_ID: string | null = null;

/**
 * Initialize a new session for audit logging
 * Should be called when the application starts or when the user logs in
 */
export function initializeSession(): string {
  SESSION_ID = uuidv4();
  return SESSION_ID;
}

/**
 * Set the current user for audit logging
 */
export function setAuditUser(userId: string): void {
  USER_ID = userId;
}

/**
 * Creates a basic audit log entry with common fields pre-populated
 */
function createBaseLogEntry(eventType: string, componentName: string): AuditLogData {
  if (!SESSION_ID) {
    SESSION_ID = initializeSession();
  }

  return {
    user_id: USER_ID,
    action_type: eventType,
    component_name: componentName,
    client_timestamp: new Date().toISOString(),
    session_id: SESSION_ID,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

/**
 * Logs an audit event to the database
 */
async function logToDatabase(data: AuditLogData): Promise<void> {
  try {
    const { error } = await supabase.from('audit_logs').insert(data);
    
    if (error) {
      console.error('Error logging audit event:', error);
    }
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

/**
 * React hook for audit logging functionality
 */
export function useAuditLog() {
  /**
   * Log a click interaction
   */
  const logClick = async (componentName: string, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('user_interaction', componentName),
      component_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      action_details: details,
    };
    
    await logToDatabase(logData);
  };

  /**
   * Log a toggle interaction (switch, checkbox, etc)
   */
  const logToggle = async (componentName: string, newValue: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, details?: Record<string, any>): Promise<void> => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const logData = {
      ...createBaseLogEntry('toggle_change', componentName),
      action_details: { ...details, newValue },
    };
    
    await logToDatabase(logData);
  };

  /**
   * Log form submission
   */
  const logFormSubmit = async (formName: string, formData: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('form_submit', formName),
      action_details: { 
        // Don't log sensitive fields
        ...sanitizeFormData(formData)
      },
    };
    
    await logToDatabase(logData);
  };

  /**
   * Log API request
   */
  const logApiRequest = async (endpoint: string, method: string, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('api_request', endpoint),
      action_details: { ...details, method },
    };
    
    await logToDatabase(logData);
  };

  /**
   * Log API response
   */
  const logApiResponse = async (endpoint: string, statusCode: number, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('api_response', endpoint),
      action_details: { ...details, statusCode },
    };
    
    await logToDatabase(logData);
  };

  /**
   * Log navigation between pages/routes
   */
  const logNavigation = async (from: string, to: string, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('navigation', 'router'),
      action_details: { ...details, from, to },
    };
    
    await logToDatabase(logData);
  };
  
  /**
   * Log a feature usage
   */
  const logFeatureUsage = async (featureName: string, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('feature_usage', featureName),
      action_details: details,
    };
    
    await logToDatabase(logData);
  };
  
  /**
   * Log an error that occurred
   */
  const logError = async (errorType: string, errorMessage: string, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry('error', errorType),
      action_details: { ...details, message: errorMessage },
    };
    
    await logToDatabase(logData);
  };
  
  /**
   * Log scroll interaction on components like feeds
   */
  const trackScroll = async (componentId: string, event: UIEvent): Promise<void> => {
    const target = event.target as Element;
    const scrollPercentage = Math.round((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100);
    
    // Only log at certain thresholds to avoid too many events
    if (scrollPercentage % 25 === 0 || scrollPercentage === 100) {
      const logData = {
        ...createBaseLogEntry('scroll', componentId),
        action_details: { scrollPercentage },
      };
      
      await logToDatabase(logData);
    }
  };

  /**
   * Log a generic event
   */
  const logEvent = async (eventType: string, details?: Record<string, any>): Promise<void> => {
    const logData = {
      ...createBaseLogEntry(eventType, 'system'),
      action_details: details,
    };
    
    await logToDatabase(logData);
  };

  return {
    logClick,
    logToggle,
    logFormSubmit,
    logApiRequest,
    logApiResponse,
    logNavigation,
    logFeatureUsage,
    logError,
    trackScroll,
    logEvent,
  };
}

/**
 * Remove sensitive data from form submissions
 */
function sanitizeFormData(formData: Record<string, any>): Record<string, any> {
  const sanitized = { ...formData };
  
  // List of fields that should be redacted
  const sensitiveFields = ['password', 'token', 'secret', 'credit_card', 'card_number', 'cvv', 'ssn'];
  
  // Redact any sensitive fields
  Object.keys(sanitized).forEach(key => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

// Interaction tracking
export async function trackInteraction(
  componentId: string,
  interactionType: InteractionHeatmap['interaction_type'],
  event: MouseEvent | FocusEvent | UIEvent
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const mouseEvent = event as MouseEvent;
    const interaction: Omit<InteractionHeatmap, 'id' | 'created_at'> = {
      user_id: user.id,
      page_path: window.location.pathname,
      component_id: componentId,
      interaction_type: interactionType,
      x_position: mouseEvent.clientX || undefined,
      y_position: mouseEvent.clientY || undefined,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      interaction_count: 1,
      device_type: getDeviceType()
    };

    await supabase
      .from('interaction_heatmap')
      .insert(interaction);
  } catch (error) {
    console.error('Interaction tracking error:', error);
  }
}

// Error logging
export async function logUIError(
  error: Error | string,
  componentInfo?: {
    componentStack?: string;
    props?: Record<string, any>;
  }
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const errorMessage = error instanceof Error ? error.message : error;
    const stackTrace = error instanceof Error ? error.stack : undefined;

    const errorLog: Omit<UIError, 'id' | 'occurred_at'> = {
      user_id: user?.id || null,
      error_type: error instanceof Error ? error.name : 'Unknown',
      error_message: errorMessage,
      stack_trace: stackTrace,
      component_stack: componentInfo?.componentStack,
      browser_info: getBrowserInfo(),
      severity: determineSeverity(errorMessage),
      resolution_status: 'new'
    };

    const { data } = await supabase
      .from('ui_error_captures')
      .insert(errorLog)
      .select()
      .single();

    // Optionally trigger GPT analysis for critical errors
    if (data && errorLog.severity === 'critical') {
      await analyzeErrorWithGPT(data.id, errorMessage, stackTrace);
    }
  } catch (logError) {
    console.error('Error logging failed:', logError);
  }
}

// Helper functions
function getDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserInfo(): Record<string, any> {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    vendor: navigator.vendor,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenResolution: `${screen.width}x${screen.height}`,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

function determineSeverity(errorMessage: string): UIError['severity'] {
  const criticalKeywords = ['crash', 'fatal', 'cannot read', 'undefined is not'];
  const highKeywords = ['failed', 'error', 'exception'];
  const mediumKeywords = ['warning', 'deprecated', 'slow'];
  
  const lowerMessage = errorMessage.toLowerCase();
  
  if (criticalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'critical';
  }
  if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'high';
  }
  if (mediumKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'medium';
  }
  return 'low';
}

async function analyzeErrorWithGPT(errorId: string, errorMessage: string, stackTrace?: string): Promise<void> {
  // This would call your GPT endpoint to analyze the error
  // For now, we'll just update with a placeholder
  try {
    const analysis = {
      gpt_analysis: 'Error analysis pending...',
      user_facing_message: 'An unexpected error occurred. Our team has been notified.',
      suggested_actions: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Contact support if the issue persists'
      ]
    };

    await supabase
      .from('ui_error_captures')
      .update(analysis)
      .eq('id', errorId);
  } catch (error) {
    console.error('GPT analysis failed:', error);
  }
}

// Error boundary integration
export function captureErrorBoundary(
  error: Error, 
  componentStack: string,
  componentName?: string
): void {
  const errorData = {
    ...createBaseLogEntry('error_boundary', componentName || 'unknown'),
    action_details: {
      message: error.message,
      stack: error.stack,
      componentStack
    }
  };
  
  logToDatabase(errorData);
}

// Performance monitoring
export async function recordPerformanceMetric(
  metricName: string,
  value: number,
  unit: string,
  metadata?: Record<string, any>
): Promise<void> {
  await logToDatabase({
    ...createBaseLogEntry('performance', metricName),
    action_details: {
      value,
      unit,
      ...metadata
    },
  });
}

// User state tracking
interface UserStateSnapshot {
  [key: string]: any;
}

export async function saveUserState(
  user: { id: string },
  path: string,
  state: UserStateSnapshot
): Promise<void> {
  try {
    await supabase
      .from('user_states')
      .upsert({
        user_id: user.id,
        session_id: SESSION_ID,
        current_path: path,
        component_states: state,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to save user state:', error);
  }
}

// Journey state tracking
export async function updateJourneyState(
  path: string,
  state: Record<string, any>
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_journey_state')
      .upsert({
        user_id: user.id,
        session_id: SESSION_ID,
        current_path: path,
        component_states: state,
        last_activity: new Date().toISOString(),
        is_active: true
      }, {
        onConflict: 'user_id,session_id'
      });
  } catch (error) {
    console.error('Journey state update error:', error);
  }
}

type LogEntry = {
  id: string;
  timestamp: string;
  user_id?: string;
  session_id?: string;
  event_type: string;
  component: string;
  action?: string;
  action_details?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

class AuditLogger {
  private sessionId: string;
  private enabled: boolean;
  private consoleDebug: boolean;
  private userId?: string;
  
  constructor() {
    this.sessionId = uuidv4();
    this.enabled = true; // Enable by default in production
    
    // Enable debug mode if in development
    this.consoleDebug = process.env.NODE_ENV === 'development';
    
    // Try to get the user ID
    this.setUserIdFromSession();
  }
  
  private async setUserIdFromSession(): Promise<void> {
    try {
      const user = await getCurrentUser();
      if (user) {
        this.userId = user.id;
      }
    } catch (error) {
      console.error('Failed to get user ID for audit logs:', error);
    }
  }
  
  /**
   * Creates the base log entry structure
   */
  private createBaseLogEntry(eventType: string, component: string): Partial<LogEntry> {
    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      user_id: this.userId,
      session_id: this.sessionId,
      event_type: eventType,
      component,
    };
  }
  
  /**
   * Enable or disable the audit logger
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Enable or disable console debugging
   */
  public setConsoleDebug(enabled: boolean): void {
    this.consoleDebug = enabled;
  }
  
  /**
   * Log a navigation event
   */
  public async logNavigation(
    fromRoute: string,
    toRoute: string,
    details?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<void> {
    if (!this.enabled) return;
    
    const logData = {
      ...this.createBaseLogEntry('navigation', 'router'),
      action: 'route_change',
      action_details: { ...details, from: fromRoute, to: toRoute },
    };
    
    if (this.consoleDebug) {
      console.debug('📝 AuditLog [Navigation]:', logData);
    }
    
    try {
      await supabase.from('audit_logs').insert(logData);
    } catch (error) {
      console.error('Failed to log navigation event:', error);
    }
  }
  
  /**
   * Log a user action
   */
  public async logAction(
    component: string,
    action: string,
    details?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<void> {
    if (!this.enabled) return;
    
    const logData = {
      ...this.createBaseLogEntry('user_action', component),
      action,
      action_details: details,
    };
    
    if (this.consoleDebug) {
      console.debug(`📝 AuditLog [Action: ${action}]:`, logData);
    }
    
    try {
      await supabase.from('audit_logs').insert(logData);
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  }
  
  /**
   * Log a toggle change
   */
  public async logToggle(
    componentName: string,
    newValue: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, // eslint-disable-line @typescript-eslint/no-explicit-any
    details?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<void> {
    const logData = {
      ...this.createBaseLogEntry('toggle_change', componentName),
      action_details: { ...details, newValue },
    };
    
    if (this.consoleDebug) {
      console.debug(`📝 AuditLog [Toggle: ${componentName}]:`, logData);
    }
    
    try {
      await supabase.from('audit_logs').insert(logData);
    } catch (error) {
      console.error('Failed to log toggle change:', error);
    }
  }
  
  /**
   * Log an error that occurred
   */
  public async logError(
    component: string,
    error: Error | string,
    details?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<void> {
    if (!this.enabled) return;
    
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    const logData = {
      ...this.createBaseLogEntry('error', component),
      action: 'error_occurred',
      action_details: {
        ...details,
        error_message: errorMessage,
        error_stack: errorStack,
      },
    };
    
    if (this.consoleDebug) {
      console.debug('📝 AuditLog [Error]:', logData);
    }
    
    try {
      await supabase.from('audit_logs').insert(logData);
    } catch (logError) {
      console.error('Failed to log error event:', logError);
    }
  }
}

// Create a singleton instance
export const auditLogger = new AuditLogger();

export default auditLogger; 