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
