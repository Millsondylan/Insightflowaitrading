import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '../db/types';

export type EventType = 
  | 'user_action'
  | 'system_event'
  | 'trading_event'
  | 'learning_event'
  | 'security_event'
  | 'error_event'
  | 'analytics_event'
  | 'performance_event'
  | 'audit_event'
  | 'compliance_event';

export interface Event {
  id: string;
  type: EventType;
  timestamp: Date;
  source: string;
  userId?: string;
  metadata: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  context: {
    sessionId: string;
    requestId: string;
    correlationId: string;
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    environment: string;
    version: string;
    tags: string[];
    attributes: Record<string, any>;
  };
  performance: {
    processingTime: number;
    queueTime: number;
    totalTime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      io: number;
    };
  };
  security: {
    authContext: {
      userId: string;
      roles: string[];
      permissions: string[];
      sessionId: string;
    };
    encryption: {
      algorithm: string;
      keyId: string;
      version: string;
    };
    audit: {
      ipAddress: string;
      userAgent: string;
      geoLocation: string;
      deviceId: string;
    };
  };
  validation: {
    schema: string;
    version: string;
    isValid: boolean;
    errors: string[];
  };
  retry: {
    count: number;
    maxAttempts: number;
    backoffDelay: number;
    lastAttempt: Date;
    errors: Error[];
  };
  dependencies: {
    services: string[];
    databases: string[];
    externalApis: string[];
    versions: Record<string, string>;
  };
}

export interface EventHandler {
  type: EventType;
  handler: (event: Event) => Promise<void>;
  filter?: (event: Event) => boolean;
  validation?: {
    schema: Record<string, any>;
    rules: ((event: Event) => boolean)[];
  };
  retry?: {
    maxAttempts: number;
    backoffStrategy: 'linear' | 'exponential' | 'custom';
    customBackoff?: (attempt: number) => number;
  };
  timeout?: number;
  priority?: number;
  concurrency?: number;
  dependencies?: string[];
}

export interface EventProcessorConfig {
  bufferSize: number;
  flushInterval: number;
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  validation: {
    enabled: boolean;
    strictMode: boolean;
    schemas: Record<string, any>;
  };
  monitoring: {
    enabled: boolean;
    metrics: string[];
    alertThresholds: Record<string, number>;
  };
  security: {
    encryption: {
      enabled: boolean;
      algorithm: string;
      keyRotation: number;
    };
    audit: {
      enabled: boolean;
      detailedLogs: boolean;
      retention: number;
    };
  };
  performance: {
    sampling: number;
    tracing: boolean;
    profiling: boolean;
  };
}

export class EventProcessor {
  private supabase: SupabaseClient;
  private handlers: Map<EventType, EventHandler[]>;
  private eventBuffer: Event[] = [];
  private processingQueue: Map<string, Event> = new Map();
  private metricsCollector: MetricsCollector;
  private config: EventProcessorConfig;

  private readonly DEFAULT_CONFIG: EventProcessorConfig = {
    bufferSize: 100,
    flushInterval: 5000,
    batchSize: 50,
    maxRetries: 3,
    retryDelay: 5000,
    validation: {
      enabled: true,
      strictMode: false,
      schemas: {}
    },
    monitoring: {
      enabled: true,
      metrics: ['latency', 'throughput', 'errors', 'retries'],
      alertThresholds: {
        errorRate: 0.05,
        latency: 1000,
        queueSize: 1000
      }
    },
    security: {
      encryption: {
        enabled: true,
        algorithm: 'AES-256-GCM',
        keyRotation: 86400000 // 24 hours
      },
      audit: {
        enabled: true,
        detailedLogs: true,
        retention: 2592000000 // 30 days
      }
    },
    performance: {
      sampling: 0.1,
      tracing: true,
      profiling: false
    }
  };

  constructor(
    supabase: SupabaseClient,
    config: Partial<EventProcessorConfig> = {}
  ) {
    this.supabase = supabase;
    this.handlers = new Map();
    this.config = { ...this.DEFAULT_CONFIG, ...config };
    this.metricsCollector = new MetricsCollector(this.config.monitoring);
    this.initializeSystem();
  }

  private async initializeSystem(): Promise<void> {
    await this.initializeHandlers();
    this.startEventProcessing();
    this.startMetricsCollection();
    this.startHealthChecks();
  }

