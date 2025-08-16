
"use client";

import React, { useRef, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { FutureClimateData } from '../stats-panel';
import { getTemperatureStats } from '@/services/map.service';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface TemperatureTrendChartProps {
    type: TerritoryTypeKey | undefined;
    id: string | undefined;
}

export default function TemperatureTrendChart({ type, id }: TemperatureTrendChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const [data, setData] = useState<FutureClimateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!type || !id) {
                setData([]);
                return;
            };

            setIsLoading(true);
            try {
                const stats = await getTemperatureStats(type, id, 'ipsl-cm6a-lr', 'ssp585');
                console.log("Dados de temperatura recebidos no componente do gráfico:", stats);
                setData(stats || []);
            } catch (error) {
                console.error("Erro ao buscar dados de temperatura no componente:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [type, id]);


    useEffect(() => {
        if (chartComponentRef.current) {
            chartComponentRef.current.chart.reflow();
        }
    }, [data]);

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
            data: data.map(d => d.value),
            color: 'hsl(var(--destructive))',
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
             {isLoading ? (
                <Skeleton className="h-full w-full" />
             ) : data && data.length > 0 ? (
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

    