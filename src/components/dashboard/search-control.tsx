
"use client"

import * as React from "react"
import { Check, Search as SearchIcon, X, Loader2 } from "lucide-react"
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
import { territoryTypes, Location, TerritoryTypeKey } from "./mock-locations"
import { getLocationsByType } from "@/services/map.service"

export default function SearchControl() {
  const [selectedType, setSelectedType] = React.useState<TerritoryTypeKey | null>(null);
  const [availableLocations, setAvailableLocations] = React.useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTypeChange = async (value: string) => {
    const typeKey = value as TerritoryTypeKey;
    setSelectedType(typeKey);
    setSelectedLocation(null);
    setAvailableLocations([]);
    
    if (typeKey) {
        setIsLoading(true);
        try {
            const locations = await getLocationsByType(typeKey);
            setAvailableLocations(locations);
        } catch (error) {
            console.error(error);
            // Optionally, show a toast notification to the user
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleClear = () => {
    setSelectedType(null);
    setSelectedLocation(null);
    setAvailableLocations([]);
  };

  return (
    <Card className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm shadow-md w-96">
      <Select onValueChange={handleTypeChange} value={selectedType || ''}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo de Território" />
        </SelectTrigger>
        <SelectContent>
          {territoryTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full justify-start font-normal text-muted-foreground"
            disabled={!selectedType}
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            {selectedLocation ? selectedLocation.label : "Buscar local..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandList>
              {isLoading && (
                 <CommandLoading>
                    <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </CommandLoading>
              )}
              {!isLoading && availableLocations.length === 0 && (
                <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
              )}
              <CommandGroup>
                {availableLocations.map((location) => (
                  <CommandItem
                    key={location.value}
                    value={location.value}
                    onSelect={(currentValue) => {
                      setSelectedLocation(
                        availableLocations.find(l => l.value === currentValue) || null
                      );
                      setPopoverOpen(false);
                    }}
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(selectedType || selectedLocation) && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8">
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </>
      )}
    </Card>
  )
}
