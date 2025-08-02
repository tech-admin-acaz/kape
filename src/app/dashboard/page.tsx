"use client";

import React from 'react';
import DashboardClient from "@/components/dashboard/dashboard-client";
import StatsPanel from "@/components/dashboard/stats-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { mockData } from "@/components/dashboard/mock-data";
import type { PanelGroupOnLayout } from "react-resizable-panels";

const COLLAPSE_THRESHOLD_PX = 250;

export default function DashboardPage() {
    const [selectedAreaId, setSelectedAreaId] = React.useState<string | null>("1");
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);
    const panelGroupRef = React.useRef<any>(null);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const selectedData = selectedAreaId ? mockData[selectedAreaId as keyof typeof mockData] : null;

    const handleLayout = (sizes: number[]) => {
        if (sizes.length === 2 && panelGroupRef.current) {
            const panelElement = panelGroupRef.current.getPanelElement("stats-panel");
            if (panelElement && panelElement.offsetWidth < COLLAPSE_THRESHOLD_PX) {
                if (!isCollapsed) {
                   panelGroupRef.current.collapse("stats-panel");
                }
            }
        }
    };
    
    const expandPanel = () => {
        if (panelGroupRef.current) {
            panelGroupRef.current.expand("stats-panel");
        }
    };

    return (
        <ResizablePanelGroup 
            ref={panelGroupRef}
            direction="horizontal" 
            className="flex-1"
            onLayout={handleLayout as PanelGroupOnLayout}
        >
            <ResizablePanel defaultSize={70}>
                <DashboardClient 
                    onAreaSelect={setSelectedAreaId} 
                    isPanelCollapsed={isCollapsed}
                    onExpandClick={expandPanel}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel 
                id="stats-panel"
                defaultSize={30} 
                minSize={15} 
                collapsible={true}
                collapsedSize={0}
                onCollapse={() => setIsCollapsed(true)}
                onExpand={() => setIsCollapsed(false)}
            >
                {isClient && isCollapsed ? null : <StatsPanel data={selectedData} />}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
