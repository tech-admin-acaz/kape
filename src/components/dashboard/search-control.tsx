
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Info, Trash2, ArrowLeftFromLine } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const groupings = {
    states: { label: "Estados", items: [ { value: "acre", label: "Acre" }, { value: "sao_paulo", label: "São Paulo" } ] },
    municipalities: { label: "Municípios", items: [ { value: "rio_branco", label: "Rio Branco" }, { value: "sao_paulo_city", label: "São Paulo" } ] },
    indigenous_lands: { label: "Terras Indígenas", items: [ { value: "yanomami", label: "T.I. Yanomami" } ] },
    conservation_units: { label: "Unidades de conservação", items: [ { value: "canastra", label: "P.N. Serra da Canastra" } ] },
} as const;

type GroupingKey = keyof typeof groupings;

export default function SearchControl() {
  const [open, setOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [grouping, setGrouping] = React.useState<GroupingKey>("states");
  const [value, setValue] = React.useState("");

  const handleClear = () => {
    setValue("");
  }

  const currentItems = groupings[grouping].items;

  if (isCollapsed) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsCollapsed(false)} className="bg-background/80 hover:bg-background">
                        <ArrowLeftFromLine className="h-4 w-4 rotate-180" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Show filters</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
  }

  return (
    <Card className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)}>
                        <ArrowLeftFromLine className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Hide filters</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        <div className="relative w-48">
            <Select value={grouping} onValueChange={(v) => {
                setGrouping(v as GroupingKey);
                setValue("");
            }}>
                <SelectTrigger>
                    <SelectValue placeholder="Agrupamento Territorial" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(groupings).map(key => (
                         <SelectItem key={key} value={key}>{groupings[key as GroupingKey].label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <label className="absolute -top-2 left-2 text-xs bg-background/80 text-muted-foreground px-1">
                Agrupamento Territorial
            </label>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 -right-1 -translate-y-1/2 h-6 w-6">
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Selecione o tipo de unidade territorial.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <div className="relative w-48">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal border-input"
                    >
                    {value
                        ? currentItems.find((item) => item.value === value)?.label
                        : "Selecione..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                        <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
                        <CommandGroup>
                        {currentItems.map((item) => (
                            <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                value === item.value ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {item.label}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
             <label className="absolute -top-2 left-2 text-xs bg-background/80 text-muted-foreground px-1">
                Buscar
            </label>
            <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 -right-1 -translate-y-1/2 h-6 w-6">
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Busque por um local específico.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-6" />

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleClear}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Limpar seleção</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    </Card>
  )
}
