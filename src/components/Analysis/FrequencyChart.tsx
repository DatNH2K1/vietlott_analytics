import React, { useMemo, useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import type { FrequencyStat } from '../../types/lottery';

interface FrequencyChartProps {
  data: FrequencyStat[];
  color?: string;
  height?: number;
}

export const FrequencyChart: React.FC<FrequencyChartProps> = ({
  data,
  color = '#3b82f6',
  height = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.number.toString().padStart(2, '0'),
      count: item.count,
      percentage: item.percentage,
    }));
  }, [data]);

  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: number | null = null;
    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width: newWidth } = entries[0].contentRect;

      // Use numeric comparison to avoid micro-updates
      if (newWidth > 0 && Math.abs(newWidth - width) > 2) {
        if (timeoutId) window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setWidth(newWidth);
        }, 100);
      }
    });

    observer.observe(containerRef.current);

    // Initial measurement
    const initialWidth = containerRef.current.getBoundingClientRect().width;
    if (initialWidth > 0) setWidth(initialWidth);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} style={{ width: '100%', height, minHeight: height }}>
      {width > 0 && (
        <BarChart
          width={width}
          height={height}
          data={chartData}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.4)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: '#f8fafc',
              padding: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ color: '#f8fafc', fontSize: '13px' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              fill="rgba(255,255,255,0.6)"
              fontSize={10}
              offset={8}
            />
          </Bar>
        </BarChart>
      )}
    </div>
  );
};
