import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function FullscreenMap({ route, navigation }) {
  const { region, restaurant } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location access is required to show the route.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error fetching current location:", error);
      }
    };

    fetchCurrentLocation();
  }, []);

  if (!region || !currentLocation) {
    return null; // Render nothing if location data isn't ready
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...currentLocation,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Restaurant Marker */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title={restaurant.name}
          description={restaurant.address.street}
        />

        {/* Draw Route */}
        <MapViewDirections
          origin={currentLocation}
          destination={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="blue"
          onError={(errorMessage) => {
            console.error("Directions error: ", errorMessage);
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
