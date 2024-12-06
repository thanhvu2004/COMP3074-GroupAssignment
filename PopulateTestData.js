import AsyncStorage from "@react-native-async-storage/async-storage";

export const populateRestaurants = async () => {
    const restaurants = [
        {
        id: 1,
        name: "Burger King",
        address: {
            street: "7560 Weston Rd",
            city: "Vaughan",
            state: "ON",
            zip: "L4L 6C5",
            country: "CA",
        },
        phones: ["9052648994"],
        description: "A great place to eat.",
        tags: ["Fastfood", "Burger"],
        image: null,
        rating: "4",
        favourite: false,
        },
        {
        id: 2,
        name: "Gyubee Japanese Grill",
        address: {
            street: "157 Dundas St W",
            city: "Toronto",
            state: "ON",
            zip: "M5E 1B4",
            country: "CA",
        },
        phones: ["4166391545"],
        description: "Delicious food and cozy atmosphere.",
        tags: ["Japanese", "Grill", "BBQ"],
        image: null,
        rating: "",
        favourite: false,
        },
        {
        id: 3,
        name: "McDonald's",
        address: {
            street: "747 Don Mills Rd",
            city: "North York",
            state: "ON",
            zip: "M3C 1T2",
            country: "CA",
        },
        phones: ["4164291266"],
        description: "Best place for fastfood dinners.",
        tags: ["American", "Burgers", "Drivethru"],
        image: null,
        rating: "",
        favourite: false,
        },
    ];

    try {
        const existingRestaurants = await AsyncStorage.getItem("restaurants");
        if (existingRestaurants==[]) {
            console.log(existingRestaurants);
            console.log("Restaurants already exist in AsyncStorage.");
        return;
        }
            await AsyncStorage.setItem("restaurants", JSON.stringify(restaurants));
            await AsyncStorage.setItem("lastRestaurantId", "3");
            console.log("Restaurants populated successfully!");
    } catch (error) {
        console.error("Failed to populate restaurants:", error);
    }
};