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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddRestaurant({ route, navigation }) {
  const { addRestaurant } = route.params; // Destructure addRestaurant function from route params
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phones, setPhones] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);

  const handleAddRestaurant = async () => {
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

    // Create a new restaurant object
    const newRestaurant = {
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
      image: image ? image.uri : null,
      rating: "", // Set rating to blank when first created
    };

    try {
      // Retrieve existing restaurants from AsyncStorage
      const existingRestaurants = await AsyncStorage.getItem("restaurants");
      const restaurants = existingRestaurants
        ? JSON.parse(existingRestaurants)
        : [];

      // Add the new restaurant to the list
      restaurants.push(newRestaurant);

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem("restaurants", JSON.stringify(restaurants));

      // Pass new restaurant to parent component using addRestaurant function
      addRestaurant(newRestaurant);

      // Reset form fields
      setRestaurantName("");
      setAddress("");
      setCity("");
      setState("");
      setZip("");
      setCountry("");
      setPhones("");
      setDescription("");
      setTags("");
      setImage(null);

      // Navigate back to the restaurant list
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save the restaurant details.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Add a New Restaurant</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleAddRestaurant}>
          <Text style={styles.buttonText}>Add Restaurant</Text>
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
