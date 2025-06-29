// Plugin SDK
// TypeScript interfaces and plugin loader system

import { 
  PluginManifest, 
  PluginInstance, 
  PluginContext,
  PluginUIComponent,
  ExtensibilityEvent 
} from './types';

export abstract class InsightFlowPlugin {
  protected context: PluginContext;
  public manifest: PluginManifest;

  constructor(context: PluginContext, manifest: PluginManifest) {
    this.context = context;
    this.manifest = manifest;
  }

  /**
   * Plugin lifecycle methods
   */
  abstract onActivate(): Promise<void>;
  abstract onDeactivate(): Promise<void>;
  
  /**
   * Optional lifecycle methods
   */
  onInstall?(): Promise<void>;
  onUninstall?(): Promise<void>;
  onUpdate?(previousVersion: string): Promise<void>;
  onConfigurationChange?(config: Record<string, any>): Promise<void>;

  /**
   * Hook registration methods
   * TODO: implement dynamic hook registration
   */
  protected registerActionHook(name: string, callback: (...args: unknown[]) => unknown): void {
    // TODO: implement action hook registration
    console.log(`Registering action hook: ${name}`);
  }

  protected registerFilterHook(name: string, callback: (...args: unknown[]) => unknown): void {
    // TODO: implement filter hook registration
    console.log(`Registering filter hook: ${name}`);
  }

  protected registerEventHook(name: string, callback: (...args: unknown[]) => unknown): void {
    // TODO: implement event hook registration
    console.log(`Registering event hook: ${name}`);
  }

  /**
   * Utility methods for plugin development
   */
  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    this.context.logger[level](`[${this.manifest.name}] ${message}`, data);
  }

  protected async getConfig<T = any></T>(key?: string): Promise<T></T> {
    const instance = await this.getPluginInstance();
    if (key) {
      return instance.configuration[key];
    }
    return instance.configuration as T;
  }

  protected async setConfig(key: string, value: unknown): Promise<void> {
    const instance = await this.getPluginInstance();
    instance.configuration[key] = value;
    // TODO: persist configuration changes
  }

  protected async getPluginInstance(): Promise<pluginInstance> {
    // TODO: implement plugin instance retrieval
    throw new Error('Plugin instance retrieval not implemented');
  }

  protected showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void {
    this.context.ui.showNotification(`[${this.manifest.name}] ${message}`, type);
  }

  protected async showModal(component: PluginUIComponent): Promise<any> {
    return this.context.ui.showModal(component);
  }

  protected addMenuItem(label: string, action: string, icon?: string): void {
    this.context.ui.addMenuItem({
      id: `${this.manifest.id}_${action}`,
      label,
      icon,
      action,
    });
  }

  protected addToolbarButton(label: string, action: string, icon: string, tooltip?: string): void {
    this.context.ui.addToolbarButton({
      id: `${this.manifest.id}_${action}`,
      label,
      icon,
      action,
      tooltip,
    });
  }
}

export class PluginLoader {
  private loadedPlugins: Map<string, InsightFlowPlugin> = new Map();
  private eventCallback?: (event: ExtensibilityEvent) => void;

  constructor() {
    this.initializeLoader();
  }

  /**
   * Initialize plugin loader
   * TODO: implement plugin directory scanning
   */
  private initializeLoader(): void {
    // TODO: scan for available plugins
    // TODO: validate plugin manifests
    // TODO: check dependencies
  }

  /**
   * Load and activate a plugin
   * TODO: implement secure plugin loading
   * TODO: add plugin sandboxing
   */
  async loadPlugin(manifest: PluginManifest, context: PluginContext): Promise<void> {
    try {
      this.log('info', `Loading plugin: ${manifest.name} v${manifest.version}`);

      // Validate plugin manifest
      this.validateManifest(manifest);

      // Check permissions
      this.checkPermissions(manifest, context);

      // Load plugin code
      const PluginClass = await this.loadPluginCode(manifest);
      
      // Create plugin instance
      const plugin = new PluginClass(context, manifest);

      // Run installation if first time
      if (plugin.onInstall && !await this.isPluginInstalled(manifest.id)) {
        await plugin.onInstall();
        await this.markPluginInstalled(manifest.id);
      }

      // Activate plugin
      await plugin.onActivate();

      // Store loaded plugin
      this.loadedPlugins.set(manifest.id, plugin);

      this.emitEvent({
        type: 'PLUGIN_ACTIVATED',
        payload: { pluginId: manifest.id, userId: context.user.id },
      });

      this.log('info', `Plugin loaded successfully: ${manifest.name}`);
    } catch (error) {
      this.log('error', `Failed to load plugin: ${manifest.name}`, error);
      
      this.emitEvent({
        type: 'PLUGIN_ERROR',
        payload: { pluginId: manifest.id, error: String(error) },
      });
      
      throw error;
    }
  }

  /**
   * Unload and deactivate a plugin
   * TODO: implement clean plugin unloading
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin not loaded: ${pluginId}`);
    }

    try {
      await plugin.onDeactivate();
      this.loadedPlugins.delete(pluginId);
      this.log('info', `Plugin unloaded: ${pluginId}`);
    } catch (error) {
      this.log('error', `Failed to unload plugin: ${pluginId}`, error);
      throw error;
    }
  }

  /**
   * Update a plugin to new version
   * TODO: implement plugin update mechanism
   */
  async updatePlugin(pluginId: string, newManifest: PluginManifest, context: PluginContext): Promise<void> {
    const oldPlugin = this.loadedPlugins.get(pluginId);
    const oldVersion = oldPlugin?.manifest.version;

    // Unload old version
    if (oldPlugin) {
      await this.unloadPlugin(pluginId);
    }

    // Load new version
    await this.loadPlugin(newManifest, context);

    // Run update hook if available
    const newPlugin = this.loadedPlugins.get(pluginId);
    if (newPlugin && newPlugin.onUpdate && oldVersion) {
      await newPlugin.onUpdate(oldVersion);
    }

    this.log('info', `Plugin updated: ${pluginId} from ${oldVersion} to ${newManifest.version}`);
  }

