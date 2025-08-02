
"use client";

import React from 'react';
import InteractiveMap from './interactive-map';
import ExpandButton from './expand-button';

interface DashboardClientProps {
    onAreaSelect: (areaId: string | null) => void;
    isPanelCollapsed: boolean;
    onExpandClick: () => void;
}

export default function DashboardClient({ onAreaSelect, isPanelCollapsed, onExpandClick }: DashboardClientProps) {
  return (
    <div className="h-full w-full relative">
      <InteractiveMap onAreaSelect={onAreaSelect} />
      {isPanelCollapsed && (
        <div className="absolute top-4 right-4 z-20">
            <ExpandButton onClick={onExpandClick} />
        </div>
      )}
    </div>
  );
}
