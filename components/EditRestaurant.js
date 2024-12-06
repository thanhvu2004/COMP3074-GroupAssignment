import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditRestaurant({ route, navigation }) {
  const { restaurant } = route.params; // Destructure restaurant object from route params
  const [restaurantName, setRestaurantName] = useState(restaurant.name);
  const [address, setAddress] = useState(restaurant.address.street);
  const [city, setCity] = useState(restaurant.address.city);
  const [state, setState] = useState(restaurant.address.state);
  const [zip, setZip] = useState(restaurant.address.zip);
  const [country, setCountry] = useState(restaurant.address.country);
  const [phones, setPhones] = useState(restaurant.phones.join(", "));
  const [description, setDescription] = useState(restaurant.description);
  const [tags, setTags] = useState(restaurant.tags.join(", "));
  const [favorite, setFavorite] = useState(restaurant.favorite);
  const [image] = useState(restaurant.image);

  const handleUpdateRestaurant = async () => {
    if (
      restaurantName === "" ||
      address === "" ||
      city === "" ||
      state === "" ||
      zip === "" ||
      country === "" ||
      phones === ""
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    // Create an updated restaurant object
    const updatedRestaurant = {
      ...restaurant,
      name: restaurantName,
      address: {
        street: address,
        city,
        state,
        zip,
        country,
      },
      phones: phones.split(",").map((phone) => phone.trim()), // Split and trim phone numbers
      description,
      tags: tags.split(",").map((tag) => tag.trim()), // Split and trim tags
      image,
    };

    try {
      // Retrieve existing restaurants from AsyncStorage
      const storedRestaurants = await AsyncStorage.getItem("restaurants");
      const restaurants = storedRestaurants
        ? JSON.parse(storedRestaurants)
        : [];

      // Update the restaurant in the list by matching its id
      const updatedRestaurants = restaurants.map((r) =>
        r.id === restaurant.id ? updatedRestaurant : r
      );

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem(
        "restaurants",
        JSON.stringify(updatedRestaurants)
      );

      // Navigate back to the restaurant details screen
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update the restaurant details.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Edit Restaurant</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Restaurant Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Restaurant Name"
            value={restaurantName}
            onChangeText={setRestaurantName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City:</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>State/Province:</Text>
          <TextInput
            style={styles.input}
            placeholder="State/Province"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Zip/Postal Code:</Text>
          <TextInput
            style={styles.input}
            placeholder="Zip/Postal Code"
            value={zip}
            onChangeText={setZip}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country:</Text>
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone(s):</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone(s) (comma separated)"
            value={phones}
            onChangeText={setPhones}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>TAGs:</Text>
          <TextInput
            style={styles.input}
            placeholder="TAGs (comma separated)"
            value={tags}
            onChangeText={setTags}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Favorite:</Text>
          <Switch
            style={styles.input}
            isOn={favorite}
            value={favorite}
            onValueChange={setFavorite}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateRestaurant}
        >
          <Text style={styles.buttonText}>Update Restaurant</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});