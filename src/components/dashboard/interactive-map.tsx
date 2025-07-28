"use client";

import React, { useState, useRef } from 'react';
import Map, { Marker, Popup, MapRef, Source } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { MapPin, Plus, Minus, Compass } from 'lucide-react';
import BasemapControl from './basemap-control';
import MapFilters from './map-filters';
import { Button } from '@/components/ui/button';
import 'mapbox-gl/dist/mapbox-gl.css';

const locations = [
  { id: "1", lat: 2.8, lng: -63.8, name: "T.I. Yanomami" },
  { id: "2", lat: -20.25, lng: -46.45, name: "Serra da Canastra" },
];

const basemaps = {
    default: 'mapbox://styles/mapbox/satellite-streets-v12',
};

interface InteractiveMapProps {
  onAreaSelect: (areaId: string | null) => void;
}

export default function InteractiveMap({ onAreaSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [style, setStyle] = useState(basemaps.default);
  const mapRef = useRef<MapRef>(null);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetBearing = () => {
    mapRef.current?.resetNorth();
  };
  
  return (
    <div className="relative w-full h-full">
        <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapLib={mapboxgl}
            initialViewState={{
                longitude: -51.9253,
                latitude: -14.235,
                zoom: 3.5,
                pitch: 45,
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle={style}
            attributionControl={true}
            terrain={{source: 'mapbox-dem', exaggeration: 1.5}}
        >
            <Source
                id="mapbox-dem"
                type="raster-dem"
                url="mapbox://mapbox.mapbox-terrain-dem-v1"
                tileSize={512}
                maxzoom={14}
            />
        
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
        <div className="absolute top-4 left-4 z-10">
            <MapFilters />
        </div>
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            <BasemapControl onStyleChange={setStyle} basemaps={basemaps} />
            <div className="flex flex-col gap-[1px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-background/80">
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="w-10 h-10 rounded-none bg-background/80 hover:bg-background">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="w-10 h-10 rounded-none bg-background/80 hover:bg-background">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleResetBearing} className="w-10 h-10 rounded-none bg-background/80 hover:bg-background">
                <Compass className="h-4 w-4" />
              </Button>
            </div>
        </div>
    </div>
  );
}
