
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

// Mapping from API keys to display names and chart colors
const landCoverMapping: { [key: string]: { name: string; color: string } } = {
    "Agricultura": { name: "Agricultura", color: "hsl(var(--chart-5))" },
    "Pastagem": { name: "Pastagem", color: "hsl(var(--chart-4))" },
    "Outras": { name: "Outros", color: "hsl(var(--muted))" },
    "Floresta Secundária": { name: "Floresta Secundária", color: "#7a5900" }, // Custom color from V1
    "Outras Formações Naturais": { name: "Outras Formações Naturais", color: "hsl(var(--chart-2))" },
    "Floresta Primaria": { name: "Formação Florestal Primária", color: "hsl(var(--chart-3))" },
};


/**
 * API route to fetch land cover statistics for a given location.
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
    
    // V1 logic: for a city, territoryID is 0. For a territory (estado, ti, uc), cityID is 0.
    let territoryId: string;
    let cityId: string;

    if (type === 'municipio') {
        territoryId = '0';
        cityId = id;
    } else {
        territoryId = id;
        cityId = '0';
    }
    
    const apiPath = `${API_BIO_URL}/area/${territoryId}/${cityId}`;


    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch stats data from source` }, { status: response.status });
        }
        
        const rawData = await response.json();
        
        // The API returns an array with one object: `[{...}]`
        const statsObject = rawData && rawData.length > 0 ? rawData[0] : {};

        if (Object.keys(statsObject).length === 0) {
            return NextResponse.json([]);
        }
        
        // Transform the object into the format expected by Highcharts
        const formattedData = Object.entries(statsObject)
            .map(([key, value]) => {
                const mapping = landCoverMapping[key];
                if (!mapping) return null; // Skip unknown categories

                return {
                    name: mapping.name,
                    y: value as number,
                    color: mapping.color
                };
            })
            .filter(item => item !== null && item.y > 0); // Filter out nulls and zero-value entries


        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching stats data from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch stats data` }, { status: 500 });
    }
}
