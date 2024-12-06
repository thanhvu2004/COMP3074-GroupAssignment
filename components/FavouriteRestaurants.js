import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import RestaurantCard from "./RestaurantCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar } from "react-native-screens";


export default function FavouriteRestaurant({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      if (storedRestaurants) {
        const restaurants = JSON.parse(storedRestaurants)
        // TODO - filter only favorite restaurants
        setRestaurants(restaurants);
      }
    } catch (error) {
      console.error("Failed to load restaurants from AsyncStorage", error);
    }
  };
  
  // Currently displays restaurants ordered by rating
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Favorite Restaurants</Text>
      <SearchBar />
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RestaurantCard restaurant={item} navigation={navigation}/>}
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