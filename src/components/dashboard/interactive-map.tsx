
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, MapRef, Source, Layer, LngLatBoundsLike, MapLayerMouseEvent } from 'react-map-gl';
import { MapPin, Plus, Minus, Navigation, Box, Layers2, Globe, Map as MapIconLucide, PanelRightClose, PanelRightOpen } from 'lucide-react';
import BasemapControl from './basemap-control';
import SearchControl from './search-control';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LayerControl, { type LayerState } from './layer-control';
import LegendControl from './legend-control';
import { getLocationDetails, getLocationByCoords } from '@/services/map.service';
import type { Location, TerritoryTypeKey } from "@/models/location.model";
import * as turf from '@turf/turf';
import type { StatsData, GeneralInfo } from './stats-panel';
import MapSettingsControl from './map-settings-control';
import { Separator } from '../ui/separator';
import { territoryTypes } from '@/models/location.model';
import ExpandButton from './expand-button';
import type { PanelGroup } from "react-resizable-panels";
import type { FeatureCollection, Geometry } from 'geojson';
import { useI18n } from '@/hooks/use-i18n';

const basemaps = {
    'satellite': 'mapbox://styles/mapbox/satellite-streets-v12',
    'streets': 'mapbox://styles/mapbox/streets-v12',
    'dark': 'mapbox://styles/mapbox/dark-v11',
};

const defaultBasemapKey = 'dark';

interface InitialLayerData {
    indicator: string | null;
    restoredCarbon: string | null;
    currentCarbon: string | null;
    opportunityCost: string | null;
    restorationCost: string | null;
    mapbiomas: string | null;
}

interface InteractiveMapProps {
  onAreaUpdate: (data: StatsData | null) => void;
  selectedArea: StatsData | null;
  isPanelCollapsed: boolean;
  togglePanel: () => void;
  panelGroupRef: React.RefObject<PanelGroup>;
  initialLayerData: InitialLayerData;
  statesGeoJSON: FeatureCollection<Geometry> | null;
  initialLocations: Record<string, Location[]>;
}

interface PopupInfo {
    lng: number;
    lat: number;
    message: string;
}

