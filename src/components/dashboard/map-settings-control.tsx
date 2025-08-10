
"use client"

import * as React from "react"
import { Settings, Image as ImageIcon, Minus, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface MapSettingsControlProps {
  indicatorOpacity: number;
  onIndicatorOpacityChange: (value: number) => void;
  fillOpacity: number;
  onFillOpacityChange: (value: number) => void;
  strokeOpacity: number;
  onStrokeOpacityChange: (value: number) => void;
}

export default function MapSettingsControl({
  indicatorOpacity,
  onIndicatorOpacityChange,
  fillOpacity,
  onFillOpacityChange,
  strokeOpacity,
  onStrokeOpacityChange,
}: MapSettingsControlProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-background/80 hover:bg-hover hover:text-primary-foreground">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                      <p>Configurações do Mapa</p>
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4 space-y-6">
        <DropdownMenuLabel>Opacidade da Camada</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="indicator-opacity" className="flex items-center gap-2 text-sm">
                <ImageIcon className="w-4 h-4 text-primary"/> Região de Interesse
            </Label>
            <Slider
              id="indicator-opacity"
              min={0}
              max={1}
              step={0.1}
              value={[indicatorOpacity]}
              onValueChange={(value) => onIndicatorOpacityChange(value[0])}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fill-opacity" className="flex items-center gap-2 text-sm">
                <Square className="w-4 h-4 text-primary fill-current"/> Região no centro do shape
            </Label>
            <Slider
              id="fill-opacity"
              min={0}
              max={1}
              step={0.1}
              value={[fillOpacity]}
              onValueChange={(value) => onFillOpacityChange(value[0])}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stroke-opacity" className="flex items-center gap-2 text-sm">
                <Minus className="w-4 h-4 text-primary"/> Borda do shape
            </Label>
            <Slider
              id="stroke-opacity"
              min={0}
              max={1}
              step={0.1}
              value={[strokeOpacity]}
              onValueChange={(value) => onStrokeOpacityChange(value[0])}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
