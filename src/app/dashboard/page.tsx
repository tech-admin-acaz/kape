"use client";

import React from 'react';
import DashboardClient from "@/components/dashboard/dashboard-client";
import StatsPanel from "@/components/dashboard/stats-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { mockData } from "@/components/dashboard/mock-data";

export default function DashboardPage() {
    const [selectedAreaId, setSelectedAreaId] = React.useState<string | null>("1");
    const selectedData = selectedAreaId ? mockData[selectedAreaId as keyof typeof mockData] : null;

    return (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel>
                <DashboardClient onAreaSelect={setSelectedAreaId} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={25} maxSize={45}>
                <StatsPanel data={selectedData} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
