import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RestaurantCard from "./RestaurantCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar } from "react-native-screens";

const SETTINGS_KEY = "settings";

export default function FavouriteRestaurant({ navigation }) {
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchSettings();
    fetchRestaurants();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurants();
      fetchSettings();
    }, [])
  );

  const fetchSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        setIsRatingEnabled(parsedSettings.isRatingEnabled);
      }
    } catch (error) {
      console.error("Failed to load settings from AsyncStorage", error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      if (storedRestaurants) {
        const restaurants = JSON.parse(storedRestaurants)
        const favRestaurants = restaurants.filter(restaurant => restaurant.favorite === true)
        setRestaurants(favRestaurants);
      }
    } catch (error) {
      console.error("Failed to load restaurants from AsyncStorage", error);
    }
  };
  
  // Currently displays restaurants ordered by rating
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Favorite Restaurants</Text>
      <SearchBar 
        inputType="text"
      />
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => 
          <RestaurantCard 
            restaurant={item} 
            navigation={navigation}
            isRatingEnabled={isRatingEnabled}
          />}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});