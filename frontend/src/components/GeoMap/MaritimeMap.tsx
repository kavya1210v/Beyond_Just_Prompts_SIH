import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CycloneMetadataResponse } from '../../types/cyclone';
import { Compass, Navigation, MapPin, AlertCircle, Info } from 'lucide-react';

// Custom SVG Icons for Leaflet
const createStormIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-storm-icon',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-8 h-8 rounded-full border-2 animate-ping opacity-75" style="border-color: ${color};"></div>
        <div class="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-black" style="background-color: ${color}; box-shadow: 0 0 15px ${color};">
          🌀
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createWaypointIcon = (imdCode: string, color: string) => {
  return L.divIcon({
    className: 'custom-waypoint-icon',
    html: `
      <div class="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-md flex items-center justify-center" style="background-color: ${color};">
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

// Map center adjuster on storm change
const MapViewController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

interface MaritimeMapProps {
  cycloneMeta: CycloneMetadataResponse;
}

export const MaritimeMap: React.FC<MaritimeMapProps> = ({ cycloneMeta }) => {
  const { center_lat, center_lon, basin } = cycloneMeta.georeference;
  const currentPos: [number, number] = [center_lat, center_lon];

  const trackPositions: [number, number][] = cycloneMeta.historical_track.map((p) => [
    p.lat,
    p.lon,
  ]);

  const stormColor = cycloneMeta.meteorological_data.imd_category.color_hex;

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Explicit DEMO / SIMULATION Watermark Pill */}
      <div className="absolute top-3 left-3 z-[500] pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/90 backdrop-blur-md border border-amber-500/60 text-amber-300 font-mono text-[11px] font-bold shadow-lg">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>[DEMO / SIMULATION] IBTrACS Ground Truth Feed</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          Geographic coordinates are decoupled from YOLO bounding-box
        </span>
      </div>

      {/* Basin & Coords HUD Badge */}
      <div className="absolute top-3 right-3 z-[500] bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono flex flex-col gap-0.5 shadow-lg">
        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>{cycloneMeta.storm_name}</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Ground Truth Center: <span className="text-white font-bold">{center_lat.toFixed(1)}°N, {center_lon.toFixed(1)}°E</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Basin: <span className="text-slate-200">{basin}</span> | Heading: <span className="text-amber-300 font-bold">{cycloneMeta.meteorological_data.movement_heading}</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={currentPos}
        zoom={6}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: '#070b14' }}
      >
        <MapViewController center={currentPos} />

        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Historical Track Polyline */}
        <Polyline
          positions={trackPositions}
          pathOptions={{
            color: '#38bdf8',
            weight: 3,
            dashArray: '6, 6',
            opacity: 0.85,
          }}
        />

        {/* Historical Waypoints */}
        {cycloneMeta.historical_track.map((pt, idx) => (
          <Marker
            key={idx}
            position={[pt.lat, pt.lon]}
            icon={createWaypointIcon(pt.imd_code, '#38bdf8')}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 font-mono text-xs text-slate-900">
                <p className="font-bold text-cyan-900">{pt.relative_time} ({pt.imd_name})</p>
                <p>Lat: {pt.lat}°N, Lon: {pt.lon}°E</p>
                <p>Wind: {pt.wind_kts} kts | Pressure: {pt.central_pressure_hpa} hPa</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Radius of Maximum Winds Ring */}
        <Circle
          center={currentPos}
          radius={cycloneMeta.meteorological_data.estimated_radius_max_wind_km * 1000}
          pathOptions={{
            color: stormColor,
            fillColor: stormColor,
            fillOpacity: 0.15,
            weight: 1.5,
            dashArray: '4, 4',
          }}
        />

        {/* Current Storm Marker */}
        <Marker position={currentPos} icon={createStormIcon(stormColor)}>
          <Popup className="custom-leaflet-popup">
            <div className="p-2 font-mono text-xs text-slate-900">
              <p className="font-black text-red-600 text-sm">{cycloneMeta.storm_name}</p>
              <p className="font-bold text-slate-700">{cycloneMeta.meteorological_data.imd_category.name}</p>
              <hr className="my-1 border-slate-300" />
              <p>Center: {center_lat}°N, {center_lon}°E</p>
              <p>Max Wind: {cycloneMeta.meteorological_data.max_sustained_wind_kmh} km/h</p>
              <p>Pressure: {cycloneMeta.meteorological_data.central_pressure_hpa} hPa</p>
              <p className="text-[10px] text-slate-500 mt-1 italic">[DEMO / IBTrACS Simulation]</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Bottom Track Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-[500] bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-semibold">Track Sequence:</span>
          {cycloneMeta.historical_track.map((pt, i) => (
            <span key={i} className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {pt.relative_time}: {pt.imd_code} ({pt.wind_kts} kt)
            </span>
          ))}
        </div>
        <span className="text-amber-400 font-semibold">
          Radius Max Wind: {cycloneMeta.meteorological_data.estimated_radius_max_wind_km} km
        </span>
      </div>
    </div>
  );
};
