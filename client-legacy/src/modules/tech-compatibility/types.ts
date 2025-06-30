// Tech Compatibility Module Types

export interface LovableConfig {
  editableComponents: boolean;
  visualEditing: boolean;
  supportsTailwind: boolean;
  [key: string]: any;
}

export interface SupabaseAdapterConfig {
  projectId: string;
  apiKey: string;
  authEnabled: boolean;
  edgeFunctions: boolean;
}

export interface GitSyncConfig {
  provider: 'github' | 'gitlab' | 'bitbucket';
  repo: string;
  branch: string;
  autoCommit: boolean;
}

export interface TechCompatibilityConfig {
  lovable: LovableConfig;
  supabase?: SupabaseAdapterConfig;
  gitSync?: GitSyncConfig;
}

export interface MigrationProgress {
  step: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  message?: string;
}

// Tech Compatibility module types
export interface PlatformCompatibility {
  platform: 'web' | 'mobile' | 'desktop';
  supported: boolean;
  features: string[];
  limitations: string[];
  version: string;
}

export interface IntegrationStatus {
  service: string;
  connected: boolean;
  lastSync?: string;
  error?: string;
  config: Record<string, any>;
}

export interface SystemRequirement {
  type: 'minimum' | 'recommended';
  os: string;
  memory: string;
  storage: string;
  network: string;
}
