"use client";

import { useEffect, useRef, useState } from "react";
import PropertyCard from "./Property-card";
import { Loader } from "lucide-react";

interface Property {
  id: number;
  image: string;
  price: number;
  address: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  lat: number;
  lng: number;
}

interface MapViewProps {
  properties: Property[];
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void; // <-- Made initMap optional
  }
}

export default function MapView({ properties }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (window.google) {
      window.initMap?.();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setMapError(true);
      setLoading(false);
    };

    window.initMap = () => {
      if (mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 14,
          center: { lat: -1.2921, lng: 36.8219 },
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        setMap(mapInstance);
        setLoading(false);
      }
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
      window.initMap = undefined; // <-- Correctly resetting it
    };
  }, []);

  useEffect(() => {
    if (!map || !properties.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    properties.forEach((property) => {
      const marker = new window.google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4A90E2",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelectedProperty(selectedProperty?.id === property.id ? null : property);
      });

      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  }, [map, properties, selectedProperty]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {mapError ? (
        <div className="h-full w-full flex items-center justify-center text-gray-500">
          <p>Map failed to load. Please check your internet connection.</p>
        </div>
      ) : (
        <div ref={mapRef} className="h-full w-full" />
      )}
      {selectedProperty && (
        <div
          className="absolute transform -translate-x-1/2 z-10 w-[300px]"
          style={{
            left:
              map
                ?.getProjection()
                ?.fromLatLngToPoint(new window.google.maps.LatLng(selectedProperty.lat, selectedProperty.lng))?.x + "px" || "50%",
            top:
              map
                ?.getProjection()
                ?.fromLatLngToPoint(new window.google.maps.LatLng(selectedProperty.lat, selectedProperty.lng))?.y - 200 + "px" || "50%",
          }}
        >
          <PropertyCard {...selectedProperty} />
        </div>
      )}
    </div>
  );
}
