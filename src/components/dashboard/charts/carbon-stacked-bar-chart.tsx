
"use client";

import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface ChartDataPoint {
  name: string;
  current: number;
  restorable: number;
}

interface CarbonStackedBarChartProps {
  data: ChartDataPoint[] | null;
  isLoading: boolean;
}

const formatNumber = (value: number): string => {
    if (value === 0) return "0";
    if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
    return value.toFixed(0);
};

const CarbonStackedBarChart: React.FC<CarbonStackedBarChartProps> = ({ data, isLoading }) => {
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

  const categories = data?.map(d => d.name) ?? [];
  const currentData = data?.map(d => d.current) ?? [];
  const restorableData = data?.map(d => d.restorable) ?? [];

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
    },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: categories,
      labels: { style: { color: 'hsl(var(--foreground))' } },
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))',
    },
    yAxis: {
      min: 0,
      title: { 
          text: `tCO₂e`,
          style: { color: 'hsl(var(--foreground))' } 
      },
      labels: { 
          style: { color: 'hsl(var(--foreground))' },
          formatter: function() {
              return formatNumber(this.value as number);
          }
      },
      gridLineColor: 'hsl(var(--border))',
      stackLabels: {
          enabled: true,
          style: {
              fontWeight: 'bold',
              color: 'hsl(var(--foreground))',
              textOutline: 'none'
          },
          formatter: function() {
              return formatNumber(this.total);
          }
      }
    },
    legend: {
      itemStyle: { color: 'hsl(var(--foreground))' },
      itemHoverStyle: { color: 'hsl(var(--primary))' },
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y} ({point.percentage:.1f}%)<br/>Total: {point.stackTotal}',
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      style: { color: 'hsl(var(--popover-foreground))', fontWeight: 'normal' },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: function() {
              return formatNumber(this.y ?? 0);
          },
          style: { color: 'hsl(var(--primary-foreground))', textOutline: 'none', fontWeight: 'bold' }
        }
      }
    },
    series: [
      {
        type: 'column',
        name: t('current'),
        data: currentData,
        color: 'hsl(var(--chart-3))'
      },
      {
        type: 'column',
        name: t('restorable'),
        data: restorableData,
        color: 'hsl(var(--chart-3) / 0.5)',
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
                    states: { hover: { fill: 'hsl(var(--muted))' }, select: { fill: 'hsl(var(--muted))' } }
                }
            }
        },
        menuItemStyle: { fontFamily: 'Inter, sans-serif', color: 'hsl(var(--foreground))' },
        menuItemHoverStyle: { background: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' },
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
    <div className="w-full h-64">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : data && data.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {t('noDataAvailable')}
        </div>
      )}
    </div>
  );
};

export default CarbonStackedBarChart;
