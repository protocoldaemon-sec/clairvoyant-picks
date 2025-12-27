import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';

interface CryptoChartProps {
  symbol: string;
  className?: string;
}

export default function CryptoChart({ symbol, className }: CryptoChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  const [interval, setInterval] = useState('1h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: isDark ? '#1e293b' : '#f8fafc' },
        textColor: isDark ? '#94a3b8' : '#64748b',
      },
      grid: {
        vertLines: { color: isDark ? '#334155' : '#e2e8f0' },
        horzLines: { color: isDark ? '#334155' : '#e2e8f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // v5 API: use addSeries with CandlestickSeries
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    chartRef.current = chart;
    seriesRef.current = series as any;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight || 300,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, []);

  // Load chart data
  useEffect(() => {
    const loadChartData = async () => {
      if (!seriesRef.current) return;
      
      setIsLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_URL}/crypto/${symbol}/chart?interval=${interval}&limit=100`);
        if (!res.ok) throw new Error('Failed to load chart');

        const data = await res.json();
        const candles = data.candles || [];
        
        if (candles.length === 0) {
          setError('No data available');
          return;
        }

        const candleData: CandlestickData<Time>[] = candles.map((c: any) => ({
          time: Math.floor(new Date(c.timestamp).getTime() / 1000) as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        seriesRef.current.setData(candleData);
        chartRef.current?.timeScale().fitContent();
      } catch (e: any) {
        setError(e.message || 'Failed to load chart');
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [symbol, interval]);

  // Update chart colors on theme change
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!chartRef.current) return;
      
      const isDark = document.documentElement.classList.contains('dark');
      chartRef.current.applyOptions({
        layout: {
          background: { color: isDark ? '#1e293b' : '#f8fafc' },
          textColor: isDark ? '#94a3b8' : '#64748b',
        },
        grid: {
          vertLines: { color: isDark ? '#334155' : '#e2e8f0' },
          horzLines: { color: isDark ? '#334155' : '#e2e8f0' },
        },
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const intervals = ['1h', '4h', '1d'];

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Header with title and interval buttons */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Price Chart</h3>
        <div className="flex gap-1">
          {intervals.map((tf) => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors',
                interval === tf
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative flex-1 min-h-[300px] bg-muted/20 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
