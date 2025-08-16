"use client";

import React from 'react';
import FutureClimateChart, { type FutureClimateData } from './future-climate-chart';

interface RainfallTrendChartProps {
    data: FutureClimateData[];
}

export default function RainfallTrendChart({ data }: RainfallTrendChartProps) {
    return (
        <FutureClimateChart
            title="Tendência da Chuva Média Anual"
            yAxisTitle="Precipitação Média"
            seriesName="Precipitação"
            seriesType="column"
            color="hsl(var(--chart-2))"
            unit="mm"
            data={data}
        />
    );
}
