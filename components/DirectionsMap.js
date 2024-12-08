import { View, Text, StyleSheet, PermissionsAndroid } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useEffect, useState } from "react";
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DirectionsMap({ route }) {
  const { region, restaurant } = route.params;
  const [location, setLocation] = useState(false)
  console.log(region);

  useEffect(() => {
    // Get permissions, then get location
  },[])



  return !currentLocation ? (
    <Text>Getting your location...</Text> 
  ) : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        key={region.latitude + region.longitude}
      >
        <MapViewDirections 
          origin={location}
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
