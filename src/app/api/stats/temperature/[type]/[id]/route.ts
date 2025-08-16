
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

    let territoryId: string;
    let cityId: string;

    if (type === 'municipio') {
        cityId = id;
        territoryId = '0';
    } else { // estado, ti, uc
        territoryId = id;
        cityId = '0';
    }
    
    const apiPath = `${API_BIO_URL}/graph/tas/${territoryId}/${cityId}/${model}/${scenario}`;
    console.log("Fetching temperature stats from URL:", apiPath);

    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching temperature stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch temperature stats from source` }, { status: response.status });
        }
        
        const data = await response.json();
        // The V1 API returns data in a nested array, e.g. `[[{time, value}, ...]]`
        // We will return the inner array if it exists.
        if (Array.isArray(data) && Array.isArray(data[0])) {
            return NextResponse.json(data[0]);
        }
        // If it's just a single array, return it directly.
        return NextResponse.json(data);

    } catch (error) {
        console.error(`Error fetching temperature stats from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch temperature stats` }, { status: 500 });
    }
}