  /**
   * Get loaded plugin instance
   */
  getPlugin(pluginId: string): InsightFlowPlugin | undefined {
    return this.loadedPlugins.get(pluginId);
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): Map<string, InsightFlowPlugin> {
    return new Map(this.loadedPlugins);
  }

  /**
   * Execute plugin hook
   * TODO: implement hook execution system
   */
  async executeHook(hookName: string, ...args: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any[]): Promise<any> {
    // TODO: find plugins that register this hook
    // TODO: execute hooks in correct order
    // TODO: handle hook return values
    console.log(`Executing hook: ${hookName}`, args);
  }

  /**
   * Private helper methods
   */
  private validateManifest(manifest: PluginManifest): void {
    if (!manifest.id || !manifest.name || !manifest.version) {
      throw new Error('Invalid plugin manifest: missing required fields');
    }

    if (!this.isValidSemVer(manifest.version)) {
      throw new Error('Invalid plugin version: must follow semantic versioning');
    }

    // TODO: add more validation rules
  }

  private checkPermissions(manifest: PluginManifest, context: PluginContext): void {
    // TODO: implement permission checking
    // TODO: check user permissions against plugin requirements
    // TODO: validate API access permissions
    console.log('Checking permissions for plugin:', manifest.name);
  }

  private async loadPluginCode(manifest: PluginManifest): Promise<new (context: PluginContext, manifest: PluginManifest) => InsightFlowPlugin> {
    // TODO: implement secure code loading
    // TODO: use dynamic imports or eval with sandboxing
    // TODO: validate plugin code signature
    
    // Placeholder for plugin code loading - return a mock plugin class for now
    class MockPlugin extends InsightFlowPlugin {
      async onActivate(): Promise<void> {
        this.log('info', 'Mock plugin activated');
      }
      async onDeactivate(): Promise<void> {
        this.log('info', 'Mock plugin deactivated');
      }
    }
    
    return MockPlugin;
  }

  private async isPluginInstalled(pluginId: string): Promise<boolean> {
    // TODO: check plugin installation status from database
    return false;
  }

  private async markPluginInstalled(pluginId: string): Promise<void> {
    // TODO: mark plugin as installed in database
    console.log('Marking plugin as installed:', pluginId);
  }

  private isValidSemVer(version: string): boolean {
    const semVerRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semVerRegex.test(version);
  }

  private log(level: 'info' | 'error', message: string, data?: any): void {
    console[level](`[PluginLoader] ${message}`, data);
  }

  /**
   * Set event callback
   */
  setEventCallback(callback: (event: ExtensibilityEvent) => void): void {
    this.eventCallback = callback;
  }

  /**
   * Emit extensibility event
   */
  private emitEvent(event: ExtensibilityEvent): void {
    if (this.eventCallback) {
      this.eventCallback(event);
    }
  }
}

// Plugin development utilities
export class PluginDevelopmentKit {
  /**
   * Create plugin manifest template
   * TODO: add interactive manifest builder
   */
  static createManifestTemplate(name: string, author: string): PluginManifest {
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      version: '1.0.0',
      description: `${name} plugin for Insight Flow`,
      author,
      license: 'MIT',
      permissions: [
        {
          type: 'api_access',
          scope: 'read',
          description: 'Read access to trading data',
          required: true,
        },
      ],
      hooks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Validate plugin code
   * TODO: implement code validation and linting
   */
  static validatePluginCode(code: string): { valid: boolean; errors: string[] } {
    // TODO: implement TypeScript compilation check
    // TODO: validate against plugin interface
    // TODO: check for security issues
    return { valid: true, errors: [] };
  }

  /**
   * Generate plugin boilerplate
   * TODO: add code generation utilities
   */
  static generatePluginBoilerplate(manifest: PluginManifest): string {
    return `
import { InsightFlowPlugin, PluginContext, PluginManifest } from '@insightflow/plugin-sdk';

export default class ${manifest.name.replace(/\s+/g, '')}Plugin extends InsightFlowPlugin {
  async onActivate(): Promise<void> {
    this.log('info', 'Plugin activated');
    
    // TODO: implement plugin activation logic
  }

  async onDeactivate(): Promise<void> {
    this.log('info', 'Plugin deactivated');
    
    // TODO: implement plugin deactivation logic
  }
}
    `.trim();
  }
}

// Utility functions
export const createPluginLoader = (): PluginLoader => {
  return new PluginLoader();
};

export const createPluginContext = (
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, 
  platform: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, 
  api: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, 
  ui: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, 
  storage: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any, 
  logger: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any
): PluginContext => {
  return {
    user,
    platform,
    api,
    ui,
    storage,
    logger,
  };
};

// TODO: Add plugin marketplace integration
export const PLUGIN_MARKETPLACE_CONFIG = {
  url: 'https://marketplace.insightflow.ai',
  apiVersion: 'v1',
  categories: [
    'indicators',
    'strategies',
    'notifications',
    'integrations',
    'utilities',
    'ui-enhancements',
  ],
  verification: {
    requireCodeSigning: true,
    allowedDomains: ['insightflow.ai', 'github.com'],
    maxFileSize: '10MB',
  },
} as const; 