import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RestaurantCard from "./RestaurantCard";

const SETTINGS_KEY = "settings";

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const [search, setSearch] = useState();
  const navigation = useNavigation();

  const fetchRestaurants = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      if (storedRestaurants) {
        setRestaurants(JSON.parse(storedRestaurants));
        setFilteredRestaurants(JSON.parse(storedRestaurants));
      }
    } catch (error) {
      console.error("Failed to load restaurants from AsyncStorage", error);
    }
  };

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

  useEffect(() => {
    fetchRestaurants();
    fetchSettings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurants();
      fetchSettings();
    }, [])
  );

  // Passed to AddRestaurant screen
  const addRestaurant = (restaurant) => {
    setRestaurants((prevRestaurants) => [...prevRestaurants, restaurant]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Recent Restaurants</Text>
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
        keyExtractor={(item) => item.id.toString()} // Use `id` as the unique key
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            navigation={navigation}
            isRatingEnabled={isRatingEnabled}
          />
        )}
      />
      {/* Floating button to navigate to Add Restaurant */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddRestaurant", { addRestaurant })}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
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
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "blue",
    borderRadius: 30,
    elevation: 8,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 24,
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