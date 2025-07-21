"use client"

import * as React from "react"
import { Layers, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BasemapControlProps {
    onStyleChange: (style: string) => void;
    basemaps: Record<string, string>;
}

export default function BasemapControl({ onStyleChange, basemaps }: BasemapControlProps) {
  const [currentStyle, setCurrentStyle] = React.useState('default');
  
  const handleStyleChange = (styleKey: string) => {
    onStyleChange(basemaps[styleKey]);
    setCurrentStyle(styleKey);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
          <Layers className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(basemaps).map((styleKey) => (
          <DropdownMenuItem key={styleKey} onSelect={() => handleStyleChange(styleKey)}>
              <div className="w-4 mr-2">
              {currentStyle === styleKey && <Check className="h-4 w-4" />}
            </div>
            <span className="capitalize">{styleKey}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
