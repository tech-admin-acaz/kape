
"use client"

import * as React from "react"
import { Layers, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export interface LayerState {
    indicator: boolean;
    restoredCarbon: boolean;
    currentCarbon: boolean;
    opportunityCost: boolean;
    restorationCost: boolean;
    mapbiomas: boolean;
}

interface LayerControlProps {
    layers: LayerState;
    setLayers: React.Dispatch<React.SetStateAction<LayerState>>;
}

const layerItems = [
    { id: 'indicator', label: 'Indicador', collapsible: true },
    { id: 'restoredCarbon', label: 'Carbono Restaurado', collapsible: true },
    { id: 'currentCarbon', label: 'Carbono Atual', collapsible: true },
    { id: 'opportunityCost', label: 'Custo de Oportunidade', collapsible: true },
    { id: 'restorationCost', label: 'Custo de Restauracao', collapsible: true },
    { id: 'mapbiomas', label: 'Mapbiomas Categorizado', collapsible: true },
] as const;


export default function LayerControl({ layers, setLayers }: LayerControlProps) {
    const handleLayerChange = (layerId: keyof LayerState) => {
        setLayers(prev => ({...prev, [layerId]: !prev[layerId]}));
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background/80 hover:bg-background">
          <Layers className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Camadas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-1">
            {layerItems.map((item) => (
                <Collapsible key={item.id} className="space-y-2">
                    <div className="flex items-center space-x-2 p-1">
                        <Switch 
                            id={item.id} 
                            checked={layers[item.id as keyof LayerState]}
                            onCheckedChange={() => handleLayerChange(item.id as keyof LayerState)}
                        />
                        <Label htmlFor={item.id} className="flex-1 cursor-pointer">{item.label}</Label>
                        {item.collapsible && (
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                </Button>
                            </CollapsibleTrigger>
                        )}
                    </div>
                    {item.collapsible && (
                        <CollapsibleContent>
                            <div className="mx-3 mb-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                                <p>Fonte: GEE</p>
                                <p>Ano: 2024</p>
                            </div>
                        </CollapsibleContent>
                    )}
                </Collapsible>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
