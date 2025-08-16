
import { NextResponse, NextRequest } from 'next/server';
import type { CarbonData } from '@/components/dashboard/stats-panel';

const API_BIO_URL = process.env.API_BIO_URL;

const labelMapping: { [key: string]: { name: string; type: 'current' | 'restorable' } } = {
    'Vegetacao_Primaria': { name: 'Vegetação Primária', type: 'current' },
    'Vegetacao_Secundaria': { name: 'Vegetação Secundária', type: 'current' },
    'Agropecuaria': { name: 'Agropecuária', type: 'current' },
    'Potencial_Vegetacao_Primaria': { name: 'Vegetação Primária', type: 'restorable' },
    'Potencial_Vegetacao_Secundaria': { name: 'Vegetação Secundária', type: 'restorable' },
    'Potencial_Agropecuaria': { name: 'Agropecuária', type: 'restorable' },
};

/**
 * API route to fetch carbon statistics for a given location.
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
    
    const apiPath = `${API_BIO_URL}/graph/carbono/${fetchType}/${id}`;
    
    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching carbon stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch stats data from source: ${errorText}` }, { status: response.status });
        }
        
        const rawData: {label: string, value: number}[] = await response.json();

        if (!Array.isArray(rawData) || rawData.length === 0) {
            return NextResponse.json(null, { status: 404 });
        }

        const currentAndRestorableMap: { [key: string]: { name: string, current: number, restorable: number } } = {};

        rawData.forEach(item => {
            const mapping = labelMapping[item.label];
            if (mapping) {
                if (!currentAndRestorableMap[mapping.name]) {
                    currentAndRestorableMap[mapping.name] = { name: mapping.name, current: 0, restorable: 0 };
                }
                currentAndRestorableMap[mapping.name][mapping.type] = item.value;
            }
        });

        const currentAndRestorable = Object.values(currentAndRestorableMap);
        
        // Assuming valuation is derived or part of another logic, we'll mock it for now
        // based on the total current values to keep the chart functional.
        const totalCurrent = currentAndRestorable.reduce((acc, curr) => acc + curr.current, 0);
        const valuation = [
            { name: "Vegetação Primária", value: currentAndRestorable.find(c => c.name === 'Vegetação Primária')?.current * 15 || 0 },
            { name: "Vegetação Secundária", value: currentAndRestorable.find(c => c.name === 'Vegetação Secundária')?.current * 10 || 0 },
            { name: "Agropecuária", value: currentAndRestorable.find(c => c.name === 'Agropecuária')?.current * 5 || 0 },
        ].filter(v => v.value > 0);


        const formattedData: CarbonData = {
            currentAndRestorable,
            valuation
        };
            
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching/processing carbon stats from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch or process stats data` }, { status: 500 });
    }
}
