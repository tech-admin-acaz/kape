
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line } from 'recharts';
import type { FutureClimateData } from '../stats-panel';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';
import type { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface RainfallTrendChartProps {
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
                        <span className="font-bold">{`${Number(p.value).toFixed(2)} mm`}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};


export default function RainfallTrendChart({ id, type }: RainfallTrendChartProps) {
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
            try {
                const response = await fetch(`/api/stats/precipitation/${type}/${id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error fetching precipitation stats from API:`, response.status, errorText);
                    setChartData([]);
                    return;
                }
                const apiData = await response.json();
                if (!apiData || apiData.length === 0) {
                  setChartData([]);
                  return;
                }
                setChartData(apiData);
            } catch (error) {
                console.error(`Error processing precipitation stats:`, error);
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
                            tickFormatter={(value) => `${value} mm`} 
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
                            name={t('rainfallSeriesName')} 
                            stroke="hsl(var(--chart-2))" 
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
