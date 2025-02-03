"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngExpression } from "leaflet";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  coordinates: LatLngExpression; // Ensure it's compatible with Leaflet types
}

interface PropertyMapProps {
  properties: Property[];
  center: LatLngExpression;
  zoom?: number;
}

export function PropertyMap({ properties, center, zoom = 13 }: PropertyMapProps) {
  return (
    <div className="h-full rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={zoom} className="w-full h-full" scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker key={property.id} position={property.coordinates as LatLngExpression}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm">${property.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{property.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
