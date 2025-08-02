
"use client";

import React from 'react';
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

const BiodiversityItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
    <div className="flex items-center gap-3">
        {icon}
        <div>
            <div className="font-semibold">{label}</div>
            <div className="text-2xl font-bold text-primary">{value}</div>
        </div>
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

const FrogIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.5 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M14 6.07a6.5 6.5 0 1 1-4 0"/><path d="M10.15 11.23c-.22.33-.35.73-.35 1.17a3.18 3.18 0 0 0 3.18 3.18c.44 0 .84-.13 1.17-.35"/><path d="M21.5 14.5c.33.82 0 1.68-.82 2s-1.68 0-2-.82"/><path d="M2.5 14.5c-.33.82 0 1.68.82 2s1.68 0 2-.82"/></svg>
);

const ReptileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.83 8.17a.5.5 0 0 0-.83.5V11a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .33-.83l-2-2Z"/><path d="m9.42 3.34.46.13a2.17 2.17 0 0 1 1.53 2.12V6.5a1.5 1.5 0 0 0 1.5 1.5h.09a1.5 1.5 0 0 1 1.5 1.5v1.4a.5.5 0 0 0 .5.5h.09a1.41 1.41 0 0 1 1.41 1.41V14a4 4 0 1 1-8 0v-.59a1.41 1.41 0 0 1 1.41-1.41h.09a.5.5 0 0 0 .5-.5v-1.4a1.5 1.5 0 0 1 1.5-1.5h.09a1.5 1.5 0 0 0 1.5-1.5V6.16a2.17 2.17 0 0 1 2.45-2.3Z"/><path d="m3.34 14.6-1.54.54a1 1 0 0 0-.6 1.6l1.3 2.12a1 1 0 0 0 1.6.6l1.54-.54"/><path d="m20.66 14.6 1.54.54a1 1 0 0 1 .6 1.6l-1.3 2.12a1 1 0 0 1-1.6.6l-1.54-.54"/></svg>
);

const MammalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M16 10s-1-2-3-2-3 2-3 2"/><path d="M5.3 11.3C4.2 12.5 4 14.2 4 16c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4 0-1.8-.2-3.5-1.3-4.7-1.3-1.5-3.5-1.8-5.7-1.3-2.2.5-4.5.5-6.7 0-2.2-.5-4.4-.2-5.7 1.3Z"/></svg>
);


export default function ServicesTab({ data }: ServicesTabProps) {
    const { biodiversity, carbon, water } = data;

  return (
    <div className="p-6 space-y-8">
        {/* Biodiversity Section */}
        <div className="space-y-4">
            <SectionHeader title="Biodiversidade" tooltipText="Quantidade média de espécies na área selecionada." />
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <BiodiversityItem icon={<FrogIcon className="w-10 h-10 text-green-500" />} label="Anfíbios" value={biodiversity.amphibians} />
                <BiodiversityItem icon={<Bird className="w-10 h-10 text-red-500" />} label="Aves" value={biodiversity.birds} />
                <BiodiversityItem icon={<MammalIcon className="w-10 h-10 text-yellow-600" />} label="Mamíferos" value={biodiversity.mammals} />
                <BiodiversityItem icon={<TreeDeciduous className="w-10 h-10 text-green-700" />} label="Árvores" value={biodiversity.trees} />
                <BiodiversityItem icon={<ReptileIcon className="w-10 h-10 text-teal-600" />} label="Répteis" value={biodiversity.reptiles} />
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
