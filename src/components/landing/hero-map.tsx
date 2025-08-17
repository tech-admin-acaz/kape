
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Map, { MapRef, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getIndicatorXYZ } from '@/services/map.service';
import { useTheme } from 'next-themes';


export default function HeroMap() {
    const { theme } = useTheme();
    const [indicatorXYZ, setIndicatorXYZ] = useState<string | null>(null);
    const mapRef = useRef<MapRef>(null);

    const mapStyle = theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11';

    useEffect(() => {
        async function fetchIndicatorLayer() {
            try {
                const indicator = await getIndicatorXYZ();
                if (indicator) setIndicatorXYZ(indicator);
            } catch (error) {
                console.error('Failed to fetch indicator layer:', error);
            }
        }
        fetchIndicatorLayer();
    }, []);

    const renderRasterLayer = (id: string, xyzUrl: string | null) => {
        if (!xyzUrl) return null;
        return (
          <Source id={`${id}-source`} type="raster" tiles={[xyzUrl]} tileSize={256}>
            <Layer id={id} type={'raster'} paint={{'raster-opacity': 0.7}} />
          </Source>
        );
      };

    return (
        <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={{
                longitude: -56,
                latitude: -6,
                zoom: 2.5,
            }}
            style={{width: '100%', height: '100%', background: 'transparent'}}
            mapStyle={mapStyle}
            projection={{name: 'globe'}}
            attributionControl={false}
            interactive={true}
        >
            {indicatorXYZ && renderRasterLayer('indicator', indicatorXYZ)}
        </Map>
    );
}
