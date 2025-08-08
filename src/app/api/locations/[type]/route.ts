
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
    const type = params.type;

    if (!API_BIO_URL) {
        return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
    }

    // Validate type to prevent open proxy
    const allowedTypes = ['estado', 'municipio', 'ti', 'uc'];
    if (!allowedTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid location type' }, { status: 400 });
    }

    try {
        const response = await fetch(`${API_BIO_URL}/${type}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching ${type} from external API:`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch ${type} data from source` }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return NextResponse.json({ error: `Failed to fetch ${type} data` }, { status: 500 });
    }
}
