
"use client";

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}


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
}

export default function FutureClimateChart({ 
    data, 
    yAxisLabel,
    valueName,
    trendName,
    valueColor,
    trendColor
}: FutureClimateChartProps) {

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
            categories: data.map(d => d.year),
            labels: {
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            },
            tickInterval: 5,
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
            gridLineColor: 'hsl(var(--border))'
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
                data: data.map(d => d.value),
                color: valueColor,
                
            },
            {
                type: 'line',
                name: trendName,
                data: data.map(d => d.trend),
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
    <div className="w-full h-full">
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </div>
  );
}
