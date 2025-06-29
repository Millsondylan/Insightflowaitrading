import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';

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

interface TradingViewLightWeightChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  overlays?: PriceOverlay[];
}

const TradingViewLightWeightChart = ({
  data,
  width,
  height = 300,
  overlays = [],
}: TradingViewLightWeightChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'candlestick'> | null>(null);

  // Chart initialization and data loading
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    }

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      width: width || chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.7)',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.4)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.4)',
      },
      crosshair: {
        mode: 0, // Normal crosshair mode
      },
    });

    // Create candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    // Set the data
    candleSeries.setData(data);

    // Store references
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Handle window resize
    function handleResize() {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: width || chartContainerRef.current.clientWidth,
        });
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height, width]);

  // Handle overlays separately
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current) return;
    
    // Remove all existing price lines (this is a simplified approach)
    // For a more sophisticated approach, you'd want to track created lines and update them
    const existingLines = chartRef.current.priceScale('right').priceRange();
    
    // Add new price lines for overlays
    overlays.forEach((overlay) => {
      if (overlay.type === 'price' && candleSeriesRef.current) {
        // Map line style
        let lineStyle: LineStyle = LineStyle.Solid;
        if (overlay.lineStyle === 'dashed') lineStyle = LineStyle.Dashed;
        if (overlay.lineStyle === 'dotted') lineStyle = LineStyle.Dotted;

        // Create the price line
        const priceLine = candleSeriesRef.current.createPriceLine({
          price: overlay.price,
          color: overlay.color,
          lineWidth: overlay.lineWidth,
          lineStyle,
          title: overlay.label || '',
        });
      }
    });
  }, [overlays]);

  return <Div ref={chartContainerRef} /></HTMLDivElement>;
};

export default TradingViewLightWeightChart;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

