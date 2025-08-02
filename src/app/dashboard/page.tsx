
"use client";

import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import DashboardClient from "@/components/dashboard/dashboard-client";
import StatsPanel from "@/components/dashboard/stats-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { mockData } from "@/components/dashboard/mock-data";


export default function DashboardPage() {
    const [selectedAreaId, setSelectedAreaId] = React.useState<string | null>("1");
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);
    const panelGroupRef = React.useRef<PanelGroup>(null);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const selectedData = selectedAreaId ? mockData[selectedAreaId as keyof typeof mockData] : null;
    
    const expandPanel = () => {
        if (panelGroupRef.current) {
            panelGroupRef.current.setLayout([70, 30]);
            setIsCollapsed(false);
        }
    };

    return (
        <ResizablePanelGroup 
            ref={panelGroupRef}
            direction="horizontal" 
            className="flex-1"
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
