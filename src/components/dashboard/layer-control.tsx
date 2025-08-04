
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
    { id: 'restoredCarbon', label: 'Carbono Restaurado' },
    { id: 'currentCarbon', label: 'Carbono Atual' },
    { id: 'opportunityCost', label: 'Custo de Oportunidade' },
    { id: 'restorationCost', label: 'Custo de Restauracao' },
    { id: 'mapbiomas', label: 'Mapbiomas Categorizado' },
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
        
        {layerItems.map((item) => (
             item.collapsible ? (
                <Collapsible key={item.id} className="px-2 py-1.5" open={layers[item.id]}>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                             <Switch 
                                id={item.id} 
                                checked={layers[item.id]}
                                onCheckedChange={() => handleLayerChange(item.id)}
                            />
                            <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                        </div>
                        <CollapsibleTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <div className="mt-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                            <p>Fonte: GEE</p>
                            <p>Ano: 2024</p>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
             ) : (
                <div key={item.id} className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id={item.id}
                            checked={layers[item.id as keyof LayerState]}
                            onCheckedChange={() => handleLayerChange(item.id as keyof LayerState)}
                        />
                        <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
