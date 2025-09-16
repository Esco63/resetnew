"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { LatLngTuple } from "leaflet";

type Props = {
  center?: LatLngTuple;
  radiusMeters?: number;
  polygonCoords?: LatLngTuple[];
  zoom?: number;
  scrollWheelZoom?: boolean;
};

const ServiceAreaMapInner = dynamic(() => import("./ServiceAreaMapInner"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50" />,
});

export default function ServiceAreaMap(props: Props) {
  return <ServiceAreaMapInner {...props} />;
}