  private async initializeHandlers(): Promise<void> {
    // Initialize default handlers with enhanced capabilities
    const defaultHandlers: EventHandler[] = [
      {
        type: 'user_action',
        handler: async (event: Event) => {
          const { userId, metadata } = event;
          if (!userId) return;

          await this.supabase
            .from('user_activity')
            .insert({
              userId,
              action: metadata.action,
              timestamp: event.timestamp,
              details: metadata
            });

          if (metadata.action === 'login') {
            await this.supabase
              .from('users')
              .update({ lastActive: event.timestamp })
              .eq('id', userId);
          }

          if (metadata.feature) {
            await this.supabase
              .from('feature_usage')
              .insert({
                userId,
                feature: metadata.feature,
                timestamp: event.timestamp,
                details: metadata
              });
          }
        },
        filter: (event) => event.priority !== 'low',
        validation: {
          schema: {
            required: ['userId', 'action', 'timestamp'],
            properties: {
              userId: { type: 'string' },
              action: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' }
            }
          },
          rules: [
            (event) => !!event.userId,
            (event) => !!event.metadata.action
          ]
        },
        retry: {
          maxAttempts: 3,
          backoffStrategy: 'exponential'
        },
        timeout: 5000,
        priority: 1,
        concurrency: 5
      }
    ];

    // Register default handlers
    defaultHandlers.forEach(handler => {
      const handlers = this.handlers.get(handler.type) || [];
      handlers.push(handler);
      this.handlers.set(handler.type, handlers);
    });
  }

  private startEventProcessing(): void {
    setInterval(() => this.processEventBuffer(), this.config.flushInterval);
  }

  private startMetricsCollection(): void {
    if (this.config.monitoring.enabled) {
      setInterval(() => this.collectMetrics(), 60000); // Every minute
    }
  }

  private startHealthChecks(): void {
    setInterval(() => this.performHealthCheck(), 300000); // Every 5 minutes
  }

  private async processEventBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const events = this.eventBuffer.splice(0, this.config.batchSize);
    const batches = this.createBatches(events);

