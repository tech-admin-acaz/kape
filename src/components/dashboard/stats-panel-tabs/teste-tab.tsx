
"use client";

import React, { useState, useEffect } from 'react';
import TesteChart from '../charts/teste-chart';
import type { FutureClimateData } from '../stats-panel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TesteTab() {
  const [data, setData] = useState<FutureClimateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://bfkts3jaswinpvxy12014.cleavr.one/api/graph/tas/municipios/141/CESM2/ssp245');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let rawData = await response.json();
        
        // The API might return data in a nested array, e.g. `[[{time, value}, ...]]`
        const chartData = (Array.isArray(rawData) && Array.isArray(rawData[0])) ? rawData[0] : rawData;

        // Ensure data is in the correct format and filter out invalid entries
        const formattedData = chartData
          .filter((d: any) => d && typeof d.value === 'number' && typeof d.trend === 'number')
          .map((d: any) => ({
              year: d.year,
              value: parseFloat(d.value.toFixed(2)),
              trend: parseFloat(d.trend.toFixed(2)),
          }));

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch test chart data:", error);
        setData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-[320px] w-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <TesteChart data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
