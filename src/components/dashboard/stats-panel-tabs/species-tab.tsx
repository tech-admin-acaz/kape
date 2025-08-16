"use client";

import React, { useState, useEffect } from 'react';
import SpeciesRankingTable from '../species-ranking-table';
import type { SpeciesData } from '../stats-panel';
import { TerritoryTypeKey } from '@/models/location.model';
import { Skeleton } from '@/components/ui/skeleton';

interface SpeciesTabProps {
    id: string;
    typeKey: TerritoryTypeKey;
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


export default function SpeciesTab({ id, typeKey }: SpeciesTabProps) {
    const [species, setSpecies] = useState<SpeciesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id || !typeKey) {
            setIsLoading(false);
            return;
        }

        const fetchSpeciesData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/stats/species/${typeKey}/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch species data');
                }
                const data = await response.json();
                setSpecies(data);
            } catch (error) {
                console.error("Error fetching species data:", error);
                setSpecies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpeciesData();
    }, [id, typeKey]);

    if(isLoading) {
        return <TableSkeleton />;
    }

    return (
        <SpeciesRankingTable species={species} />
    );
}
