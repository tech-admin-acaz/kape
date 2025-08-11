
"use client";

import type { Location, TerritoryTypeKey } from "@/models/location.model";

const fetchXYZ = async (endpoint: string): Promise<string> => {
    const response = await fetch(endpoint);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching from ${endpoint}:`, response.status, errorText);
        throw new Error(`Network response was not ok for ${endpoint}`);
    }
    const data = await response.json();
    return data.xyz;
};

/**
 * Fetches the XYZ tile URL for the indicator layer.
 */
export async function getIndicatorXYZ(): Promise<string> {
    return fetchXYZ('/api/map/indicator');
}

/**
 * Fetches the XYZ tile URL for the restored carbon layer.
 */
export async function getRestoredCarbonXYZ(): Promise<string> {
    return fetchXYZ('/api/map/restored-carbon');
}

/**
 * Fetches the XYZ tile URL for the current carbon layer.
 */
export async function getCurrentCarbonXYZ(): Promise<string> {
    return fetchXYZ('/api/map/current-carbon');
}

/**
 * Fetches the XYZ tile URL for the opportunity cost layer.
 */
export async function getOpportunityCostXYZ(): Promise<string> {
    return fetchXYZ('/api/map/opportunity-cost');
}

/**
 * Fetches the XYZ tile URL for the restoration cost layer.
 */
export async function getRestorationCostXYZ(): Promise<string> {
    return fetchXYZ('/api/map/restoration-cost');
}

/**
 * Fetches the XYZ tile URL for the mapbiomas layer.
 */
export async function getMapbiomasXYZ(): Promise<string> {
    return fetchXYZ('/api/map/mapbiomas');
}

/**
 * Fetches locations based on the territory type.
 */
export async function getLocationsByType(type: TerritoryTypeKey): Promise<Location[]> {
    const response = await fetch(`/api/locations/${type}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch locations for type: ${type}`);
    }
    const data = await response.json();
    // API returns id as number, but CommandItem in shadcn expects string value
    const locations = data.map((item: any) => ({
        value: String(item.id), 
        label: item.name,
    }));

    // Sort locations alphabetically by label
    locations.sort((a, b) => a.label.localeCompare(b.label));

    return locations;
}

/**
 * Fetches a single location's details, including its GeoJSON geometry.
 */
export async function getLocationDetails(type: TerritoryTypeKey, id: string): Promise<any> {
    const response = await fetch(`/api/locations/${type}/${id}`);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching location details for ${type}/${id}:`, response.status, errorText);
        throw new Error(`Failed to fetch location details for ${type}/${id}`);
    }
    const data = await response.json();
    // The API wraps the result in an array, so we return the first element.
    return data && data.length > 0 ? data[0] : null;
}

/**
 * Fetches a location based on geographic coordinates.
 */
export async function getLocationByCoords(lat: number, lng: number): Promise<any> {
    const response = await fetch(`/api/locations/by-coords?lat=${lat}&lng=${lng}`);
     if (!response.ok) {
        if (response.status === 404) {
            console.log(`Location not found for coords ${lat},${lng}`);
            return null; // Return null specifically for 404
        }
        const errorText = await response.text();
        console.error(`Error fetching location by coords:`, response.status, errorText);
        throw new Error(`Failed to fetch location by coords`);
    }
    return await response.json();
}

/**
 * Fetches land cover statistics for a given location.
 */
export async function getLandCoverStats(type: TerritoryTypeKey, id: string): Promise<any> {
    const response = await fetch(`/api/stats/land-cover/${type}/${id}`);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching land cover stats for ${type}/${id}:`, response.status, errorText);
        throw new Error(`Failed to fetch land cover stats for ${type}/${id}`);
    }
    const data = await response.json();
    // The API returns an array, so we return the first element.
    return data && data.length > 0 ? data[0] : null;
}
