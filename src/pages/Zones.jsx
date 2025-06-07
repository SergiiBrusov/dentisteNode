import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Zones() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Zones d'intervention</h2>
      <MapContainer
        center={[46.5, 2.2]}
        zoom={6}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[48.85, 2.35]}>
          <Popup>Paris</Popup>
        </Marker>
        <Marker position={[45.75, 4.85]}>
          <Popup>Lyon</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
