"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '../ui/button';
import { FileText, Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import CharacterizationTab from './stats-panel-tabs/characterization-tab';
import ServicesTab from './stats-panel-tabs/services-tab';
import SpeciesTab from './stats-panel-tabs/species-tab';
import { AICorrelator } from './ai-correlator';
import { SparkleIcon } from '../shared/sparkle-icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TerritoryTypeKey } from '@/models/location.model';


interface LandCoverData {
  name: string;
  y: number;
  color: string;
}

interface GeneralInfo {
    state: string;
    municipality: string;
    territoryName: string;
    conservationUnit: string;
}

export interface BiodiversityData {
    amphibians: number;
    birds: number;
    mammals: number;
    trees: number;
    reptiles: number;
}

export interface CarbonData {
    currentAndRestorable: { name: string; current: number; restorable: number; }[];
    valuation: { name: string; value: number; }[];
}

export interface WaterData {
    valuation: { name: string; value: number; }[];
}

export interface SpeciesData {
    id: string;
    name: string;
    resilience: string;
    potential: boolean;
    domestication: boolean;
    availability: boolean;
}

export interface FutureClimateData {
    year: string;
    value: number;
    trend: number;
}

export interface StatsData {
  id: string;
  name: string;
  type: string;
  typeKey: TerritoryTypeKey;
  generalInfo: GeneralInfo;
  stats: {
    landCover: LandCoverData[];
    waterQuality: number;
    vegetationIndex: number;
  };
  environmentalServices: {
    carbon: CarbonData; // This will now be fetched dynamically
    water: WaterData;
  };
  correlationInsights: string;
  species: SpeciesData[];
  futureClimate: {
    temperature: FutureClimateData[];
    precipitation: FutureClimateData[];
  };
}

interface StatsPanelProps {
  data: StatsData | null;
}

function StatsPanelSkeleton() {
    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
            <div className="mt-auto pt-4">
                 <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export default function StatsPanel({ data }: StatsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [shouldAbbreviate, setShouldAbbreviate] = useState(false);
  
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setShouldAbbreviate(entry.contentRect.width <= 450);
      }
    });

    resizeObserver.observe(panel);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  
  if (!data) {
    return <StatsPanelSkeleton />;
  }
  
  const TABS = {
    characterization: "Caracterização",
    services: "Serviços Ambientais",
    ranking: "Ranking de Espécies",
  }

  const servicesLabel = shouldAbbreviate ? "S. Ambientais" : TABS.services;
  const rankingLabel = shouldAbbreviate ? "R. Espécies" : TABS.ranking;


  return (
    <div ref={panelRef} className="h-full flex flex-col">
        <CardHeader>
            <CardDescription>{data.type}</CardDescription>
            <CardTitle className="font-headline text-lg">{data.name}</CardTitle>
        </CardHeader>
      
        <Tabs defaultValue="characterization" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6">
                 <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="characterization" className="flex-1 text-xs md:text-sm">
                        {TABS.characterization}
                    </TabsTrigger>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="services" className="flex-1 text-xs md:text-sm">
                                    {servicesLabel}
                                </TabsTrigger>
                            </TooltipTrigger>
                            {shouldAbbreviate && (
                                <TooltipContent>
                                    <p>{TABS.services}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                     <TooltipProvider>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="ranking" className="flex-1 text-xs md:text-sm">
                                    {rankingLabel}
                                </TabsTrigger>
                            </TooltipTrigger>
                            {shouldAbbreviate && (
                                <TooltipContent>
                                    <p>{TABS.ranking}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="characterization" className="mt-0">
                  <CharacterizationTab data={data} />
              </TabsContent>
              <TabsContent value="services" className="mt-0">
                  <ServicesTab 
                      id={data.id} 
                      typeKey={data.typeKey} 
                  />
              </TabsContent>
              <TabsContent value="ranking" className="mt-0 h-full flex flex-col flex-grow overflow-y-auto">
                  <SpeciesTab id={data.id} typeKey={data.typeKey} />
              </TabsContent>
            </div>
        </Tabs>
        <CardFooter>
            <div className="w-full flex items-center gap-2">
                <AICorrelator>
                    <Button variant="outline" className="w-full justify-start text-muted-foreground bg-white hover:bg-gray-50 border-gray-300 shadow-sm hover:text-foreground">
                        <span className="p-1 rounded-full bg-gradient-to-br from-sparkle-from to-sparkle-to mr-2">
                            <SparkleIcon className="w-4 h-4 text-white" />
                        </span>
                        Aprofundar Análise com IA...
                    </Button>
                </AICorrelator>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="flex-shrink-0 bg-white hover:bg-gray-50 border-gray-300 shadow-sm" 
                                onClick={() => window.open(`/report?areaId=${data.id}&typeKey=${data.typeKey}`, '_blank')}
                            >
                                <FileText className="w-5 h-5 text-primary" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Visualizar PDF</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </CardFooter>
    </div>
  );
}
