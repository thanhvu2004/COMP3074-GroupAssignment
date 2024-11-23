import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home"); // Navigate to the Home screen after 1 seconds
    }, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Logo.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
