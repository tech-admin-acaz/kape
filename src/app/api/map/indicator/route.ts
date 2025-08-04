
import { NextResponse } from 'next/server';

// This is a placeholder for the actual API URL, which should be in an environment variable.
const API_BIO_URL = process.env.API_BIO_URL || 'https://api.example.com';

/**
 * API route to fetch the indicator layer XYZ tile URL.
 * This acts as a proxy to avoid exposing the real API URL and any keys to the client.
 */
export async function GET() {
    try {
        // In a real-world scenario, you would fetch from the external API.
        // For this example, we are returning a mock Mapbox tile URL.
        // const response = await fetch(`${API_BIO_URL}/xyz/indicador`);
        // const data = await response.json();
        // return NextResponse.json({ xyz: data.xyz });

        // Using a mock URL for demonstration purposes
        const mockXYZ = "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
        return NextResponse.json({ xyz: mockXYZ });

    } catch (error) {
        console.error('Error fetching indicator XYZ:', error);
        return NextResponse.json({ error: 'Failed to fetch indicator data' }, { status: 500 });
    }
}
