
"use client"

import * as React from "react"
import { Check, Search as SearchIcon, Loader2, Trash2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { territoryTypes, type Location, type TerritoryTypeKey } from "@/models/location.model"
import { getLocationsByType } from "@/services/map.service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface SearchControlProps {
    onLocationSelect: (location: Location | null, type: TerritoryTypeKey | null) => void;
}

const InfoTooltip = ({ text }: { text: string }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="text-muted-foreground ml-1.5" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <Info className="h-3.5 w-3.5" />
                </span>
            </TooltipTrigger>
            <TooltipContent align="start">
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);


export default function SearchControl({ onLocationSelect }: SearchControlProps) {
  const [selectedType, setSelectedType] = React.useState<TerritoryTypeKey | null>(null);
  const [availableLocations, setAvailableLocations] = React.useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTypeChange = async (value: string) => {
    const typeKey = value as TerritoryTypeKey;
    setSelectedType(typeKey);
    // Reset location when type changes
    setSelectedLocation(null);
    onLocationSelect(null, null);
    setAvailableLocations([]);
    
    if (typeKey) {
        setIsLoading(true);
        try {
            const locations = await getLocationsByType(typeKey);
            setAvailableLocations(locations);
        } catch (error) {
            console.error("Failed to fetch locations by type:", error);
            setAvailableLocations([]);
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleClear = () => {
    setSelectedType(null);
    setSelectedLocation(null);
    setAvailableLocations([]);
    onLocationSelect(null, null);
  };

  const handleLocationSelected = (currentValue: string) => {
      const location = availableLocations.find(l => l.label.toLowerCase() === currentValue.toLowerCase()) || null;
      setSelectedLocation(location);
      onLocationSelect(location, selectedType);
      setPopoverOpen(false);
  }

  const getLabelForType = (type: TerritoryTypeKey | null) => {
    if (!type) return "Tipo de Território";
    return territoryTypes.find(t => t.value === type)?.label || "Tipo de Território";
  }

  return (
    <Card className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm shadow-md w-[450px]">
        <div className="flex-1">
            <Select onValueChange={handleTypeChange} value={selectedType || ''}>
                <SelectTrigger className="w-full">
                    <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1.5">AT</span>
                        <InfoTooltip text="Agrupamento Territorial (Estado, Município, etc.)" />
                        <Separator orientation="vertical" className="h-4 mx-2" />
                        <SelectValue placeholder="Selecione o tipo" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                {territoryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>

      <div className="flex-1">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-start font-normal"
                disabled={!selectedType || isLoading}
            >
                <div className="flex items-center w-full">
                    <span className="text-xs text-muted-foreground mr-1.5">Buscar</span>
                    <InfoTooltip text={`Buscar por ${getLabelForType(selectedType)}`} />
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    <div className="flex-1 text-left truncate">
                        {selectedLocation ? selectedLocation.label : (isLoading ? "Carregando..." : "Selecione o local")}
                    </div>
                </div>
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
                <CommandInput placeholder="Buscar..." />
                <CommandList>
                {isLoading ? (
                    <CommandLoading>
                        <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">Carregando locais...</span>
                        </div>
                    </CommandLoading>
                ) : (
                  <>
                    <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
                    <CommandGroup>
                        {availableLocations.map((location) => (
                        <CommandItem
                            key={location.value}
                            value={location.label}
                            onSelect={handleLocationSelected}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                selectedLocation?.value === location.value ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {location.label}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
                </CommandList>
            </Command>
            </PopoverContent>
        </Popover>
      </div>

      {(selectedType) && (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleClear} className="h-9 w-9 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Limpar seleção</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}
    </Card>
  )
}
