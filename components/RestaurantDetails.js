import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";

const SETTINGS_KEY = "settings";
const DEFAULT_IMAGE = require("../assets/restaurant.jpg");

export default function RestaurantDetails({ route }) {
  const { restaurant } = route.params;
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const [selectedRating, setSelectedRating] = useState(restaurant.rating || "");
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant);

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

    const loadRestaurant = async () => {
      try {
        const storedRestaurants = await AsyncStorage.getItem("restaurants");
        if (storedRestaurants) {
          const restaurants = JSON.parse(storedRestaurants);
          const updatedRestaurant = restaurants.find(
            (r) => r.name === restaurant.name
          );
          if (updatedRestaurant) {
            setCurrentRestaurant(updatedRestaurant);
            setSelectedRating(updatedRestaurant.rating);
          }
        }
      } catch (error) {
        console.error("Error loading restaurant:", error);
      }
    };

    loadSettings();
    loadRestaurant();
  }, [restaurant.name]);

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

    // Update the restaurant rating in AsyncStorage
    try {
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      const restaurants = storedRestaurants
        ? JSON.parse(storedRestaurants)
        : [];
      const updatedRestaurants = restaurants.map((r) =>
        r.name === restaurant.name ? updatedRestaurant : r
      );
      await AsyncStorage.setItem(
        "restaurants",
        JSON.stringify(updatedRestaurants)
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <View style={styles.container}>
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
        {currentRestaurant.address.state}, {currentRestaurant.address.zip},{" "}
        {currentRestaurant.address.country}
      </Text>
      <Text style={styles.subtle_text}>
        {currentRestaurant.tags.join(", ")}
      </Text>
      {renderRating()}
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
    </View>
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
});
