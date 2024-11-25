import React, { useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const SETTINGS_KEY = "settings";

export default function RestaurantDetails ({ route }) {
    const { restaurant } = route.params
    const [isRatingEnabled, setIsRatingEnabled] = useState(false);

    const renderRating = () => {
        if (isRatingEnabled) {
          return <Text style={styles.rating}>Rating: {restaurant.rating}</Text>;
        } else {
          const stars = "★".repeat(Math.round(restaurant.rating));
          return <Text style={styles.rating}>{stars}</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>{restaurant.name}</Text>
            <Text style={styles.paragraph_text}>{restaurant.cusine_type}</Text>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <Text style={styles.paragraph_text}>{restaurant.description}</Text>
            <Text style={styles.paragraph_text}>{restaurant.location}</Text>
            <Text style={styles.subtle_text}>{restaurant.tags.join(', ')}</Text>
            {renderRating()}
        </View>
    )
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
    subtle_text: {
        paddingLeft: 10, 
        opacity: 50,
        fontSize: 10,
    },
    paragraph_text: {
        padding: 10
    },
    rating: {
        padding: 10, 
        fontSize: 50
    },
    image: {
        height: 200,
        width: 300,
        borderRadius: 10,
        backgroundColor: "#fff"
    },
});