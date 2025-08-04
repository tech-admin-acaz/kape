
"use client"

import * as React from "react"
import { Map as MapIcon, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BasemapControlProps {
    onStyleChange: (style: string) => void;
    basemaps: Record<string, string>;
    currentStyleKey: string;
}

export default function BasemapControl({ onStyleChange, basemaps, currentStyleKey }: BasemapControlProps) {
  
  const handleStyleChange = (styleKey: string) => {
    onStyleChange(basemaps[styleKey]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
          <MapIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mapa base</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentStyleKey} onValueChange={handleStyleChange}>
            {Object.keys(basemaps).map((styleKey) => (
                <DropdownMenuRadioItem key={styleKey} value={styleKey} className="gap-2">
                     <div className="w-4">
                        {currentStyleKey === styleKey && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="capitalize">{styleKey}</span>
                </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
