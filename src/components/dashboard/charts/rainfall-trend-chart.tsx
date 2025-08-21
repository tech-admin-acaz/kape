
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';
import type { FutureClimateData } from '../stats-panel';
import { useI18n } from '@/hooks/use-i18n';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface RainfallTrendChartProps {
  id: string;
  type: TerritoryTypeKey;
}

const RainfallTrendChart: React.FC<RainfallTrendChartProps> = ({ id, type }) => {
  const [chartData, setChartData] = useState<FutureClimateData[] | null>(null);
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
        const response = await fetch(`/api/stats/precipitation/${type}/${id}`);
        if (!response.ok) {
            console.error(`Error fetching precipitation stats: ${response.statusText}`);
            setChartData([]);
            return;
        }
        
        const data = await response.json();
        setChartData(data);
        
      } catch (error) {
        console.error("Failed to fetch or process precipitation stats:", error);
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
      type: 'spline',
      backgroundColor: 'transparent',
    },
    title: {
      text: ''
    },
    credits: {
        enabled: false
    },
    xAxis: {
      categories: chartData?.map(d => d.year),
      title: {
        text: '',
      },
       labels: {
        style: {
          color: 'hsl(var(--foreground))'
        }
      },
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))',
    },
    yAxis: {
      title: {
        text: t('rainfallUnit'),
        style: {
          color: 'hsl(var(--foreground))'
        }
      },
      gridLineColor: 'hsl(var(--border))',
       labels: {
        style: {
          color: 'hsl(var(--foreground))'
        }
      }
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: 'hsl(var(--foreground))',
      },
      itemHoverStyle: {
        color: 'hsl(var(--primary))',
      },
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: false
        }
      }
    },
    series: [
      {
        type: 'spline',
        name: t('rainfallSeriesName'),
        data: chartData?.map(d => d.value),
        color: 'hsl(var(--chart-2))',
      },
      {
        type: 'spline',
        name: t('trendLineName'),
        data: chartData?.map(d => d.trend),
        color: 'hsl(var(--destructive))',
        dashStyle: 'ShortDash',
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
              <div style="font-weight: bold; margin-bottom: 5px;">${this.x}</div>
              <div><span style="color:${this.series.color};">●</span> ${this.series.name}: ${this.y?.toFixed(2)} mm</div>
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
          {t('noDataAvailable')}
        </div>
      )}
    </div>
  );
};

export default RainfallTrendChart;
