
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

/**
 * API route to fetch temperature statistics for a given location.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { type: string, id: string } }
) {
    const { type, id } = params;
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model') || 'ipsl-cm6a-lr';
    const scenario = searchParams.get('scenario') || 'ssp585';

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

    // V1 logic suggests that for stats, we might need to send 0 for the unused ID.
    // e.g., for a city, territoryID is 0. For a territory (estado, ti, uc), cityID is 0.
    const isTerritory = type === 'estado' || type === 'ti' || type === 'uc';
    const territoryId = isTerritory ? id : '0';
    const cityId = type === 'municipio' ? id : '0';
    
    const apiPath = `${API_BIO_URL}/graph/tas/${territoryId}/${cityId}/${model}/${scenario}`;

    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching temperature stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch temperature stats from source` }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error(`Error fetching temperature stats from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch temperature stats` }, { status: 500 });
    }
}
