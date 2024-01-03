import { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

import { dbRealtime } from "../../../../firebase/config";
import { selectUser } from "../../../../store/slices/userSlice";
import TourHistoryCard from "./TourHistoryCard";

const ToursHistoryScreen = ({ navigation }) => {
    const user = useSelector(selectUser);
    const [tours, setTours] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Tours History",
            headerTitleStyle: {
                fontSize: 20,
                fontFamily: "SatoshiBlack",
                fontWeight: "400",
            },
            headerTitleAlign: "center",
            headerStyle: {
                height: 60,
            },
        });
    }, [navigation]);

    useEffect(() => {
        const userRef = ref(dbRealtime, "Users/" + user.uid + "/bookedTours");
        const toursRef = ref(dbRealtime, "Tours");
        onValue(userRef, (userSnapshot) => {
            const bookedTours = userSnapshot.val();
            const bookedTourKeys = Object.keys(bookedTours);
            onValue(toursRef, (toursSnapshot) => {
                const toursData = toursSnapshot.val();
                if (toursData) {
                    const toursArray = [];
                    Object.entries(toursData).forEach(([providerId, provider]) => {
                        Object.entries(provider.Tours).forEach(([tourId, tour]) => {
                            if (tour.Bookings) {
                                Object.keys(tour.Bookings).forEach((bookingKey) => {
                                    if (bookedTourKeys.includes(bookingKey)) {
                                        const bookingID = bookingKey;
                                        const bookingDate = tour.Bookings[bookingKey].bookingDate;
                                        const numberOfPersons = tour.Bookings[bookingKey].numberOfPeople;
                                        // Match found, include the tour in the array
                                        toursArray.push({ ...tour, bookingDate, numberOfPersons, bookingID });
                                    }
                                });
                            }
                        });
                    });
                    setTours(toursArray);
                }
            });
        });
    }, [user.uid]);

    const renderTourDetails = ({ item }) => {
        return <TourHistoryCard data={item} />;
    };

    return (
        <View style={styles.container}>
            {tours.length === 0 ? (
                <View style={styles.notAvailableContainer}>
                    <Text style={styles.notAvailableText}>No Tours Available</Text>
                </View>
            ) : (
                <FlatList
                    data={tours}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderTourDetails}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    notAvailableContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notAvailableText: {
        fontSize: 18,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        color: "#333",
    },
});

export default ToursHistoryScreen;
