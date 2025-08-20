"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandCoverChart from '../charts/land-cover-chart';
import TemperatureTrendChart from '../charts/temperature-trend-chart';
import RainfallTrendChart from '../charts/rainfall-trend-chart';
import type { GeneralInfo, StatsData } from '../stats-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';

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
  const { t } = useI18n();
  
  const displayTerritoryName = typeKey === 'ti' ? generalInfo?.territoryName : null;
  const displayConservationUnit = typeKey === 'uc' ? generalInfo?.conservationUnit : null;
  const showGeneralInfo = typeKey === 'ti' || typeKey === 'uc';


  return (
    <div className="space-y-6 p-6">
        {showGeneralInfo && (
            <div className="space-y-3">
                <h3 className="font-headline text-lg font-semibold">{t('generalOverview')}</h3>
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
                                <GeneralInfoItem label={t('state')} value={generalInfo.state} />
                                <GeneralInfoItem label={t('municipality')} value={generalInfo.municipality} />
                                <GeneralInfoItem label={t('indigenousLand')} value={displayTerritoryName} />
                                <GeneralInfoItem label={t('conservationUnit')} value={displayConservationUnit} />
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t('generalOverviewError')}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}

        <div className="space-y-4">
            <SectionHeader title={t('landCoverTitle')} tooltipText={t('landCoverTooltip')} />
             <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <LandCoverChart type={typeKey} id={id} />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            <SectionHeader 
                title={t('futureClimateTitle')} 
                tooltipText={t('futureClimateTooltip')} 
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
