import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;


// === CURRENTLY UNUSED, DIRECTIONS BUTTON OPENS RELEVANT MAP APP ===


export default function DirectionsMap({ route }) {
  const { region, restaurant } = route.params;
  const [location, setLocation] = useState(false)
  console.log(region);

  useEffect(() => {
    // Get permissions, then get location
    getPermissionAndLocation();
  },[])

  const getPermissionAndLocation = async() => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
      console.log("Please grant location permissions")
      return
    }
    let currLocation = await Location.getCurrentPositionAsync({});
    console.log(currLocation)
    setLocation(currLocation.coords)
  }

  return !location ? (
    <Text>Getting your location...</Text> 
  ) : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        key={region.latitude + region.longitude}
      >
        <Marker
          coordinate={region}
          title={restaurant.name}
          description={restaurant.address.street}
        />
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
