
"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PanelLeftClose, PanelRightOpen } from "lucide-react";

interface ExpandButtonProps {
    onClick: () => void;
    isCollapsed: boolean;
}

export default function ExpandButton({ onClick, isCollapsed }: ExpandButtonProps) {
    const Icon = isCollapsed ? PanelRightOpen : PanelLeftClose;
    const tooltipText = isCollapsed ? "Expandir painel" : "Recolher painel";
    
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
