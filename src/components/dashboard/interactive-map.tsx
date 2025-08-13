
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup, MapRef, Source, Layer, LngLatBoundsLike, MapLayerMouseEvent } from 'react-map-gl';
import { MapPin, Plus, Minus, Navigation, Box, Layers2 } from 'lucide-react';
import BasemapControl from './basemap-control';
import SearchControl from './search-control';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LayerControl, { type LayerState } from './layer-control';
import LegendControl from './legend-control';
import { getIndicatorXYZ, getLocationDetails, getLocationByCoords, getRestoredCarbonXYZ, getCurrentCarbonXYZ, getOpportunityCostXYZ, getRestorationCostXYZ, getMapbiomasXYZ, getLandCoverStats } from '@/services/map.service';
import type { Location, TerritoryTypeKey } from "@/models/location.model";
import * as turf from '@turf/turf';
import type { StatsData } from './stats-panel';
import { mockData } from './mock-data';
import MapSettingsControl from './map-settings-control';
import { Separator } from '../ui/separator';
import { territoryTypes } from '@/models/location.model';

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
  onAreaUpdate: (data: StatsData | null) => void;
  selectedArea: StatsData | null;
}

interface PopupInfo {
    lng: number;
    lat: number;
    message: string;
}

export default function InteractiveMap({ onAreaUpdate, selectedArea }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [currentStyleKey, setCurrentStyleKey] = useState(defaultBasemapKey);
  const [is3D, setIs3D] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [selectedShape, setSelectedShape] = useState<any>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const mapRef = useRef<MapRef>(null);

  // Layer XYZ URLs
  const [indicatorXYZ, setIndicatorXYZ] = useState<string | null>(null);
  const [restoredCarbonXYZ, setRestoredCarbonXYZ] = useState<string | null>(null);
  const [currentCarbonXYZ, setCurrentCarbonXYZ] = useState<string | null>(null);
  const [opportunityCostXYZ, setOpportunityCostXYZ] = useState<string | null>(null);
  const [restorationCostXYZ, setRestorationCostXYZ] = useState<string | null>(null);
  const [mapbiomasXYZ, setMapbiomasXYZ] = useState<string | null>(null);


  const [layers, setLayers] = React.useState<LayerState>({
    indicator: true,
    restoredCarbon: false,
    currentCarbon: false,
    opportunityCost: false,
    restorationCost: false,
    mapbiomas: false,
  });

  const [indicatorOpacity, setIndicatorOpacity] = useState(1);
  const [fillOpacity, setFillOpacity] = useState(0);
  const [strokeOpacity, setStrokeOpacity] = useState(1);

   useEffect(() => {
        async function fetchAllLayers() {
            try {
                const [
                    indicator, 
                    restoredCarbon, 
                    currentCarbon,
                    opportunityCost,
                    restorationCost,
                    mapbiomas
                ] = await Promise.all([
                    getIndicatorXYZ(),
                    getRestoredCarbonXYZ(),
                    getCurrentCarbonXYZ(),
                    getOpportunityCostXYZ(),
                    getRestorationCostXYZ(),
                    getMapbiomasXYZ(),
                ]);
                setIndicatorXYZ(indicator);
                setRestoredCarbonXYZ(restoredCarbon);
                setCurrentCarbonXYZ(currentCarbon);
                setOpportunityCostXYZ(opportunityCost);
                setRestorationCostXYZ(restorationCost);
                setMapbiomasXYZ(mapbiomas);
            } catch (error) {
                console.error('Failed to fetch one or more layers:', error);
            }
        }
        fetchAllLayers();
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

  const handleLocationSelect = async (location: Location | null, type: TerritoryTypeKey | null) => {
    setPopupInfo(null); // Close any info popup when a location is selected
    if (!location || !type) {
      setSelectedShape(null);
      onAreaUpdate(null);
      mapRef.current?.flyTo({
          center: [-56, -6],
          zoom: 4,
          pitch: 0,
          bearing: 0,
          duration: 1000
      });
      return;
    }
    try {
      const [details, landCoverStats] = await Promise.all([
        getLocationDetails(type, location.value),
        // getLandCoverStats(type, location.value),
      ]);
      
      if (details && details.geom) {
        setSelectedShape(details.geom);
        
        if (mapRef.current) {
            const bbox = turf.bbox(details.geom) as LngLatBoundsLike;
            mapRef.current.fitBounds(bbox, { padding: 40, duration: 1000 });
        }

        const baseMockData = mockData[Object.keys(mockData)[0]];

        let landCoverData = baseMockData.stats.landCover;
        // if (landCoverStats) {
        //      landCoverData = [
        //         { name: 'Formação Florestal Primária', y: parseFloat(landCoverStats['Floresta Primaria'] || 0), color: '#1f8d49' },
        //         { name: 'Vegetação Secundária', y: parseFloat(landCoverStats['Vegetação Secundária'] || 0), color: '#7a5900' },
        //         { name: 'Outras Formações Naturais', y: parseFloat(landCoverStats['Outras Formações Naturais'] || 0), color: '#007785' },
        //         { name: 'Pastagem', y: parseFloat(landCoverStats['Pastagem'] || 0), color: '#edde8e' },
        //         { name: 'Agricultura', y: parseFloat(landCoverStats['Agricultura'] || 0), color: '#E974ED' },
        //         { name: 'Outros', y: parseFloat(landCoverStats['Outras'] || 0), color: '#fc8114' },
        //     ].filter(item => item.y > 0);
        // }

        let state = 'Não definido';
        if (details.uf && details.uf.length > 0) {
            const ufData = details.uf[0];
            state = `${ufData.nm_uf} (${ufData.sigla_uf})`;
        }

        let municipality = 'Não aplicável';
        if (type === 'municipio') {
            municipality = details.name || location.label;
        } else if (details.municipios && details.municipios.length > 0) {
            municipality = details.municipios.map((m: any) => m.nm_mun).join(', ');
        }

        let territoryName = 'Não aplicável';
        if (type === 'ti') {
            territoryName = details.name || location.label;
        } else if (details.ti && details.ti.length > 0) {
            territoryName = details.ti.map((t: any) => t.terrai_nom).join(', ');
        }

        let conservationUnit = 'Não aplicável';
        if (type === 'uc') {
            conservationUnit = details.name || location.label;
        } else if (details.uc && details.uc.length > 0) {
            conservationUnit = details.uc.map((u: any) => u.nome_uc1).join(', ');
        }
        
        const typeLabel = territoryTypes.find(t => t.value === type)?.label || 'Território';
        let areaName = location.label;
        if(type === 'municipio' && details.name) areaName = `${details.name} - ${state.split(' ')[1].replace(/[\(\)]/g, '')}`;
        if(type === 'estado' && details.name) areaName = details.name;


        const newArea: StatsData = {
          id: location.value,
          name: areaName,
          type: typeLabel,
          generalInfo: {
            state,
            municipality,
            territoryName,
            conservationUnit,
          },
          stats: {
            ...baseMockData.stats,
            landCover: landCoverData,
          },
          environmentalServices: baseMockData.environmentalServices,
          correlationInsights: baseMockData.correlationInsights,
          species: baseMockData.species,
          futureClimate: baseMockData.futureClimate,
        };
        console.log("Area data being passed to panel:", newArea);
        onAreaUpdate(newArea);
      }
    } catch (error) {
      console.error("[InteractiveMap] Failed to fetch location details", error);
      setSelectedShape(null);
      onAreaUpdate(null);
    }
  };

  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    
    if (event.originalEvent.target.closest('.mapboxgl-marker')) {
        return;
    }

    try {
        const clickedLocation = await getLocationByCoords(lat, lng);
        if (clickedLocation && clickedLocation.id) {
            const location: Location = { value: String(clickedLocation.id), label: clickedLocation.name };
            handleLocationSelect(location, 'estado');
        } else {
             setPopupInfo({ lng, lat, message: "Por favor, selecione um território onde as camadas atuam." });
        }
    } catch(error) {
        if (error instanceof Error && error.message.includes('404')) {
             setPopupInfo({ lng, lat, message: "Por favor, selecione um território onde as camadas atuam." });
        } else {
            console.error("[InteractiveMap] Failed to get location by coords", error);
            setPopupInfo({ lng, lat, message: "Erro ao buscar dados do local. Tente novamente." });
        }
    }
  }

  const handleLegendClose = (layerId: keyof LayerState) => {
    setLayers(prev => ({...prev, [layerId]: false}));
  }

  const mapStyle = basemaps[currentStyleKey as keyof typeof basemaps];

  const renderRasterLayer = (id: string, xyzUrl: string, opacity: number) => {
    return (
      <Source id={`${id}-source`} type="raster" tiles={[xyzUrl]} tileSize={256}>
        <Layer id={id} type="raster" paint={{ 'raster-opacity': opacity }} />
      </Source>
    );
  };
  
  const activeLayers = Object.entries(layers).filter(([, value]) => value).map(([key]) => key as keyof LayerState);


  return (
    <div className="relative w-full h-full">
        <div className="absolute top-4 left-4 z-10">
            <SearchControl onLocationSelect={handleLocationSelect} />
        </div>
        
        <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-2">
            {activeLayers.map((layerId) => (
                <LegendControl 
                    key={layerId}
                    layerId={layerId}
                    onClose={() => handleLegendClose(layerId)}
                />
            ))}
        </div>

        <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={{
                longitude: -56,
                latitude: -6,
                zoom: 4,
                pitch: 0,
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle={mapStyle}
            attributionControl={false}
            terrain={is3D ? {source: 'mapbox-dem', exaggeration: 1.5} : undefined}
            onMove={(evt) => setBearing(evt.viewState.bearing)}
            onClick={handleMapClick}
            cursor="pointer"
        >
            <Source
                id="mapbox-dem"
                type="raster-dem"
                url="mapbox://mapbox.mapbox-terrain-dem-v1"
                tileSize={512}
                maxzoom={14}
            />

            {layers.indicator && indicatorXYZ && renderRasterLayer('indicator', indicatorXYZ, indicatorOpacity)}
            {layers.restoredCarbon && restoredCarbonXYZ && renderRasterLayer('restored-carbon', restoredCarbonXYZ, 1)}
            {layers.currentCarbon && currentCarbonXYZ && renderRasterLayer('current-carbon', currentCarbonXYZ, 1)}
            {layers.opportunityCost && opportunityCostXYZ && renderRasterLayer('opportunity-cost', opportunityCostXYZ, 1)}
            {layers.restorationCost && restorationCostXYZ && renderRasterLayer('restoration-cost', restorationCostXYZ, 1)}
            {layers.mapbiomas && mapbiomasXYZ && renderRasterLayer('mapbiomas', mapbiomasXYZ, 1)}

            {selectedShape && (
              <Source id="selected-shape-source" type="geojson" data={selectedShape}>
                 <Layer
                  id="selected-shape-layer-fill"
                  type="fill"
                  paint={{
                    'fill-color': '#007bff',
                    'fill-opacity': fillOpacity,
                  }}
                />
                <Layer
                  id="selected-shape-layer-line"
                  type="line"
                  paint={{
                    'line-color': '#FFFFFF',
                    'line-width': 1.5,
                    'line-opacity': strokeOpacity,
                  }}
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
                    const areaData = mockData[loc.id as keyof typeof mockData];
                    if (areaData) onAreaUpdate(areaData);
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

            {popupInfo && (
                <Popup
                    longitude={popupInfo.lng}
                    latitude={popupInfo.lat}
                    onClose={() => setPopupInfo(null)}
                    closeOnClick={false}
                    anchor="bottom"
                >
                    <p>{popupInfo.message}</p>
                </Popup>
            )}
        </Map>
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
            <MapSettingsControl 
              indicatorOpacity={indicatorOpacity}
              onIndicatorOpacityChange={setIndicatorOpacity}
              fillOpacity={fillOpacity}
              onFillOpacityChange={setFillOpacity}
              strokeOpacity={strokeOpacity}
              onStrokeOpacityChange={setStrokeOpacity}
            />
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={toggle3D}
                            className={cn("bg-background/80 hover:bg-hover hover:text-primary-foreground", is3D && "bg-accent text-accent-foreground")}
                        >
                            <Box className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Toggle 3D View</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <LayerControl layers={layers} setLayers={setLayers} />
            <BasemapControl onStyleChange={handleStyleChange} basemaps={basemaps} currentStyleKey={currentStyleKey} />

            <div className="flex flex-col bg-background/80 border border-border rounded-md shadow-md overflow-hidden">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="hover:bg-hover hover:text-primary-foreground rounded-none h-10 w-10">
                            <Plus className="h-4 w-4" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>Zoom In</p></TooltipContent>
                    </Tooltip>
                    <Separator />
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="hover:bg-hover hover:text-primary-foreground rounded-none h-10 w-10">
                            <Minus className="h-4 w-4" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>Zoom Out</p></TooltipContent>
                    </Tooltip>
                    <Separator />
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleResetBearing} className="hover:bg-hover hover:text-primary-foreground rounded-none h-10 w-10">
                            <Navigation className="h-4 w-4 transition-transform" style={{ transform: `rotate(${bearing * -1}deg)` }} />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>Orientação: {Math.abs(bearing).toFixed(0)}°</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    </div>
  );
}

    