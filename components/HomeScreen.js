import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RestaurantCard from "./RestaurantCard";

const SETTINGS_KEY = "settings";

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const navigation = useNavigation();

  const fetchRestaurants = async () => {
    try {
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      if (storedRestaurants) {
        setRestaurants(JSON.parse(storedRestaurants));
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
      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => index.toString()}
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
});