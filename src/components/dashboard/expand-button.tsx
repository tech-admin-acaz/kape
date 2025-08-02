"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PanelLeftOpen } from "lucide-react";

interface ExpandButtonProps {
    onClick: () => void;
}

export default function ExpandButton({ onClick }: ExpandButtonProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={onClick} 
                        className="bg-background/80 hover:bg-background rounded-full h-10 w-10 shadow-md"
                    >
                        <PanelLeftOpen className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Expandir painel</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
