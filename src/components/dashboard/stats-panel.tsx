"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../ui/button';
import { Download, Droplets, Leaf } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LandUseData {
  name: string;
  value: number;
  fill: string;
}

export interface StatsData {
  name: string;
  type: string;
  stats: {
    landUse: LandUseData[];
    waterQuality: number;
    vegetationIndex: number;
  };
  correlationInsights: string;
}

interface StatsPanelProps {
  data: StatsData | null;
}

function StatsPanelSkeleton() {
    return (
        <Card className="h-full rounded-none border-l-0 border-r-0 border-t-0 border-b-0">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

export default function StatsPanel({ data }: StatsPanelProps) {
  if (!data) {
    return <StatsPanelSkeleton />;
  }

  return (
    <Card className="flex flex-col h-full rounded-none border-l-0 border-r-0 border-t-0 border-b-0">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{data.name}</CardTitle>
        <CardDescription>{data.type}</CardDescription>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <Tabs defaultValue="characterization" className="w-full">
            <TabsList className="mx-6">
                <TabsTrigger value="characterization">CARACTERIZAÇÃO</TabsTrigger>
                <TabsTrigger value="services">SERVIÇOS AMBIENTAIS</TabsTrigger>
                <TabsTrigger value="ranking">RANKING DE ESPÉCIES</TabsTrigger>
            </TabsList>
            <TabsContent value="characterization">
                <CardContent className="space-y-6 px-6 pb-6 pt-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Land Use</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.stats.landUse} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--card))' }} 
                                    contentStyle={{ 
                                        background: 'hsl(var(--popover))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)'
                                    }}
                                />
                                <Bar dataKey="value" background={{ fill: 'hsl(var(--muted))', radius: 4 }} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-medium flex items-center gap-2"><Droplets className="w-4 h-4 text-accent" /> Water Quality</h3>
                        <span className="text-sm font-semibold">{data.stats.waterQuality}%</span>
                      </div>
                      <Progress value={data.stats.waterQuality} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-medium flex items-center gap-2"><Leaf className="w-4 h-4 text-accent" /> Vegetation Index</h3>
                        <span className="text-sm font-semibold">{data.stats.vegetationIndex}%</span>
                      </div>
                      <Progress value={data.stats.vegetationIndex} />
                    </div>
                  </div>

                  <div>
                     <h3 className="text-sm font-medium mb-2">Latest Insights</h3>
                     <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md border">{data.correlationInsights}</p>
                  </div>

                </CardContent>
            </TabsContent>
            <TabsContent value="services">
                <CardContent className="px-6 pb-6 pt-6">
                    <p className="text-muted-foreground">Painel de Serviços Ambientais em desenvolvimento.</p>
                </CardContent>
            </TabsContent>
            <TabsContent value="ranking">
                <CardContent className="px-6 pb-6 pt-6">
                    <p className="text-muted-foreground">Painel de Ranking de Espécies em desenvolvimento.</p>
                </CardContent>
            </TabsContent>
        </Tabs>
      </ScrollArea>
      <CardFooter className="px-6 pb-6">
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
