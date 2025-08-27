
import React from 'react';
import type { PanelGroup } from "react-resizable-panels";
import DashboardClient from "@/components/dashboard/dashboard-client";
import type { StatsData } from '@/components/dashboard/stats-panel';
import WelcomeDialog from '@/components/dashboard/welcome-dialog';
import { getIndicatorXYZ, getRestoredCarbonXYZ, getCurrentCarbonXYZ, getOpportunityCostXYZ, getRestorationCostXYZ, getMapbiomasXYZ, getLocationsByType, getLocationDetails } from '@/services/map.service';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Location } from '@/models/location.model';

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
        statesGeoJSON,
    ] = await Promise.all([
        getIndicatorXYZ(),
        getRestoredCarbonXYZ(),
        getCurrentCarbonXYZ(),
        getOpportunityCostXYZ(),
        getRestorationCostXYZ(),
        getMapbiomasXYZ(),
        getLocationsByType('estado').catch(err => { 
            console.error("Failed to fetch states list:", err); 
            return []; // Return empty array on error
        }),
        getLocationsByType('estado').then(async (locations) => {
            const geojson: FeatureCollection<Geometry> = {
                type: 'FeatureCollection',
                features: []
            };
            // Fetch all location details in parallel
            const detailPromises = locations.map(loc =>
                getLocationDetails('estado', loc.value).catch(err => {
                    console.error(`Failed to fetch details for state ${loc.value}:`, err);
                    return null; // Return null for failed fetches
                })
            );
            const details = await Promise.all(detailPromises);
            
            // Filter out nulls and push valid features
            details.forEach(detail => {
                 if (detail && detail.geom) {
                    geojson.features.push({
                        type: 'Feature',
                        geometry: detail.geom,
                        properties: { name: detail.name, id: detail.id },
                        id: detail.id
                    })
                }
            })
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
    
    const initialLocations: Record<string, Location[]> = {
        'estado': states,
    }

    return (
        <DashboardClient 
            initialLayerData={initialLayerData} 
            statesGeoJSON={statesGeoJSON}
            initialLocations={initialLocations}
        />
    );
}
