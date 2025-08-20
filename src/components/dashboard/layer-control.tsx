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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useI18n } from "@/hooks/use-i18n"


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
    { id: 'indicator', labelKey: 'layerIndicator' },
    { id: 'restoredCarbon', labelKey: 'layerRestoredCarbon' },
    { id: 'currentCarbon', labelKey: 'layerCurrentCarbon' },
    { id: 'opportunityCost', labelKey: 'layerOpportunityCost' },
    { id: 'restorationCost', labelKey: 'layerRestorationCost' },
    { id: 'mapbiomas', labelKey: 'layerMapbiomas' },
] as const;


export default function LayerControl({ layers, setLayers }: LayerControlProps) {
    const { t } = useI18n();
    const handleLayerChange = (layerId: keyof LayerState) => {
        setLayers(prev => ({...prev, [layerId]: !prev[layerId]}));
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background/80 btn-map-control">
          <Layers className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t('layers')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-1">
            <Accordion type="single" collapsible className="w-full">
                {layerItems.map((item) => (
                    <AccordionItem value={item.id} key={item.id} className="border-b-0">
                         <div className="flex items-center p-1">
                            <Switch 
                                id={item.id} 
                                checked={layers[item.id as keyof LayerState]}
                                onCheckedChange={() => handleLayerChange(item.id as keyof LayerState)}
                                className="h-5 w-9 border-input"
                                thumbClassName="h-4 w-4"
                            />
                            <AccordionTrigger className="p-1 flex-1 flex justify-between [&[data-state=open]>svg]:rotate-180">
                                <Label htmlFor={item.id} className="ml-2">
                                    {t(item.labelKey as any)}
                                </Label>
                             </AccordionTrigger>
                        </div>
                        <AccordionContent>
                            <div className="mx-3 mb-2 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                                <p>{t('source')}: GEE</p>
                                <p>{t('year')}: 2024</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
