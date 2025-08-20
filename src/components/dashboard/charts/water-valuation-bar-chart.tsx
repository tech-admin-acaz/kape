
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
  value: number;
}

interface WaterValuationBarChartProps {
  data: ChartDataPoint[] | null;
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(value);
};

const WaterValuationBarChart: React.FC<WaterValuationBarChartProps> = ({ data, isLoading }) => {
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

  const chartData = data?.map(item => ({
    name: item.name,
    y: item.value,
    color: 'hsl(var(--chart-2) / 0.7)'
  })) ?? [];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
    },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: chartData.map(d => d.name),
      labels: { style: { color: 'hsl(var(--foreground))' } },
      lineColor: 'hsl(var(--border))',
      tickColor: 'hsl(var(--border))',
    },
    yAxis: {
      min: 0,
      title: { text: '', style: { color: 'hsl(var(--foreground))' } },
      labels: { 
        style: { color: 'hsl(var(--foreground))' },
        formatter: function() {
            return formatCurrency(this.value as number);
        }
      },
      gridLineColor: 'hsl(var(--border))',
    },
    legend: { enabled: false },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
      formatter: function() {
          return `${this.key}: <b>${formatCurrency(this.y ?? 0)}</b>`;
      },
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      style: { color: 'hsl(var(--popover-foreground))', fontWeight: 'normal' },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          formatter: function() {
            return formatCurrency(this.y ?? 0);
          },
          style: { color: 'hsl(var(--foreground))', textOutline: 'none' }
        },
        borderRadius: 4
      }
    },
    series: [
      {
        type: 'bar',
        name: t('value'),
        data: chartData,
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

export default WaterValuationBarChart;
