
"use client";

import { useSearchParams } from 'next/navigation';
import CharacterizationTab from '@/components/dashboard/stats-panel-tabs/characterization-tab';
import ServicesTab from '@/components/dashboard/stats-panel-tabs/services-tab';
import SpeciesTab from '@/components/dashboard/stats-panel-tabs/species-tab';
import { Button } from '../ui/button';
import { Download, FilePlus2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TerritoryTypeKey } from '@/models/location.model';
import type { StatsData, GeneralInfo, BiodiversityData, CarbonData, WaterData, SpeciesData } from '../dashboard/stats-panel';
import { Skeleton } from '../ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';

const fetchReportData = async (typeKey: TerritoryTypeKey, areaId: string, areaName: string): Promise<[GeneralInfo | null, Partial<StatsData> | null, BiodiversityData | null, CarbonData | null, WaterData | null, SpeciesData[] | null]> => {
     try {
          const fetchPromises = [
               typeKey === 'ti' || typeKey === 'uc' ? fetch(`/api/metadata/${typeKey}/${areaId}`) : Promise.resolve(null),
               fetch(`/api/stats/biodiversity/${typeKey}/${areaId}`),
               fetch(`/api/stats/carbon/${typeKey}/${areaId}`),
               fetch(`/api/stats/water/${typeKey}/${areaId}`),
               fetch(`/api/stats/species/${typeKey}/${areaId}`)
          ];

          const [infoRes, bioRes, carbonRes, waterRes, speciesRes] = await Promise.all(fetchPromises);

          let info: GeneralInfo | null = null;
          if (infoRes && infoRes.ok) {
              info = await infoRes.json();
          }

          const biodiversity = bioRes.ok ? await bioRes.json() : null;
          const carbonData = carbonRes.ok ? await carbonRes.json() : null;
          const waterData = waterRes.ok ? await waterRes.json() : null;
          const speciesData = speciesRes.ok ? await speciesRes.json() : [];
          
          const tempData: Partial<StatsData> = {
            id: areaId,
            typeKey: typeKey,
            name: areaName,
            type: 'Relatório'
          };
          
          return [info, tempData, biodiversity, carbonData, waterData, speciesData];

     } catch (error) {
         console.error("Failed to fetch report data:", error);
         return [null, null, null, null, null, null];
     }
}

export default function ReportLayout() {
  const searchParams = useSearchParams();
  const areaId = searchParams.get('areaId');
  const typeKey = searchParams.get('typeKey') as TerritoryTypeKey | null;
  const areaName = searchParams.get('areaName');
  const { t } = useI18n();

  const [data, setData] = useState<StatsData | null>(null);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [biodiversity, setBiodiversity] = useState<BiodiversityData | null>(null);
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [waterData, setWaterData] = useState<WaterData | null>(null);
  const [species, setSpecies] = useState<SpeciesData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [includeSpecies, setIncludeSpecies] = useState(false);

  useEffect(() => {
    if (areaId && typeKey && areaName) {
      const loadData = async () => {
        setIsLoading(true);
        const [info, tempData, bioData, carbData, watData, specData] = await fetchReportData(typeKey, areaId, areaName);
        setGeneralInfo(info);
        setData(tempData as StatsData);
        setBiodiversity(bioData);
        setCarbonData(carbData);
        setWaterData(watData);
        setSpecies(specData ?? []);
        if (tempData?.name) {
          document.title = `${t('reportTitle')} - ${tempData.name}`;
        }
        setIsLoading(false);
      };
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [areaId, typeKey, areaName, t]);


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
        <p>{t('reportSelectArea')}</p>
      </div>
    );
  }

  const handleDownloadPDF = (includeSpeciesData: boolean) => {
    setIncludeSpecies(includeSpeciesData);
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
                    <p className="text-sm text-muted-foreground">{t('reportSubtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handleDownloadPDF(false)}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('reportDownloadPdf')}
                    </Button>
                    <Button onClick={() => handleDownloadPDF(true)}>
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        {t('reportDownloadFull')}
                    </Button>
                </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="divide-y divide-border/50 space-y-8">
            <div id="characterization-section">
                <h2 className="text-2xl font-bold font-headline mb-4">1. {t('characterizationTab')}</h2>
                <CharacterizationTab data={data} generalInfo={generalInfo} isLoadingInfo={isLoading} />
            </div>
            
            <div id="services-section" className="pt-8">
                 <h2 className="text-2xl font-bold font-headline mb-4">2. {t('servicesTab')}</h2>
                <ServicesTab 
                  data={data}
                  biodiversity={biodiversity}
                  carbonData={carbonData}
                  waterData={waterData}
                  isBiodiversityLoading={isLoading}
                  isCarbonLoading={isLoading}
                  isWaterLoading={isLoading}
                />
            </div>

            {includeSpecies && (
                 <div id="species-section" className="pt-8">
                    <h2 className="text-2xl font-bold font-headline mb-4">3. {t('rankingTab')}</h2>
                    <div className="bg-card rounded-lg border">
                         <SpeciesTab 
                            species={species}
                            isLoading={isLoading}
                         />
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
