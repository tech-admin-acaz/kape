"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandCoverChart from '../charts/land-cover-chart';
import TemperatureTrendChart from '../charts/temperature-trend-chart';
import RainfallTrendChart from '../charts/rainfall-trend-chart';
import type { StatsData, GeneralInfo } from '../stats-panel';
import { Skeleton } from '@/components/ui/skeleton';

interface CharacterizationTabProps {
  data: StatsData;
  generalInfo: GeneralInfo | null;
  isLoading: boolean;
}

const SectionHeader = ({ title, tooltipText }: { title: string, tooltipText: string }) => (
    <div className="flex items-center gap-2 mb-2">
        <h3 className="font-headline text-lg font-semibold">{title}</h3>
        <TooltipProvider>
            <UITooltip>
                <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </UITooltip>
        </TooltipProvider>
    </div>
);

const GeneralInfoItem = ({ label, value }: { label: string; value: string | undefined | null }) => {
    const displayValue = value || `Sem dados de ${label.replace(':', '')}`;
    return (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium text-right">{displayValue}</span>
        </div>
    )
};

const GeneralInfoSkeleton = () => (
    <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-4/5" />
    </div>
);

export default function CharacterizationTab({ data, generalInfo, isLoading }: CharacterizationTabProps) {
  const { stats, futureClimate, correlationInsights, id, typeKey } = data;
  
  return (
    <div className="space-y-6 p-6">
        <div className="space-y-3">
            <h3 className="font-headline text-lg font-semibold">Panorama Geral</h3>
            <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-2">
                    {isLoading ? (
                        <GeneralInfoSkeleton />
                    ) : generalInfo ? (
                        <>
                            <GeneralInfoItem label="Estado" value={generalInfo.state} />
                            <GeneralInfoItem label="Município" value={generalInfo.municipality} />
                            <GeneralInfoItem label="Nome do Território" value={generalInfo.territoryName} />
                            <GeneralInfoItem label="Unidade de Conservação" value={generalInfo.conservationUnit} />
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground p-4 text-center">Não foi possível carregar os dados.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            <SectionHeader title="Uso e Cobertura da Terra" tooltipText="Distribuição do uso do solo na área selecionada." />
             <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <LandCoverChart type={typeKey} id={id} />
                </CardContent>
            </Card>
        </div>
        
        <Card className="bg-muted/30">
            <CardHeader className='pb-2'>
                <CardTitle className="text-base font-medium flex items-center gap-2"><Info className="w-4 h-4" />Insights de Correlação</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{correlationInsights}</p>
            </CardContent>
        </Card>

        <div className="space-y-4">
            <SectionHeader 
                title="Clima do Futuro" 
                tooltipText="Projeções de temperatura e precipitação para a área selecionada." 
            />
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <TemperatureTrendChart type={typeKey} id={id} />
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <RainfallTrendChart type={typeKey} id={id} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
