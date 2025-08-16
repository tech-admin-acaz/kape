"use client";

import React from 'react';
import FutureClimateChart, { type FutureClimateData } from './future-climate-chart';

interface TemperatureTrendChartProps {
    data: FutureClimateData[];
}

export default function TemperatureTrendChart({ data }: TemperatureTrendChartProps) {
    return (
        <FutureClimateChart
            title="Tendência de Temperatura da Superfície"
            yAxisTitle="Temperatura (°C)"
            seriesName="Temperatura"
            seriesType="spline"
            color="hsl(var(--destructive))"
            unit="°"
            data={data}
        />
    );
}
