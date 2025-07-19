"use client";

import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { MapPin } from 'lucide-react';
import BasemapControl from './basemap-control';

const locations = [
  { id: "1", lat: 2.8, lng: -63.8, name: "T.I. Yanomami" },
  { id: "2", lat: -20.25, lng: -46.45, name: "Serra da Canastra" },
];

const basemaps = {
    default: 'https://demotiles.maplibre.org/style.json',
    streets: 'https://api.maptiler.com/maps/streets-v2/style.json?key=get_your_own_OpIi9ZULNADvP4s_2qA',
    satellite: 'https://api.maptiler.com/maps/satellite/style.json?key=get_your_own_OpIi9ZULNADvP4s_2qA',
    dark: 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=get_your_own_OpIi9ZULNADvP4s_2qA',
};

interface InteractiveMapProps {
  onAreaSelect: (areaId: string | null) => void;
}

export default function InteractiveMap({ onAreaSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [style, setStyle] = useState(basemaps.default);
  
  return (
    <div className="relative w-full h-full">
        <Map
            mapLib={maplibregl}
            initialViewState={{
                longitude: -51.9253,
                latitude: -14.235,
                zoom: 3.5,
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle={style}
            attributionControl={false}
        >
        <NavigationControl position="top-left" />
        {locations.map((loc) => (
            <Marker
            key={loc.id}
            longitude={loc.lng}
            latitude={loc.lat}
            onClick={(e) => {
                e.originalEvent.stopPropagation();
                onAreaSelect(loc.id);
                setSelectedLocation(loc);
            }}
            style={{cursor: 'pointer'}}
            >
            <MapPin className="w-6 h-6 text-primary fill-primary/50" />
            </Marker>
        ))}

        {selectedLocation && (
            <Popup
            longitude={selectedLocation.lng}
            latitude={selectedLocation.lat}
            onClose={() => setSelectedLocation(null)}
            closeButton={false}
            offset={30}
            anchor="bottom"
            >
            <div className="text-sm font-semibold">{selectedLocation.name}</div>
            </Popup>
        )}
        </Map>
        <BasemapControl onStyleChange={setStyle} basemaps={basemaps} />
    </div>
  );
}
