
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

/**
 * API route to fetch locations based on their type (e.g., municipio, estado).
 * This acts as a proxy to avoid exposing the real API URL to the client.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { type: string } }
) {
    let type = params.type;
    const timeKey = `[API] Fetching locations for type: ${type}`;

    if (!API_BIO_URL) {
        return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
    }

    // Validate type to prevent open proxy
    const allowedTypes = ['estado', 'municipio', 'ti', 'uc'];
    if (!allowedTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid location type' }, { status: 400 });
    }

    let fetchType = type;
    if (type === 'estado') {
        fetchType = 'estados';
    } else if (type === 'municipio') {
        fetchType = 'municipios';
    }

    try {
        console.time(timeKey);
        const response = await fetch(`${API_BIO_URL}/${fetchType}`);
        console.timeEnd(timeKey);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching ${fetchType} from external API:`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch ${fetchType} data from source` }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.timeEnd(timeKey);
        console.error(`Error fetching ${fetchType} data:`, error);
        return NextResponse.json({ error: `Failed to fetch ${fetchType} data` }, { status: 500 });
    }
}
