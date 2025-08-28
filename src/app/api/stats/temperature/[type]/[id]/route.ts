
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

const calculateTrendLine = (data: { year: string; value: number }[]): number[] => {
    const values = data.map(d => d.value);
    const n = values.length;
    if (n < 2) return values;

    const sumX = values.reduce((acc, _, i) => acc + i, 0);
    const sumY = values.reduce((acc, curr) => acc + curr, 0);
    const sumXY = values.reduce((acc, curr, i) => acc + i * curr, 0);
    const sumXX = values.reduce((acc, _, i) => acc + i * i, 0);

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return values;

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return values.map((_, i) => parseFloat((slope * i + intercept).toFixed(2)));
};


/**
 * API route to fetch temperature statistics for a given location.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { type: string, id: string } }
) {
    const { type, id } = params;
    const model = 'CESM2';
    const scenario = 'ssp245';

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
    
    let apiTypePath = type;
    if (type === 'estado') {
        apiTypePath = 'estados';
    } else if (type === 'municipio') {
        apiTypePath = 'municipios';
    }
    
    const apiPath = `${API_BIO_URL}/graph/tas/${apiTypePath}/${id}/${model}/${scenario}`;
    console.log(`Buscando estatísticas de temperatura em: ${apiPath}`);

    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching temperature stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch stats data from source` }, { status: response.status });
        }
        
        const apiData = await response.json();
        
        const timeSeries = (Array.isArray(apiData) && Array.isArray(apiData[0])) ? apiData[0] : (Array.isArray(apiData) ? apiData : []);

        if (!Array.isArray(timeSeries) || timeSeries.length === 0) {
            return NextResponse.json([]);
        }

        const processedData = timeSeries.map((d: any) => ({
            year: new Date(d.time).getFullYear().toString(),
            value: parseFloat(d.value.toFixed(2))
        }));

        const trendLine = calculateTrendLine(processedData);

        const finalData = processedData.map((d, index) => ({
            year: d.year,
            value: d.value,
            trend: trendLine[index]
        }));
        
        return NextResponse.json(finalData);

    } catch (error) {
        console.error(`Error fetching temperature stats data from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch stats data` }, { status: 500 });
    }
}
