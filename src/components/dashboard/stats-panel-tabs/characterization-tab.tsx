"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandCoverChart from '../charts/land-cover-chart';
import FutureClimateChart from '../charts/future-climate-chart';
import type { StatsData } from '../stats-panel';

interface CharacterizationTabProps {
  data: StatsData;
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

const GeneralInfoItem = ({ label, value }: { label: string; value: string | undefined }) => {
    if (!value || value.toLowerCase().includes('sem dados') || value.toLowerCase().includes('undefined')) {
        return null;
    }
    return (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium text-right">{value}</span>
        </div>
    )
};

export default function CharacterizationTab({ data }: CharacterizationTabProps) {
  const { generalInfo, stats, futureClimate, correlationInsights } = data;
  
  return (
    <div className="space-y-6 p-6">
        <div className="space-y-3">
            <h3 className="font-headline text-lg font-semibold">Panorama Geral</h3>
            <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-2">
                    <GeneralInfoItem label="Estado" value={generalInfo.state} />
                    <GeneralInfoItem label="Município" value={generalInfo.municipality} />
                    <GeneralInfoItem label="Terra Indígena" value={generalInfo.territoryName} />
                    <GeneralInfoItem label="Unidade de Conservação" value={generalInfo.conservationUnit} />
                </CardContent>
            </Card>
        </div>

        {/* <div className="space-y-4">
            <SectionHeader title="Uso e Cobertura da Terra" tooltipText="Distribuição do uso do solo na área selecionada." />
            <div className="h-80 w-full">
                <LandCoverChart data={stats.landCover} />
            </div>
        </div> */}
        
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
                     <FutureClimateChart
                        title="Tendência de Temperatura da Superfície"
                        yAxisTitle="Temperatura (°C)"
                        seriesName="Temperatura"
                        seriesType="spline"
                        color="hsl(var(--destructive))"
                        unit="°"
                        data={futureClimate.temperature} 
                    />
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <FutureClimateChart
                        title="Tendência da Chuva Média Anual"
                        yAxisTitle="Precipitação Média"
                        seriesName="Precipitação"
                        seriesType="column"
                        color="hsl(var(--chart-2))"
                        unit="mm"
                        data={futureClimate.precipitation} 
                    />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
