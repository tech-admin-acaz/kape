
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
    
    // V1 logic: for a city, territoryID is 0. For a territory (estado, ti, uc), cityID is 0.
    const isMunicipio = type === 'municipio';
    const territoryId = isMunicipio ? '0' : id;
    const cityId = isMunicipio ? id : '0';
    
    const apiPath = `${API_BIO_URL}/area/${territoryId}/${cityId}`;


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
