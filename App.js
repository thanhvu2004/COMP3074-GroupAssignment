import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import FavouriteRestaurant from "./components/FavouriteRestaurants";
import SettingScreen from "./components/SettingScreen";
import SplashScreen from "./components/SplashScreen";
import AddRestaurant from "./components/AddRestaurant";
import About from "./components/About";
import RestaurantDetails from "./components/RestaurantDetails";
import EditRestaurant from "./components/EditRestaurant";
import FullscreenMap  from "./components/FullscreenMap";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favourite" component={FavouriteRestaurant} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddRestaurant"
          component={AddRestaurant}
          options={{ title: "Add Restaurant" }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{ title: "About" }}
        />
        <Stack.Screen
          name="RestaurantDetails"
          component={RestaurantDetails}
          options={{ title: "Restaurant Details" }}
        />
        <Stack.Screen
          name="EditRestaurant"
          component={EditRestaurant}
          options={{ title: "Edit Restaurant" }}
        />
        <Stack.Screen
          name="FullscreenMap"
          component={FullscreenMap}
          options={{ title: "Map" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}