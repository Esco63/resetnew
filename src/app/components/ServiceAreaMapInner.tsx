"use client";

import React from "react";
import { MapContainer, TileLayer, Circle, Polygon } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";

type Props = {
  /** Mittelpunkt der Karte (Default: Schwerin) */
  center?: LatLngTuple; // [lat, lng]
  /** Entweder radiusMeters (Kreis) ODER polygonCoords (Polygon) */
  radiusMeters?: number;
  polygonCoords?: LatLngTuple[];
  /** Start-Zoom */
  zoom?: number;
  /** Scroll-Zoom erlauben */
  scrollWheelZoom?: boolean;
};

export default function ServiceAreaMapInner({
  center = [53.629, 11.414],
  radiusMeters = 25000,
  polygonCoords,
  zoom = 11,
  scrollWheelZoom = false,
}: Props) {
  const stroke = "#ea580c"; // orange-600
  const fill = "#ea580c";

  const centerLL = center as LatLngExpression;

  return (
    <MapContainer
      center={centerLL}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className="h-full w-full"
      attributionControl
      aria-label="Karte vom Einsatzgebiet rund um Schwerin"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // Hinweis: wenn TS hier meckert, siehe Fallback unten
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />

      {polygonCoords && polygonCoords.length >= 3 ? (
        <Polygon
          positions={polygonCoords as LatLngExpression[]}
          pathOptions={{ color: stroke, weight: 3, fillColor: fill, fillOpacity: 0.1 }}
        />
      ) : (
        <Circle
          center={centerLL}
          radius={radiusMeters}
          pathOptions={{ color: stroke, weight: 3, fillColor: fill, fillOpacity: 0.1 }}
        />
      )}
    </MapContainer>
  );
}
