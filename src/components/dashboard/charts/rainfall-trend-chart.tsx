
"use client";

import React, { useRef, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { FutureClimateData } from '../stats-panel';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface RainfallTrendChartProps {
    id: string;
    type: TerritoryTypeKey;
}

export default function RainfallTrendChart({ id, type }: RainfallTrendChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<FutureClimateData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, locale } = useI18n();

    useEffect(() => {
        Highcharts.setOptions({
            lang: {
                viewFullscreen: t('viewFullscreen' as any),
                printChart: t('printChart' as any),
                downloadPNG: t('downloadPNG' as any),
                downloadJPEG: t('downloadJPEG' as any),
                downloadPDF: t('downloadPDF' as any),
                downloadSVG: t('downloadSVG' as any),
            }
        });
    }, [locale, t]);

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

    useEffect(() => {
        if (chartComponentRef.current && !isLoading) {
            chartComponentRef.current.chart.reflow();
        }
    }, [chartData, isLoading]);

    useEffect(() => {
      const container = chartContainerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver(() => {
        if (chartComponentRef.current) {
          chartComponentRef.current.chart.reflow();
        }
      });
      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }, []);

    const options: Highcharts.Options = {
        chart: {
            backgroundColor: 'transparent',
            type: 'spline',
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
                format: '{value} mm',
                style: {
                    color: 'hsl(var(--foreground))'
                }
            },
            title: {
                text: 'Chuva Média Anual (mm/ano)',
                style: {
                    color: 'hsl(var(--foreground))'
                }
            },
            gridLineColor: 'hsl(var(--border))',
            tickAmount: 5,
        },
        tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            style: {
                color: 'hsl(var(--popover-foreground))',
                fontWeight: 'normal'
            },
            formatter: function () {
                let points = this.points;
                if (!points) return '';

                let s = `<div style="font-weight: bold; margin-bottom: 5px;">${this.x}</div>`;
                points.forEach(point => {
                    s += `
                        <div style="display: flex; align-items: center;">
                            <span style="color:${point.color}; font-size: 1.5em; margin-right: 5px;">●</span>
                            <span>${point.series.name}: <b>${point.y?.toFixed(2)} mm</b></span>
                        </div>
                    `;
                });
                return s;
            }
        },
        legend: {
           enabled: true,
           itemStyle: {
                color: 'hsl(var(--foreground))',
                fontWeight: 'normal',
           },
           itemHoverStyle: {
               color: 'hsl(var(--primary))'
           }
        },
        series: [{
            name: "Precipitação",
            type: 'spline',
            data: chartData.map(d => d.value),
            color: 'hsl(var(--chart-2))',
        },
        {
            name: 'Linha de tendencia',
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
            },
            menuItemStyle: {
                fontFamily: 'Inter, sans-serif',
                color: 'hsl(var(--foreground))',
            },
            menuItemHoverStyle: {
                background: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
            }
        },
        navigation: {
            menuStyle: {
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            }
        },
    };

    return (
        <div ref={chartContainerRef} className="w-full h-[320px]">
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
                    Nenhum dado de precipitação disponível para exibir.
                </div>
             )}
        </div>
    );
}
