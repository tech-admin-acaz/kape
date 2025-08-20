"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandCoverChart from '../charts/land-cover-chart';
import TemperatureTrendChart from '../charts/temperature-trend-chart';
import RainfallTrendChart from '../charts/rainfall-trend-chart';
import type { GeneralInfo, StatsData } from '../stats-panel';
import { Skeleton } from '@/components/ui/skeleton';

interface CharacterizationTabProps {
  data: StatsData;
  generalInfo: GeneralInfo | null;
  isLoadingInfo: boolean;
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
    if (!value) return null;
    return (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium text-right">{value}</span>
        </div>
    )
};


export default function CharacterizationTab({ data, generalInfo, isLoadingInfo }: CharacterizationTabProps) {
  const { id, typeKey } = data;
  
  const displayTerritoryName = typeKey === 'ti' ? generalInfo?.territoryName : null;
  const displayConservationUnit = typeKey === 'uc' ? generalInfo?.conservationUnit : null;
  const showGeneralInfo = typeKey === 'ti' || typeKey === 'uc';


  return (
    <div className="space-y-6 p-6">
        {showGeneralInfo && (
            <div className="space-y-3">
                <h3 className="font-headline text-lg font-semibold">Panorama Geral</h3>
                <Card className="bg-muted/30">
                    <CardContent className="p-4 space-y-2">
                    {isLoadingInfo ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ) : generalInfo ? (
                            <>
                                <GeneralInfoItem label="Estado" value={generalInfo.state} />
                                <GeneralInfoItem label="Município" value={generalInfo.municipality} />
                                <GeneralInfoItem label="Terra Indígena" value={displayTerritoryName} />
                                <GeneralInfoItem label="Unidade de Conservação" value={displayConservationUnit} />
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Não foi possível carregar os dados do panorama geral.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}

        <div className="space-y-4">
            <SectionHeader title="Uso e Cobertura da Terra" tooltipText="Distribuição do uso do solo na área selecionada." />
             <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <LandCoverChart type={typeKey} id={id} />
                </CardContent>
            </Card>
        </div>

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
