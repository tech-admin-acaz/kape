"use client";

import React from 'react';
import TesteChart from '../charts/teste-chart';
import type { FutureClimateData } from '../charts/future-climate-chart';
import { Card, CardContent } from '@/components/ui/card';

interface TesteTabProps {
  data: FutureClimateData[];
}

export default function TesteTab({ data }: TesteTabProps) {
  return (
    <div className="space-y-6 p-6">
        <Card className="bg-muted/30">
            <CardContent className="pt-6">
                <TesteChart data={data} />
            </CardContent>
        </Card>
    </div>
  );
}
