import { StyleSheet, Text, View, Pressable } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RideHistoryCard = ({ data }) => {
    const navigation = useNavigation();

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "assigned":
                return "#007ACC";
            case "ongoing":
                return "gold";
            case "completed":
                return "green";
            case "cancelled":
                return "red";
            default:
                return "black";
        }
    };

    const textColor = getStatusColor(data?.status);
    return (
        <Pressable onPress={() => navigation.navigate("RideHistoryDetailScreen", { data: data })}>
            <View style={styles.rideContainer}>
                <Text style={styles.rideDate}>{data?.createdAt}</Text>
                <View style={styles.infoContainer}>
                    <Ionicons name="location-outline" size={22} color="blue" />
                    <Text style={styles.rideInfoText}>{data?.origin.locationName}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="location-outline" size={22} color="green" />
                    <Text style={styles.rideInfoText}>{data?.destination.locationName}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Ionicons name="cash-outline" size={22} color="#333" />
                    <Text style={styles.rideInfoText}>PKR {data?.fare}</Text>
                </View>
                <View style={styles.rideStatus}>
                    <Text style={[styles.rideStatusText, { color: textColor }]}>{data?.status}</Text>
                </View>
                <Divider style={{ width: "100%" }} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    rideContainer: {
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
    rideDate: {
        fontSize: 14,
        fontFamily: "Satoshi",
        fontWeight: "500",
        color: "#333",
        textAlign: "left",
        paddingVertical: 5,
    },
    rideInfoText: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: "SatoshiBold",
        fontWeight: "500",
        color: "#000",
        textAlign: "left",
    },
    rideStatus: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 5,
        marginBottom: 10,
    },
    rideStatusText: {
        fontSize: 15,
        fontFamily: "SatoshiBold",
        fontWeight: "600",
        textAlign: "right",
        textTransform: "uppercase",
    },
});

export default RideHistoryCard;
