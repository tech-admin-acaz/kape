
import { NextResponse, NextRequest } from 'next/server';
import type { BiodiversityData } from '@/components/dashboard/stats-panel';

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

const labelToKeyMapping: { [key: string]: keyof BiodiversityData } = {
    'anfibios': 'amphibians',
    'passaros': 'birds',
    'mamiferos': 'mammals',
    'repitiles': 'reptiles', // Note: "repitiles" as per example data
    'arvores': 'trees'
};

/**
 * API route to fetch biodiversity statistics for a given location.
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
    
    const apiPath = `${API_BIO_URL}/table/biodiversidade/${fetchType}/${id}`;
    
    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching biodiversity stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch stats data from source: ${errorText}` }, { status: response.status });
        }
        
        const rawData: {label: string, value: number}[] = await response.json();

        if (!Array.isArray(rawData) || rawData.length === 0) {
            return NextResponse.json(null, { status: 404 });
        }

        const formattedData: Partial<BiodiversityData> = {};

        rawData.forEach(item => {
            const key = labelToKeyMapping[item.label.toLowerCase()];
            if (key) {
                formattedData[key] = item.value;
            }
        });
            
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching/processing biodiversity stats from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch or process stats data` }, { status: 500 });
    }
}
