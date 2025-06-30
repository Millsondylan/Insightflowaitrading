// Extensibility Ecosystem Type Definitions

// Plugin system types
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license: string;
  permissions: PluginPermission[];
  hooks: PluginHook[];
  dependencies?: PluginDependency[];
  configuration?: PluginConfigSchema;
  assets?: PluginAssets;
  createdAt: Date;
  updatedAt: Date;
}

export interface PluginPermission {
  type: 'api_access' | 'data_read' | 'data_write' | 'ui_render' | 'notification' | 'external_request';
  scope: string;
  description: string;
  required: boolean;
}

export interface PluginHook {
  name: string;
  type: 'action' | 'filter' | 'event';
  description: string;
  parameters?: PluginParameter[];
  returnType?: string;
}

export interface PluginParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
}

export interface PluginDependency {
  name: string;
  version: string;
  type: 'plugin' | 'npm';
  required: boolean;
}

export interface PluginConfigSchema {
  properties: Record<string, PluginConfigProperty>;
  required?: string[];
}

export interface PluginConfigProperty {
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  title: string;
  description?: string;
  default?: any;
  options?: Array<{ label: string; value: unknown }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };
}

export interface PluginAssets {
  icon?: string;
  screenshots?: string[];
  documentation?: string;
  changelog?: string;
}

export interface PluginInstance {
  id: string;
  manifestId: string;
  userId: string;
  enabled: boolean;
  configuration: Record<string, any>;
  installedAt: Date;
  lastUpdated: Date;
  lastUsed: Date;
  usage: PluginUsageStats;
}

export interface PluginUsageStats {
  activations: number;
  errors: number;
  lastError?: string;
  lastErrorAt?: Date;
  avgExecutionTime: number;
  totalExecutions: number;
}

// Plugin SDK context types
export interface PluginContext {
  user: PluginUserContext;
  platform: PluginPlatformContext;
  api: PluginAPIContext;
  ui: PluginUIContext;
  storage: PluginStorageContext;
  logger: PluginLoggerContext;
}

export interface PluginUserContext {
  id: string;
  email: string;
  displayName: string;
  subscription: string;
  permissions: string[];
  preferences: Record<string, any>;
}

export interface PluginPlatformContext {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: string[];
  limits: {
    apiCalls: number;
    storage: number;
    execution: number;
  };
}

export interface PluginAPIContext {
  get: (endpoint: string, params?: any) => Promise<any>;
  post: (endpoint: string, data?: any) => Promise<any>;
  put: (endpoint: string, data?: any) => Promise<any>;
  delete: (endpoint: string) => Promise<any>;
  subscribe: (event: string, callback: (...args: unknown[]) => unknown) => void;
  unsubscribe: (event: string, callback: (...args: unknown[]) => unknown) => void;
}

export interface PluginUIContext {
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  showModal: (content: PluginUIComponent) => Promise<any>;
  showSidebar: (content: PluginUIComponent) => void;
  addMenuItem: (item: PluginMenuItem) => void;
  addToolbarButton: (button: PluginToolbarButton) => void;
  renderComponent: (component: PluginUIComponent, container: string) => void;
}

export interface PluginStorageContext {
  get: (key: string) => Promise<any>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  keys: () => Promise<string[]>;
}

export interface PluginLoggerContext {
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, error?: Error) => void;
}

export interface PluginUIComponent {
  type: 'modal' | 'sidebar' | 'widget' | 'form' | 'chart';
  props: Record<string, any>;
  children?: PluginUIComponent[];
}

export interface PluginMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: string;
  submenu?: PluginMenuItem[];
}

export interface PluginToolbarButton {
  id: string;
  label: string;
  icon: string;
  action: string;
  tooltip?: string;
}

// Webhook system types
export interface WebhookConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  events: WebhookEvent[];
  filters?: WebhookFilter[];
  auth?: WebhookAuth;
  retryPolicy: WebhookRetryPolicy;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookEvent {
  type: string;
  description: string;
  payload: Record<string, any>;
}

