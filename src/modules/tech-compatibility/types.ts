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
