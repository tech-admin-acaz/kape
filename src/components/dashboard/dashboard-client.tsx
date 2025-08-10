
"use client";

import React from 'react';
import InteractiveMap from './interactive-map';
import ExpandButton from './expand-button';
import type { StatsData } from './stats-panel';

interface DashboardClientProps {
    onAreaUpdate: (data: StatsData) => void;
    isPanelCollapsed: boolean;
    onExpandClick: () => void;
}

export default function DashboardClient({ onAreaUpdate, isPanelCollapsed, onExpandClick }: DashboardClientProps) {
  return (
    <div className="h-full w-full relative">
      <InteractiveMap onAreaUpdate={onAreaUpdate} />
      {isPanelCollapsed && (
        <div className="absolute top-4 right-4 z-20">
            <ExpandButton onClick={onExpandClick} />
        </div>
      )}
    </div>
  );
}
