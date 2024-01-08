import { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

import { dbRealtime } from "../../../../firebase/config";
import { selectUser } from "@store/slices/userSlice";
import RideHistoryCard from "./RideHistoryCard";

const RidesHistoryScreen = ({ navigation }) => {
    const user = useSelector(selectUser);
    const [rides, setRides] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Rides History",
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
        const ridesRef = ref(dbRealtime, "Rides");
        onValue(ridesRef, (snapshot) => {
            const data = snapshot.val();
            const matchingRides = [];
            for (let id in data) {
                if (data[id].customerID === user.uid) {
                    matchingRides.push({ id, ...data[id] });
                }
            }
            setRides(matchingRides);
        });
    }, []);

    const renderRideDetails = ({ item }) => {
        return <RideHistoryCard data={item} />;
    };

    return (
        <View style={styles.container}>
            {rides.length === 0 ? (
                <View style={styles.notAvailableContainer}>
                    <Text style={styles.notAvailableText}>No Rides Available</Text>
                </View>
            ) : (
                <FlatList
                    data={rides}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRideDetails}
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

export default RidesHistoryScreen;
