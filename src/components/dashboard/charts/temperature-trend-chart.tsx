
"use client";

import React, { useRef, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { FutureClimateData } from '../stats-panel';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface TemperatureTrendChartProps {
    id: string;
    type: TerritoryTypeKey;
}

// Equivalent to the Angular version for calculating trend line
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


export default function TemperatureTrendChart({ id, type }: TemperatureTrendChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const [chartData, setChartData] = useState<FutureClimateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id || !type) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            
            const model = 'ipsl-cm6a-lr';
            const scenario = 'ssp585';
            
            let territoryId: string;
            let cityId: string;

            if (type === 'municipio') {
                territoryId = '0';
                cityId = id;
            } else {
                territoryId = id;
                cityId = '0';
            }

            const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;
            if (!API_BIO_URL) {
                console.error("API URL not configured");
                setIsLoading(false);
                return;
            }

            const apiPath = `${API_BIO_URL}/graph/tas/${territoryId}/${cityId}/${model}/${scenario}`;
            console.log(`Fetching temperature stats from: ${apiPath}`);

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

                const trendLine = calculateTrendLine(processedData);

                const finalData = processedData.map((d, index) => ({
                    year: d.year,
                    value: d.value,
                    trend: trendLine[index]
                }));

                console.log("Data processed for chart:", finalData);
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

    useEffect(() => {
        if (chartComponentRef.current && !isLoading) {
            chartComponentRef.current.chart.reflow();
        }
    }, [chartData, isLoading]);

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            type: 'spline',
            zoomType: 'x',
        },
        title: {
            text: 'Tendência de Temperatura da Superfície',
            align: 'left',
            style: {
                color: 'hsl(var(--foreground))',
                fontWeight: 'bold',
                fontSize: '14px'
            }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: chartData.map(d => d.year),
            crosshair: true,
            labels: {
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            },
            tickInterval: 2
        },
        yAxis: { 
            labels: {
                format: '{value}°',
                style: {
                    color: 'hsl(var(--foreground))'
                }
            },
            title: {
                text: 'Temperatura (°C)',
                style: {
                    color: 'hsl(var(--foreground))'
                }
            },
            gridLineColor: 'hsl(var(--border))',
            tickAmount: 5,
        },
        tooltip: {
            shared: true,
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            style: {
                color: 'hsl(var(--popover-foreground))',
            },
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f} °C</b><br/>'
        },
        legend: {
           enabled: false
        },
        series: [{
            name: "Temperatura",
            type: 'spline',
            data: chartData.map(d => d.value),
            color: 'hsl(var(--destructive))',
        },
        {
            name: 'Tendência',
            type: 'spline',
            data: chartData.map(d => d.trend),
            color: 'hsl(var(--destructive))',
            dashStyle: 'Dash',
            marker: {
                enabled: false
            },
        }
        ],
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    symbol: 'menu',
                    symbolStroke: 'hsl(var(--foreground))',
                    theme: {
                        fill: 'transparent',
                        states: {
                            hover: {
                                fill: 'hsl(var(--muted))',
                            },
                            select: {
                                fill: 'hsl(var(--muted))',
                            }
                        }
                    }
                }
            }
        },
    };

    return (
        <div className="w-full h-[320px]">
             {isLoading ? (
                <Skeleton className="w-full h-full" />
             ) : chartData && chartData.length > 0 ? (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                    containerProps={{ style: { height: "100%", width: "100%" } }}
                />
             ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Nenhum dado de temperatura disponível para exibir.
                </div>
             )}
        </div>
    );
}
