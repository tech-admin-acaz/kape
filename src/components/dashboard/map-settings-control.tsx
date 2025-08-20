
"use client"

import * as React from "react"
import { Settings, Image as ImageIcon, Minus, Square, Mountain } from "lucide-react"

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface MapSettingsControlProps {
  is3D: boolean;
  indicatorOpacity: number;
  onIndicatorOpacityChange: (value: number) => void;
  fillOpacity: number;
  onFillOpacityChange: (value: number) => void;
  strokeOpacity: number;
  onStrokeOpacityChange: (value: number) => void;
  terrainExaggeration: number;
  onTerrainExaggerationChange: (value: number) => void;
}

export default function MapSettingsControl({
  is3D,
  indicatorOpacity,
  onIndicatorOpacityChange,
  fillOpacity,
  onFillOpacityChange,
  strokeOpacity,
  onStrokeOpacityChange,
  terrainExaggeration,
  onTerrainExaggerationChange,
}: MapSettingsControlProps) {

  return (
    <DropdownMenu>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-background/80 btn-map-control">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Configurações do Mapa</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

      <DropdownMenuContent align="end" className="w-64 p-4 space-y-6">
        <div>
          <DropdownMenuLabel>Opacidade da Camada</DropdownMenuLabel>
          <DropdownMenuSeparator className="-mx-4 w-auto" />
        </div>

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

        {is3D && (
          <>
            <div>
              <DropdownMenuLabel>Opções de relevo</DropdownMenuLabel>
              <DropdownMenuSeparator className="-mx-4 w-auto" />
            </div>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="terrain-exaggeration" className="flex items-center gap-2 text-sm">
                  <Mountain className="w-4 h-4 text-primary"/> Exagero do Terreno
                </Label>
                <Slider
                  id="terrain-exaggeration"
                  min={0}
                  max={5}
                  step={0.1}
                  value={[terrainExaggeration]}
                  onValueChange={(value) => onTerrainExaggerationChange(value[0])}
                />
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
