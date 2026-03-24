import React from "react";
import MapView, { Marker } from "react-native-maps";

export default function MapComponent({
  location,
  locations = [],
  onSelectLocation,
  region,
}: any) {
  if (!location && !locations.length) return null;

  return (
    <MapView
      style={{ flex: 1 }}
      region={
        region || {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      }
    >
      {/* Nếu có list locations → render nhiều marker */}
      {locations.length > 0
        ? locations.map((item: any) => (
            <Marker
              key={item.locationId}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
              description={item.description}
              onPress={() => onSelectLocation?.(item)}
            />
          ))
        : location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          )}
    </MapView>
  );
}