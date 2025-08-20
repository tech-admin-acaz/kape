
"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/use-i18n";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

interface ExpandButtonProps {
    onClick: () => void;
    isCollapsed: boolean;
}

export default function ExpandButton({ onClick, isCollapsed }: ExpandButtonProps) {
    const { t } = useI18n();
    const Icon = isCollapsed ? PanelRightOpen : PanelRightClose;
    const tooltipText = isCollapsed ? t('expandPanel') : t('collapsePanel');
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={onClick} 
                        className="bg-background/80 hover:bg-hover rounded-full h-10 w-10 shadow-md"
                    >
                        <Icon className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
