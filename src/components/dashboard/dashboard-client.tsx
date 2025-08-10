
"use client";

import React from 'react';
import InteractiveMap from './interactive-map';
import ExpandButton from './expand-button';
import type { StatsData } from './stats-panel';

interface DashboardClientProps {
    onAreaUpdate: (data: StatsData | null) => void;
    isPanelCollapsed: boolean;
    onExpandClick: () => void;
    selectedArea: StatsData | null;
}

export default function DashboardClient({ onAreaUpdate, isPanelCollapsed, onExpandClick, selectedArea }: DashboardClientProps) {
  return (
    <div className="h-full w-full relative">
      <InteractiveMap onAreaUpdate={onAreaUpdate} selectedArea={selectedArea}/>
      {isPanelCollapsed && (
        <div className="absolute top-4 right-4 z-20">
            <ExpandButton onClick={onExpandClick} />
        </div>
      )}
    </div>
  );
}
