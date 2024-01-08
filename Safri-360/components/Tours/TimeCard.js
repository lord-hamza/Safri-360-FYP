import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-elements";
import { useSelector } from "react-redux";
import moment from "moment";

import { selectTour } from "@store/slices/tourSlice";

const TimeCard = () => {
    const tour = useSelector(selectTour);

    const getReachByTime = (departureTime) => {
        const OGdepartureTime = departureTime;
        const newReachByTime = moment(OGdepartureTime, "HH:mm A").subtract(30, "minutes").format("HH:mm A");
        return newReachByTime;
    };

    return (
        <Card containerStyle={styles.card}>
            <Text style={styles.cardTitle}>
                Departure Time: {tour.departure || ""} {moment(tour.startDate).format("LL") || ""}
            </Text>
            <Card.Divider style={styles.divider} />
            <Text style={styles.cardTitle}>
                Reach By: {getReachByTime(tour.departure) || ""} {moment(tour.startDate).format("LL") || ""}
            </Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
        backgroundColor: "#fff",
        position: "absolute",
        top: 45,
        left: 10,
        right: 10,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
    },
    divider: {
        marginTop: 12,
        marginBottom: 10,
    },
});

export default TimeCard;
