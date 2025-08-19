
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

const getRelatedInfo = (data: any[] = [], nameKey: string): string | undefined => {
    if (!data || data.length === 0) return undefined;
    return data.map(item => item[nameKey]).filter(Boolean).join(', ');
};

/**
 * API route to fetch and format metadata for the "Panorama Geral".
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
    if (type === 'estado') fetchType = 'estados';
    if (type === 'municipio') fetchType = 'municipios';

    try {
        const response = await fetch(`${API_BIO_URL}/${fetchType}/${id}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching metadata source from ${fetchType}/${id}:`, response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch metadata from source` }, { status: response.status });
        }
        
        const data = await response.json();
        // The API returns an array, we are interested in the first element.
        const details = data && data.length > 0 ? data[0] : null;

        if (!details) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }
        
        const metadata: { [key: string]: string | undefined } = {
            state: undefined,
            municipality: undefined,
            territoryName: undefined,
            conservationUnit: undefined,
        };

        switch (type) {
            case 'estado':
                metadata.state = `${details.name} (${details.sigla})`;
                break;
            case 'municipio':
                if (details.uf && details.uf.length > 0) {
                    metadata.state = `${details.uf[0].nm_uf} (${details.uf[0].sigla_uf})`;
                }
                metadata.municipality = details.name;
                break;
            case 'ti':
                metadata.state = details.uf_sigla;
                metadata.municipality = details.municipio_;
                metadata.territoryName = details.terrai_nom || details.name;
                break;
            case 'uc':
                metadata.state = getRelatedInfo(details.uf, 'nm_uf');
                metadata.municipality = getRelatedInfo(details.municipios, 'municipio');
                metadata.conservationUnit = details.nome_uc1 || details.name;
                break;
        }

        return NextResponse.json(metadata);

    } catch (error) {
        console.error(`Error fetching metadata for ${type}/${id}:`, error);
        return NextResponse.json({ error: `Failed to fetch metadata` }, { status: 500 });
    }
}
