
import type { Location, TerritoryTypeKey } from "@/models/location.model";

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

// Base fetch function
const fetchFromExternalAPI = async (path: string) => {
    if (!API_BIO_URL) {
        console.error('API URL not configured');
        throw new Error('API URL not configured');
    }
    const fullUrl = `${API_BIO_URL}/${path}`;
    const response = await fetch(fullUrl, { cache: 'no-store' }); // Use no-store to prevent caching issues

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching from ${fullUrl}:`, response.status, errorText);
        throw new Error(`Failed to fetch from external API: ${fullUrl}`);
    }
    return response.json();
};


// --- Functions to fetch XYZ tile URLs ---

export async function fetchIndicatorXYZ(): Promise<string | null> {
    try {
        const data = await fetchFromExternalAPI('xyz/indicador');
        return data.xyz;
    } catch (error) {
        console.error('Failed to fetch IndicatorXYZ:', error);
        return null;
    }
}

export async function fetchRestoredCarbonXYZ(): Promise<string | null> {
    try {
        const data = await fetchFromExternalAPI('xyz/carbonoRestauracao');
        return data.xyz;
    } catch (error) {
        console.error('Failed to fetch RestoredCarbonXYZ:', error);
        return null;
    }
}

export async function fetchCurrentCarbonXYZ(): Promise<string | null> {
    try {
        const data = await fetchFromExternalAPI('xyz/carbonoAtual');
        return data.xyz;
    } catch (error) {
        console.error('Failed to fetch CurrentCarbonXYZ:', error);
        return null;
    }
}

export async function fetchOpportunityCostXYZ(): Promise<string | null> {
    try {
        const data = await fetchFromExternalAPI('xyz/oportunidade');
        return data.xyz;
    } catch (error) {
        console.error('Failed to fetch OpportunityCostXYZ:', error);
        return null;
    }
}

export async function fetchRestorationCostXYZ(): Promise<string | null> {
    try {
        const data = await fetchFromExternalAPI('xyz/restauracao');
        return data.xyz;
    } catch (error) {
        console.error('Failed to fetch RestorationCostXYZ:', error);
        return null;
    }
}

export async function fetchMapbiomasXYZ(): Promise<string | null> {
    try {
        const data = await fetchFromExternalAPI('xyz/mapbiomas');
        return data.xyz;
    } catch (error) {
        console.error('Failed to fetch MapbiomasXYZ:', error);
        return null;
    }
}


const titleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return (word.length > 3) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }).join(' ');
}


// --- Functions to fetch Location Data ---

/**
 * Fetches locations list by territory type from the external API.
 */
export async function getLocationsByType(type: TerritoryTypeKey): Promise<Location[]> {
    let fetchType = type;
    if (type === 'estado') {
        fetchType = 'estados' as any;
    } else if (type === 'municipio') {
        fetchType = 'municipios' as any;
    }

    try {
        const data = await fetchFromExternalAPI(fetchType);
        
        const locations = data.map((item: any) => ({
            value: String(item.id), 
            label: type === 'uc' ? titleCase(item.name) : item.name,
        }));

        locations.sort((a: Location, b: Location) => a.label.localeCompare(b.label));

        return locations;
    } catch (error) {
        console.error(`Failed to get locations for type ${type}:`, error);
        return [];
    }
}

/**
 * Fetches a single location's details from the external API.
 */
export async function getLocationDetails(type: TerritoryTypeKey, id: string): Promise<any> {
    let fetchType = type;
    if (type === 'estado') {
        fetchType = 'estados' as any;
    } else if (type === 'municipio') {
        fetchType = 'municipios' as any;
    }
    
    const data = await fetchFromExternalAPI(`${fetchType}/${id}`);
    
    if (data) {
        // The API returns an array for estado/municipio, but a direct object for ti/uc
        const details = Array.isArray(data) ? data[0] : data;
        
        if (details.geom && details.geom.geom) {
            details.geom = details.geom.geom;
        }

        if (type === 'uc' && details.name) {
            details.name = titleCase(details.name);
        }
        return details;
    }
    return null;
}

/**
 * Fetches a location based on geographic coordinates from the external API.
 * This function will be called by the internal API route.
 */
export async function getLocationByCoords(lat: number, lng: number): Promise<any> {
     // Defaults to searching for 'estados' as a fallback
    const data = await fetchFromExternalAPI(`action/estados/${lng}/${lat}`);
    
    // The API returns an array, we are interested in the first element.
    if (data && data.length > 0) {
        return data[0];
    }
    return null;
}
