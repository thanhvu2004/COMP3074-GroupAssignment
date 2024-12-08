import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import GetLocation from "react-native-get-location";
import { useEffect, useState } from "react";
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DirectionsMap({ route }) {
  const { region, restaurant } = route.params;
  const [currentLocation, setCurrentLocation] = useState()
  console.log(region);

  useEffect(() => {
    // Loads in the users location
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
    .then(location => {
        setCurrentLocation(location);
    })
    .catch(e => {
        console.warn(e);
    })
  },[])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        key={region.latitude + region.longitude}
      >
        <MapViewDirections 
          origin={currentLocation}
          destination={region}
          apikey={GOOGLE_MAPS_API_KEY}
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
