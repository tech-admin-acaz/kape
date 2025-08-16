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
import { Search, Download, Info, ChevronDown, Check, X, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { SpeciesData } from './stats-panel';
import { cn } from '@/lib/utils';

interface SpeciesRankingTableProps {
  species: SpeciesData[];
}

const ITEMS_PER_PAGE = 15;

type SortKey = keyof SpeciesData;

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

  const filteredSpecies = useMemo(() =>
    species.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [species, searchTerm]
  );
  
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


  return (
    <div className="flex flex-col h-full space-y-4 bg-background p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ex: especie, coriaceae..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
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
          {filteredSpecies.length} espécies encontradas.
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
