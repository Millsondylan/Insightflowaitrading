// InsightFlow API Definitions
// REST/GraphQL endpoint specifications and SDK

import { APIEndpoint, APIParameter, ExtensibilityEvent } from './types';

export class InsightFlowAPI {
  private baseUrl: string;
  private apiKey?: string;
  private version: string;

  constructor(config: {
    baseUrl?: string;
    apiKey?: string;
    version?: string;
  } = {}) {
    this.baseUrl = config.baseUrl || 'https://api.insightflow.ai';
    this.apiKey = config.apiKey;
    this.version = config.version || 'v1';
  }

  /**
   * Trading Data Endpoints
   * TODO: implement complete trading data API
   */
  async getTradingData(params: {
    symbol?: string;
    timeframe?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<any[]> {
    const endpoint = this.buildEndpoint('/trading/data', params);
    return this.request('GET', endpoint);
  }

  async getAccountInfo(): Promise<any> {
    const endpoint = this.buildEndpoint('/account/info');
    return this.request('GET', endpoint);
  }

  async getPositions(): Promise<any[]> {
    const endpoint = this.buildEndpoint('/trading/positions');
    return this.request('GET', endpoint);
  }

  async createOrder(order: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint('/trading/orders');
    return this.request('POST', endpoint, order);
  }

  /**
   * Strategy Endpoints
   * TODO: implement strategy management API
   */
  async getStrategies(params?: {
    category?: string;
    userId?: string;
    public?: boolean;
  }): Promise<any[]> {
    const endpoint = this.buildEndpoint('/strategies', params);
    return this.request('GET', endpoint);
  }

  async createStrategy(strategy: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint('/strategies');
    return this.request('POST', endpoint, strategy);
  }

  async updateStrategy(strategyId: string, updates: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint(`/strategies/${strategyId}`);
    return this.request('PUT', endpoint, updates);
  }

  async deleteStrategy(strategyId: string): Promise<void> {
    const endpoint = this.buildEndpoint(`/strategies/${strategyId}`);
    return this.request('DELETE', endpoint);
  }

  /**
   * Backtest Endpoints
   * TODO: implement backtesting API
   */
  async runBacktest(config: unknown): Promise<any> {
    const endpoint = this.buildEndpoint('/backtest/run');
    return this.request('POST', endpoint, config);
  }

  async getBacktestResults(backtestId: string): Promise<any> {
    const endpoint = this.buildEndpoint(`/backtest/${backtestId}/results`);
    return this.request('GET', endpoint);
  }

  /**
   * Journal Endpoints
   * TODO: implement journal API
   */
  async getJournalEntries(params?: {
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
  }): Promise<any[]> {
    const endpoint = this.buildEndpoint('/journal/entries', params);
    return this.request('GET', endpoint);
  }

  async createJournalEntry(entry: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint('/journal/entries');
    return this.request('POST', endpoint, entry);
  }

  /**
   * Analytics Endpoints
   * TODO: implement analytics API
   */
  async getPerformanceMetrics(params?: {
    timeframe?: string;
    symbols?: string[];
  }): Promise<any> {
    const endpoint = this.buildEndpoint('/analytics/performance', params);
    return this.request('GET', endpoint);
  }

  async getCorrelationMatrix(symbols: string[]): Promise<any> {
    const endpoint = this.buildEndpoint('/analytics/correlation');
    return this.request('POST', endpoint, { symbols });
  }

  /**
   * Market Data Endpoints
   * TODO: implement market data API
   */
  async getMarketData(params: {
    symbol: string;
    interval?: string;
    limit?: number;
  }): Promise<any[]> {
    const endpoint = this.buildEndpoint('/market/data', params);
    return this.request('GET', endpoint);
  }

  async getSymbols(exchange?: string): Promise<string[]> {
    const endpoint = this.buildEndpoint('/market/symbols', { exchange });
    return this.request('GET', endpoint);
  }

  /**
   * Social Features Endpoints
   * TODO: implement social API
   */
  async getCommunityPosts(params?: {
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const endpoint = this.buildEndpoint('/community/posts', params);
    return this.request('GET', endpoint);
  }

  async createCommunityPost(post: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint('/community/posts');
    return this.request('POST', endpoint, post);
  }

  async getLeaderboard(type: string): Promise<any[]> {
    const endpoint = this.buildEndpoint(`/social/leaderboard/${type}`);
    return this.request('GET', endpoint);
  }

  /**
   * Webhook Management Endpoints
   * TODO: implement webhook management API
   */
  async getWebhooks(): Promise<any[]> {
    const endpoint = this.buildEndpoint('/webhooks');
    return this.request('GET', endpoint);
  }

  async createWebhook(webhook: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint('/webhooks');
    return this.request('POST', endpoint, webhook);
  }

  async updateWebhook(webhookId: string, updates: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any): Promise<any> {
    const endpoint = this.buildEndpoint(`/webhooks/${webhookId}`);
    return this.request('PUT', endpoint, updates);
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    const endpoint = this.buildEndpoint(`/webhooks/${webhookId}`);
    return this.request('DELETE', endpoint);
  }

  /**
   * Private helper methods
   */
  private buildEndpoint(path: string, params?: any): string {
    let url = `${this.baseUrl}/${this.version}${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    
    return url;
  }

  private async request(method: string, url: string, data?: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'InsightFlow-SDK/1.0.0',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// GraphQL API client
export class InsightFlowGraphQLAPI {
  private endpoint: string;
  private apiKey?: string;

  constructor(config: {
    endpoint?: string;
    apiKey?: string;
  } = {}) {
    this.endpoint = config.endpoint || 'https://api.insightflow.ai/graphql';
    this.apiKey = config.apiKey;
  }

  /**
   * Execute GraphQL query
   * TODO: implement GraphQL query execution
   */
  async query(query: string, variables?: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors.map((e: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any) => e.message).join(', ')}`);
    }

    return result.data;
  }

  /**
   * Predefined GraphQL queries
   * TODO: add more comprehensive GraphQL schema
   */
  async getTradingData(params: {
    symbol: string;
    timeframe: string;
    limit?: number;
  }): Promise<any> {
    const query = `
      query GetTradingData($symbol: String!, $timeframe: String!, $limit: Int) {
        tradingData(symbol: $symbol, timeframe: $timeframe, limit: $limit) {
          timestamp
          open
          high
          low
          close
          volume
        }
      }
    `;

    return this.query(query, params);
  }

  async getStrategies(userId?: string): Promise<any> {
    const query = `
      query GetStrategies($userId: ID) {
        strategies(userId: $userId) {
          id
          name
          description
          performance {
            totalReturn
            sharpeRatio
            maxDrawdown
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.query(query, { userId });
  }
}

// API endpoint definitions
export const API_ENDPOINTS: APIEndpoint[] = [
  {
    path: '/trading/data',
    method: 'GET',
    description: 'Get historical trading data',
    parameters: [
      {
        name: 'symbol',
        in: 'query',
        type: 'string',
        required: true,
        description: 'Trading symbol (e.g., EURUSD)',
        example: 'EURUSD',
      },
      {
        name: 'timeframe',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Timeframe for data (1m, 5m, 1h, 1d)',
        example: '1h',
      },
      {
        name: 'limit',
        in: 'query',
        type: 'integer',
        required: false,
        description: 'Maximum number of data points',
        example: 1000,
        validation: { min: 1, max: 10000 },
      },
    ],
    responses: [
      {
        status: 200,
        description: 'Successfully retrieved trading data',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              timestamp: { type: 'string' },
              open: { type: 'number' },
              high: { type: 'number' },
              low: { type: 'number' },
              close: { type: 'number' },
              volume: { type: 'number' },
            },
            required: ['timestamp', 'open', 'high', 'low', 'close'],
          },
        },
      },
      {
        status: 400,
        description: 'Invalid parameters',
      },
      {
        status: 401,
        description: 'Unauthorized',
      },
    ],
    authentication: {
      type: 'bearer',
      name: 'Authorization',
    },
    rateLimit: {
      requests: 1000,
      period: 'hour',
    },
    version: 'v1',
  },
  // TODO: Add more endpoint definitions
];

// Utility functions
export const createInsightFlowAPI = (config?: {
  baseUrl?: string;
  apiKey?: string;
  version?: string;
}): InsightFlowAPI => {
  return new InsightFlowAPI(config);
};

export const createGraphQLAPI = (config?: {
  endpoint?: string;
  apiKey?: string;
}): InsightFlowGraphQLAPI => {
  return new InsightFlowGraphQLAPI(config);
};

// API configuration constants
export const API_CONFIG = {
  baseUrl: 'https://api.insightflow.ai',
  version: 'v1',
  timeout: 30000,
  retries: 3,
  rateLimit: {
    requests: 1000,
    period: 'hour',
    burst: 50,
  },
  endpoints: {
    trading: '/trading',
    strategies: '/strategies',
    backtest: '/backtest',
    journal: '/journal',
    analytics: '/analytics',
    market: '/market',
    community: '/community',
    social: '/social',
    webhooks: '/webhooks',
    admin: '/admin',
  },
} as const; 