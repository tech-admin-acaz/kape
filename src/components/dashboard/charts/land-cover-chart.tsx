
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import type { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';

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

const mockLandCoverData: ChartDataPoint[] = [
    { name: "Formação Florestal Primária", y: 70.06, color: "hsl(var(--chart-3))" },
    { name: "Outras Formações Naturais", y: 13.89, color: "hsl(var(--chart-2))" },
    { name: "Pastagem", y: 13.72, color: "hsl(var(--chart-4))" },
    { name: "Floresta Secundária", y: 2.2, color: "#7a5900" },
    { name: "Agricultura", y: 0.68, color: "hsl(var(--chart-5))" },
    { name: "Outros", y: 1.21, color: "hsl(var(--muted))" },
];


const LandCoverChart: React.FC<LandCoverChartProps> = ({ id, type }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>(mockLandCoverData);
  const [isLoading, setIsLoading] = useState(false);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // useEffect(() => {
  //   if (!id || !type) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`/api/stats/land-cover/${type}/${id}`);
  //       if (!response.ok) {
  //         console.error(`Error fetching land cover stats: ${response.statusText}`);
  //         setChartData([]);
  //         return;
  //       }
  //       const data = await response.json();
  //       setChartData(data);
        
  //     } catch (error) {
  //       console.error("Failed to fetch or process land cover stats:", error);
  //       setChartData([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [id, type]);

  useEffect(() => {
    if (chartComponentRef.current && !isLoading) {
      chartComponentRef.current.chart.reflow();
    }
  }, [chartData, isLoading]);

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
                }
            }
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
          containerProps={{ style: { height: "100%", width: "100%" } }}
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
