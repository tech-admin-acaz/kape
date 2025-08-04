"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Info, Trash2, ArrowLeftFromLine, Search as SearchIcon } from "lucide-react"

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

const locations = [
    { value: "yanomami", label: "T.I. Yanomami" },
    { value: "canastra", label: "P.N. Serra da Canastra" },
    { value: "iguacu", label: "P.N. do Iguaçu" },
    { value: "pico_neblina", label: "P.N. Pico da Neblina" },
    { value: "xingu", label: "P.I. do Xingu" },
    { value: "acre", label: "Acre" }, 
    { value: "sao_paulo", label: "São Paulo" },
    { value: "rio_branco", label: "Rio Branco" }, 
    { value: "sao_paulo_city", label: "São Paulo (Cidade)" }
];


export default function SearchControl() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClear = () => {
    setValue("");
  }

  const selectedLabel = value ? locations.find((location) => location.value === value)?.label : "Buscar local...";

  return (
    <Card className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm shadow-md">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-64 justify-start font-normal text-muted-foreground"
                >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {selectedLabel}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Buscar estado, município, T.I. ..." />
                    <CommandList>
                        <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((location) => (
                                <CommandItem
                                    key={location.value}
                                    value={location.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === location.value ? "opacity-100" : "opacity-0"
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

        {value && (
             <>
                <Separator orientation="vertical" className="h-6" />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Limpar seleção</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </>
        )}
    </Card>
  )
}
