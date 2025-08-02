
"use client";

import React from 'react';
import { Area, AreaChart, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ClimateChartTooltip from './climate-chart-tooltip';

export interface FutureClimateData {
    year: string;
    value: number;
    trend: number;
}

interface FutureClimateChartProps {
    data: FutureClimateData[];
    yAxisLabel: string;
    valueKey: keyof FutureClimateData;
    trendKey: keyof FutureClimateData;
    valueName: string;
    trendName: string;
    valueColor: string;
    trendColor: string;
}

export default function FutureClimateChart({ 
    data, 
    yAxisLabel, 
    valueKey, 
    trendKey,
    valueName,
    trendName,
    valueColor,
    trendColor
}: FutureClimateChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8}
            interval={5}
        />
        <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' } }}
        />
        <Tooltip 
            content={<ClimateChartTooltip 
                valueName={valueName} 
                trendName={trendName} 
            />}
            cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1 }}
        />
        <Area 
            type="monotone" 
            dataKey={valueKey} 
            stroke={valueColor}
            fill={valueColor} 
            fillOpacity={0.3}
            strokeWidth={2}
            name={valueName}
        />
        <Line 
            type="monotone" 
            dataKey={trendKey} 
            stroke={trendColor}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name={trendName}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
