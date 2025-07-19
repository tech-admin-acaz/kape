"use client";

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const locations = [
  { id: "1", lat: 2.8, lng: -63.8, name: "T.I. Yanomami" },
  { id: "2", lat: -20.25, lng: -46.45, name: "Serra da Canastra" },
];

interface InteractiveMapProps {
  onAreaSelect: (areaId: string | null) => void;
}

export default function InteractiveMap({ onAreaSelect }: InteractiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="text-center text-muted-foreground">
          Google Maps API Key is missing. <br />
          Please add it to your .env.local file.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={{ lat: -14.235, lng: -51.9253 }}
        defaultZoom={4}
        mapId="biodiversidade_map"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {locations.map((loc) => (
          <AdvancedMarker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            onClick={() => onAreaSelect(loc.id)}
            title={loc.name}
          >
            <Pin 
              background={'hsl(var(--primary))'} 
              borderColor={'hsl(var(--primary-foreground))'} 
              glyphColor={'hsl(var(--primary-foreground))'} 
            />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
