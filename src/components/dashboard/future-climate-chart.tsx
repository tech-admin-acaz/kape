
"use client";

import React, { useRef, useEffect } from 'react';
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
    tickAmount?: number;
}

export default function FutureClimateChart({ 
    data, 
    yAxisLabel,
    valueName,
    trendName,
    tickAmount
}: FutureClimateChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        if (chartComponentRef.current) {
            chartComponentRef.current.chart.reflow();
        }
    }, [data]);

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            type: 'line',
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
                },
                formatter: function () {
                    return this.value + '°';
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
        },
        series: [
            {
                type: 'line',
                name: valueName,
                data: data.map(d => d.value),
                color: 'hsl(var(--foreground))',
            },
            {
                type: 'line',
                name: trendName,
                data: data.map(d => d.trend),
                color: 'hsl(var(--destructive))',
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
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
            containerProps={{ style: { height: "100%", width: "100%" } }}
        />
    </div>
  );
}
