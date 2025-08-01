
"use client";

import React from 'react';
import InteractiveMap from './interactive-map';

interface DashboardClientProps {
    onAreaSelect: (areaId: string | null) => void;
}

export default function DashboardClient({ onAreaSelect }: DashboardClientProps) {
  return (
    <div className="h-full w-full relative">
      <InteractiveMap onAreaSelect={onAreaSelect} />
    </div>
  );
}
