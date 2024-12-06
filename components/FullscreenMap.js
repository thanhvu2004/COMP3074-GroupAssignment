import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function FullscreenMap({ route }) {
  const { region, restaurant } = route.params;
  console.log(region);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        key={region.latitude + region.longitude}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title={restaurant.name}
          description={restaurant.address.street}
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
    ...StyleSheet.absoluteFillObject,
  },
});
