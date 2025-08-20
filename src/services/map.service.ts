
"use client";

import type { Location, TerritoryTypeKey } from "@/models/location.model";

const fetchWithTiming = async (endpoint: string, key: string) => {
    console.time(key);
    const response = await fetch(endpoint);
    console.timeEnd(key);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching from ${endpoint}:`, response.status, errorText);
        throw new Error(`Network response was not ok for ${endpoint}`);
    }
    return response.json();
};


const fetchXYZ = async (endpoint: string): Promise<string> => {
    const data = await fetchWithTiming(endpoint, `[Client] Fetching XYZ for ${endpoint}`);
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

const titleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return (word.length > 3) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }).join(' ');
}


/**
 * Fetches locations based on the territory type.
 */
export async function getLocationsByType(type: TerritoryTypeKey): Promise<Location[]> {
    const data = await fetchWithTiming(`/api/locations/${type}`, `[Client] Fetching locations for type: ${type}`);
    
    const locations = data.map((item: any) => ({
        value: String(item.id), 
        label: type === 'uc' ? titleCase(item.name) : item.name,
    }));

    locations.sort((a: Location, b: Location) => a.label.localeCompare(b.label));

    return locations;
}

/**
 * Fetches a single location's details, including its GeoJSON geometry.
 */
export async function getLocationDetails(type: TerritoryTypeKey, id: string): Promise<any> {
    const data = await fetchWithTiming(`/api/locations/${type}/${id}`, `[Client] Fetching location details for ${type}/${id}`);
    
    if (data && data.length > 0) {
        const details = data[0];
        if (type === 'uc' && details.name) {
            details.name = titleCase(details.name);
        }
        return details;
    }
    return null;
}

/**
 * Fetches a location based on geographic coordinates.
 */
export async function getLocationByCoords(lat: number, lng: number): Promise<any> {
    const timeKey = `[Client] Fetching location by coords: ${lat},${lng}`;
    console.time(timeKey);
    const response = await fetch(`/api/locations/by-coords?lat=${lat}&lng=${lng}`);
    console.timeEnd(timeKey);
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
