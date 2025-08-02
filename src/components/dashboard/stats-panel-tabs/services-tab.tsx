
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Bird, TreeDeciduous } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart } from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { StatsData } from '../stats-panel';

type EnvironmentalServicesData = StatsData['environmentalServices'];

interface ServicesTabProps {
  data: EnvironmentalServicesData;
}

const formatNumber = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}bi`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toString();
};

const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value);
    return formatted.replace(/\s/g, '');
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

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-popover text-popover-foreground border rounded-md p-2 shadow-sm text-sm">
                <p className="font-bold mb-1">{data.name}</p>
                <p>
                    Percentual de Area: {(payload[0].value as number).toFixed(1)}%
                </p>
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
  <div className="bg-gray-800 rounded-lg overflow-hidden flex items-center shadow-lg text-white">
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
      <p className="text-5xl font-bold text-lime-400">{count}</p>
    </div>
  </div>
);

export default function ServicesTab({ data }: ServicesTabProps) {
    const { biodiversity, carbon, water } = data;
    const biodiversityData = [
      {
        category: 'Anfíbios',
        count: biodiversity.amphibians,
        imageUrl: 'https://placehold.co/100x100.png',
        imageHint: 'frog tree',
      },
      {
        category: 'Aves',
        count: biodiversity.birds,
        imageUrl: 'https://placehold.co/100x100.png',
        imageHint: 'macaw bird',
      },
      {
        category: 'Mamíferos',
        count: biodiversity.mammals,
        imageUrl: 'https://placehold.co/100x100.png',
        imageHint: 'jaguar animal',
      },
      {
        category: 'Árvores',
        count: biodiversity.trees,
        imageUrl: 'https://placehold.co/100x100.png',
        imageHint: 'brazil nut tree',
      },
      {
        category: 'Répteis',
        count: biodiversity.reptiles,
        imageUrl: 'https://placehold.co/100x100.png',
        imageHint: 'green snake',
      },
    ];

  return (
    <div className="p-6 space-y-8">
        {/* Biodiversity Section */}
        <div className="space-y-4">
            <SectionHeader title="Biodiversidade" tooltipText="Quantidade média de espécies na área selecionada." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {biodiversityData.map((item) => (
                    <BiodiversityCard key={item.category} {...item} />
                ))}
            </div>
        </div>

        {/* Carbon Section */}
        <div className="space-y-4">
            <SectionHeader title="Carbono" tooltipText="Análise de estoque e valoração de serviços de carbono." />
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Atual e Restaurável</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={256}>
                        <ComposedChart data={carbon.currentAndRestorable} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            <Bar dataKey="current" name="Atual" stackId="a" fill="hsl(var(--chart-3))" />
                            <Bar dataKey="restorable" name="Restaurável" stackId="a" fill="hsl(var(--chart-3) / 0.5)" radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Valoração de Serviços de Carbono</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={carbon.valuation} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="Valor" fill="hsl(var(--chart-3) / 0.7)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        {/* Water Section */}
        <div className="space-y-4">
            <SectionHeader title="Água" tooltipText="Análise de valoração de serviços hídricos." />
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Valoração de Serviços de Água</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={256}>
                        <BarChart data={water.valuation} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="Valor" fill="hsl(var(--chart-2) / 0.7)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
