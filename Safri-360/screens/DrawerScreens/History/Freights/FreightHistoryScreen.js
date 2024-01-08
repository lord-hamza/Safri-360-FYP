import { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

import { dbRealtime } from "../../../../firebase/config";
import { selectUser } from "@store/slices/userSlice";
import FreightHistoryCard from "./FreightHistoryCard";

const FreightHistoryScreen = ({ navigation }) => {
    const user = useSelector(selectUser);
    const [freights, setFreights] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Freights History",
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
        const freightsRef = ref(dbRealtime, "FreightRequests");
        onValue(freightsRef, (snapshot) => {
            const data = snapshot.val();
            const matchingFreights = [];
            for (let id in data) {
                if (data[id].customerID === user.uid) {
                    matchingFreights.push({ id, ...data[id] });
                }
            }
            setFreights(matchingFreights);
        });
    }, []);

    const renderFreightDetails = ({ item }) => {
        return <FreightHistoryCard data={item} />;
    };

    return (
        <View style={styles.container}>
            {freights.length === 0 ? (
                <View style={styles.notAvailableContainer}>
                    <Text style={styles.notAvailableText}>No Freight Requests Available.</Text>
                </View>
            ) : (
                <FlatList
                    data={freights}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderFreightDetails}
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

export default FreightHistoryScreen;
