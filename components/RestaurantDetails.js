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
  Platform,
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

  useEffect(() => {
   
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

  useFocusEffect(
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
              setCurrentRestaurant(updatedRestaurant);
              setSelectedRating(updatedRestaurant.rating);
              const fullAddress = `${updatedRestaurant.address.street}, ${updatedRestaurant.address.city}, ${updatedRestaurant.address.state}, ${updatedRestaurant.address.zip}, ${updatedRestaurant.address.country}`;
              Geocoder.from(fullAddress)
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

  const renderRating = () => {
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

  const handleRatingChange = async (newRating) => {
    setSelectedRating(newRating);
    const updatedRestaurant = { ...currentRestaurant, rating: newRating };
    setCurrentRestaurant(updatedRestaurant);
    updateRestaurant(updatedRestaurant);
  };

  const handleFavoriteChange = async (isFav) => {
    const updatedRestaurant = { ...currentRestaurant, favorite: isFav };
    setCurrentRestaurant(updatedRestaurant);
    updateRestaurant(updatedRestaurant);
  };

  const updateRestaurant = async (updatedRestaurant) => {
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
  };

  const handleShare = () => {
    Linking.openURL(
      `mailto:?subject=Check out this restaurant&body=Check out the details of this restaurant at ${currentRestaurant.name}.`
    ).then(() => {
      navigation.goBack(); 
    });
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=https://maps.google.com/?q=${currentRestaurant.geometry.location.lat},${currentRestaurant.geometry.location.lng}`;
    Linking.openURL(url).then(() => {
      navigation.goBack(); 
    }).catch(err => console.error('Error opening Facebook share:', err));
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=Check out ${currentRestaurant.name} at ${currentRestaurant.formatted_address}!`;
    Linking.openURL(url).then(() => {
      navigation.goBack(); 
    }).catch(err => console.error('Error opening Twitter share:', err));
  };

  const handleEditRestaurant = () => {
    navigation.navigate("EditRestaurant", { restaurant: currentRestaurant });
  };

  const handleDeleteRestaurant = async () => {
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
      ios: `maps://?q=${currentRestaurant.name}&ll=${region.latitude},${region.longitude}`,
      android: `google.navigation:q=${region.latitude},${region.longitude}`,
    });
    Linking.openURL(scheme).catch(err =>
      console.error('Error opening map: ', err),
    );
  };

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
          onValueChange={(v) => {
            setFavorite(v);
            handleFavoriteChange(v);
          }}
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
      <Button title="Share via Email" onPress={handleShare} />
      <Button title="Share via Facebook" onPress={handleFacebookShare} />
      <Button title="Share via Twitter" onPress={handleTwitterShare} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({

});
