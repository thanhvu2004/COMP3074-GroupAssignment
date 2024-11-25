import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function AddRestaurant({ route, navigation }) {
  const { addRestaurant } = route.params; // Destructure addRestaurant function from route params
  const [restaurantName, setRestaurantName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const handleAddRestaurant = () => {
 
    if (
      restaurantName === "" ||
      streetAddress === "" ||
      contactNumber === ""
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    // Create a new restaurant object
    const newRestaurant = {
      name: restaurantName,
      streetAddress,
      contactNumber,
    };

    // Pass new restaurant to parent component using addRestaurant function
    addRestaurant(newRestaurant);

    // Reset form fields
    setRestaurantName("");
    setStreetAddress("");
    setContactNumber("");

    // Navigate back to the restaurant list
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add a New Restaurant</Text>                                                                                        
      <TextInput
        style={styles.input}
        placeholder="Restaurant Name"
        value={restaurantName}
        onChangeText={setRestaurantName}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={streetAddress}
        onChangeText={setStreetAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Mailing Address"
        value={mailingAddress}
        onChangeText={setMailingAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        keyboardType="phone-pad"
        onChangeText={setContactNumber}
      />

   
      <Button title="Add Restaurant" onPress={handleAddRestaurant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingLeft: 10,
  },

});