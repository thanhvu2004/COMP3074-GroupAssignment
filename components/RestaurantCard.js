import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "settings";
const DEFAULT_IMAGE = require("../assets/restaurant.jpg");

export default function RestaurantCard({
  restaurant,
  navigation,
  isRatingEnabled,
}) {
  const [currentRestaurant, setCurrentRestaurant] = useState(restaurant);

  useEffect(() => {
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
          }
        }
      } catch (error) {
        console.error("Error loading restaurant:", error);
      }
    };

    loadRestaurant();
  }, [restaurant, isRatingEnabled]);

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

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("RestaurantDetails", {
          restaurant: currentRestaurant,
        })
      }
    >
      <View style={styles.card}>
        <Image
          source={
            currentRestaurant.image
              ? { uri: currentRestaurant.image }
              : DEFAULT_IMAGE
          }
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{currentRestaurant.name}</Text>
          <Text style={styles.location}>
            {currentRestaurant.address.street}, {currentRestaurant.address.city}
            , {currentRestaurant.address.state}, {currentRestaurant.address.zip}
            , {currentRestaurant.address.country}
          </Text>
          {renderRating()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "gray",
    marginVertical: 5,
  },
  rating: {
    fontSize: 14,
    color: "gold",
  },
});