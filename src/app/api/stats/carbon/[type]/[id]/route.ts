
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
    
    const carbonStockPath = `${API_BIO_URL}/graph/carbono/${fetchType}/${id}`;
    const valuationPath = `${API_BIO_URL}/graph/valorecossistemico/${fetchType}/${id}`;
    
    try {
        // Fetch both endpoints in parallel
        const [carbonStockRes, valuationRes] = await Promise.all([
            fetch(carbonStockPath),
            fetch(valuationPath)
        ]);
        
        // Handle Carbon Stock data
        if (!carbonStockRes.ok) {
            const errorText = await carbonStockRes.text();
            console.error(`Error fetching carbon stock stats from external API (${carbonStockPath}):`, carbonStockRes.status, errorText);
            // We can decide to return partial data or a full error. Let's return error for now.
            return NextResponse.json({ error: `Failed to fetch carbon stock data from source: ${errorText}` }, { status: carbonStockRes.status });
        }
        const rawCarbonStockData: {label: string, value: number}[] = await carbonStockRes.json();
        
        // Handle Valuation data
        if (!valuationRes.ok) {
            const errorText = await valuationRes.text();
            console.error(`Error fetching valuation stats from external API (${valuationPath}):`, valuationRes.status, errorText);
            return NextResponse.json({ error: `Failed to fetch valuation data from source: ${errorText}` }, { status: valuationRes.status });
        }
        const rawValuationData: {label: string, value: number}[] = await valuationRes.json();


        // Process Carbon Stock data
        const currentAndRestorableMap: { [key: string]: { name: string, current: number, restorable: number } } = {};
        if (Array.isArray(rawCarbonStockData)) {
            rawCarbonStockData.forEach(item => {
                const mapping = labelMapping[item.label];
                if (mapping) {
                    if (!currentAndRestorableMap[mapping.name]) {
                        currentAndRestorableMap[mapping.name] = { name: mapping.name, current: 0, restorable: 0 };
                    }
                    currentAndRestorableMap[mapping.name][mapping.type] = item.value;
                }
            });
        }
        
        const currentAndRestorable = Object.values(currentAndRestorableMap);
        
        // Process Valuation data
        const valuation = (Array.isArray(rawValuationData)) 
            ? rawValuationData.map(item => ({ name: item.label, value: item.value })).filter(v => v.value > 0)
            : [];


        const formattedData: CarbonData = {
            currentAndRestorable,
            valuation
        };
            
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching/processing carbon stats from APIs:`, error);
        return NextResponse.json({ error: `Failed to fetch or process stats data` }, { status: 500 });
    }
}
