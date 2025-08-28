
import { NextResponse, NextRequest } from 'next/server';
import type { WaterData } from '@/components/dashboard/stats-panel';

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

const labelMapping: { [key: string]: string } = {
    'Vegetacao_Primaria': 'Vegetação Primária',
    'Vegetacao_Secundaria': 'Vegetação Secundária',
    'Agropecuaria': 'Agropecuária',
};

/**
 * API route to fetch water valuation statistics for a given location.
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
    
    const valuationPath = `${API_BIO_URL}/graph/agua/${fetchType}/${id}`;
    
    try {
        const valuationRes = await fetch(valuationPath);
        
        if (!valuationRes.ok) {
            const errorText = await valuationRes.text();
            console.error(`Error fetching water valuation stats from external API (${valuationPath}):`, valuationRes.status, errorText);
            return NextResponse.json({ error: `Failed to fetch valuation data from source: ${errorText}` }, { status: valuationRes.status });
        }
        const rawValuationData: {label: string, value: number}[] = await valuationRes.json();

        // Process Valuation data
        const valuation = (Array.isArray(rawValuationData)) 
            ? rawValuationData.map(item => ({ name: labelMapping[item.label] || item.label, value: item.value })).filter(v => v.value > 0)
            : [];

        const formattedData: WaterData = {
            valuation
        };
            
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching/processing water stats from API:`, error);
        return NextResponse.json({ error: `Failed to fetch or process stats data` }, { status: 500 });
    }
}
