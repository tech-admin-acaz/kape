
import type { Location, TerritoryTypeKey } from "@/models/location.model";

// Function to get the base URL, works on both server and client
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // client-side, relative path
        return '';
    }
    // server-side
    // Use NEXT_PUBLIC_SITE_URL which is automatically set by Firebase App Hosting.
    // Fallback to localhost for local development.
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
};


const fetchWithTiming = async (endpoint: string) => {
    const baseUrl = getBaseUrl();
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    
    const response = await fetch(fullUrl);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching from ${fullUrl}:`, response.status, errorText);
        throw new Error(`Network response was not ok for ${fullUrl}`);
    }
    return response.json();
};


const fetchXYZ = async (endpoint: string): Promise<string | null> => {
    try {
        const data = await fetchWithTiming(endpoint);
        return data.xyz;
    } catch (error) {
        console.error(`Failed to fetch XYZ from ${endpoint}:`, error);
        return null; // Return null on error to avoid breaking the page
    }
};

/**
 * Fetches the XYZ tile URL for the indicator layer.
 */
export async function getIndicatorXYZ(): Promise<string | null> {
    return fetchXYZ('/api/map/indicator');
}

/**
 * Fetches the XYZ tile URL for the restored carbon layer.
 */
export async function getRestoredCarbonXYZ(): Promise<string | null> {
    return fetchXYZ('/api/map/restored-carbon');
}

/**
 * Fetches the XYZ tile URL for the current carbon layer.
 */
export async function getCurrentCarbonXYZ(): Promise<string | null> {
    return fetchXYZ('/api/map/current-carbon');
}

/**
 * Fetches the XYZ tile URL for the opportunity cost layer.
 */
export async function getOpportunityCostXYZ(): Promise<string | null> {
    return fetchXYZ('/api/map/opportunity-cost');
}

/**
 * Fetches the XYZ tile URL for the restoration cost layer.
 */
export async function getRestorationCostXYZ(): Promise<string | null> {
    return fetchXYZ('/api/map/restoration-cost');
}

/**
 * Fetches the XYZ tile URL for the mapbiomas layer.
 */
export async function getMapbiomasXYZ(): Promise<string | null> {
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
    try {
        const data = await fetchWithTiming(`/api/locations/${type}`);
        
        const locations = data.map((item: any) => ({
            value: String(item.id), 
            label: type === 'uc' ? titleCase(item.name) : item.name,
        }));

        locations.sort((a: Location, b: Location) => a.label.localeCompare(b.label));

        return locations;
    } catch (error) {
        console.error(`Failed to get locations for type ${type}:`, error);
        return []; // Return empty array on error
    }
}

/**
 * Fetches a single location's details, including its GeoJSON geometry.
 */
export async function getLocationDetails(type: TerritoryTypeKey, id: string): Promise<any> {
    const data = await fetchWithTiming(`/api/locations/${type}/${id}`);
    
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/locations/by-coords?lat=${lat}&lng=${lng}`);
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
