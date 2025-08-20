
"use client";

import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import InteractiveMap from './interactive-map';
import type { StatsData } from './stats-panel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import StatsPanel from "@/components/dashboard/stats-panel";
import WelcomeDialog from '@/components/dashboard/welcome-dialog';
import { useI18n } from '@/hooks/use-i18n';
import type { FeatureCollection, Geometry } from 'geojson';

interface InitialLayerData {
    indicator: string | null;
    restoredCarbon: string | null;
    currentCarbon: string | null;
    opportunityCost: string | null;
    restorationCost: string | null;
    mapbiomas: string | null;
}

interface DashboardClientProps {
   initialLayerData: InitialLayerData;
   statesGeoJSON: FeatureCollection<Geometry> | null;
}

export default function DashboardClient({ initialLayerData, statesGeoJSON }: DashboardClientProps) {
    const [selectedArea, setSelectedArea] = React.useState<StatsData | null>(null);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [isClient, setIsClient] = React.useState(false);
    const panelGroupRef = React.useRef<PanelGroup>(null);
    const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(true);
    const { t } = useI18n();

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const togglePanel = React.useCallback(() => {
        const panelGroup = panelGroupRef.current;
        if (!panelGroup) return;

        if (isCollapsed) {
            panelGroup.setLayout([70, 30]);
        } else {
            panelGroup.setLayout([100, 0]);
        }
        setIsCollapsed(prev => !prev);
    }, [isCollapsed]);

    const handleDialogClose = () => {
        setShowWelcomeDialog(false);
    };

    return (
        <div className="flex-1 flex relative">
            <WelcomeDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog} onDialogClose={handleDialogClose} />
            <ResizablePanelGroup
                ref={panelGroupRef}
                direction="horizontal"
                className="flex-1"
                onLayout={(sizes) => {
                    if (typeof document !== 'undefined') {
                       document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
                    }
                    setIsCollapsed(sizes[1] < 5);
                }}
            >
                <ResizablePanel defaultSize={100} minSize={30}>
                     <div className="h-full w-full relative">
                      <InteractiveMap 
                          onAreaUpdate={setSelectedArea} 
                          selectedArea={selectedArea}
                          isPanelCollapsed={isCollapsed}
                          togglePanel={togglePanel}
                          panelGroupRef={panelGroupRef}
                          initialLayerData={initialLayerData}
                          statesGeoJSON={statesGeoJSON}
                      />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    id="stats-panel"
                    defaultSize={0}
                    minSize={25}
                    maxSize={50}
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
