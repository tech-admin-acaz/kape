
"use client";

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';

if (typeof Highcharts === 'object') {
  exporting(Highcharts);
}

interface LandCoverChartProps {
  data: { name: string; y: number; color: string; }[];
}

const LandCoverChart: React.FC<LandCoverChartProps> = ({ data }) => {

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
      data: data,
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
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default LandCoverChart;
