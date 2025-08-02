"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FutureClimateData } from './future-climate-chart';
import CharacterizationTab from './stats-panel-tabs/characterization-tab';
import ServicesTab from './stats-panel-tabs/services-tab';
import SpeciesTab from './stats-panel-tabs/species-tab';


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

interface BiodiversityData {
    amphibians: number;
    birds: number;
    mammals: number;
    trees: number;
    reptiles: number;
}

interface CarbonData {
    currentAndRestorable: { name: string; current: number; restorable: number; }[];
    valuation: { name: string; value: number; }[];
}

interface WaterData {
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

export interface StatsData {
  name: string;
  type: string;
  generalInfo: GeneralInfo;
  stats: {
    landCover: LandCoverData[];
    waterQuality: number;
    vegetationIndex: number;
  };
  environmentalServices: {
    biodiversity: BiodiversityData;
    carbon: CarbonData;
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

  if (!data) {
    return <StatsPanelSkeleton />;
  }

  return (
    <div className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">{data.name}</CardTitle>
            <CardDescription>{data.type}</CardDescription>
        </CardHeader>
      
        <Tabs defaultValue="characterization" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6">
              <TabsList className="w-full">
                  <TabsTrigger value="characterization" className="flex-1">CARACTERIZAÇÃO</TabsTrigger>
                  <TabsTrigger value="services" className="flex-1">SERVIÇOS AMBIENTAIS</TabsTrigger>
                  <TabsTrigger value="ranking" className="flex-1">RANKING DE ESPÉCIES</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="characterization" className="mt-0">
                  <CharacterizationTab data={data} />
              </TabsContent>
              <TabsContent value="services" className="mt-0">
                  <ServicesTab data={data.environmentalServices} />
              </TabsContent>
              <TabsContent value="ranking" className="mt-0 h-full flex flex-col flex-grow overflow-y-auto">
                  <SpeciesTab species={data.species} />
              </TabsContent>
            </div>
        </Tabs>
        <CardFooter>
            <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </CardFooter>
    </div>
  );
}
