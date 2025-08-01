
"use client";

import React, { useState } from 'react';
import InteractiveMap from './interactive-map';
import StatsPanel from './stats-panel';
import type { StatsData, SpeciesData } from './stats-panel';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

const mockSpecies: SpeciesData[] = [
    { id: '1', name: 'Alibertia latifolia', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '2', name: 'Bellucia klugii', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '3', name: 'Bellucia subandina', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '4', name: 'Coussarea flava', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '5', name: 'Coussarea grandis', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '6', name: 'Coussarea hirticalyx', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '7', name: 'Coussarea hydrangeifolia', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '8', name: 'Coussarea klugii', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '9', name: 'Coussarea paniculata', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '10', name: 'Coussarea rudgeoides', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '11', name: 'Coussarea violacea', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '12', name: 'Dipteryx lacunifera', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '13', name: 'Graffenrieda intermedia', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '14', name: 'Graffenrieda rupestris', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '15', name: 'Henriettea caudata', resilience: '5 - Muito Alta', potential: false, domestication: false, availability: false },
    { id: '16', name: 'Henriettea loretensis', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '17', name: 'Euterpe oleracea', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '18', name: 'Theobroma cacao', resilience: '3 - Média', potential: true, domestication: true, availability: true },
    { id: '19', name: 'Bertholletia excelsa', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: true },
    { id: '20', name: 'Paullinia cupana', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '21', name: 'Bactris gasipaes', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '22', name: 'Mauritia flexuosa', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: true },
    { id: '23', name: 'Myrciaria dubia', resilience: '3 - Média', potential: true, domestication: true, availability: false },
    { id: '24', name: 'Carapa guianensis', resilience: '4 - Alta', potential: true, domestication: false, availability: true },
    { id: '25', name: 'Hevea brasiliensis', resilience: '3 - Média', potential: true, domestication: true, availability: true },
    { id: '26', name: 'Anacardium occidentale', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '27', name: 'Hymenaea courbaril', resilience: '5 - Muito Alta', potential: true, domestication: false, availability: false },
    { id: '28', name: 'Genipa americana', resilience: '4 - Alta', potential: true, domestication: true, availability: true },
    { id: '29', name: 'Annona muricata', resilience: '3 - Média', potential: true, domestication: true, availability: true },
    { id: '30', name: 'Psidium guajava', resilience: '3 - Média', potential: true, domestication: true, availability: true },
];


const mockData: Record<string, StatsData> = {
  "1": {
    name: "T.I. Yanomami",
    type: "Indigenous Territory",
    generalInfo: {
        state: "Roraima (RR)",
        municipality: "Undefined",
        territoryName: "T.I. Yanomami",
        conservationUnit: "Undefined",
    },
    stats: {
      landCover: [
        { name: "Formação Florestal Primária", y: 36.2, color: "hsl(var(--chart-3))" },
        { name: "Outras Formações Naturais", y: 24.5, color: "hsl(var(--chart-2))" },
        { name: "Pastagem", y: 24.2, color: "hsl(var(--chart-4))" },
        { name: "Agricultura", y: 13.3, color: "hsl(var(--chart-5))" },
        { name: "Outros", y: 1.8, color: "hsl(var(--muted))" },
      ],
      waterQuality: 78,
      vegetationIndex: 92,
    },
    environmentalServices: {
      biodiversity: {
        amphibians: 53,
        birds: 470,
        mammals: 129,
        trees: 73,
        reptiles: 131,
      },
      carbon: {
        currentAndRestorable: [
            { name: "Vegetação Primária", current: 348210000, restorable: 0 },
            { name: "Floresta Secundária", current: 0, restorable: 5490000 },
            { name: "Agropecuária", current: 325930000, restorable: 26030000 },
        ],
        valuation: [
            { name: "Vegetação Primária", value: 5000000000 },
            { name: "Floresta Secundária", value: 285000000 },
            { name: "Agropecuária", value: 14000000000 },
        ],
      },
      water: {
        valuation: [
            { name: "Balanço Hídrico", value: 2300000000 },
            { name: "Qualidade da Água", value: 1200000000 },
            { name: "Recarga de Aquífero", value: 850000000 },
        ]
      }
    },
    correlationInsights: "Recent satellite data shows a 2% increase in deforestation on the eastern border, likely linked to illegal mining activities.",
    species: mockSpecies,
  },
  "2": {
    name: "Serra da Canastra",
    type: "National Park",
    generalInfo: {
        state: "Minas Gerais (MG)",
        municipality: "Undefined",
        territoryName: "Undefined",
        conservationUnit: "P.N. Serra da Canastra",
    },
    stats: {
      landCover: [
        { name: "Formação Florestal Primária", y: 20, color: "hsl(var(--chart-3))" },
        { name: "Outras Formações Naturais", y: 60, color: "hsl(var(--chart-2))" },
        { name: "Pastagem", y: 15, color: "hsl(var(--chart-4))" },
        { name: "Agricultura", y: 5, color: "hsl(var(--chart-5))" },
        { name: "Outros", y: 0, color: "hsl(var(--muted))" },
      ],
      waterQuality: 95,
      vegetationIndex: 88,
    },
    environmentalServices: {
      biodiversity: {
        amphibians: 40,
        birds: 350,
        mammals: 100,
        trees: 150,
        reptiles: 90,
      },
      carbon: {
        currentAndRestorable: [
          { name: "Vegetação Primária", current: 450000000, restorable: 1000000 },
          { name: "Floresta Secundária", current: 10000000, restorable: 15000000 },
          { name: "Agropecuária", current: 100000000, restorable: 50000000 },
        ],
        valuation: [
            { name: "Vegetação Primária", value: 8000000000 },
            { name: "Floresta Secundária", value: 500000000 },
            { name: "Agropecuária", value: 8000000000 },
        ],
      },
       water: {
        valuation: [
            { name: "Balanço Hídrico", value: 3300000000 },
            { name: "Qualidade da Água", value: 2200000000 },
            { name: "Recarga de Aquífero", value: 1850000000 },
        ]
      }
    },
    correlationInsights: "The park's water sources remain pristine, showing high resilience to surrounding agricultural activities.",
    species: mockSpecies.slice().reverse(), // just to show different data
  },
};

export default function DashboardClient() {
  const [selectedArea, setSelectedArea] = useState<StatsData | null>(mockData["1"]);

  const handleAreaSelect = (areaId: string | null) => {
    if (areaId && mockData[areaId]) {
      setSelectedArea(mockData[areaId]);
    } else {
      setSelectedArea(null);
    }
  };

  return (
    <ResizablePanelGroup 
        direction="horizontal"
        className="h-[calc(100vh-3.5rem)] w-full"
    >
        <ResizablePanel defaultSize={67}>
            <div className="h-full overflow-hidden">
                <InteractiveMap onAreaSelect={handleAreaSelect} />
            </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33}>
            <StatsPanel data={selectedArea} />
        </ResizablePanel>
    </ResizablePanelGroup>
  );
}
