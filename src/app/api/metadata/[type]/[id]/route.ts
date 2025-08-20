
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
    const start = Date.now();
    console.log(`[api/metadata] Fetching metadata for ${type}/${id}`);

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
            if (response.status === 404) {
                 return NextResponse.json({ error: 'Location not found' }, { status: 404 });
            }
            return NextResponse.json({ error: `Failed to fetch metadata from source` }, { status: response.status });
        }
        
        const data = await response.json();
        
        let details = {};
        if (type === 'uc' || type === 'ti') {
            details = data;
        } else {
            details = Array.isArray(data) && data.length > 0 ? data[0] : (data || {});
        }

        if (!details || Object.keys(details).length === 0) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }
        
        const metadata: { [key: string]: string | undefined } = {};

        if (type === 'estado') {
             metadata.state = `${(details as any).name} (${(details as any).sigla})`;
        } else if (type === 'municipio') {
            metadata.municipality = (details as any).name;
            if ((details as any).uf && (details as any).uf.length > 0) {
                metadata.state = `${(details as any).uf[0].nm_uf} (${(details as any).uf[0].sigla_uf})`;
            }
        } else if (type === 'ti') {
             const tiDetails = Array.isArray((details as any).ti) && (details as any).ti.length > 0 ? (details as any).ti[0] : null;
            const ufDetails = Array.isArray((details as any).uf) && (details as any).uf.length > 0 ? (details as any).uf[0] : null;

            if (tiDetails) {
                 metadata.territoryName = tiDetails.terrai_nom;
                 metadata.municipality = tiDetails.municipio_;
            }
            if (ufDetails) {
                 metadata.state = `${ufDetails.nm_uf} (${ufDetails.sigla_uf})`;
            }
        } else if (type === 'uc') {
            const ucDetails = Array.isArray((details as any).uc) && (details as any).uc.length > 0 ? (details as any).uc[0] : null;
            
            if(ucDetails) {
                 metadata.conservationUnit = ucDetails.nome_uc1 ? titleCase(ucDetails.nome_uc1) : undefined;
            }
            if ((details as any).municipios && (details as any).municipios.length > 0) {
                 metadata.municipality = (details as any).municipios.map((m: any) => m.nm_mun).join(', ');
            }
             if ((details as any).uf && (details as any).uf.length > 0) {
                metadata.state = (details as any).uf.map((u: any) => `${u.nm_uf} (${u.sigla_uf})`).join(', ');
            }
        }

        const duration = Date.now() - start;
        console.log(`[api/metadata] Metadata for ${type}/${id} processed in ${duration}ms`);

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
