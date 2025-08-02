
"use client";

import SpeciesRankingTable from '../species-ranking-table';
import type { SpeciesData } from '../stats-panel';

interface SpeciesTabProps {
    species: SpeciesData[];
}

export default function SpeciesTab({ species }: SpeciesTabProps) {
    return (
        <SpeciesRankingTable species={species} />
    );
}
