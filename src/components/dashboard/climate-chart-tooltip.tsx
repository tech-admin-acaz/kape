
"use client";

import React from 'react';
import type { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ClimateChartTooltipProps extends TooltipProps<ValueType, NameType> {
    valueName: string;
    trendName: string;
}

export default function ClimateChartTooltip({ active, payload, label, valueName, trendName }: ClimateChartTooltipProps) {
    if (active && payload && payload.length) {
        const valueData = payload.find(p => p.dataKey === 'value');
        const trendData = payload.find(p => p.dataKey === 'trend');

        return (
            <div className="bg-popover text-popover-foreground border rounded-md p-3 shadow-sm text-sm">
                <p className="font-bold mb-2">{label}</p>
                {valueData && (
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: valueData.color }} />
                        <span>{valueName}: <strong>{valueData.value?.toString()}</strong></span>
                    </div>
                )}
                 {trendData && (
                     <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trendData.color }} />
                        <span>{trendName}: <strong>{trendData.value?.toString()}</strong></span>
                    </div>
                )}
            </div>
        );
    }

    return null;
};
