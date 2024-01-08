import { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { selectOrigin, selectDestination, selectTravelRouteInformation } from "@store/slices/navigationSlice";
import { selectFreight, setFreight } from "@store/slices/freightSlice";

const FreightFareCalculator = ({ weight }) => {
    const PETROL_PRICE = 285;
    const AVERAGE_OF_VEHICLE = 12;
    const WEIGHT_COST = 20;

    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const travelRouteInformation = useSelector(selectTravelRouteInformation);
    const freight = useSelector(selectFreight);
    const [fareValue, setFareValue] = useState("");

    useEffect(() => {
        setFareValue("");
        dispatch(setFreight({ fare: 0 }));
        if (freight && origin && destination && travelRouteInformation) {
            setTimeout(() => {
                calculateFare();
            }, 500);
        }
    }, [origin, destination, weight]);

    const calculateFare = () => {
        const distance = travelRouteInformation?.distance; // in km

        const fuel_used = distance / AVERAGE_OF_VEHICLE;
        const fuel_cost = fuel_used * PETROL_PRICE;

        const weight_cost = weight * WEIGHT_COST;
        const totalFare = fuel_cost + weight_cost;

        dispatch(setFreight({ fare: totalFare.toFixed(0) }));
        setFareValue(totalFare.toFixed(0));
    };

    return (
        <View>
            <Text style={styles.currencyMain}>PKR </Text>
            <TextInput placeholder="Fare" style={styles.fareInput} editable={false} value={fareValue} />
        </View>
    );
};

const styles = StyleSheet.create({
    currencyMain: {
        position: "absolute",
        left: 15,
        top: 18,
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
        color: "#000",
        zIndex: 1000,
    },
    fareInput: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        color: "#000",
        height: 50,
        marginTop: 5,
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 70,
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "500",
    },
});

export default FreightFareCalculator;
