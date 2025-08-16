
"use client";

import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { FutureClimateData } from '../stats-panel';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface TesteChartProps {
    data: FutureClimateData[];
}

export default function TesteChart({ data }: TesteChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        if (chartComponentRef.current) {
            chartComponentRef.current.chart.reflow();
        }
    }, [data]);

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            type: 'spline'
        },
        title: {
            text: 'Teste Chart',
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
            categories: data.map(d => d.year),
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
                format: `{value}°`,
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
           enabled: true
        },
        series: [{
            name: "Temperatura",
            type: 'spline',
            data: data.map(d => d.value),
            color: 'hsl(var(--chart-1))',
        },
        {
            name: 'Tendência',
            type: 'spline',
            data: data.map(d => d.trend),
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
             {data && data.length > 0 ? (
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                    containerProps={{ style: { height: "100%", width: "100%" } }}
                />
             ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Nenhum dado disponível para exibir.
                </div>
             )}
        </div>
    );
}
