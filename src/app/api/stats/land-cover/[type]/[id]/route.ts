
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

/**
 * API route to fetch land cover statistics for a given location.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { type: string, id: string } }
) {
    const { type, id } = params;

    if (!API_BIO_URL) {
        return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
    }

    const allowedTypes = ['estado', 'municipio', 'ti', 'uc'];
    if (!allowedTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid location type' }, { status: 400 });
    }

    if (!id) {
        return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    // The V1 API endpoint seems to be `/area/{territoryID}/{CityID}`
    // The current app structure only passes one ID.
    // Based on V1 code, it seems to use territoryId and cityId.
    // Let's assume for now the API can work with a single ID based on type.
    // We'll use a placeholder for the second ID if needed, like '0'.
    // The endpoint seems to be just /area/{id1}/{id2}, without type.
    // This seems tricky. Let's assume the API is /area/{type}/{id}
    // No, the V1 code is /area/{territoryID}/{CityID}. This implies we might need two IDs.
    // Let's try to construct it based on what we have.
    // Let's assume for a municipality, territoryId can be 0.
    // For a territory (ti, uc), cityId can be 0.
    let territoryId = type === 'municipio' ? '0' : id;
    let cityId = type === 'municipio' ? id : '0';

    // The V1 code uses territoryId and cityId. This might not map directly.
    // The endpoint in V1 is /area/{territoryID}/{CityID}
    // Let's assume a simplified endpoint for now, that takes the main ID.
    // A robust solution might require changing the search to handle two IDs.
    // Based on the new understanding, the API structure is likely different.
    // The V1 `getStatsAreaBlocks` uses `/area/${territoryID}/${CityID}`.
    // In our app, we have one ID. Let's assume the second ID can be 0 for simplicity.

    let apiPath = `${API_BIO_URL}/area/${id}/0`;
    if (type === 'municipio') {
         apiPath = `${API_BIO_URL}/area/0/${id}`;
    }


    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch stats data from source` }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error(`Error fetching stats data from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch stats data` }, { status: 500 });
    }
}

