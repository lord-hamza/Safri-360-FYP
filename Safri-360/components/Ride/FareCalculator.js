import { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { selectOrigin, selectDestination, selectTravelRouteInformation } from "../../store/slices/navigationSlice";
import { selectRide, setRide } from "../../store/slices/rideSlice";

const FareCalculator = () => {
    const PETROL_PRICE = 285;
    const RATE_FOR_24_HRS = 4500;

    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const travelRouteInformation = useSelector(selectTravelRouteInformation);
    const ride = useSelector(selectRide);
    const [fareValue, setFareValue] = useState("");

    useEffect(() => {
        setFareValue("");
        dispatch(setRide({ ...ride, fare: 0 }));
        if (origin && destination && ride?.car?.average && travelRouteInformation) {
            setTimeout(() => {
                calculateFare();
            }, 500);
        }
    }, [origin, destination, ride?.car]);

    const calculateFare = () => {
        const distance = travelRouteInformation?.distance; // in km
        const duration = travelRouteInformation?.duration; // in minutes
        let petrol_price_for_trip = 0;
        const carAverage = ride?.car?.average;
        const petrol_price_for_one_km = (1 / carAverage) * PETROL_PRICE; // 1 = 1km
        petrol_price_for_trip = petrol_price_for_one_km * distance;

        let profit = 0;
        let fare_wrt_24_hrs = 0;
        const minutes_in_24_hours = 24 * 60;
        const rate_per_minute = RATE_FOR_24_HRS / minutes_in_24_hours;
        const fare_for_ride_duration = rate_per_minute * duration;
        fare_wrt_24_hrs = fare_for_ride_duration;

        const totalFare = petrol_price_for_trip + fare_wrt_24_hrs;
        profit = fare_wrt_24_hrs;

        dispatch(setRide({ ...ride, fare: totalFare.toFixed(0) }));
        setFareValue(totalFare.toFixed(0));
    };

    return (
        <View style={styles.textInputMain}>
            <Text style={styles.currencyMain}>PKR </Text>
            <TextInput placeholder="Estimated Fare" style={styles.fareInputMain} editable={false} value={fareValue} />
        </View>
    );
};

const styles = StyleSheet.create({
    textInputMain: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    currencyMain: {
        position: "absolute",
        left: 15,
        top: 22,
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
        color: "#000",
        zIndex: 1000,
    },
    fareInputMain: {
        backgroundColor: "#f2f2f2",
        color: "#000",
        height: 50,
        marginTop: 9,
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 60,
        fontSize: 18,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
        flex: 1,
    },
});

export default FareCalculator;
