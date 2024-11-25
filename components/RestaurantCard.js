import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "settings";

export default function RestaurantCard({ restaurant, navigation }) {
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (settings !== null) {
          const parsedSettings = JSON.parse(settings);
          setIsRatingEnabled(parsedSettings.isRatingANEnabled);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const renderRating = () => {
    if (isRatingEnabled) {
      return <Text style={styles.rating}>Rating: {restaurant.rating}</Text>;
    } else {
      const stars = "★".repeat(Math.round(restaurant.rating));
      return <Text style={styles.rating}>{stars}</Text>;
    }
  };

  return (
    <TouchableOpacity onPress={() => 
      {navigation.navigate("RestaurantDetails", {restaurant: restaurant})}}>
      <View style={styles.card}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.location}>{restaurant.location}</Text>
          {renderRating()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    marginLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  rating: {
    fontSize: 14,
    color: "#666",
  },
});