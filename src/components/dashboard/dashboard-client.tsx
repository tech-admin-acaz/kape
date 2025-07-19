"use client";

import React, { useState } from 'react';
import InteractiveMap from './interactive-map';
import StatsPanel from './stats-panel';
import type { StatsData } from './stats-panel';

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
    <div className="flex h-[calc(100vh-1rem)] flex-col lg:flex-row gap-4 p-4">
      <div className="flex-grow lg:w-2/3 h-1/2 lg:h-full rounded-lg overflow-hidden border shadow-sm">
        <InteractiveMap onAreaSelect={handleAreaSelect} />
      </div>
      <div className="lg:w-1/3 w-full h-1/2 lg:h-full">
        <StatsPanel data={selectedArea} />
      </div>
    </div>
  );
}
