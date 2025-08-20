
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

const titleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return (word.length > 3 || word.toLowerCase() === 'do' || word.toLowerCase() === 'da') 
               ? word.charAt(0).toUpperCase() + word.slice(1) 
               : word;
    }).join(' ');
}


/**
 * API route to fetch and format metadata for the "Panorama Geral".
 * This now acts as a direct proxy to the dedicated metadata endpoint.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { type: string, id: string } }
) {
    const { type, id } = params;
    const timeKey = `[API] Fetching metadata for ${type}/${id}`;

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

    // The external API path for metadata is /metadata/{type}/{id}
    const apiPath = `${API_BIO_URL}/metadata/${type}/${id}`;

    try {
        console.time(timeKey);
        const response = await fetch(apiPath);
        console.timeEnd(timeKey);
        
        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: 'Location not found' }, { status: 404 });
            }
            const errorText = await response.text();
            console.error(`Error fetching metadata from ${apiPath}:`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch metadata from source` }, { status: response.status });
        }
        
        let data = await response.json();
        
        // API returns data in an array, e.g. [{...}]
        let details = Array.isArray(data) && data.length > 0 ? data[0] : (data || {});

        if (!details || Object.keys(details).length === 0) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }
        
        const metadata: { [key: string]: string | undefined } = {};

        if (type === 'estado') {
             metadata.state = `${details.name} (${details.sigla})`;
        } else if (type === 'municipio') {
            metadata.municipality = details.name;
            if (details.uf && details.uf.length > 0) {
                metadata.state = `${details.uf[0].nm_uf} (${details.uf[0].sigla_uf})`;
            }
        } else if (type === 'ti') {
            metadata.territoryName = details.terrai_nom;
            metadata.municipality = details.municipio_;
            metadata.state = `${details.nm_uf} (${details.uf_sigla})`;
        } else if (type === 'uc') {
            metadata.conservationUnit = details.nome_uc1 ? titleCase(details.nome_uc1) : undefined;
            if (details.municipios && details.municipios.length > 0) {
                 metadata.municipality = details.municipios.map((m: any) => m.nm_mun).join(', ');
            }
             if (details.uf && details.uf.length > 0) {
                metadata.state = details.uf.map((u: any) => `${u.nm_uf} (${u.sigla_uf})`).join(', ');
            }
        }


        return new NextResponse(JSON.stringify(metadata), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

    } catch (error) {
        console.timeEnd(timeKey);
        console.error(`Error fetching metadata for ${type}/${id}:`, error);
        return NextResponse.json({ error: `Failed to fetch metadata` }, { status: 500 });
    }
}
