import { BehaviorSubject } from 'rxjs';

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: number;
}

export class MobileMarketFeed {
  private socketConnection: WebSocket | null = null;
  private backgroundMode = false;
  private activeTickers = new Set<string>();
  
  // Observables for real-time data
  public tickerData$ = new BehaviorSubject<Record<string, TickerData>>({});
  
  constructor() {
    // Listen for app state changes to manage connection in background
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }
  
  private handleVisibilityChange = () => {
    this.backgroundMode = document.hidden;
      
    if (!document.hidden) {
      this.resumeFeeds();
    } else {
      this.pauseFeeds();
    }
  }
  
  public connect() {
    // Connect to WebSocket for real-time market data
    this.socketConnection = new WebSocket('wss://api.insightflow.ai/market-stream');
    
    this.socketConnection.onopen = () => {
      console.log('Market feed connected');
      this.subscribeToTickers();
    };
    
    this.socketConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.tickerData$.next({
        ...this.tickerData$.value,
        [data.symbol]: data
      });
    };
    
    this.socketConnection.onerror = (error) => {
      console.error('Market feed error:', error);
    };
    
    this.socketConnection.onclose = () => {
      console.log('Market feed disconnected');
      // Attempt reconnection
      setTimeout(() => this.connect(), 5000);
    };
  }
  
  public pauseFeeds() {
    if (this.socketConnection && this.socketConnection.readyState === WebSocket.OPEN) {
      console.log('Pausing market feed for background mode');
      this.socketConnection.send(JSON.stringify({ action: 'pause' }));
    }
  }
  
  public resumeFeeds() {
    if (this.socketConnection && this.socketConnection.readyState === WebSocket.OPEN) {
      console.log('Resuming market feed');
      this.subscribeToTickers();
    } else {
      this.connect();
    }
  }
  
  public subscribeTicker(symbol: string) {
    this.activeTickers.add(symbol);
    
    if (this.socketConnection && this.socketConnection.readyState === WebSocket.OPEN) {
      this.socketConnection.send(JSON.stringify({
        action: 'subscribe',
        symbol
      }));
    }
  }
  
  public unsubscribeTicker(symbol: string) {
    this.activeTickers.delete(symbol);
    
    if (this.socketConnection && this.socketConnection.readyState === WebSocket.OPEN) {
      this.socketConnection.send(JSON.stringify({
        action: 'unsubscribe',
        symbol
      }));
    }
  }
  
  private subscribeToTickers() {
    if (!this.socketConnection || this.socketConnection.readyState !== WebSocket.OPEN) {
      return;
    }
    
    // Resubscribe to all active tickers
    this.activeTickers.forEach(symbol => {
      this.socketConnection?.send(JSON.stringify({
        action: 'subscribe',
        symbol
      }));
    });
  }
  
  public disconnect() {
    if (this.socketConnection) {
      this.socketConnection.close();
      this.socketConnection = null;
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
} 