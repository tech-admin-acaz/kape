"use client";

import { Location } from "@/components/dashboard/mock-locations";

/**
 * Fetches the XYZ tile URL for the indicator layer.
 * In a real application, this would fetch from a secure API endpoint.
 * For this example, it calls a local API route.
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
 * It calls a local API route which then proxies the request to the external API.
 */
export async function getLocationsByType(type: string): Promise<Location[]> {
    const response = await fetch(`/api/locations/${type}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch locations for type: ${type}`);
    }
    const data = await response.json();
    // Assuming the API returns an array of objects with `value` and `label` properties.
    // If the structure is different, this part will need to be adjusted.
    return data.map((item: any) => ({
        value: item.value || item.id, // Or whatever the unique identifier is
        label: item.label || item.name, // Or whatever the display name is
    }));
}
