
"use client";

import React from 'react';
import SpeciesRankingTable from '../species-ranking-table';
import type { SpeciesData } from '../stats-panel';
import { Skeleton } from '@/components/ui/skeleton';

interface SpeciesTabProps {
    species: SpeciesData[];
    isLoading: boolean;
}

const TableSkeleton = () => (
    <div className="space-y-4 p-6">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="border rounded-md">
            <div className="p-4 border-b"><Skeleton className="h-6 w-full" /></div>
            <div className="p-4 space-y-3">
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
        </div>
         <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 w-1/3" />
        </div>
    </div>
);


export default function SpeciesTab({ species, isLoading }: SpeciesTabProps) {
    if(isLoading) {
        return <TableSkeleton />;
    }

    return (
        <SpeciesRankingTable species={species} />
    );
};
