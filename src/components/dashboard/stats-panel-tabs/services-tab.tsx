
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { BiodiversityData, CarbonData, WaterData } from '../stats-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';
import CarbonStackedBarChart from '../charts/carbon-stacked-bar-chart';
import CarbonValuationBarChart from '../charts/carbon-valuation-bar-chart';
import WaterValuationBarChart from '../charts/water-valuation-bar-chart';


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


const BiodiversityCard = ({
  imageUrl,
  imageHint,
  category,
  count,
}: {
  imageUrl: string;
  imageHint: string;
  category: string;
  count: number;
}) => (
  <div className="bg-card rounded-lg overflow-hidden flex items-center shadow-lg text-card-foreground border">
    <div className="relative w-24 h-24 flex-shrink-0">
      <Image
        src={imageUrl}
        alt={category}
        layout="fill"
        objectFit="cover"
        className="rounded-l-lg"
        data-ai-hint={imageHint}
      />
    </div>
    <div className="p-4">
      <p className="text-lg font-semibold">{category}</p>
      <p className="text-5xl font-bold text-primary">{count}</p>
    </div>
  </div>
);

const DataSkeleton = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-4">
        {children}
    </div>
);

interface ServicesTabProps {
  biodiversity: BiodiversityData | null;
  carbonData: CarbonData | null;
  waterData: WaterData | null;
  isBiodiversityLoading: boolean;
  isCarbonLoading: boolean;
  isWaterLoading: boolean;
  data: any;
}


export default function ServicesTab({
    biodiversity,
    carbonData,
    waterData,
    isBiodiversityLoading,
    isCarbonLoading,
    isWaterLoading,
    data
}: ServicesTabProps) {
    const { t } = useI18n();

    const biodiversityCards = biodiversity ? [
      { category: t('amphibians'), count: biodiversity.amphibians, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'frog tree' },
      { category: t('birds'), count: biodiversity.birds, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'macaw bird' },
      { category: t('mammals'), count: biodiversity.mammals, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'jaguar animal' },
      { category: t('trees'), count: biodiversity.trees, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'brazil nut tree' },
      { category: t('reptiles'), count: biodiversity.reptiles, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'green snake' },
    ] : [];

  return (
    <div className="p-6 space-y-8">
        {/* Biodiversity Section */}
        <div className="space-y-4">
            <SectionHeader title={t('biodiversityTitle')} tooltipText={t('biodiversityTooltip')} />
             {isBiodiversityLoading ? (
                <DataSkeleton>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-card rounded-lg overflow-hidden flex items-center shadow-lg text-card-foreground border">
                                <Skeleton className="w-24 h-24 bg-muted" />
                                <div className="p-4 w-full"><Skeleton className="h-6 w-3/4 mb-2 bg-muted" /><Skeleton className="h-12 w-1/2 bg-muted" /></div>
                            </div>
                        ))}
                    </div>
                </DataSkeleton>
            ) : biodiversity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {biodiversityCards.map((item) => (
                        item.count > 0 && <BiodiversityCard key={item.category} {...item} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">{t('biodiversityError')}</p>
            )}
        </div>

        {/* Carbon Section */}
        <div className="space-y-4">
            <SectionHeader title={t('carbonTitle')} tooltipText={t('carbonTooltip')} />
            <Card className="bg-muted/30">
                <CardHeader><CardTitle className="text-base font-medium">{t('carbonCurrentRestorableTitle')}</CardTitle></CardHeader>
                <CardContent>
                    <CarbonStackedBarChart 
                        data={carbonData?.currentAndRestorable ?? null} 
                        isLoading={isCarbonLoading} 
                    />
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardHeader><CardTitle className="text-base font-medium">{t('carbonValuationTitle')}</CardTitle></CardHeader>
                <CardContent>
                     <CarbonValuationBarChart 
                        data={carbonData?.valuation ?? null} 
                        isLoading={isCarbonLoading} 
                    />
                </CardContent>
            </Card>
        </div>

        {/* Water Section */}
        <div className="space-y-4">
            <SectionHeader title={t('waterTitle')} tooltipText={t('waterTooltip')} />
             <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-base font-medium">{t('waterValuationTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <WaterValuationBarChart 
                        data={waterData?.valuation ?? null} 
                        isLoading={isWaterLoading} 
                    />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
