import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  locations?: any[];
  location?: any;
  onSelectLocation?: (item: any) => void;
}

export default function MapComponent({
  locations = [],
  location,
  onSelectLocation,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const center = location || locations[0];

  // 🚀 INIT MAP
  useEffect(() => {
    if (!mapContainer.current || !center) return;

    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        // ✅ FIX: đổi style (không còn map xanh)
        style:
          "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",

        center: [
          Number(center.longitude),
          Number(center.latitude),
        ],
        zoom: 15,

        // 🎯 cho map đẹp hơn
        pitch: 45,
        bearing: -10,
        
      });

      mapRef.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );
    }
  }, []);

  // 🎯 UPDATE CENTER
  useEffect(() => {
    if (!mapRef.current || !center) return;

    mapRef.current.flyTo({
      center: [
        Number(center.longitude),
        Number(center.latitude),
      ],
      zoom: 15,
      duration: 800,
    });
  }, [location]);

  // 📍 RENDER MARKERS
  useEffect(() => {
    if (!mapRef.current) return;

    // clear markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      const el = document.createElement("div");

      // 🎯 style marker đẹp hơn
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
      el.style.backgroundColor =
        item.locationId === location?.locationId
          ? "#ff3b30" // đỏ khi selected
          : "#007aff"; // xanh iOS

      const marker = new maplibregl.Marker(el)
        .setLngLat([
          Number(item.longitude),
          Number(item.latitude),
        ])
        .addTo(mapRef.current);

      // 👉 click marker
      el.onclick = () => {
        onSelectLocation?.(item);
      };

      markersRef.current.push(marker);
    });
  }, [locations, location]);

  // ❌ tránh crash khi không có data
  if (!center) return null;

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}