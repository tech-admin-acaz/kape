"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Download, Info, ChevronDown, Check, X, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter } from 'lucide-react';
import type { SpeciesData } from './stats-panel';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface SpeciesRankingTableProps {
  species: SpeciesData[];
}

const ITEMS_PER_PAGE = 15;

type SortKey = keyof SpeciesData;
type ResilienceLevel = '1 - Muito Baixa' | '2 - Baixa' | '3 - Intermediaria' | '4 - Alta' | '5 - Muito Alta';
type BooleanFilter = 'any' | 'yes' | 'no';

interface AdvancedFilters {
    resilience: ResilienceLevel[];
    potential: BooleanFilter;
    domestication: BooleanFilter;
    availability: BooleanFilter;
}

const resilienceOptions: ResilienceLevel[] = [
    '1 - Muito Baixa',
    '2 - Baixa',
    '3 - Intermediaria',
    '4 - Alta',
    '5 - Muito Alta'
];

const InfoHeader = ({ children, tooltipText }: { children: React.ReactNode, tooltipText: string }) => (
  <div className="flex items-center gap-1">
    <span>{children}</span>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default function SpeciesRankingTable({ species }: SpeciesRankingTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<AdvancedFilters>({
    resilience: [],
    potential: 'any',
    domestication: 'any',
    availability: 'any',
  });

  const handleFilterChange = <K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
      setCurrentPage(1);
  };

  const handleResilienceChange = (level: ResilienceLevel, checked: boolean) => {
    const newResilience = checked
      ? [...filters.resilience, level]
      : filters.resilience.filter(l => l !== level);
    handleFilterChange('resilience', newResilience);
  };

  const filteredSpecies = useMemo(() => {
    return species
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(s => {
        if (filters.resilience.length > 0 && !filters.resilience.includes(s.resilience as ResilienceLevel)) {
            return false;
        }
        if (filters.potential !== 'any' && (filters.potential === 'yes') !== s.potential) {
            return false;
        }
        if (filters.domestication !== 'any' && (filters.domestication === 'yes') !== s.domestication) {
            return false;
        }
        if (filters.availability !== 'any' && (filters.availability === 'yes') !== s.availability) {
            return false;
        }
        return true;
    });
  }, [species, searchTerm, filters]);

  const sortedSpecies = useMemo(() => {
    let sortableItems = [...filteredSpecies];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            if (aValue === bValue) return 0;
             if (sortConfig.direction === 'asc') {
                return aValue ? -1 : 1;
            }
            return aValue ? 1 : -1;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            if (sortConfig.direction === 'asc') {
                return aValue.localeCompare(bValue);
            }
            return bValue.localeCompare(aValue);
        }
        
        return 0;
      });
    }
    return sortableItems;
  }, [filteredSpecies, sortConfig]);


  const totalPages = Math.ceil(sortedSpecies.length / ITEMS_PER_PAGE);

  const paginatedSpecies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedSpecies.slice(startIndex, endIndex);
  }, [sortedSpecies, currentPage]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const SortableHeader = ({ sortKey, children, tooltipText, className }: { sortKey: SortKey, children: React.ReactNode, tooltipText: string, className?: string }) => (
      <TableHead className={className}>
          <Button variant="ghost" onClick={() => requestSort(sortKey)} className="px-2 py-1 h-auto">
             <div className="flex items-center gap-1">
                <InfoHeader tooltipText={tooltipText}>{children}</InfoHeader>
                <ArrowUpDown className="h-4 w-4" />
            </div>
          </Button>
      </TableHead>
  );

  const FilterRadioGroup = ({ label, value, onValueChange }: { label: string, value: BooleanFilter, onValueChange: (value: BooleanFilter) => void }) => (
    <div className="space-y-2">
        <Label className="font-medium">{label}</Label>
        <RadioGroup
            defaultValue={value}
            onValueChange={onValueChange}
            className="flex items-center gap-4"
        >
            <div className="flex items-center space-x-2"><RadioGroupItem value="any" id={`${label}-any`} /><Label htmlFor={`${label}-any`} className="font-normal">Qualquer</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`${label}-yes`} /><Label htmlFor={`${label}-yes`} className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`${label}-no`} /><Label htmlFor={`${label}-no`} className="font-normal">Não</Label></div>
        </RadioGroup>
    </div>
  );


  return (
    <div className="flex flex-col h-full space-y-4 bg-background p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ex: especie, coriaceae..."
            className="pl-9 pr-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-muted">
                    <Filter className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Filtros Avançados</h4>
                        <p className="text-sm text-muted-foreground">
                            Refine a sua busca de espécies.
                        </p>
                    </div>
                    <Separator />
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label className="font-medium">Resiliência Climática</Label>
                            {resilienceOptions.map(level => (
                                <div key={level} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={level}
                                        checked={filters.resilience.includes(level)}
                                        onCheckedChange={(checked) => handleResilienceChange(level, !!checked)}
                                    />
                                    <Label htmlFor={level} className="font-normal">{level}</Label>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <FilterRadioGroup 
                            label="Potencial de Uso" 
                            value={filters.potential}
                            onValueChange={(v) => handleFilterChange('potential', v as BooleanFilter)}
                        />
                         <Separator />
                        <FilterRadioGroup 
                            label="Domesticação"
                            value={filters.domestication}
                            onValueChange={(v) => handleFilterChange('domestication', v as BooleanFilter)}
                        />
                         <Separator />
                         <FilterRadioGroup 
                            label="Disponibilidade"
                            value={filters.availability}
                            onValueChange={(v) => handleFilterChange('availability', v as BooleanFilter)}
                        />
                    </div>
                </div>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>CSV</DropdownMenuItem>
            <DropdownMenuItem>XLSX</DropdownMenuItem>
            <DropdownMenuItem>HTML</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-grow overflow-auto border rounded-md">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <SortableHeader sortKey="name" tooltipText="Nome científico da espécie.">Espécie</SortableHeader>
              <SortableHeader sortKey="resilience" tooltipText="Nível de resiliência da espécie às mudanças climáticas.">Resiliência Climática</SortableHeader>
              <SortableHeader sortKey="potential" tooltipText="Potencial de uso econômico ou ecológico.">Potencial de Uso</SortableHeader>
              <SortableHeader sortKey="domestication" tooltipText="Espécie domesticada para cultivo.">Domesticação</SortableHeader>
              <SortableHeader sortKey="availability" tooltipText="Disponibilidade de sementes no mercado.">Disponibilidade</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSpecies.length > 0 ? (
              paginatedSpecies.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.resilience}</TableCell>
                  <TableCell className="text-center">
                    {s.potential ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.domestication ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.availability ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">Nenhuma espécie encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-2 border-t bg-background">
        <div className="text-sm text-muted-foreground">
          {sortedSpecies.length} espécies encontradas.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
