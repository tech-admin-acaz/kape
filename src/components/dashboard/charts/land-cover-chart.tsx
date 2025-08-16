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

const landCoverMapping: { [key: string]: { name: string; color: string } } = {
    "Agricultura": { name: "Agricultura", color: "hsl(var(--chart-5))" },
    "Pastagem": { name: "Pastagem", color: "hsl(var(--chart-4))" },
    "Outras": { name: "Outros", color: "hsl(var(--muted))" },
    "Floresta Secundária": { name: "Floresta Secundária", color: "#7a5900" },
    "Outras Formações Naturais": { name: "Outras Formações Naturais", color: "hsl(var(--chart-2))" },
    "Floresta Primaria": { name: "Formação Florestal Primária", color: "hsl(var(--chart-3))" },
};


const LandCoverChart: React.FC<LandCoverChartProps> = ({ id, type }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (!id || !type) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setChartData(null);
      
      const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;
      if (!API_BIO_URL) {
          console.error("API URL not configured");
          setIsLoading(false);
          return;
      }
      
      let territoryId: string;
      let cityId: string;

      if (type === 'municipio') {
          territoryId = '0';
          cityId = id;
      } else {
          territoryId = id;
          cityId = '0';
      }
      
      const apiPath = `${API_BIO_URL}/area/${territoryId}/${cityId}`;

      try {
        const response = await fetch(apiPath);
        if (!response.ok) {
          console.error(`Error fetching land cover stats from external API: ${response.statusText}`);
          setChartData([]);
          return;
        }
        
        const rawData = await response.json();
        const statsObject = rawData && rawData.length > 0 ? rawData[0] : {};

        if (Object.keys(statsObject).length === 0) {
            setChartData([]);
        } else {
            const formattedData = Object.entries(statsObject)
            .map(([key, value]) => {
                const mapping = landCoverMapping[key];
                if (!mapping) return null;

                return {
                    name: mapping.name,
                    y: value as number,
                    color: mapping.color
                };
            })
            .filter((item): item is ChartDataPoint => item !== null && item.y > 0);

            setChartData(formattedData);
        }
        
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
