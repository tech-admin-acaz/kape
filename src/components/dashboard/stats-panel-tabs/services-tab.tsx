"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart, LabelList } from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { BiodiversityData, CarbonData, WaterData } from '../stats-panel';
import { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';

interface ServicesTabProps {
  id: string;
  typeKey: TerritoryTypeKey;
}

const formatNumber = (value: number): string => {
    if (value === 0) return "0.00M";
    if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(2)}k`;
    return value.toFixed(2);
};

const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', compactDisplay: 'short' }).format(value);
    return formatted.replace(/\s/g, '').replace('.',',');
};

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

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover text-popover-foreground border rounded-md p-2 shadow-sm text-sm">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((p, index) => (
                    <div key={index} style={{ color: p.color || p.fill }}>
                        <span className="mr-2">●</span>
                        <span>{`${p.name}: `}</span>
                        <span className="font-bold">{p.name === 'Valor' ? formatCurrency(Number(p.value)) : `${formatNumber(Number(p.value))} tCO₂e`}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

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

export default function ServicesTab({ id, typeKey }: ServicesTabProps) {
    const [biodiversity, setBiodiversity] = useState<BiodiversityData | null>(null);
    const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
    const [waterData, setWaterData] = useState<WaterData | null>(null);
    const [isBiodiversityLoading, setIsBiodiversityLoading] = useState(true);
    const [isCarbonLoading, setIsCarbonLoading] = useState(true);
    const [isWaterLoading, setIsWaterLoading] = useState(true);

     useEffect(() => {
        if (!id || !typeKey) {
            setIsBiodiversityLoading(false);
            setIsCarbonLoading(false);
            setIsWaterLoading(false);
            return;
        }

        const fetchBiodiversityData = async () => {
            setIsBiodiversityLoading(true);
            try {
                const response = await fetch(`/api/stats/biodiversity/${typeKey}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch biodiversity data');
                const data = await response.json();
                setBiodiversity(data);
            } catch (error) {
                console.error("Error fetching biodiversity data:", error);
                setBiodiversity(null);
            } finally {
                setIsBiodiversityLoading(false);
            }
        };

        const fetchCarbonData = async () => {
            setIsCarbonLoading(true);
            try {
                const response = await fetch(`/api/stats/carbon/${typeKey}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch carbon data');
                const data = await response.json();
                setCarbonData(data);
            } catch (error) {
                console.error("Error fetching carbon data:", error);
                setCarbonData(null);
            } finally {
                setIsCarbonLoading(false);
            }
        };

        const fetchWaterData = async () => {
            setIsWaterLoading(true);
            try {
                const response = await fetch(`/api/stats/water/${typeKey}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch water data');
                const data = await response.json();
                setWaterData(data);
            } catch (error) {
                console.error("Error fetching water data:", error);
                setWaterData(null);
            } finally {
                setIsWaterLoading(false);
            }
        };

        fetchBiodiversityData();
        fetchCarbonData();
        fetchWaterData();
    }, [id, typeKey]);
    
    const biodiversityCards = biodiversity ? [
      { category: 'Anfíbios', count: biodiversity.amphibians, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'frog tree' },
      { category: 'Aves', count: biodiversity.birds, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'macaw bird' },
      { category: 'Mamíferos', count: biodiversity.mammals, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'jaguar animal' },
      { category: 'Árvores', count: biodiversity.trees, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'brazil nut tree' },
      { category: 'Répteis', count: biodiversity.reptiles, imageUrl: 'https://placehold.co/100x100.png', imageHint: 'green snake' },
    ] : [];

  return (
    <div className="p-6 space-y-8">
        {/* Biodiversity Section */}
        <div className="space-y-4">
            <SectionHeader title="Biodiversidade" tooltipText="Quantidade média de espécies na área selecionada." />
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
                <p className="text-muted-foreground">Não foi possível carregar os dados de biodiversidade.</p>
            )}
        </div>

        {/* Carbon Section */}
        <div className="space-y-4">
            <SectionHeader title="Carbono" tooltipText="Análise de estoque e valoração de serviços de carbono." />
            {isCarbonLoading ? (
                 <DataSkeleton>
                    <Card className="bg-muted/30"><CardContent className="pt-6"><Skeleton className="w-full h-[256px]" /></CardContent></Card>
                    <Card className="bg-muted/30"><CardContent className="pt-6"><Skeleton className="w-full h-[256px]" /></CardContent></Card>
                </DataSkeleton>
            ) : carbonData ? (
                <>
                    <Card className="bg-muted/30">
                        <CardHeader><CardTitle className="text-base font-medium">Atual e Restaurável</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={256}>
                                <ComposedChart data={carbonData.currentAndRestorable} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tickFormatter={(value) => formatNumber(Number(value))} tick={{ fontSize: 12 }} />
                                    <Tooltip 
                                        content={<CustomTooltip />} 
                                        cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                                    />
                                    <Legend wrapperStyle={{fontSize: "12px"}} />
                                    <Bar dataKey="current" name="Atual" stackId="a" fill="hsl(var(--chart-3))">
                                      <LabelList dataKey="current" position="center" formatter={(value: number) => formatNumber(value)} style={{ fill: 'white', fontSize: '12px', fontWeight: 'bold' }} />
                                    </Bar>
                                    <Bar dataKey="restorable" name="Restaurável" stackId="a" fill="hsl(var(--chart-3) / 0.5)" radius={[4, 4, 0, 0]}>
                                      <LabelList dataKey="restorable" position="center" formatter={(value: number) => formatNumber(value)} style={{ fill: 'white', fontSize: '12px', fontWeight: 'bold' }} />
                                    </Bar>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/30">
                        <CardHeader><CardTitle className="text-base font-medium">Valoração de Serviços de Carbono</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={256}>
                                <BarChart data={carbonData.valuation} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
                                    <Tooltip 
                                        content={<CustomTooltip />}
                                        cursor={{ fill: 'hsl(var(--accent) / 0.3)' }} 
                                    />
                                    <Bar dataKey="value" name="Valor" fill="hsl(var(--chart-3) / 0.7)" radius={[0, 4, 4, 0]}>
                                      <LabelList dataKey="value" position="right" formatter={formatCurrency} style={{ fill: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }} offset={10} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </>
            ) : (
                 <p className="text-muted-foreground">Não foi possível carregar os dados de carbono.</p>
            )}
        </div>

        {/* Water Section */}
        <div className="space-y-4">
            <SectionHeader title="Água" tooltipText="Análise de valoração de serviços hídricos." />
            {isWaterLoading ? (
                 <DataSkeleton>
                    <Card className="bg-muted/30"><CardContent className="pt-6"><Skeleton className="w-full h-[256px]" /></CardContent></Card>
                </DataSkeleton>
            ) : waterData ? (
                 <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Valoração de Serviços de Água</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ResponsiveContainer width="100%" height={256}>
                            <BarChart data={waterData.valuation} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
                                <Tooltip 
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'hsl(var(--accent) / 0.3)' }} 
                                />
                                <Bar dataKey="value" name="Valor" fill="hsl(var(--chart-2) / 0.7)" radius={[0, 4, 4, 0]}>
                                  <LabelList dataKey="value" position="right" formatter={formatCurrency} style={{ fill: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }} offset={10}/>
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            ) : (
                <p className="text-muted-foreground">Não foi possível carregar os dados de valoração de água.</p>
            )}
        </div>
    </div>
  );
}
