
"use client";

import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import DashboardClient from "@/components/dashboard/dashboard-client";
import StatsPanel from "@/components/dashboard/stats-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { StatsData } from '@/components/dashboard/stats-panel';

export default function DashboardPage() {
    const [selectedArea, setSelectedArea] = React.useState<StatsData | null>(null);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [isClient, setIsClient] = React.useState(false);
    const panelGroupRef = React.useRef<PanelGroup>(null);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const expandPanel = React.useCallback(() => {
        if (panelGroupRef.current) {
            // Check if it's already expanding or expanded to avoid unnecessary calls
            const layout = panelGroupRef.current.getLayout();
            if (layout[1] < 15) {
                panelGroupRef.current.setLayout([70, 30]);
                setIsCollapsed(false);
            }
        }
    }, []);

    React.useEffect(() => {
        if (selectedArea) {
            expandPanel();
        }
    }, [selectedArea, expandPanel]);
    
    return (
        <div className="flex-1 flex">
            <ResizablePanelGroup 
                ref={panelGroupRef}
                direction="horizontal" 
                className="flex-1"
                onLayout={(sizes) => {
                    if (sizes[1] > 5) {
                        setIsCollapsed(false);
                    } else {
                        setIsCollapsed(true);
                    }
                }}
            >
                <ResizablePanel defaultSize={100} minSize={30}>
                    <DashboardClient 
                        onAreaUpdate={setSelectedArea} 
                        isPanelCollapsed={isCollapsed}
                        onExpandClick={expandPanel}
                        selectedArea={selectedArea}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel 
                    id="stats-panel"
                    defaultSize={0} 
                    minSize={25}
                    maxSize={50}
                    collapsible={true}
                    collapsedSize={0}
                    onCollapse={() => {
                        setIsCollapsed(true);
                    }}
                    onExpand={() => setIsCollapsed(false)}
                >
                    {isClient && isCollapsed ? null : <StatsPanel data={selectedArea} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