    await Promise.all(
      batches.map(batch => this.processBatch(batch))
    );
  }

  private createBatches(events: Event[]): Event[][] {
    const batches: Event[][] = [];
    const batchSize = this.config.batchSize;

    for (let i = 0; i < events.length; i += batchSize) {
      batches.push(events.slice(i, i + batchSize));
    }

    return batches;
  }

  private async processBatch(events: Event[]): Promise<void> {
    const startTime = Date.now();

    try {
      await Promise.all(
        events.map(async (event) => {
          try {
            event.status = 'processing';
            await this.processEvent(event);
            event.status = 'completed';
            event.performance.processingTime = Date.now() - startTime;
          } catch (error) {
            event.status = 'failed';
            event.retry.errors.push(error as Error);
            
            // Handle failed event
            console.error(`Event processing failed:`, {
              id: event.id,
              type: event.type,
              error: error.message
            });

            // Create error event
            const errorEvent: Event = {
              id: Math.random().toString(36).substr(2, 9),
              type: 'error_event',
              source: 'event_processor',
              timestamp: new Date(),
              metadata: {
                failedEventId: event.id,
                failedEventType: event.type,
                error: error.message
              },
              priority: 'high',
              status: 'pending',
              context: event.context,
              performance: {
                processingTime: 0,
                queueTime: 0,
                totalTime: 0,
                resourceUsage: {
                  cpu: 0,
                  memory: 0,
                  io: 0
                }
              },
              security: event.security,
              validation: {
                schema: '',
                version: '',
                isValid: true,
                errors: []
              },
              retry: {
                count: 0,
                maxAttempts: this.config.maxRetries,
                backoffDelay: this.config.retryDelay,
                lastAttempt: new Date(),
                errors: []
              },
              dependencies: {
                services: [],
                databases: [],
                externalApis: [],
                versions: {}
              }
            };

            this.eventBuffer.push(errorEvent);

            // Retry critical events
            if (event.priority === 'critical' && event.retry.count < this.config.maxRetries) {
              setTimeout(() => {
                this.eventBuffer.push({
                  ...event,
                  status: 'pending',
                  retry: {
                    ...event.retry,
                    count: event.retry.count + 1,
                    lastAttempt: new Date()
                  }
                });
              }, this.config.retryDelay);
            }
          }
        })
      );

      // Persist events to database
      try {
        const { error } = await this.supabase
          .from('events')
          .insert(events);

        if (error) {
          console.error('Error persisting events:', error);
          // Add failed events back to buffer
          this.eventBuffer = [...events.filter(e => e.status === 'failed'), ...this.eventBuffer];
        }
      } catch (error) {
        console.error('Error persisting events:', error);
        this.eventBuffer = [...events.filter(e => e.status === 'failed'), ...this.eventBuffer];
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
      await this.handleBatchFailure(events, error as Error);
    }
  }

  private async processEvent(event: Event): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    
    // Validate event
    if (this.config.validation.enabled) {
      await this.validateEvent(event);
    }

    // Process event with handlers
    await Promise.all(
      handlers
        .filter(handler => !handler.filter || handler.filter(event))
        .map(async (handler) => {
          try {
            if (handler.timeout) {
              await this.executeWithTimeout(
                () => handler.handler(event),
                handler.timeout
              );
            } else {
              await handler.handler(event);
            }
          } catch (error) {
            await this.handleHandlerFailure(event, handler, error as Error);
          }
        })
    );
  }

  private async validateEvent(event: Event): Promise<void> {
    const handler = this.handlers.get(event.type)?.[0];
    if (!handler?.validation) return;

    const { schema, rules } = handler.validation;

    // Validate against schema
    const isValidSchema = await this.validateSchema(event, schema);
    if (!isValidSchema) {
      throw new Error('Event failed schema validation');
    }

    // Validate against custom rules
    const isValidRules = rules.every(rule => rule(event));
    if (!isValidRules) {
      throw new Error('Event failed custom validation rules');
    }
  }

  private async validateSchema(
    event: Event,
    schema: Record<string, any>
  ): Promise<boolean> {
    // Implementation would use a schema validation library
    return true;
  }

  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
      )
    ]);
  }

  private async handleHandlerFailure(
    event: Event,
    handler: EventHandler,
    error: Error
  ): Promise<void> {
    console.error(`Handler failed for event ${event.id}:`, error);

    if (handler.retry && event.retry.count < handler.retry.maxAttempts) {
      await this.retryEvent(event, handler);
    } else {
      await this.handleFatalFailure(event, error);
    }
  }

  private async retryEvent(
    event: Event,
    handler: EventHandler
  ): Promise<void> {
    event.retry.count++;
    const delay = this.calculateRetryDelay(event.retry.count, handler.retry!);

    setTimeout(() => {
      this.eventBuffer.push(event);
    }, delay);
  }

  private calculateRetryDelay(
    attempt: number,
    retry: EventHandler['retry']
  ): number {
    if (!retry) return this.config.retryDelay;

    switch (retry.backoffStrategy) {
      case 'linear':
        return this.config.retryDelay * attempt;
      case 'exponential':
        return this.config.retryDelay * Math.pow(2, attempt - 1);
      case 'custom':
        return retry.customBackoff?.(attempt) || this.config.retryDelay;
      default:
        return this.config.retryDelay;
    }
  }

  private async handleFatalFailure(
    event: Event,
    error: Error
  ): Promise<void> {
    console.error(`Fatal failure processing event ${event.id}:`, error);

    await this.supabase
      .from('failed_events')
      .insert({
        eventId: event.id,
        type: event.type,
        error: error.message,
        stackTrace: error.stack,
        metadata: event.metadata,
        timestamp: new Date()
      });
  }

  private async handleBatchFailure(
    events: Event[],
    error: Error
  ): Promise<void> {
    console.error('Batch processing failed:', error);

    // Log batch failure
    await this.supabase
      .from('batch_failures')
      .insert({
        events: events.map(e => e.id),
        error: error.message,
        stackTrace: error.stack,
        timestamp: new Date()
      });

    // Retry individual events
    events.forEach(event => {
      if (event.retry.count < this.config.maxRetries) {
        this.eventBuffer.push(event);
      }
    });
  }

  private async collectMetrics(): Promise<void> {
    const metrics = this.metricsCollector.collect();

    await this.supabase
      .from('event_metrics')
      .insert({
        timestamp: new Date(),
        metrics
      });

    // Check alert thresholds
    this.checkAlertThresholds(metrics);
  }

  private checkAlertThresholds(metrics: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): void {
    const { alertThresholds } = this.config.monitoring;

    for (const [metric, threshold] of Object.entries(alertThresholds)) {
      if (metrics[metric] > threshold) {
        this.triggerAlert(metric, metrics[metric], threshold);
      }
    }
  }

  private async triggerAlert(
    metric: string,
    value: number,
    threshold: number
  ): Promise<void> {
    await this.supabase
      .from('alerts')
      .insert({
        type: 'threshold_exceeded',
        metric,
        value,
        threshold,
        timestamp: new Date()
      });
  }

  private async performHealthCheck(): Promise<void> {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      metrics: {
        bufferSize: this.eventBuffer.length,
        processingQueueSize: this.processingQueue.size,
        handlerCount: Array.from(this.handlers.values()).reduce((sum, handlers) => sum + handlers.length, 0)
      },
      lastError: null as Error | null
    };

    try {
      // Perform health checks
      await this.checkDatabaseConnection();
      await this.checkHandlerHealth();
      await this.checkResourceUsage();
    } catch (error) {
      health.status = 'unhealthy';
      health.lastError = error as Error;
    }

    await this.supabase
      .from('health_checks')
      .insert(health);
  }

  private async checkDatabaseConnection(): Promise<void> {
    const { error } = await this.supabase
      .from('health')
      .select('count')
      .single();

    if (error) throw error;
  }

  private async checkHandlerHealth(): Promise<void> {
    // Implementation would check handler health
  }

  private async checkResourceUsage(): Promise<void> {
    // Implementation would check resource usage
  }
}

class MetricsCollector {
  private config: EventProcessorConfig['monitoring'];
  private metrics: Record<string, number> = {};

  constructor(config: EventProcessorConfig['monitoring']) {
    this.config = config;
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    this.config.metrics.forEach(metric => {
      this.metrics[metric] = 0;
    });
  }

  public collect(): Record<string, number> {
    // Implementation would collect actual metrics
    return this.metrics;
  }
} 