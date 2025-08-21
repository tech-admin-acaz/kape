
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface LandCoverChartProps {
  id: string;
  type: TerritoryTypeKey;
}

interface ChartDataPoint {
  name: string;
  y: number;
  color: string;
}

const LandCoverChart: React.FC<LandCoverChartProps> = ({ id, type }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
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
      setChartData(null);
      
      try {
        const response = await fetch(`/api/stats/land-cover/${type}/${id}`);
        if (!response.ok) {
            console.error(`Error fetching land cover stats: ${response.statusText}`);
            setChartData([]);
            return;
        }
        
        const data = await response.json();
        setChartData(data);
        
      } catch (error) {
        console.error("Failed to fetch or process land cover stats:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  useEffect(() => {
    if (!chartComponentRef.current) return;

    const chart = chartComponentRef.current.chart;
    const container = chart.container.parentElement;

    const resizeObserver = new ResizeObserver(() => {
      if (chartComponentRef.current && chartComponentRef.current.chart) {
        chartComponentRef.current.chart.reflow();
      }
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [isLoading]);

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: ''
    },
    credits: {
        enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          distance: 20,
          style: {
            color: 'hsl(var(--foreground))',
            textOutline: 'none',
            fontWeight: 'normal',
          }
        },
        showInLegend: false
      }
    },
    series: [{
      type: 'pie',
      name: 'Uso da Terra',
      data: chartData,
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
                },
                y: 15
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
    tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        borderColor: 'hsl(var(--border))',
        style: {
            color: 'hsl(var(--popover-foreground))',
            fontWeight: 'normal'
        },
        formatter: function () {
            return `
                <div style="font-weight: bold; margin-bottom: 5px;">${this.point.name}</div>
                <div>Percentual de Area: ${this.percentage.toFixed(2)}%</div>
            `;
        }
    },
  };

  return (
    <div className="w-full h-80">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : chartData && chartData.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
          containerProps={{ style: { height: "99%", width: "100%" } }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Nenhum dado de uso e cobertura da terra disponível.
        </div>
      )}
    </div>
  );
};

export default LandCoverChart;
