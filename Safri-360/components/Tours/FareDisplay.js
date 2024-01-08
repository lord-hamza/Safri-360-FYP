import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { selectOrigin } from "@store/slices/navigationSlice";
import { selectTour } from "@store/slices/tourSlice";

const FareDisplay = ({ numberOfPeople }) => {
    const origin = useSelector(selectOrigin);
    const tour = useSelector(selectTour);

    const [fareValue, setFareValue] = useState("");

    useEffect(() => {
        setFareValue("");
        if (origin && tour && numberOfPeople) {
            displayFare();
        }
    }, [tour.fare, numberOfPeople]);

    const displayFare = () => {
        setFareValue((tour.fare * numberOfPeople).toFixed(0));
    };

    return (
        <View style={styles.textInputMain}>
            <Text style={styles.currencyMain}>PKR </Text>
            <TextInput placeholder="Tour Fare" style={styles.fareInputMain} editable={false} value={fareValue} />
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
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "500",
        flex: 1,
    },
});

export default FareDisplay;
