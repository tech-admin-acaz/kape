
import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import DashboardClient from "@/components/dashboard/dashboard-client";
import type { StatsData } from '@/components/dashboard/stats-panel';
import WelcomeDialog from '@/components/dashboard/welcome-dialog';
import { getIndicatorXYZ, getRestoredCarbonXYZ, getCurrentCarbonXYZ, getOpportunityCostXYZ, getRestorationCostXYZ, getMapbiomasXYZ, getLocationsByType, getLocationDetails } from '@/services/map.service';
import type { FeatureCollection, Geometry } from 'geojson';

// This is now a Server Component to fetch initial data
export default async function DashboardPage() {
    
    // Fetch all layer data and initial geojson on the server
    const [
        indicator,
        restoredCarbon,
        currentCarbon,
        opportunityCost,
        restorationCost,
        mapbiomas,
        states,
    ] = await Promise.all([
        getIndicatorXYZ(),
        getRestoredCarbonXYZ(),
        getCurrentCarbonXYZ(),
        getOpportunityCostXYZ(),
        getRestorationCostXYZ(),
        getMapbiomasXYZ(),
        getLocationsByType('estado').then(async (locations) => {
            const geojson: FeatureCollection<Geometry> = {
                type: 'FeatureCollection',
                features: []
            };
            const promises = locations.map(loc =>
                getLocationDetails('estado', loc.value).then(detail => {
                    if (detail && detail.geom) {
                        geojson.features.push({
                            type: 'Feature',
                            geometry: detail.geom,
                            properties: { name: detail.name, id: detail.id },
                            id: detail.id
                        })
                    }
                })
            );
            await Promise.all(promises);
            return geojson;
        }).catch(error => {
            console.error("Failed to fetch states geojson:", error);
            return null; // Handle error case
        })
    ]);

    const initialLayerData = {
        indicator,
        restoredCarbon,
        currentCarbon,
        opportunityCost,
        restorationCost,
        mapbiomas,
    };

    return (
        <DashboardClient initialLayerData={initialLayerData} statesGeoJSON={states} />
    );
}
