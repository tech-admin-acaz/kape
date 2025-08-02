
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
    title: string;
    yAxisTitle: string;
    seriesName: string;
    seriesType: 'spline' | 'column';
    color: string;
    unit: string;
}

export default function FutureClimateChart({ 
    data,
    title,
    yAxisTitle,
    seriesName,
    seriesType,
    color,
    unit
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
            zoomType: 'x',
        },
        title: {
            text: title,
            align: 'left',
            style: {
                color: 'hsl(var(--foreground))',
                fontWeight: 'bold'
            }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: data.map(d => d.year),
            crosshair: true,
            labels: {
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            }
        },
        yAxis: { 
            labels: {
                format: `{value} ${unit}`,
                style: {
                    color: 'hsl(var(--foreground))'
                }
            },
            title: {
                text: yAxisTitle,
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
        },
        legend: {
           enabled: false
        },
        series: [{
            name: seriesName,
            type: seriesType,
            data: data.map(d => d.value),
            color: color,
            tooltip: {
                valueSuffix: ` ${unit}`
            }
        },
        {
            name: `${seriesName} Trend`,
            type: 'spline',
            data: data.map(d => d.trend),
            color: 'hsl(var(--destructive))',
            dashStyle: 'Dash',
            marker: {
                enabled: false
            },
            tooltip: {
                valueSuffix: ` ${unit}`
            }
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
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: { height: "100%", width: "100%" } }}
            />
        </div>
    );
}
