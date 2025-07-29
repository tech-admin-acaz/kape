
"use client";

import React, { useState } from 'react';
import InteractiveMap from './interactive-map';
import StatsPanel from './stats-panel';
import type { StatsData } from './stats-panel';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

const mockData: Record<string, StatsData> = {
  "1": {
    name: "T.I. Yanomami",
    type: "Indigenous Territory",
    stats: {
      landUse: [
        { name: "Forest", value: 85, fill: "var(--color-chart-1)" },
        { name: "Agriculture", value: 5, fill: "var(--color-chart-2)" },
        { name: "Mining", value: 10, fill: "var(--color-chart-3)" },
      ],
      waterQuality: 78,
      vegetationIndex: 92,
    },
    environmentalServices: {
      biodiversity: {
        amphibians: 53,
        birds: 470,
        mammals: 129,
        trees: 73,
        reptiles: 131,
      },
      carbon: {
        currentAndRestorable: [
            { name: "Vegetação Primária", current: 348210000, restorable: 0 },
            { name: "Floresta Secundária", current: 0, restorable: 5490000 },
            { name: "Agropecuária", current: 325930000, restorable: 26030000 },
        ],
        valuation: [
            { name: "Vegetação Primária", value: 5000000000 },
            { name: "Floresta Secundária", value: 285000000 },
            { name: "Agropecuária", value: 14000000000 },
        ],
      },
      water: {
        valuation: [
            { name: "Balanço Hídrico", value: 2300000000 },
            { name: "Qualidade da Água", value: 1200000000 },
            { name: "Recarga de Aquífero", value: 850000000 },
        ]
      }
    },
    correlationInsights: "Recent satellite data shows a 2% increase in deforestation on the eastern border, likely linked to illegal mining activities.",
  },
  "2": {
    name: "Serra da Canastra",
    type: "National Park",
    stats: {
      landUse: [
        { name: "Savanna", value: 70, fill: "var(--color-chart-1)" },
        { name: "Forest", value: 20, fill: "var(--color-chart-2)" },
        { name: "Pasture", value: 10, fill: "var(--color-chart-3)" },
      ],
      waterQuality: 95,
      vegetationIndex: 88,
    },
    environmentalServices: {
      biodiversity: {
        amphibians: 40,
        birds: 350,
        mammals: 100,
        trees: 150,
        reptiles: 90,
      },
      carbon: {
        currentAndRestorable: [
          { name: "Vegetação Primária", current: 450000000, restorable: 1000000 },
          { name: "Floresta Secundária", current: 10000000, restorable: 15000000 },
          { name: "Agropecuária", current: 100000000, restorable: 50000000 },
        ],
        valuation: [
            { name: "Vegetação Primária", value: 8000000000 },
            { name: "Floresta Secundária", value: 500000000 },
            { name: "Agropecuária", value: 8000000000 },
        ],
      },
       water: {
        valuation: [
            { name: "Balanço Hídrico", value: 3300000000 },
            { name: "Qualidade da Água", value: 2200000000 },
            { name: "Recarga de Aquífero", value: 1850000000 },
        ]
      }
    },
    correlationInsights: "The park's water sources remain pristine, showing high resilience to surrounding agricultural activities.",
  },
};

export default function DashboardClient() {
  const [selectedArea, setSelectedArea] = useState<StatsData | null>(mockData["1"]);

  const handleAreaSelect = (areaId: string | null) => {
    if (areaId && mockData[areaId]) {
      setSelectedArea(mockData[areaId]);
    } else {
      setSelectedArea(null);
    }
  };

  return (
    <ResizablePanelGroup 
        direction="horizontal"
        className="h-[calc(100vh-3.5rem)] w-full"
    >
        <ResizablePanel defaultSize={67}>
            <div className="h-full overflow-hidden">
                <InteractiveMap onAreaSelect={handleAreaSelect} />
            </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33}>
            <div className="h-full">
                <StatsPanel data={selectedArea} />
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>
  );
}
