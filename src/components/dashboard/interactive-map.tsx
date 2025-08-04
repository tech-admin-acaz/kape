
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup, MapRef, Source, Layer } from 'react-map-gl';
import MapboxMap from 'mapbox-gl';
import { MapPin, Plus, Minus, Navigation, Box, Layers2, Map as MapIcon } from 'lucide-react';
import BasemapControl from './basemap-control';
import SearchControl from './search-control';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LayerControl, { type LayerState } from './layer-control';
import LegendControl from './legend-control';
import { getIndicatorXYZ } from '@/services/map.service';


const locations = [
  { id: "1", lat: 2.8, lng: -63.8, name: "T.I. Yanomami" },
  { id: "2", lat: -20.25, lng: -46.45, name: "Serra da Canastra" },
];

const basemaps = {
    'satélite': 'mapbox://styles/mapbox/satellite-streets-v12',
    'ruas': 'mapbox://styles/mapbox/streets-v12',
    'escuro': 'mapbox://styles/mapbox/dark-v11',
};

const defaultBasemapKey = 'escuro';

interface InteractiveMapProps {
  onAreaSelect: (areaId: string | null) => void;
}

export default function InteractiveMap({ onAreaSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [currentStyleKey, setCurrentStyleKey] = useState(defaultBasemapKey);
  const [is3D, setIs3D] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [indicatorXYZ, setIndicatorXYZ] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  const [layers, setLayers] = React.useState<LayerState>({
    indicator: true,
    restoredCarbon: false,
    currentCarbon: false,
    opportunityCost: false,
    restorationCost: false,
    mapbiomas: false,
  });

   useEffect(() => {
        async function fetchIndicatorLayer() {
            try {
                const xyzUrl = await getIndicatorXYZ();
                setIndicatorXYZ(xyzUrl);
            } catch (error) {
                console.error('Failed to fetch indicator layer:', error);
            }
        }
        fetchIndicatorLayer();
    }, []);

  useEffect(() => {
    if (mapRef.current) {
        mapRef.current.easeTo({ pitch: is3D ? 60 : 0, duration: 1000 });
    }
  }, [is3D]);
  
  const handleStyleChange = (styleUrl: string) => {
    const styleKey = Object.keys(basemaps).find(key => basemaps[key as keyof typeof basemaps] === styleUrl) || defaultBasemapKey;
    setCurrentStyleKey(styleKey);
  }

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetBearing = () => {
    mapRef.current?.resetNorthPitch();
  };
  
  const toggle3D = () => {
    setIs3D(prevIs3D => !prevIs3D);
  }

  const mapStyle = basemaps[currentStyleKey as keyof typeof basemaps];

  return (
    <div className="relative w-full h-full">
        <div className="absolute top-4 left-4 z-10">
            <SearchControl />
        </div>
        
        {layers.indicator && (
            <div className="absolute bottom-4 left-4 z-10">
                <LegendControl />
            </div>
        )}

        <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapLib={MapboxMap as any}
            initialViewState={{
                longitude: -51.9253,
                latitude: -14.235,
                zoom: 3.5,
                pitch: 0,
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle={mapStyle}
            attributionControl={false}
            terrain={is3D ? {source: 'mapbox-dem', exaggeration: 1.5} : undefined}
            onMove={(evt) => setBearing(evt.viewState.bearing)}
        >
            <Source
                id="mapbox-dem"
                type="raster-dem"
                url="mapbox://mapbox.mapbox-terrain-dem-v1"
                tileSize={512}
                maxzoom={14}
            />

            {layers.indicator && indicatorXYZ && (
                <Source
                    id="indicator-source"
                    type="raster"
                    tiles={[indicatorXYZ]}
                    tileSize={256}
                >
                    <Layer 
                      id={'indicator'}
                      type={'raster'}
                      paint={{'raster-opacity': 1}}
                    />
                </Source>
            )}
        
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
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={toggle3D} className={cn("bg-background/80 hover:bg-hover hover:text-primary-foreground", is3D && "bg-accent text-accent-foreground")}>
                            <Box className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Toggle 3D View</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <LayerControl layers={layers} setLayers={setLayers} />
            <BasemapControl onStyleChange={handleStyleChange} basemaps={basemaps} currentStyleKey={currentStyleKey} />

            <TooltipProvider>
                <div className="flex flex-col gap-[1px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-background/80">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleZoomIn} className="w-10 h-10 rounded-none bg-background/80 hover:bg-hover hover:text-primary-foreground">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Zoom In</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleZoomOut} className="w-10 h-10 rounded-none bg-background/80 hover:bg-hover hover:text-primary-foreground">
                        <Minus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Zoom Out</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleResetBearing} className="w-10 h-10 rounded-none bg-background/80 hover:bg-hover hover:text-primary-foreground">
                        <Navigation className="h-4 w-4 transition-transform" style={{ transform: `rotate(${bearing * -1}deg)` }} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Orientação: {Math.abs(bearing).toFixed(0)}°</p></TooltipContent>
                  </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    </div>
  );
}
