
"use client";

import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import InteractiveMap from './interactive-map';
import type { StatsData } from './stats-panel';

interface DashboardClientProps {
    onAreaUpdate: (data: StatsData | null) => void;
    selectedArea: StatsData | null;
    isPanelCollapsed: boolean;
    togglePanel: () => void;
    panelGroupRef: React.RefObject<PanelGroup>;
}

export default function DashboardClient({ onAreaUpdate, selectedArea, isPanelCollapsed, togglePanel, panelGroupRef }: DashboardClientProps) {
  return (
    <div className="h-full w-full relative">
      <InteractiveMap 
          onAreaUpdate={onAreaUpdate} 
          selectedArea={selectedArea}
          isPanelCollapsed={isPanelCollapsed}
          togglePanel={togglePanel}
          panelGroupRef={panelGroupRef}
      />
    </div>
  );
}
