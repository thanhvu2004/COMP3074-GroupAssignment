import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import HomeScreen from "./components/HomeScreen";
import FavouriteRestaurant from "./components/FavouriteRestaurants";
import SettingScreen from "./components/SettingScreen";

const Nav = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Nav.Navigator>
        <Nav.Screen name="Home" component={HomeScreen} />
        <Nav.Screen name="Favourite" component={FavouriteRestaurant} />
        <Nav.Screen name="Setting" component={SettingScreen} />
      </Nav.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
