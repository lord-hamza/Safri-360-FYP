import { StyleSheet, Text, View, Pressable } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { formatCurrencyWithCommas } from "../../../../utils/formatCurrencyValue";

const TourHistoryCard = ({ data }) => {
    const navigation = useNavigation();

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "open":
                return "green";
            case "cancelled":
                return "orange";
            case "closed":
                return "red";
            default:
                return "black";
        }
    };

    const textColor = getStatusColor(data?.tourBookingStatus);
    return (
        <Pressable onPress={() => navigation.navigate("TourHistoryDetailScreen", { data: data })}>
            <View style={styles.tourContainer}>
                <Text style={styles.tourDate}>
                    {moment(data?.tourStartDate, "LL").format("LL")} - {moment(data?.tourEndDate, "LL").format("LL")}
                </Text>
                <Text style={styles.tourBookingID}>{data?.bookingID}</Text>
                <Text style={styles.tourName}>{data?.tourName}</Text>
                <View style={styles.infoContainer}>
                    <Ionicons name="location-outline" size={24} color="blue" />
                    <Text style={styles.tourInfoText}>
                        <Text style={styles.tourLabel}>Pickup:</Text> {data?.tourPickup.locationName}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="location-outline" size={24} color="green" />
                    <Text style={styles.tourInfoText}>
                        <Text style={styles.tourLabel}>Destination:</Text> {data?.tourDestination.locationName}
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="cash-outline" size={24} color="#333" />
                    <Text style={styles.tourInfoText}>
                        <Text style={styles.tourLabel}>PKR</Text> {formatCurrencyWithCommas(data?.tourTotalFare)}
                    </Text>
                </View>
                <View style={styles.tourStatus}>
                    <Text style={[styles.tourStatusText, { color: textColor }]}>{data?.tourBookingStatus}</Text>
                </View>
                <Divider style={{ width: "100%" }} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    tourContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        paddingTop: 5,
        paddingHorizontal: 15,
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 2,
    },
    tourDate: {
        fontSize: 14,
        fontFamily: "Satoshi",
        fontWeight: "500",
        color: "#333",
        textAlign: "left",
        paddingVertical: 5,
    },
    tourBookingID: {
        fontSize: 17,
        fontFamily: "SatoshiBlack",
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
        paddingVertical: 5,
    },
    tourName: {
        fontSize: 17,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
        paddingBottom: 5,
    },
    tourLabel: {
        fontSize: 17,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        color: "#333",
        textAlign: "left",
    },
    tourInfoText: {
        width: "80%",
        marginLeft: 10,
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "500",
        color: "#000",
        textAlign: "left",
    },
    tourStatus: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 5,
        marginBottom: 10,
    },
    tourStatusText: {
        fontSize: 15,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        textAlign: "right",
        textTransform: "uppercase",
    },
});

export default TourHistoryCard;
