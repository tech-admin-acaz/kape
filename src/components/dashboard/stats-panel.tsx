
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '../ui/button';
import { FileText, Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import CharacterizationTab from './stats-panel-tabs/characterization-tab';
import ServicesTab from './stats-panel-tabs/services-tab';
import SpeciesTab from './stats-panel-tabs/species-tab';
import { AICorrelator } from './ai-correlator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TerritoryTypeKey } from '@/models/location.model';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/use-i18n';

interface LandCoverData {
  name: string;
  y: number;
  color: string;
}

export interface GeneralInfo {
    state?: string | null;
    municipality?: string | null;
    territoryName?: string | null;
    conservationUnit?: string | null;
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
  const { toast } = useToast();
  const { t } = useI18n();
  
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [biodiversity, setBiodiversity] = useState<BiodiversityData | null>(null);
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [waterData, setWaterData] = useState<WaterData | null>(null);
  const [species, setSpecies] = useState<SpeciesData[]>([]);

  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const [isBiodiversityLoading, setIsBiodiversityLoading] = useState(true);
  const [isCarbonLoading, setIsCarbonLoading] = useState(true);
  const [isWaterLoading, setIsWaterLoading] = useState(true);
  const [isSpeciesLoading, setIsSpeciesLoading] = useState(true);
  
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

  useEffect(() => {
    if (data && data.id && data.typeKey) {
        const { id, typeKey } = data;

        setIsInfoLoading(true);
        setGeneralInfo(null);
        setIsBiodiversityLoading(true);
        setBiodiversity(null);
        setIsCarbonLoading(true);
        setCarbonData(null);
        setIsWaterLoading(true);
        setWaterData(null);
        setIsSpeciesLoading(true);
        setSpecies([]);

        if (typeKey === 'ti' || typeKey === 'uc') {
            fetch(`/api/metadata/${typeKey}/${id}`)
                .then(res => {
                    if (!res.ok) {
                         if(res.status === 404) return null;
                         throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if(data) setGeneralInfo(data);
                })
                .catch(error => {
                     console.error(`Error fetching metadata for ${typeKey}/${id}:`, error)
                     if (typeKey === 'ti' || typeKey === 'uc') {
                        toast({
                           variant: 'destructive',
                           title: t('errorToastTitle'),
                           description: t('errorToastMetadata'),
                       });
                    }
                })
                .finally(() => setIsInfoLoading(false));
        } else {
            setIsInfoLoading(false);
        }

        fetch(`/api/stats/biodiversity/${typeKey}/${id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => setBiodiversity(data))
            .catch(error => console.error("Error fetching biodiversity data:", error))
            .finally(() => setIsBiodiversityLoading(false));
            
        fetch(`/api/stats/carbon/${typeKey}/${id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => setCarbonData(data))
            .catch(error => console.error("Error fetching carbon data:", error))
            .finally(() => setIsCarbonLoading(false));

        fetch(`/api/stats/water/${typeKey}/${id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => setWaterData(data))
            .catch(error => console.error("Error fetching water data:", error))
            .finally(() => setIsWaterLoading(false));

        fetch(`/api/stats/species/${typeKey}/${id}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setSpecies(data))
            .catch(error => console.error("Error fetching species data:", error))
            .finally(() => setIsSpeciesLoading(false));
    }
  }, [data, toast, t]);
  
  if (!data) {
    return <StatsPanelSkeleton />;
  }
  
  const TABS = {
    characterization: t('characterizationTab'),
    services: t('servicesTab'),
    ranking: t('rankingTab'),
  }

  const servicesLabel = shouldAbbreviate ? t('servicesTabAbbr') : TABS.services;
  const rankingLabel = shouldAbbreviate ? t('rankingTabAbbr') : TABS.ranking;


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
                  <CharacterizationTab data={data} generalInfo={generalInfo} isLoadingInfo={isInfoLoading} />
              </TabsContent>
              <TabsContent value="services" className="mt-0">
                  <ServicesTab 
                      biodiversity={biodiversity}
                      carbonData={carbonData}
                      waterData={waterData}
                      isBiodiversityLoading={isBiodiversityLoading}
                      isCarbonLoading={isCarbonLoading}
                      isWaterLoading={isWaterLoading}
                      data={data}
                  />
              </TabsContent>
              <TabsContent value="ranking" className="mt-0 h-full">
                  <SpeciesTab species={species} isLoading={isSpeciesLoading} />
              </TabsContent>
            </div>
        </Tabs>
        <CardFooter>
            <div className="w-full flex items-center gap-2">
                <AICorrelator>
                    <Button variant="default" className="w-full justify-start">
                        <Wand2 className="w-4 h-4 text-primary-foreground" />
                        {t('aiCorrelatorTrigger')}
                    </Button>
                </AICorrelator>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="flex-shrink-0" 
                                onClick={() => window.open(`/report?areaId=${data.id}&typeKey=${data.typeKey}&areaName=${encodeURIComponent(data.name)}`, '_blank')}
                            >
                                <FileText className="w-5 h-5 text-primary" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('viewPdf')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </CardFooter>
    </div>
  );
}
