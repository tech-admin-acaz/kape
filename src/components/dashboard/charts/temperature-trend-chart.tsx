
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line } from 'recharts';
import type { FutureClimateData } from '../stats-panel';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';
import type { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

if (typeof window !== 'undefined') {
  // Required for recharts Tooltip to work properly in Next.js
  const ev = new Event('resize');
  window.dispatchEvent(ev);
}

interface TemperatureTrendChartProps {
    id: string;
    type: TerritoryTypeKey;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover text-popover-foreground border rounded-md p-2 shadow-sm text-sm">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((p, index) => (
                    <div key={index} style={{ color: p.color || p.fill }}>
                        <span className="mr-2">●</span>
                        <span>{`${p.name}: `}</span>
                        <span className="font-bold">{`${Number(p.value).toFixed(2)} °C`}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};


export default function TemperatureTrendChart({ id, type }: TemperatureTrendChartProps) {
    const [chartData, setChartData] = useState<FutureClimateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        if (!id || !type) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            
            let apiTypePath = type;
            if (type === 'estado') {
                apiTypePath = 'estados';
            } else if (type === 'municipio') {
                apiTypePath = 'municipios';
            }
            
            const model = 'CESM2';
            const scenario = 'ssp245';
            const territoryId = id;

            const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;
            if (!API_BIO_URL) {
                console.error("API URL not configured");
                setIsLoading(false);
                return;
            }
            
            const apiPath = `${API_BIO_URL}/graph/tas/${apiTypePath}/${territoryId}/${model}/${scenario}`;

            try {
                const response = await fetch(apiPath);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error fetching temperature stats from external API (${apiPath}):`, response.status, errorText);
                    setChartData([]);
                    return;
                }
                
                const apiData = await response.json();
                
                const timeSeries = (Array.isArray(apiData) && Array.isArray(apiData[0])) ? apiData[0] : (Array.isArray(apiData) ? apiData : []);

                if (!Array.isArray(timeSeries) || timeSeries.length === 0) {
                    setChartData([]);
                    return;
                }

                const processedData = timeSeries.map((d: any) => ({
                    year: new Date(d.time).getFullYear().toString(),
                    value: parseFloat(d.value.toFixed(2))
                }));
                
                const calculateTrendLine = (data: { year: string; value: number }[]): number[] => {
                    const values = data.map(d => d.value);
                    const n = values.length;
                    if (n < 2) return values;

                    const sumX = values.reduce((acc, _, i) => acc + i, 0);
                    const sumY = values.reduce((acc, curr) => acc + curr, 0);
                    const sumXY = values.reduce((acc, curr, i) => acc + i * curr, 0);
                    const sumXX = values.reduce((acc, _, i) => acc + i * i, 0);

                    const denominator = n * sumXX - sumX * sumX;
                    if (denominator === 0) return values;

                    const slope = (n * sumXY - sumX * sumY) / denominator;
                    const intercept = (sumY - slope * sumX) / n;

                    return values.map((_, i) => parseFloat((slope * i + intercept).toFixed(2)));
                };
                const trendLine = calculateTrendLine(processedData);

                const finalData = processedData.map((d, index) => ({
                    year: d.year,
                    value: d.value,
                    trend: trendLine[index]
                }));

                setChartData(finalData);

            } catch (error) {
                console.error(`Error processing temperature stats from ${apiPath}:`, error);
                setChartData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, type]);

    return (
        <div className="w-full h-[320px]">
             {isLoading ? (
                <Skeleton className="w-full h-full" />
             ) : chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="year" 
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                            tickLine={{ stroke: 'hsl(var(--border))' }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                            interval={Math.floor(chartData.length / 5)}
                         />
                        <YAxis 
                            tickFormatter={(value) => `${value}°C`} 
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={{ stroke: 'hsl(var(--border))' }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                         />
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                        />
                        <Legend wrapperStyle={{fontSize: "12px", color: 'hsl(var(--foreground))'}} />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            name={t('temperatureSeriesName')} 
                            stroke="hsl(var(--chart-1))" 
                            dot={false}
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="trend" 
                            name={t('trendLineName')}
                            stroke="hsl(var(--destructive))" 
                            strokeDasharray="5 5" 
                            dot={false}
                            strokeWidth={2}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('noDataAvailable')}
                </div>
             )}
        </div>
    );
}
