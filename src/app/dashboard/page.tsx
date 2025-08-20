
"use client";

import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import DashboardClient from "@/components/dashboard/dashboard-client";
import StatsPanel from "@/components/dashboard/stats-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { StatsData } from '@/components/dashboard/stats-panel';
import WelcomeDialog from '@/components/dashboard/welcome-dialog';
import { useI18n } from '@/hooks/use-i18n';

export default function DashboardPage() {
    const [selectedArea, setSelectedArea] = React.useState<StatsData | null>(null);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [isClient, setIsClient] = React.useState(false);
    const panelGroupRef = React.useRef<PanelGroup>(null);
    const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
    const { t } = useI18n();

    React.useEffect(() => {
        setIsClient(true);
        // We check localStorage to see if the user has previously opted out.
        const hideDialog = localStorage.getItem('hideWelcomeDialog');
        if (hideDialog !== 'true') {
            setShowWelcomeDialog(true);
        }
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

    const handleDialogClose = (dontShowAgain: boolean) => {
        if (dontShowAgain) {
            localStorage.setItem('hideWelcomeDialog', 'true');
        }
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
                    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
                    setIsCollapsed(sizes[1] === 0);
                }}
            >
                <ResizablePanel defaultSize={100} minSize={30}>
                    <DashboardClient 
                        onAreaUpdate={setSelectedArea} 
                        selectedArea={selectedArea}
                        isPanelCollapsed={isCollapsed}
                        togglePanel={togglePanel}
                        panelGroupRef={panelGroupRef}
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
                    onCollapse={() => setIsCollapsed(true)}
                    onExpand={() => setIsCollapsed(false)}
                >
                    {isClient && isCollapsed ? null : <StatsPanel data={selectedArea} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
