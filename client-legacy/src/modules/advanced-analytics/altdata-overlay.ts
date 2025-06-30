import { AltDataOverlay } from './types';

export class AltDataOverlayService {
  static async getOverlay(symbol: string, dataType: string): Promise<AltDataOverlay> {
    // Mock implementation
    return {
      id: `alt-${symbol}-${dataType}`,
      dataType,
      values: Array.from({ length: 100 }, () => Math.random() * 100),
      timestamps: Array.from({ length: 100 }, (_, i) => new Date(Date.now() - i * 86400000).toISOString())
    };
  }
}

export * from './types'; 