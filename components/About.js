import { Text, View, StyleSheet } from "react-native";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>About The Team</Text>
      <Text style={styles.h2}>
        This app is created by Team 10 Mobile App Development, George Brown College
      </Text>
      <Text>Members:</Text>
      <Text>1. Josephine Snyder</Text>
      <Text>2. Conor Le</Text>
      <Text>3. Ferdos Nurhusien</Text>
      <Text>4. Abinet Aniyo</Text>
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
  h2: {
    fontSize: 20,
    marginBottom: 20,
  },
});