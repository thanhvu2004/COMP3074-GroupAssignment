import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AddRestaurant() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add a new restaurant</Text>
      {/* Add your form components here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
