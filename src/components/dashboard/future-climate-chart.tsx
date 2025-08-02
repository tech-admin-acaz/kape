
"use client";

import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

const WINDOW_SIZE = 15;

export interface FutureClimateData {
    year: string;
    value: number;
    trend: number;
}

interface FutureClimateChartProps {
    data: FutureClimateData[];
    yAxisLabel: string;
    valueName: string;
    trendName: string;
    valueColor: string;
    trendColor: string;
    tickAmount?: number;
}

export default function FutureClimateChart({ 
    data, 
    yAxisLabel,
    valueName,
    trendName,
    valueColor,
    trendColor,
    tickAmount
}: FutureClimateChartProps) {
    const [startIndex, setStartIndex] = useState(0);

    const visibleData = data.slice(startIndex, startIndex + WINDOW_SIZE);
    
    const handlePrev = () => {
        setStartIndex(prev => Math.max(0, prev - 1));
    }

    const handleNext = () => {
        setStartIndex(prev => Math.min(data.length - WINDOW_SIZE, prev + 1));
    }

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: visibleData.map(d => d.year),
            labels: {
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            },
            tickInterval: 2,
        },
        yAxis: {
            title: {
                text: yAxisLabel,
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            },
            labels: {
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            },
            gridLineColor: 'hsl(var(--border))',
            tickAmount: tickAmount,
        },
        tooltip: {
            shared: true,
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            style: {
                color: 'hsl(var(--popover-foreground))',
            },
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            },
            area: {
                fillOpacity: 0.3
            }
        },
        series: [
            {
                type: 'area',
                name: valueName,
                data: visibleData.map(d => d.value),
                color: valueColor,
                
            },
            {
                type: 'line',
                name: trendName,
                data: visibleData.map(d => d.trend),
                color: trendColor,
                dashStyle: 'Dash',
                lineWidth: 2,
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
    <div className="w-full h-80 relative">
        <div className='absolute top-2 right-12 z-10 flex gap-1'>
            <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handlePrev} 
                disabled={startIndex === 0}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleNext}
                disabled={startIndex >= data.length - WINDOW_SIZE}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: "100%", width: "100%" } }}
        />
    </div>
  );
}
