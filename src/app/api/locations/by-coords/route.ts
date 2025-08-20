
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

/**
 * API route to find a location by its coordinates (lat/lng).
 * Defaults to searching for 'estados'.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const type = 'estados'; // Changed from 'municipios' to 'estados'

    if (!API_BIO_URL) {
        return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
    }

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    try {
        // The external API uses 'estados' in the path for states
        const response = await fetch(`${API_BIO_URL}/action/${type}/${lng}/${lat}`);
        
        if (!response.ok) {
             if (response.status === 404) {
                return NextResponse.json({ error: 'Location not found' }, { status: 404 });
            }
            const errorText = await response.text();
            console.error(`Error fetching by-coords from external API:`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch location data from source` }, { status: response.status });
        }
        
        const data = await response.json();
        // The API returns an array, we are interested in the first element.
        if (data && data.length > 0) {
            return NextResponse.json(data[0]);
        } else {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }

    } catch (error) {
        console.error(`Error fetching by-coords data:`, error);
        return NextResponse.json({ error: `Failed to fetch location data` }, { status: 500 });
    }
}