export default function InteractiveMap({ onAreaUpdate, selectedArea, isPanelCollapsed, togglePanel, panelGroupRef, initialLayerData, statesGeoJSON, initialLocations }: InteractiveMapProps) {
  const [currentStyleKey, setCurrentStyleKey] = useState(defaultBasemapKey);
  const [is3D, setIs3D] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [selectedShape, setSelectedShape] = useState<any>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [projection, setProjection] = useState<'mercator' | 'globe'>('mercator');
  const mapRef = useRef<MapRef>(null);
  const { t } = useI18n();

  // Layer XYZ URLs now come from props
  const { 
    indicator: indicatorXYZ, 
    restoredCarbon: restoredCarbonXYZ,
    currentCarbon: currentCarbonXYZ,
    opportunityCost: opportunityCostXYZ,
    restorationCost: restorationCostXYZ,
    mapbiomas: mapbiomasXYZ,
  } = initialLayerData;

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
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.5);

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

  const toggleProjection = () => {
    setProjection(current => current === 'mercator' ? 'globe' : 'mercator');
  };

  const handleLocationSelect = async (location: Location | null, type: TerritoryTypeKey | null) => {
    setPopupInfo(null); 
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
      const details = await getLocationDetails(type, location.value);
      
      if (details && details.geom) {
        setSelectedShape(details.geom);
        
        if (mapRef.current) {
            const bbox = turf.bbox(details.geom) as LngLatBoundsLike;
            mapRef.current.fitBounds(bbox, { padding: 40, duration: 1000 });
        }
        
        let areaName = details.name;
        if(type === 'municipio' && details.uf && details.uf.length > 0) {
             areaName = `${details.name} - ${details.uf[0].sigla_uf}`;
        }
       
        const typeLabel = territoryTypes.find(t => t.value === type)?.label || 'Territory';
       
        const newArea: StatsData = {
          id: location.value,
          name: areaName,
          type: typeLabel,
          typeKey: type,
        };
        onAreaUpdate(newArea);

        if (isPanelCollapsed) {
          panelGroupRef.current?.setLayout([70, 30]);
        }
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

    const features = event.features?.filter(f => f.layer.id === 'states-fill');
    if (features && features.length > 0) {
        const feature = features[0];
        if (feature && feature.properties) {
            const { id, name } = feature.properties;
            const location: Location = { value: String(id), label: name };
            handleLocationSelect(location, 'estado');
            return;
        }
    }

    // Fallback to coordinate-based search if no feature was clicked (e.g., clicking on the sea)
    try {
        const clickedLocation = await getLocationByCoords(lat, lng);
        if (clickedLocation && clickedLocation.id) {
            const location: Location = { value: String(clickedLocation.id), label: clickedLocation.name };
            handleLocationSelect(location, 'estado');
        } else {
             setPopupInfo({ lng, lat, message: t('mapPopupSelectTerritory') });
        }
    } catch(error) {
        if (error instanceof Error && error.message.includes('404')) {
             setPopupInfo({ lng, lat, message: t('mapPopupSelectTerritory') });
        } else {
            console.error("[InteractiveMap] Failed to get location by coords", error);
            setPopupInfo({ lng, lat, message: t('mapPopupError') });
        }
    }
  }


  const handleLegendClose = (layerId: keyof LayerState) => {
    setLayers(prev => ({...prev, [layerId]: false}));
  }

  const mapStyle = basemaps[currentStyleKey as keyof typeof basemaps];

  const renderRasterLayer = (id: string, xyzUrl: string | null, opacity: number) => {
    if (!xyzUrl) return null;
    return (
      <Source id={`${id}-source`} type="raster" tiles={[xyzUrl]} tileSize={256}>
        <Layer id={id} type={'raster'} paint={{'raster-opacity': opacity}} />
      </Source>
    );
  };
  
  const activeLayers = Object.entries(layers).filter(([, value]) => value).map(([key]) => key as keyof LayerState);


  return (
    <div className="relative w-full h-full">
        <div className="absolute top-4 left-4 z-10">
            <SearchControl 
              onLocationSelect={handleLocationSelect} 
              initialLocations={initialLocations}
            />
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
            projection={{name: projection}}
            attributionControl={false}
            terrain={is3D ? {source: 'mapbox-dem', exaggeration: terrainExaggeration} : undefined}
            onMove={(evt) => setBearing(evt.viewState.bearing)}
            onClick={handleMapClick}
            interactiveLayerIds={['states-fill']}
            cursor="pointer"
        >
            <Source
                id="mapbox-dem"
                type="raster-dem"
                url="mapbox://mapbox.mapbox-terrain-dem-v1"
                tileSize={512}
                maxzoom={14}
            />

            {statesGeoJSON && (
                 <Source id="states-source" type="geojson" data={statesGeoJSON} generateId={true}>
                    <Layer
                        id="states-fill"
                        type="fill"
                        paint={{
                           'fill-color': 'transparent',
                        }}
                    />
                </Source>
            )}

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

            {popupInfo && (
                <Popup
                    longitude={popupInfo.lng}
                    latitude={popupInfo.lat}
                    onClose={() => setPopupInfo(null)}
                    closeOnClick={false}
                    closeButton={true}
                    anchor="bottom"
                >
                     {popupInfo.message}
                </Popup>
            )}
        </Map>

        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
             {selectedArea && <ExpandButton onClick={togglePanel} isCollapsed={isPanelCollapsed} />}
        </div>
        
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
            <MapSettingsControl 
              is3D={is3D}
              indicatorOpacity={indicatorOpacity}
              onIndicatorOpacityChange={setIndicatorOpacity}
              fillOpacity={fillOpacity}
              onFillOpacityChange={setFillOpacity}
              strokeOpacity={strokeOpacity}
              onStrokeOpacityChange={setStrokeOpacity}
              terrainExaggeration={terrainExaggeration}
              onTerrainExaggerationChange={setTerrainExaggeration}
            />
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={toggle3D}
                            className={cn("bg-background/80 btn-map-control", is3D && "bg-accent text-accent-foreground")}
                        >
                            <Box className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>{is3D ? t('disable3D') : t('enable3D')}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={toggleProjection}
                            className={cn("bg-background/80 btn-map-control", projection === 'globe' && "bg-accent text-accent-foreground")}
                        >
                            {projection === 'mercator' ? <Globe className="h-5 w-5" /> : <MapIconLucide className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>{projection === 'mercator' ? t('globeProjection') : t('mercatorProjection')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <LayerControl layers={layers} setLayers={setLayers} />
            <BasemapControl onStyleChange={handleStyleChange} basemaps={basemaps} currentStyleKey={currentStyleKey} />

            <div className="flex flex-col bg-background/80 border border-border rounded-md shadow-md overflow-hidden">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="btn-map-control rounded-none h-10 w-10">
                            <Plus className="h-4 w-4" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>{t('zoomIn')}</p></TooltipContent>
                    </Tooltip>
                    <Separator />
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="btn-map-control rounded-none h-10 w-10">
                            <Minus className="h-4 w-4" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>{t('zoomOut')}</p></TooltipContent>
                    </Tooltip>
                    <Separator />
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleResetBearing} className="btn-map-control rounded-none h-10 w-10">
                            <Navigation className="h-4 w-4 transition-transform" style={{ transform: `rotate(${bearing * -1}deg)` }} />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>{t('orientation')}: {Math.abs(bearing).toFixed(0)}°</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    </div>
  );
}
