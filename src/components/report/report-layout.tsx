
"use client";

import { useSearchParams } from 'next/navigation';
import CharacterizationTab from '@/components/dashboard/stats-panel-tabs/characterization-tab';
import ServicesTab from '@/components/dashboard/stats-panel-tabs/services-tab';
import SpeciesTab from '@/components/dashboard/stats-panel-tabs/species-tab';
import { Button } from '../ui/button';
import { Download, FilePlus2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TerritoryTypeKey } from '@/models/location.model';
import type { StatsData, GeneralInfo } from '../dashboard/stats-panel';
import { Skeleton } from '../ui/skeleton';

const fetchReportData = async (typeKey: TerritoryTypeKey, areaId: string): Promise<[GeneralInfo | null, Partial<StatsData> | null]> => {
     try {
          const response = await fetch(`/api/metadata/${typeKey}/${areaId}`);
          if(!response.ok) {
              const errorText = await response.text();
              console.error("Failed to fetch metadata:", errorText)
              throw new Error('Failed to fetch metadata');
          }
          const info = await response.json();
          let name = `Área ${areaId}`;
          if (info) {
              name = info.conservationUnit || info.territoryName || info.municipality || info.state || `Área ${areaId}`
          }

          const tempData: Partial<StatsData> = {
            id: areaId,
            typeKey: typeKey,
            name: name,
            type: 'Relatório'
          };
          document.title = `Relatório - ${tempData.name}`;
          return [info, tempData];
     } catch (error) {
         console.error("Failed to fetch report data:", error);
         return [null, null];
     }
}

export default function ReportLayout() {
  const searchParams = useSearchParams();
  const areaId = searchParams.get('areaId');
  const typeKey = searchParams.get('typeKey') as TerritoryTypeKey | null;

  const [data, setData] = useState<StatsData | null>(null);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [includeSpecies, setIncludeSpecies] = useState(false);

  useEffect(() => {
    if (areaId && typeKey) {
      const loadData = async () => {
        setIsLoading(true);
        const [info, tempData] = await fetchReportData(typeKey, areaId);
        setGeneralInfo(info);
        setData(tempData as StatsData);
        setIsLoading(false);
      };
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [areaId, typeKey]);


  if (isLoading) {
      return (
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-1/4" />
              <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-48" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
      )
  }

  if (!data || !areaId || !typeKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Selecione uma área no painel para ver o relatório.</p>
      </div>
    );
  }

  const handleDownloadPDF = (includeSpeciesData: boolean) => {
    setIncludeSpecies(includeSpeciesData);
    // This is a placeholder for the print functionality
    // A short delay ensures state is set before printing
    setTimeout(() => {
        window.print();
    }, 100);
  };


  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div>
                    <h1 className="text-2xl font-bold font-headline">{data.name}</h1>
                    <p className="text-sm text-muted-foreground">Relatório de Análise Ambiental</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handleDownloadPDF(false)}>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                    </Button>
                    <Button onClick={() => handleDownloadPDF(true)}>
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Baixar Relatório Completo
                    </Button>
                </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="divide-y divide-border/50 space-y-8">
            <div id="characterization-section">
                <h2 className="text-2xl font-bold font-headline mb-4">1. Caracterização</h2>
                <CharacterizationTab data={data} generalInfo={generalInfo} isLoadingInfo={isLoading} />
            </div>
            
            <div id="services-section" className="pt-8">
                 <h2 className="text-2xl font-bold font-headline mb-4">2. Serviços Ambientais</h2>
                <ServicesTab 
                  id={areaId} 
                  typeKey={typeKey}
                />
            </div>

            {includeSpecies && (
                 <div id="species-section" className="pt-8">
                    <h2 className="text-2xl font-bold font-headline mb-4">3. Ranking de Espécies</h2>
                    <div className="bg-card rounded-lg border">
                        <SpeciesTab id={areaId} typeKey={typeKey} />
                    </div>
                </div>
            )}
        </div>
      </main>

       <style jsx global>{`
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .print-hidden, .print-hidden * {
                    display: none !important;
                }
                main {
                    padding: 0;
                    margin: 0;
                }
                #species-section .overflow-auto {
                    overflow: visible;
                }
                #species-section table {
                  width: 100%;
                  table-layout: fixed;
                  page-break-inside: auto;
                }
                 #species-section tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }
                #species-section thead {
                    display: table-header-group;
                }
            }
        `}</style>
    </div>
  );
}
