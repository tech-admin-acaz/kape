
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

/**
 * API route to fetch and format metadata for the "Panorama Geral".
 * This now acts as a direct proxy to the dedicated metadata endpoint.
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

    // The external API path for metadata is /metadata/{type}/{id}
    const apiPath = `${API_BIO_URL}/metadata/${type}/${id}`;

    try {
        const response = await fetch(apiPath);
        if (!response.ok) {
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

        const metadata: { [key: string]: string | undefined } = {
            state: details.nm_uf || details.uf_sigla,
            municipality: details.municipio_,
            territoryName: type === 'ti' ? details.terrai_nom : undefined,
            conservationUnit: type === 'uc' ? details.nome_uc1 : undefined,
        };
        
        // For 'estado' and 'municipio', the name is in a different field.
        if (type === 'estado') {
             metadata.state = `${details.name} (${details.sigla})`;
             metadata.municipality = undefined;
        } else if (type === 'municipio') {
             if (details.uf && details.uf.length > 0) {
                metadata.state = `${details.uf[0].nm_uf} (${details.uf[0].sigla_uf})`;
            }
            metadata.municipality = details.name;
        }


        return new NextResponse(JSON.stringify(metadata), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

    } catch (error) {
        console.error(`Error fetching metadata for ${type}/${id}:`, error);
        return NextResponse.json({ error: `Failed to fetch metadata` }, { status: 500 });
    }
}
