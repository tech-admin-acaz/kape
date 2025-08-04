
"use client";

/**
 * Fetches the XYZ tile URL for the indicator layer.
 * In a real application, this would fetch from a secure API endpoint.
 * For this example, it calls a local API route.
 */
export async function getIndicatorXYZ(): Promise<string> {
    const response = await fetch('/api/map/indicator');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.xyz;
}
