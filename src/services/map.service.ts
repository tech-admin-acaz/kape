
"use client";

import type { Location, TerritoryTypeKey } from "@/models/location.model";

/**
 * Fetches the XYZ tile URL for the indicator layer.
 */
export async function getIndicatorXYZ(): Promise<string> {
    const response = await fetch('/api/map/indicator');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.xyz;
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
    return data.map((item: any) => ({
        value: String(item.id), 
        label: item.name,
    }));
}

/**
 * Fetches a single location's details, including its GeoJSON geometry.
 */
export async function getLocationDetails(type: TerritoryTypeKey, id: string): Promise<any> {
    const response = await fetch(`/api/locations/${type}/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch location details for ${type}/${id}`);
    }
    return await response.json();
}
