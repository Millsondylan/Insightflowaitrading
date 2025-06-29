import React, { useEffect, useRef } from 'react';

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface PriceOverlay {
  type: 'price';
  price: number;
  color: string;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  lineWidth: number;
  label?: string;
}

interface TradingViewChartSymbolProps {
  symbol: string;
  interval?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
  container?: string;
  withToolbar?: boolean;
  studies?: string[];
  data?: never;
  overlays?: never;
}

interface TradingViewChartDataProps {
  data: ChartData[];
  width?: number;
  height?: number;
  overlays?: PriceOverlay[];
  symbol?: never;
  interval?: never;
  theme?: never;
  container?: never;
  withToolbar?: never;
  studies?: never;
}

type TradingViewChartProps = TradingViewChartSymbolProps | TradingViewChartDataProps;

const TradingViewChart: React.FC<TradingViewChartProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if we're using symbol-based or data-based rendering
  const isSymbolBased = 'symbol' in props;

  useEffect(() => {
    if (isSymbolBased) {
      // Symbol-based rendering (TradingView widget)
      const { 
        symbol, 
        interval = '1D', 
        theme = 'dark', 
        container = 'tradingview-widget-container',
        withToolbar = true,
        studies = []
      } = props;

      // Clean up any existing widgets
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.TradingView !== 'undefined' && containerRef.current) {
          new window.TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: 'Etc/UTC',
            theme: theme,
            style: '1',
            locale: 'en',
            toolbar_bg: theme === 'dark' ? '#1E1E2D' : '#F1F3F6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: container,
            hide_top_toolbar: !withToolbar,
            studies: studies,
            save_image: false,
          });
        }
      };

      document.head.appendChild(script);

      return () => {
        // Clean up
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      // Data-based rendering (canvas)
      const { data, height = 300, overlays = [] } = props;

      if (!canvasRef.current || !data || data.length === 0) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas size
      canvas.width = props.width || canvas.clientWidth;
      canvas.height = height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(30, 30, 30, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Find min and max prices for scaling
      const prices = data.flatMap(candle => [candle.high, candle.low]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice;
      
      // Add a margin to price range
      const margin = priceRange * 0.1;
      const scaledMinPrice = minPrice - margin;
      const scaledMaxPrice = maxPrice + margin;
      const scaledPriceRange = scaledMaxPrice - scaledMinPrice;
      
      // Calculate scaling factors
      const horizontalScale = canvas.width / data.length;
      const verticalScale = canvas.height / scaledPriceRange;
      
      // Function to convert price to y-coordinate (inverted, as canvas y increases downwards)
      const priceToY = (price: number) => canvas.height - (price - scaledMinPrice) * verticalScale;
      
      // Draw each candle
      data.forEach((candle, i) => {
        const x = i * horizontalScale;
        const width = horizontalScale * 0.8;
        
        // Determine if candle is bullish (close > open) or bearish (close < open)
        const isBullish = candle.close >= candle.open;
        
        // Draw candle body
        ctx.fillStyle = isBullish ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        const bodyTop = priceToY(isBullish ? candle.close : candle.open);
        const bodyBottom = priceToY(isBullish ? candle.open : candle.close);
        const bodyHeight = Math.max(1, bodyBottom - bodyTop); // Ensure at least 1px height
        
        ctx.fillRect(x + width * 0.1, bodyTop, width, bodyHeight);
        
        // Draw wick (high to low)
        ctx.beginPath();
        ctx.strokeStyle = isBullish ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 1;
        
        // Upper wick
        const wickX = x + width / 2;
        ctx.moveTo(wickX, priceToY(candle.high));
        ctx.lineTo(wickX, bodyTop);
        
        // Lower wick
        ctx.moveTo(wickX, bodyBottom);
        ctx.lineTo(wickX, priceToY(candle.low));
        
        ctx.stroke();
      });
      
      // Draw overlays
      overlays.forEach(overlay => {
        if (overlay.type === 'price') {
          const y = priceToY(overlay.price);
          
          ctx.beginPath();
          ctx.strokeStyle = overlay.color;
          ctx.lineWidth = overlay.lineWidth;
          
          // Set line style
          if (overlay.lineStyle === 'dashed') {
            ctx.setLineDash([5, 3]);
          } else if (overlay.lineStyle === 'dotted') {
            ctx.setLineDash([1, 3]);
          } else {
            ctx.setLineDash([]);
          }
          
          // Draw horizontal line
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
          
          // Reset line dash
          ctx.setLineDash([]);
          
          // Draw label if provided
          if (overlay.label) {
            ctx.font = '10px Arial';
            ctx.fillStyle = overlay.color;
            ctx.fillText(overlay.label + ': ' + overlay.price.toFixed(2), 5, y - 3);
          }
        }
      });
    }
  }, [props, isSymbolBased]);

  if (isSymbolBased) {
    const { width = '100%', height = 500, container = 'tradingview-widget-container', theme = 'dark' } = props;
    return (
      <Div 
        ref={containerRef}
        id={container}
        style={{ 
          width, 
          height,
          backgroundColor: theme === 'dark' ? '#1E1E2D' : '#FFFFFF',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
    );
  } else {
    const { width, height = 300 } = props;
    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height }}
      />
    );
  }
};

// Add TradingView to window object
declare global {
  interface Window {
    TradingView: any;
  }
}

export default TradingViewChart;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 