import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import restaurantData from "../data/restaurant.json";
import RestaurantCard from "./RestaurantCard";


export default function FavouriteRestaurant({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    setRestaurants(restaurantData);
  }, []);
  
  // Currently displays restaurants ordered by rating
  // TODO - include 'favorite' boolean on each restaurant to only show ones selected as favorites 
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Favorite Restaurants</Text>
      <FlatList
        data={restaurants.sort((a, b) => {b.rating-a.rating})}
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