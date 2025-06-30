
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType } from 'lightweight-charts';

interface ChartData {
  time: string | number;
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
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

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
        background: { type: ColorType.Solid, color: 'transparent' },
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

    // Transform and set the data
    const transformedData = data.map(item => ({
      time: typeof item.time === 'string' ? item.time : item.time.toString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candleSeries.setData(transformedData);

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
    
    // Add new price lines for overlays
    overlays.forEach((overlay) => {
      if (overlay.type === 'price' && candleSeriesRef.current) {
        // Map line style
        let lineStyle = LineStyle.Solid;
        if (overlay.lineStyle === 'dashed') lineStyle = LineStyle.Dashed;
        if (overlay.lineStyle === 'dotted') lineStyle = LineStyle.Dotted;

        // Create the price line
        candleSeriesRef.current.createPriceLine({
          price: overlay.price,
          color: overlay.color,
          lineWidth: overlay.lineWidth as any,
          lineStyle,
          title: overlay.label || '',
        });
      }
    });
  }, [overlays]);

  return <div ref={chartContainerRef}/>;
};

export default TradingViewLightWeightChart;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
