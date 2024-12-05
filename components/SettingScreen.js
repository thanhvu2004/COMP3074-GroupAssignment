import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "settings";

export default function SettingScreen() {
  const [isRatingEnabled, setIsRatingEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (settings !== null) {
          const parsedSettings = JSON.parse(settings);
          setIsRatingEnabled(parsedSettings.isRatingEnabled);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        const updatedSettings = { isRatingEnabled };
        await AsyncStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify(updatedSettings)
        );
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };

    saveSettings();
  }, [isRatingEnabled]);

  const toggleSwitch = () => {
    setIsRatingEnabled((previousState) => !previousState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Rating as number</Text>
        <Switch onValueChange={toggleSwitch} value={isRatingEnabled} />
      </View>
      <Text style={styles.settingDisclaimer}>
        The change will take effect immediately.
      </Text>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.settingText}>About</Text>
        <Text style={styles.arrow}></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  settingText: {
    fontSize: 18,
  },
  settingDisclaimer: {
    fontSize: 14,
    color: "#888",
  },
  arrow: {
    fontSize: 18,
    color: "#000",
  },
});
