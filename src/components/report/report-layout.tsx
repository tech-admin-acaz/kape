
"use client";

import { useSearchParams } from 'next/navigation';
import { mockData } from '@/components/dashboard/mock-data';
import CharacterizationTab from '@/components/dashboard/stats-panel-tabs/characterization-tab';
import ServicesTab from '@/components/dashboard/stats-panel-tabs/services-tab';
import SpeciesTab from '@/components/dashboard/stats-panel-tabs/species-tab';
import { Button } from '../ui/button';
import { Download, FilePlus2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useState } from 'react';

export default function ReportLayout() {
  const searchParams = useSearchParams();
  const areaId = searchParams.get('areaId');
  const data = areaId ? mockData[areaId] : null;

  const [includeSpecies, setIncludeSpecies] = useState(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Selecione uma área no painel para ver o relatório.</p>
      </div>
    );
  }

  const handleDownloadPDF = (includeSpeciesData: boolean) => {
    setIncludeSpecies(includeSpeciesData);
    // This is a placeholder for the print functionality
    // In a real app, this would likely trigger a library like jsPDF or a browser print dialog
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
                <CharacterizationTab data={data} />
            </div>
            
            <div id="services-section" className="pt-8">
                 <h2 className="text-2xl font-bold font-headline mb-4">2. Serviços Ambientais</h2>
                <ServicesTab data={data.environmentalServices} />
            </div>

            {includeSpecies && (
                 <div id="species-section" className="pt-8">
                    <h2 className="text-2xl font-bold font-headline mb-4">3. Ranking de Espécies</h2>
                    <div className="bg-card rounded-lg border">
                        <SpeciesTab species={data.species} />
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
