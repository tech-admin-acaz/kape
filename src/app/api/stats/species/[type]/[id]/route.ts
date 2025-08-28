
import { NextResponse, NextRequest } from 'next/server';
import type { SpeciesData } from '@/components/dashboard/stats-panel';

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

/**
 * API route to fetch species data for a given location.
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

    let fetchType = type;
    if (type === 'estado') {
        fetchType = 'estados';
    } else if (type === 'municipio') {
        fetchType = 'municipios';
    }
    
    const apiPath = `${API_BIO_URL}/table/especies/${fetchType}/${id}`;
    
    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching species data from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch species data from source: ${errorText}` }, { status: response.status });
        }
        
        const rawData: any[] = await response.json();

        if (!Array.isArray(rawData)) {
            return NextResponse.json([], { status: 200 });
        }

        const formattedData: SpeciesData[] = rawData.map(item => ({
            id: String(item.id),
            name: item.species,
            resilience: item.climate_resistence,
            potential: item.utility === 'check',
            domestication: item.domestication === 'check',
            availability: item.market_availability === 'check'
        }));
            
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching/processing species data from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch or process species data` }, { status: 500 });
    }
}
