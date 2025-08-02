
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

interface FutureClimateComboChartProps {
    temperatureData: FutureClimateData[];
    precipitationData: FutureClimateData[];
}

export default function FutureClimateComboChart({ 
    temperatureData,
    precipitationData
}: FutureClimateComboChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        if (chartComponentRef.current) {
            chartComponentRef.current.chart.reflow();
        }
    }, [temperatureData, precipitationData]);

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            zoomType: 'xy',
        },
        title: {
            text: 'Tendências Climáticas Futuras',
            align: 'left',
            style: {
                color: 'hsl(var(--foreground))',
                fontWeight: 'bold'
            }
        },
        credits: {
            enabled: false
        },
        xAxis: [{
            categories: temperatureData.map(d => d.year),
            crosshair: true,
            labels: {
                style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            }
        }],
        yAxis: [{ // Primary yAxis for Precipitation
            labels: {
                format: '{value} mm',
                style: {
                    color: 'hsl(var(--chart-2))'
                }
            },
            title: {
                text: 'Precipitação Média Anual',
                style: {
                    color: 'hsl(var(--chart-2))'
                }
            },
            gridLineColor: 'hsl(var(--border))',
        }, { // Secondary yAxis for Temperature
            title: {
                text: 'Temperatura Média da Superfície',
                style: {
                    color: 'hsl(var(--destructive))'
                }
            },
            labels: {
                format: '{value}°C',
                style: {
                    color: 'hsl(var(--destructive))'
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true,
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            style: {
                color: 'hsl(var(--popover-foreground))',
            },
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: 'transparent',
            itemStyle: {
                color: 'hsl(var(--foreground))'
            },
            itemHoverStyle: {
                color: 'hsl(var(--primary))'
            }
        },
        series: [{
            name: 'Precipitação',
            type: 'column',
            yAxis: 0,
            data: precipitationData.map(d => d.value),
            color: 'hsl(var(--chart-2) / 0.7)',
            tooltip: {
                valueSuffix: ' mm'
            }
        }, {
            name: 'Temperatura',
            type: 'spline',
            yAxis: 1,
            data: temperatureData.map(d => d.value),
            color: 'hsl(var(--destructive))',
            tooltip: {
                valueSuffix: '°C'
            }
        }],
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
        <div className="w-full h-[400px]">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartComponentRef}
                containerProps={{ style: { height: "100%", width: "100%" } }}
            />
        </div>
    );
}
