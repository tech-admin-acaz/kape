
"use client";

import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import DashboardClient from "@/components/dashboard/dashboard-client";
import StatsPanel from "@/components/dashboard/stats-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { mockData } from "@/components/dashboard/mock-data";
import type { StatsData } from '@/components/dashboard/stats-panel';


export default function DashboardPage() {
    const [selectedArea, setSelectedArea] = React.useState<StatsData | null>(null);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);
    const panelGroupRef = React.useRef<PanelGroup>(null);

    React.useEffect(() => {
        setIsClient(true);
        // Load initial data for the first location in mockData
        const initialAreaId = Object.keys(mockData)[0];
        if (initialAreaId) {
            setSelectedArea(mockData[initialAreaId]);
        }
    }, []);
    
    const expandPanel = () => {
        if (panelGroupRef.current) {
            panelGroupRef.current.setLayout([70, 30]);
            setIsCollapsed(false);
        }
    };

    return (
        <div className="flex-1 flex">
            <ResizablePanelGroup 
                ref={panelGroupRef}
                direction="horizontal" 
                className="flex-1"
            >
                <ResizablePanel defaultSize={70}>
                    <DashboardClient 
                        onAreaUpdate={setSelectedArea} 
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
                    {isClient && isCollapsed ? null : <StatsPanel data={selectedArea} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