export interface WebhookFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: unknown;
}

export interface WebhookAuth {
  type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2';
  credentials: Record<string, string>;
}

export interface WebhookRetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

export interface WebhookExecution {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  lastAttemptAt: Date;
  nextRetryAt?: Date;
  response?: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
  error?: string;
  executedAt: Date;
}

// External integration types
export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'slack' | 'telegram' | 'discord' | 'sms' | 'email' | 'webhook' | 'api';
  enabled: boolean;
  credentials: Record<string, any>;
  settings: IntegrationSettings;
  lastSync?: Date;
  status: 'connected' | 'disconnected' | 'error';
}

export interface IntegrationSettings {
  channels?: string[];
  templates?: Record<string, string>;
  filters?: IntegrationFilter[];
  schedule?: IntegrationSchedule;
  formatting?: IntegrationFormatting;
}

export interface IntegrationFilter {
  event: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
}

export interface IntegrationSchedule {
  type: 'immediate' | 'delayed' | 'scheduled' | 'batched';
  delay?: number; // minutes
  cron?: string;
  batchSize?: number;
}

export interface IntegrationFormatting {
  includeTimestamp: boolean;
  includeUser: boolean;
  customFields?: Record<string, string>;
  template?: string;
}

// API definitions
export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: APIParameter[];
  requestBody?: APIRequestBody;
  responses: APIResponse[];
  authentication: APIAuthentication;
  rateLimit?: APIRateLimit;
  deprecated?: boolean;
  version: string;
}

export interface APIParameter {
  name: string;
  in: 'query' | 'path' | 'header';
  type: string;
  required: boolean;
  description: string;
  example?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface APIRequestBody {
  contentType: string;
  schema: APISchema;
  examples?: Record<string, any>;
}

export interface APIResponse {
  status: number;
  description: string;
  schema?: APISchema;
  examples?: Record<string, any>;
}

export interface APISchema {
  type: string;
  properties?: Record<string, APISchema>;
  items?: APISchema;
  required?: string[];
  additionalProperties?: boolean;
}

export interface APIAuthentication {
  type: 'none' | 'api_key' | 'bearer' | 'oauth2' | 'basic';
  location?: 'header' | 'query' | 'cookie';
  name?: string;
  scheme?: string;
  flows?: APIAuthFlow[];
}

export interface APIAuthFlow {
  type: 'authorization_code' | 'client_credentials' | 'password' | 'implicit';
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: Record<string, string>;
}

export interface APIRateLimit {
  requests: number;
  period: 'second' | 'minute' | 'hour' | 'day';
  burst?: number;
}

// Event types for extensibility
export type ExtensibilityEvent =
  | { type: 'PLUGIN_INSTALLED'; payload: { pluginId: string; userId: string } }
  | { type: 'PLUGIN_ACTIVATED'; payload: { pluginId: string; userId: string } }
  | { type: 'PLUGIN_ERROR'; payload: { pluginId: string; error: string } }
  | { type: 'WEBHOOK_EXECUTED'; payload: { webhookId: string; status: string } }
  | { type: 'INTEGRATION_CONNECTED'; payload: { integrationType: string; userId: string } }
  | { type: 'API_RATE_LIMIT_EXCEEDED'; payload: { userId: string; endpoint: string } };

// Plugin marketplace types
export interface PluginListing {
  id: string;
  manifest: PluginManifest;
  pricing: PluginPricing;
  stats: PluginMarketplaceStats;
  reviews: PluginReview[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  featured: boolean;
  tags: string[];
}

export interface PluginPricing {
  type: 'free' | 'one_time' | 'subscription';
  price?: number;
  monthlyPrice?: number;
  currency: string;
  trial?: {
    duration: number;
    features: string[];
  };
}

export interface PluginMarketplaceStats {
  downloads: number;
  activeInstalls: number;
  rating: number;
  reviews: number;
  lastUpdated: Date;
}

export interface PluginReview {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: Date;
} 