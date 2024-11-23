import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RestaurantCard from "./RestaurantCard";
import restaurantData from "../data/restaurant.json";

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setRestaurants(restaurantData);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Recent Restaurant</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      />
      {/* Floating button to navigate to Add Restaurant */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddRestaurant")}
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
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 8,
  },
  floatingButtonText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
});