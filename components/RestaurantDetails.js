import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Linking,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";

const SETTINGS_KEY = "settings";
const DEFAULT_IMAGE = require("../assets/restaurant.jpg");
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

Geocoder.init(GOOGLE_MAPS_API_KEY);

export default function RestaurantDetails({ route, navigation }) {
  const { restaurant } = route.params;
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const [selectedRating, setSelectedRating] = useState(restaurant.rating || "");
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant);
  const [favorite, setFavorite] = useState(restaurant.favorite);
  const [region, setRegion] = useState(null);

  useEffect(() => { // Load the settings from AsyncStorage once the component mounts
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (settings !== null) {
          const parsedSettings = JSON.parse(settings);
          setIsRatingEnabled(parsedSettings.isRatingEnabled);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  useFocusEffect( // Load the restaurant details from AsyncStorage when the screen is focused
    React.useCallback(() => {
      const loadRestaurant = async () => {
        try {
          const storedRestaurants = await AsyncStorage.getItem("restaurants");
          if (storedRestaurants) {
            const restaurants = JSON.parse(storedRestaurants);
            const updatedRestaurant = restaurants.find(
              (r) => r.id === restaurant.id
            );
            if (updatedRestaurant) {
              setCurrentRestaurant(updatedRestaurant); // Update the current restaurant state
              setSelectedRating(updatedRestaurant.rating); // Update the selected rating state
              const fullAddress = `${updatedRestaurant.address.street}, ${updatedRestaurant.address.city}, ${updatedRestaurant.address.state}, ${updatedRestaurant.address.zip}, ${updatedRestaurant.address.country}`;
              Geocoder.from(fullAddress) // Get the latitude and longitude of the restaurant based on its address
                .then((json) => {
                  const location = json.results[0].geometry.location;
                  setRegion({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                })
                .catch((error) => console.warn(error));
            }
          }
        } catch (error) {
          console.error("Error loading restaurant:", error);
        }
      };

      loadRestaurant();
    }, [restaurant.id])
  );

  const renderRating = () => { // Render the restaurant rating
    if (currentRestaurant.rating === "") {
      return (
        <Text style={styles.rating}>
          This restaurant doesn't have a rating yet
        </Text>
      );
    } else if (isRatingEnabled) {
      return (
        <Text style={styles.rating}>Rating: {currentRestaurant.rating}</Text>
      );
    } else {
      const stars = "★".repeat(Math.round(currentRestaurant.rating));
      return <Text style={styles.rating}>{stars}</Text>;
    }
  };

  const handleRatingChange = async (newRating) => { // Handle the rating change
    setSelectedRating(newRating);
    const updatedRestaurant = { ...currentRestaurant, rating: newRating };
    setCurrentRestaurant(updatedRestaurant);

    // Update the restaurant in AsyncStorage
    updateRestaurant(updatedRestaurant)
  };

  const handleFavoriteChange = async (isFav) => { // Handle the favorite change
    const updatedRestaurant = { ...currentRestaurant, favorite: isFav };
    setCurrentRestaurant(updatedRestaurant);

    // Update the restaurant in AsyncStorage
    updateRestaurant(updatedRestaurant)
  };

  const updateRestaurant = async(updatedRestaurant) => {
    try {
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      const restaurants = storedRestaurants
        ? JSON.parse(storedRestaurants)
        : [];
      const updatedRestaurants = restaurants.map((r) =>
        r.id === restaurant.id ? updatedRestaurant : r
      );
      await AsyncStorage.setItem(
        "restaurants",
        JSON.stringify(updatedRestaurants)
      );
    } catch (error) {
      console.error("Error updating restaurant: ", error);
    }
  }

  const handleEditRestaurant = () => { // Navigate to the EditRestaurant screen
    navigation.navigate("EditRestaurant", { restaurant: currentRestaurant });
  };

  const handleDeleteRestaurant = async () => { // Delete the restaurant
    Alert.alert(
      "Delete Restaurant",
      "Are you sure you want to delete this restaurant?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedRestaurants = await AsyncStorage.getItem(
                "restaurants"
              );
              const restaurants = storedRestaurants
                ? JSON.parse(storedRestaurants)
                : [];
              const updatedRestaurants = restaurants.filter(
                (r) => r.id !== restaurant.id
              );
              await AsyncStorage.setItem(
                "restaurants",
                JSON.stringify(updatedRestaurants)
              );
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting restaurant:", error);
            }
          },
        },
      ]
    );
  };

  const handleViewFullscreenMap = () => {
    navigation.navigate("FullscreenMap", {
      region,
      restaurant: currentRestaurant,
    });
  };

  const handleGetDirections = () => {
    const scheme = Platform.select({
      ios: `maps://?q=${restaurant.name}&ll=${region.latitude},${region.longitude}`,
      android: `google.navigation:q=${region.latitude},${region.longitude}`,
    });
    Linking.openURL(scheme).catch(err =>
      console.error('Error opening map: ', err),
    );
    // navigation.navigate("DirectionsMap", {
    //   region,
    //   restaurant: currentRestaurant,
    // });
  }

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{currentRestaurant.name}</Text>
      <Text style={styles.paragraph_text}>
        {currentRestaurant.cuisine_type}
      </Text>
      <Image
        source={
          currentRestaurant.image
            ? { uri: currentRestaurant.image }
            : DEFAULT_IMAGE
        }
        style={styles.image}
      />
      <Text style={styles.paragraph_text}>{currentRestaurant.description}</Text>
      <Text style={styles.paragraph_text}>
        {currentRestaurant.address.street}, {currentRestaurant.address.city},{" "}
        {currentRestaurant.address.state}, {currentRestaurant.address.country}
      </Text>
      <Text style={styles.paragraph_text}>{currentRestaurant.address.zip}</Text>
      <Text style={styles.paragraph_text}>Phones:</Text>
      {currentRestaurant.phones.map((phone, index) => (
        <Text key={index}>{formatPhoneNumber(phone)}</Text>
      ))}
      <Text style={styles.subtle_text}>
        {currentRestaurant.tags.join(", ")}
      </Text>
      {renderRating()}
      {region && (
        // Render the map if the region is available
        <View> 
          <MapView style={styles.map} region={region}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title={currentRestaurant.name}
              description={currentRestaurant.address.street}
            />
          </MapView>
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={handleViewFullscreenMap}
          >
            <Text style={styles.buttonText}>View Fullscreen Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={handleGetDirections}
          >
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Select Rating:</Text>
        <View style={styles.radioGroup}>
          {[1, 2, 3, 4, 5].map((value) => (
            <View key={value} style={styles.radioItem}>
              <RadioButton
                value={value.toString()}
                status={
                  selectedRating === value.toString() ? "checked" : "unchecked"
                }
                onPress={() => handleRatingChange(value.toString())}
              />
              <Text>{value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Favorite:</Text>
        <Switch
          style={styles.input}
          isOn={favorite}
          value={favorite}
          onValueChange={(v) => {setFavorite(v); handleFavoriteChange(v);}}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEditRestaurant}>
        <Text style={styles.buttonText}>Edit Restaurant</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDeleteRestaurant}
      >
        <Text style={styles.buttonText}>Delete Restaurant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph_text: {
    fontSize: 16,
    marginBottom: 10,
  },
  subtle_text: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    color: "gold",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  fullscreenButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  ratingContainer: {
    marginTop: 20,
  },
  ratingLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});