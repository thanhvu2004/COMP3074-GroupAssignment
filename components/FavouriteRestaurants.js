import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RestaurantCard from "./RestaurantCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "settings";

export default function FavouriteRestaurant({ navigation }) {
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const [search, setSearch] = useState();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

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
        setFilteredRestaurants(favRestaurants)
      }
    } catch (error) {
      console.error("Failed to load restaurants from AsyncStorage", error);
    }
  };

  const filterRestaurants = () => {
    if(search && search.length > 0){
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(search.toLowerCase()) || 
        restaurant.tags.find(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
      setFilteredRestaurants(filtered)
    } else {
      setFilteredRestaurants(restaurants)
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Favorite Restaurants</Text>
      <View style={styles.inputContainer}>
          <Text style={styles.label}>Search</Text>
          <TextInput
            style={styles.input}
            placeholder="Filter by name or tags..."
            value={search}
            onChangeText={input => {setSearch(input); filterRestaurants(); }}
          />
      </View>
      <FlatList
        data={filteredRestaurants}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
});