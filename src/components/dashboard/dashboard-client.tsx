
"use client";

import React, { useState } from 'react';
import InteractiveMap from './interactive-map';
import { mockData } from './mock-data';

export default function DashboardClient() {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>("1");

  const handleAreaSelect = (areaId: string | null) => {
    setSelectedAreaId(areaId);
    // Note: The actual data update for StatsPanel will be handled in the layout
    // For now, we just manage the selected ID here.
  };
  
  const selectedArea = selectedAreaId ? mockData[selectedAreaId as keyof typeof mockData] : null;

  return (
    <div className="h-full w-full relative">
      <InteractiveMap onAreaSelect={handleAreaSelect} />
    </div>
  );
}
