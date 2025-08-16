
"use client";

import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { FutureClimateData } from '../stats-panel';


if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface RainfallTrendChartProps {
    data: FutureClimateData[];
}

export default function RainfallTrendChart({ data }: RainfallTrendChartProps) {
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
            text: 'Tendência da Chuva Média Anual',
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
                format: '{value}mm',
                style: {
                    color: 'hsl(var(--foreground))'
                }
            },
            title: {
                text: 'Precipitação Média',
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
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f} mm</b><br/>'
        },
        legend: {
           enabled: false
        },
        series: [{
            name: "Precipitação",
            type: 'column',
            data: data.map(d => d.value),
            color: 'hsl(var(--chart-2))',
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
                    Nenhum dado de precipitação disponível para exibir.
                </div>
             )}
        </div>
    );
}
