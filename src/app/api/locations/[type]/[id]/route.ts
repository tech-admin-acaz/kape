
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

/**
 * API route to fetch a single location's details, including GeoJSON.
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

    try {
        const response = await fetch(`${API_BIO_URL}/${fetchType}/${id}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching ${fetchType}/${id} from external API:`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch location data from source` }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error(`Error fetching ${fetchType}/${id} data:`, error);
        return NextResponse.json({ error: `Failed to fetch location data` }, { status: 500 });
    }
}

