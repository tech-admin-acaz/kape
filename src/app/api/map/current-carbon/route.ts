
import { NextResponse } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

/**
 * API route to fetch the current carbon layer XYZ tile URL.
 * This acts as a proxy to avoid exposing the real API URL and any keys to the client.
 */
export async function GET() {
    if (!API_BIO_URL) {
        return NextResponse.json({ error: 'API URL not configured' }, { status: 500 });
    }
    
    try {
        const response = await fetch(`${API_BIO_URL}/xyz/carbonoAtual`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching current carbon from external API:', response.status, errorText);
            return NextResponse.json({ error: 'Failed to fetch current carbon data from source' }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json({ xyz: data.xyz });

    } catch (error) {
        console.error('Error fetching current carbon XYZ:', error);
        return NextResponse.json({ error: 'Failed to fetch current carbon data' }, { status: 500 });
    }
}
