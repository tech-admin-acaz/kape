
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.NEXT_PUBLIC_API_BIO_URL;

interface ChartDataPoint {
  name: string;
  y: number;
  color: string;
}

const landCoverMapping: { [key: string]: { name: string; color: string } } = {
    "Agricultura": { name: "Agricultura", color: "#E974ED" },
    "Pastagem": { name: "Pastagem", color: "#EADB89" },
    "Outras": { name: "Outros", color: "#FC8114" },
    "Outras Formações Naturais": { name: "Outras Formações Naturais", color: "#007785" },
    "Floresta Primaria": { name: "Formação Florestal Primária", color: "#3AA462" },
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

    let fetchType = type;
    if (type === 'estado') {
        fetchType = 'estados';
    } else if (type === 'municipio') {
        fetchType = 'municipios';
    }
    
    // Corrected API path construction
    const apiPath = `${API_BIO_URL}/area/${fetchType}/${id}`;
    
    try {
        const response = await fetch(apiPath);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching land cover stats from external API (${apiPath}):`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch stats data from source: ${errorText}` }, { status: response.status });
        }
        
        const rawData = await response.json();

        // The API returns an array with a single object: [{...}]
        const statsObject = rawData && rawData.length > 0 ? rawData[0] : {};

        if (Object.keys(statsObject).length === 0) {
            return NextResponse.json([]);
        }

        const formattedData = Object.entries(statsObject)
            .map(([key, value]) => {
                const mapping = landCoverMapping[key];
                // If a key from the API is not in our map, we ignore it.
                if (!mapping) return null;

                return {
                    name: mapping.name,
                    y: value as number,
                    color: mapping.color
                };
            })
            .filter((item): item is ChartDataPoint => item !== null && item.y > 0);
            
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error(`Error fetching/processing land cover stats from ${apiPath}:`, error);
        return NextResponse.json({ error: `Failed to fetch or process stats data` }, { status: 500 });
    }
}
