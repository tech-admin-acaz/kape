
import { NextResponse, NextRequest } from 'next/server';

const API_BIO_URL = process.env.API_BIO_URL;

// Equivalent to the Angular version for calculating trend line
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
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model') || 'ipsl-cm6a-lr';
    const scenario = searchParams.get('scenario') || 'ssp585';

    try {
        // MOCK DATA
        const mockApiData = [[{"time":"2015-01-01","value":26.3292359183172},{"time":"2016-01-01","value":26.854070037476},{"time":"2017-01-01","value":27.4597286780739},{"time":"2018-01-01","value":27.8141677415853},{"time":"2019-01-01","value":26.6047018751686},{"time":"2020-01-01","value":26.7625132245806},{"time":"2021-01-01","value":27.4328980956096},{"time":"2022-01-01","value":27.668321273673},{"time":"2023-01-01","value":27.1593507278599},{"time":"2024-01-01","value":28.2237743615496},{"time":"2025-01-01","value":27.1709299705776},{"time":"2026-01-01","value":26.9960987879697},{"time":"2027-01-01","value":27.6815462165202},{"time":"2028-01-01","value":27.9553835031744},{"time":"2029-01-01","value":27.2293525289382},{"time":"2030-01-01","value":27.9543370657532},{"time":"2031-01-01","value":27.7915139196641},{"time":"2032-01-01","value":27.782268356349},{"time":"2033-01-01","value":26.5258014583807},{"time":"2034-01-01","value":27.2254072737216},{"time":"2035-01-01","value":28.2856271739091},{"time":"2036-01-01","value":27.1013558632084},{"time":"2037-01-01","value":28.3420062429672},{"time":"2038-01-01","value":28.4929043882112},{"time":"2039-01-01","value":27.87507423465},{"time":"2040-01-01","value":28.76241478008},{"time":"2041-01-01","value":27.7887562764415},{"time":"2042-01-01","value":27.6885088429891},{"time":"2043-01-01","value":28.547778054589},{"time":"2044-01-01","value":27.6487095373339}]];

        const timeSeries = (Array.isArray(mockApiData) && Array.isArray(mockApiData[0])) ? mockApiData[0] : (Array.isArray(mockApiData) ? mockApiData : []);

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
        console.error(`Error processing temperature stats:`, error);
        return NextResponse.json({ error: `Failed to process temperature stats` }, { status: 500 });
    }
}
