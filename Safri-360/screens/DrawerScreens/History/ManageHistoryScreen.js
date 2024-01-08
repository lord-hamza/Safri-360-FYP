import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { CarIcon, TourVanIcon, TruckIcon } from "@assets";

const ManageScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.cardContainer, styles.cardContainerHalf]}
                    onPress={() => navigation.navigate("RidesHistoryScreen")}
                >
                    <Image source={CarIcon} style={styles.icon} />
                    <Text style={styles.cardText}>Rides</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.cardContainer, styles.cardContainerHalf]}
                    onPress={() => navigation.navigate("FreightHistoryScreen")}
                >
                    <Image source={TruckIcon} style={styles.icon} />
                    <Text style={styles.cardText}>Freights</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate("ToursHistoryScreen")}>
                <Image source={TourVanIcon} style={styles.icon} />
                <Text style={styles.cardText}>Tours</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    cardContainer: {
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 12,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#A7E92F",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxWidth: "42%",
    },
    cardContainerHalf: {
        flex: 0.5,
    },
    icon: {
        width: 50,
        height: 50,
    },
    cardText: {
        fontSize: 20,
        fontWeight: "500",
        fontFamily: "SatoshiBold",
    },
});

export default ManageScreen;
